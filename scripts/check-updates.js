// 竞品监控脚本
// 每周运行时：检查所有关注的项目有没有新 Release 或新 Commit
// 输出报告到 reports/latest.json

const WATCH_FILE = './reports/watchlist.json';
const REPORT_FILE = './reports/latest.json';
const HISTORY_FILE = './reports/history.json';

const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const headers = GITHUB_TOKEN
  ? { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'zirflow-bot/1.0' }
  : { 'User-Agent': 'zirflow-bot/1.0' };

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Parse failed: ${url}`)); }
      });
    }).on('error', reject);
  });
}

async function getLatestRelease(repo) {
  try {
    const data = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (data.tag_name) return { version: data.tag_name, date: data.published_at, url: data.html_url };
  } catch {}
  return null;
}

async function getRecentCommits(repo, since) {
  try {
    const url = since
      ? `https://api.github.com/repos/${repo}/commits?since=${since}&per_page=5`
      : `https://api.github.com/repos/${repo}/commits?per_page=5`;
    const data = await fetch(url);
    if (Array.isArray(data)) {
      return data.map(c => ({
        message: c.commit.message.split('\n')[0].slice(0, 100),
        date: c.commit.committer.date,
        url: c.html_url,
        author: c.commit.author.name,
      }));
    }
  } catch {}
  return [];
}

async function searchNewProjects(query) {
  try {
    const data = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`
    );
    if (data.items) {
      return data.items
        .filter(item => item.stargazers_count > 50)  // 只看 50 星以上的
        .map(item => ({
          name: item.full_name,
          stars: item.stargazers_count,
          description: (item.description || '').slice(0, 100),
          url: item.html_url,
          updated_at: item.updated_at,
        }));
    }
  } catch {}
  return [];
}

async function main() {
  const watchlist = JSON.parse(fs.readFileSync(WATCH_FILE, 'utf8'));
  const history = fs.existsSync(HISTORY_FILE)
    ? JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
    : { releases: {}, reports: [] };

  const now = new Date().toISOString();
  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const results = [];

  for (const item of watchlist.watched) {
    console.log(`检查: ${item.name} (${item.repo})`);

    const lastVersion = history.releases[item.repo];
    const release = await getLatestRelease(item.repo);
    const commits = await getRecentCommits(item.repo, threeMonthsAgo);

    const isNewRelease = release && release.version !== lastVersion;

    results.push({
      name: item.name,
      repo: item.repo,
      latestRelease: release,
      recentCommits: commits.slice(0, 5),
      hasUpdate: isNewRelease || commits.length > 0,
      focus: item.focus,
    });

    // 更新历史记录
    if (release) {
      history.releases[item.repo] = release.version;
    }
  }

  // 搜索新项目
  console.log('搜索新项目...');
  const newProjects = [];
  for (const query of watchlist.searchQueries) {
    const found = await searchNewProjects(query);
    // 只看不在 watchlist 里的
    const watchedRepos = new Set(watchlist.watched.map(w => w.repo));
    for (const p of found) {
      if (!watchedRepos.has(p.name)) {
        newProjects.push(p);
        watchedRepos.add(p.name);
      }
    }
  }

  // 生成报告
  const report = {
    checkedAt: now,
    updated: results.filter(r => r.hasUpdate).map(r => ({
      name: r.name,
      repo: r.repo,
      release: r.latestRelease,
      commits: r.recentCommits,
      focus: r.focus,
      hasNewRelease: r.latestRelease?.version !== history.releases[r.repo],
    })),
    stable: results.filter(r => !r.hasUpdate).map(r => r.name),
    newProjects: newProjects.slice(0, 10),
    summary: {
      total: results.length,
      hasUpdates: results.filter(r => r.hasUpdate).length,
      newProjectsFound: newProjects.length,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  console.log(`\n检查完成: ${results.length} 个项目`);
  console.log(`有更新: ${report.summary.hasUpdates} 个`);
  console.log(`发现新项目: ${report.summary.newProjectsFound} 个`);
  console.log(`报告已保存: ${REPORT_FILE}`);
}

main().catch(console.error);
