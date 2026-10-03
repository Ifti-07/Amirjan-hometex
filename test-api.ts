
import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:3000/api/products');
    console.log('Products API success:', res.data.length, 'products found');
  } catch (err: any) {
    console.error('Products API failed:', err.response?.status, err.response?.data);
  }

  try {
    const res = await axios.get('http://localhost:3000/api/categories');
    console.log('Categories API success:', res.data.length, 'categories found');
  } catch (err: any) {
    console.error('Categories API failed:', err.response?.status, err.response?.data);
  }
}

test();
