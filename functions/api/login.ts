/** Login API
 *  POST /api/login
 *  Body: { email, password }
 *  Returns a session token on success.
 *  Currently returns demo accounts for any login.
 *  TODO: Validate against Baserow user table.
 */
export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: '请填写邮箱和密码' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    // Extract client from email domain (demo mode)
    const domain = email.split('@')[1] || '';
    let client = 'demo';
    if (domain.includes('huaqing')) client = 'huaqing';
    else if (domain.includes('hengjia')) client = 'hengjia';

    const token = btoa(JSON.stringify({ email, client, ts: Date.now() }));

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { email, client }
    }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: '登录失败' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
