const url = 'https://bqacpjxzqthgrheuslxl.supabase.co';
const key = 'sb_publishable_JSzLQU_0GbYLJQuaoWkuGQ_NbdcFgCq';

async function fixTestUserWithAuth() {
  // 1. Log In
  const authRes = await fetch(url + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'cfernandez.bolton@gmail.com',
      password: '123456787'
    })
  });
  const authData = await authRes.json();
  const token = authData.access_token;
  console.log('Login successful, token retrieved:', !!token);

  // 2. Try Update
  const updateRes = await fetch(url + '/rest/v1/terapeutas?id=eq.10', {
    method: 'PATCH',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + (token || key),
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ price: '$35.000' })
  });
  
  const updateData = await updateRes.json();
  console.log('Update Res:', updateData);
}

fixTestUserWithAuth();
