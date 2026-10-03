
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

    const res = await axios.post('http://localhost:3000/api/products', {
      name: 'New Test Product',
      price: 99.99,
      description: 'This is a test product.',
      images: ['https://picsum.photos/seed/test/800/800'],
      category: categoryId,
      stock: 10,
      featured: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Product POST success:', res.data.name);
  } catch (err: any) {
    console.error('Product POST failed:', err.response?.status, err.response?.data);
  }
}

test();
