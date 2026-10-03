
import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'abdul.jabbar.dev@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;

    const res = await axios.post('http://localhost:3000/api/categories', {
      name: 'New Category',
      slug: 'new-category',
      description: 'This is a new category.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Category POST success:', res.data.name);
  } catch (err: any) {
    console.error('Category POST failed:', err.response?.status, err.response?.data);
  }
}

test();
