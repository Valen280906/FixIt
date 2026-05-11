import fetch from 'node-fetch';

async function run() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'andrea.c.a.808@gmail.com', password: 'password' })
  });
  const data = await loginRes.json();
  if (!data.token) {
    console.log('Login failed:', data);
    return;
  }
  
  const putRes = await fetch('http://localhost:5000/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` },
    body: JSON.stringify({
      name: 'Andrea Test',
      phone: '04123880437',
      address: 'Los Guayo',
      city: 'Valencia',
      bio: 'test bio',
      avatar: '',
      birth_date: '2014-02-11',
      gender: 'female',
      id_number: '123456'
    })
  });
  console.log('PUT response:', await putRes.json());
}
run();
