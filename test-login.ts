
import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'abdul.jabbar.dev@gmail.com',
      password: 'admin123'
    });
    console.log('Login success:', res.data.user.name);
    const token = res.data.token;

    const meRes = await axios.get('http://localhost:3000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Me success:', meRes.data.name);
  } catch (err: any) {
    console.error('Login/Me failed:', err.response?.status, err.response?.data);
  }
}

test();
