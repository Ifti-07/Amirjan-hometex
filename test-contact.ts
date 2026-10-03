
import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello, this is a test message.'
    });
    console.log('Contact POST success:', res.data.message);
  } catch (err: any) {
    console.error('Contact POST failed:', err.response?.status, err.response?.data);
  }
}

test();
