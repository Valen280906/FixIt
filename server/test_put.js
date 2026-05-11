import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

async function run() {
  const token = jwt.sign({ id: 3, role: 'client' }, 'your_jwt_secret_here', { expiresIn: '1h' }); // wait I don't know the secret. Let's just login.
  
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'andrea.c.a.808@gmail.com', password: 'password123' }) // assuming standard password
  });
  
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.log('Login failed', loginData);
    return;
  }
  
  console.log('Logged in!');
  
  const putRes = await fetch('http://localhost:5000/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginData.token}` },
    body: JSON.stringify({
      name: 'Andrea',
      phone: '04123880437',
      address: 'Los Guayo, Paraparal, Noemi',
      city: 'Valencia',
      bio: 'soy una persona proactiva y gentil',
      avatar: '',
      birth_date: '2014-02-11',
      gender: 'female',
      id_number: '31856233'
    })
  });
  
  const putData = await putRes.json();
  console.log('PUT response:', putData);
}
run();
