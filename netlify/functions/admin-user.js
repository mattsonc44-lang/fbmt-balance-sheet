const https = require('https');

function supaRequest(path, method, body, serviceKey) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: new URL(process.env.SUPABASE_URL).hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': 'Bearer ' + serviceKey,
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-fbmt-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const secret = process.env.FBMT_FUNCTION_SECRET;
  if (!secret || event.headers['x-fbmt-secret'] !== secret) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SERVICE_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured' }) };

  try {
    const { action, ...params } = JSON.parse(event.body);

    if (action === 'create_user') {
      // Create auth user
      const authResult = await supaRequest('/auth/v1/admin/users', 'POST', {
        email: params.email,
        password: params.password,
        email_confirm: true
      }, SERVICE_KEY);
      if (authResult.status !== 200 && authResult.status !== 201) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: authResult.body?.msg || authResult.body?.message || 'Failed to create user' }) };
      }
      const userId = authResult.body.id;
      // Insert profile
      await supaRequest('/rest/v1/profiles', 'POST', {
        id: userId,
        full_name: params.fullName,
        email: params.email,
        role: params.role,
        bank_name: 'First Bank of Montana',
        is_active: true,
        force_password_change: true
      }, SERVICE_KEY);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, userId }) };
    }

    if (action === 'reset_password') {
      await supaRequest(`/auth/v1/admin/users/${params.userId}`, 'PUT', {
        password: params.password
      }, SERVICE_KEY);
      await supaRequest(`/rest/v1/profiles?id=eq.${params.userId}`, 'PATCH', {
        force_password_change: true
      }, SERVICE_KEY);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (action === 'update_profile') {
      await supaRequest(`/rest/v1/profiles?id=eq.${params.userId}`, 'PATCH', params.updates, SERVICE_KEY);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
