
import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'abdul.jabbar.dev@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;

    const catRes = await axios.get('http://localhost:3000/api/categories');
    const categoryId = catRes.data[0]._id;

    const res = await axios.put(`http://localhost:3000/api/categories/${categoryId}`, {
      name: 'Updated Category'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Category PUT success:', res.data.name);
  } catch (err: any) {
    console.error('Category PUT failed:', err.response?.status, err.response?.data);
  }
}

test();
