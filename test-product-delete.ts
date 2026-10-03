
import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'abdul.jabbar.dev@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;

    const prodRes = await axios.get('http://localhost:3000/api/products');
    const productId = prodRes.data[0]._id;

    const res = await axios.delete(`http://localhost:3000/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Product DELETE success:', res.data.message);
  } catch (err: any) {
    console.error('Product DELETE failed:', err.response?.status, err.response?.data);
  }
}

test();
