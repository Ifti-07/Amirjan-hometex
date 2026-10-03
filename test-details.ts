
import axios from 'axios';

async function test() {
  try {
    const prodRes = await axios.get('http://localhost:3000/api/products');
    const products = prodRes.data;
    if (products.length > 0) {
      const id = products[0]._id;
      const res = await axios.get(`http://localhost:3000/api/products/${id}`);
      console.log('Product Details success:', res.data.name);
    } else {
      console.log('No products found to test details');
    }
  } catch (err: any) {
    console.error('Product Details failed:', err.response?.status, err.response?.data);
  }
}

test();
