const url = 'https://bqacpjxzqthgrheuslxl.supabase.co';
const key = 'sb_publishable_JSzLQU_0GbYLJQuaoWkuGQ_NbdcFgCq';

async function fixTestUser() {
  const newTherapist = {
    id: 11,
    name: 'Ps. Claudio Fernández',
    title: 'Psicólogo Clínico de Prueba',
    bio: 'Perfil de prueba para validar funcionalidades del dashboard y sincronización de datos con Supabase.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claudio',
    price: '$35.000',
    specialty: 'Pruebas de Software · QA · Sincronización',
    tags: ['Testing', 'QA', 'Mock'],
    availability: 'Alta',
    rating: 5.0,
    reviews: 0,
    email: 'cfernandez.bolton@gmail.com',
    impresiones: 0,
    clics: 0,
    leads: 0,
    calendar_url: null
  };

  const insertRes = await fetch(url + '/rest/v1/terapeutas', {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(newTherapist)
  });
  
  const insertData = await insertRes.json();
  console.log('Insert Res new user:', insertData);
}

fixTestUser();
