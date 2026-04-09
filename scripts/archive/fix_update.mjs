const url = 'https://bqacpjxzqthgrheuslxl.supabase.co';
const key = 'sb_publishable_JSzLQU_0GbYLJQuaoWkuGQ_NbdcFgCq';

async function fixTestUser() {
  const updateRes = await fetch(url + '/rest/v1/terapeutas?email=eq.cfernandez.bolton@gmail.com', {
    method: 'PATCH',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ price: '$35.000' })
  });
  
  const updateData = await updateRes.json();
  console.log('Update Res:', updateData);
}

fixTestUser();
