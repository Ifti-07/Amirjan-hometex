import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Get in touch</span>
          <h1 className="text-6xl font-bold tracking-tighter mt-4 mb-8">WE'D LOVE TO <br /> HEAR FROM YOU.</h1>
          <p className="text-lg text-gray-600 max-w-md leading-relaxed">
            Have a question about our products or an existing order? Fill out the form and our team will get back to you within 24 hours.
          </p>
          
          <div className="mt-12 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</h4>
              <p className="text-xl font-medium">hello@luxecommerce.com</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Office</h4>
              <p className="text-xl font-medium">123 Design District, <br /> San Francisco, CA 94103</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-10">
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <CheckCircle size={64} className="text-green-500" />
              <h2 className="text-3xl font-bold tracking-tight">MESSAGE SENT</h2>
              <p className="text-gray-500">Thank you for reaching out. We'll be in touch soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b-2 border-gray-200 focus:border-black py-3 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b-2 border-gray-200 focus:border-black py-3 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Your Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-black p-4 outline-none transition resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {status === 'loading' ? 'Sending...' : (
                  <>Send Message <Send size={18} className="ml-2" /></>
                )}
              </button>
              {status === 'error' && <p className="text-red-600 text-xs font-bold uppercase text-center">Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
