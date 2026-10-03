
import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'abdul.jabbar.dev@gmail.com',
      password: 'admin123'
    });
    const token = res.data.token;

    const contactRes = await axios.get('http://localhost:3000/api/contact', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Contact GET success:', contactRes.data.length, 'messages found');
  } catch (err: any) {
    console.error('Contact GET failed:', err.response?.status, err.response?.data);
  }
}

test();
