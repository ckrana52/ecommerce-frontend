import { useEffect, useState } from 'react';

export default function Contact() {
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch('/api/pages/contact')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setInfo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/pages/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to send');
        setSuccess('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      })
      .catch(err => setError(err.message));
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="mb-2">Phone: {info.phone}</div>
        <div className="mb-2">Email: {info.email}</div>
        <div className="mb-2">Address: {info.address}</div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-2">
        <input name="name" value={form.name} onChange={handleChange} required className="border p-2 rounded w-full" placeholder="Your Name" />
        <input name="email" value={form.email} onChange={handleChange} required className="border p-2 rounded w-full" placeholder="Your Email" />
        <textarea name="message" value={form.message} onChange={handleChange} required className="border p-2 rounded w-full" placeholder="Your Message" />
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
      </form>
    </div>
  );
} 