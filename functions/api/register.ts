/** Registration API
 *  POST /api/register
 *  Body: { company, email, password }
 *  Creates a user account and returns a session token.
 *  Currently uses demo mode (stores in-memory).
 *  TODO: Replace with Baserow DB storage.
 */
export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { company, email, password } = await request.json();

    if (!company || !email || !password) {
      return new Response(JSON.stringify({ error: '请填写完整信息' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: '邮箱格式不正确' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: '密码至少 6 位' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    // Try to store in Baserow or KV — for now, return success with demo token
    // In production: store user in Baserow table, generate JWT
    const token = btoa(JSON.stringify({ email, company, ts: Date.now() }));

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { email, company, client: email.split('@')[1]?.split('.')[0] || 'demo' }
    }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: '服务器错误' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
