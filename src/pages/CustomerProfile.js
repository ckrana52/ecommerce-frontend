import { useEffect, useState } from 'react';

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch('/api/auth/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setForm({ name: data.name, email: data.email, phone: data.phone });
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

  function handleSave() {
    setLoading(true);
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setEditing(false);
        setSuccess('Profile updated successfully');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="bg-white rounded shadow p-4">
        <div className="mb-2">Name: {editing ? <input name="name" value={form.name} onChange={handleChange} className="border p-1 rounded" /> : profile.name}</div>
        <div className="mb-2">Email: {editing ? <input name="email" value={form.email} onChange={handleChange} className="border p-1 rounded" /> : profile.email}</div>
        <div className="mb-2">Phone: {editing ? <input name="phone" value={form.phone} onChange={handleChange} className="border p-1 rounded" /> : profile.phone}</div>
        {editing ? (
          <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleSave} disabled={loading}>Save</button>
        ) : (
          <button className="bg-gray-600 text-white px-4 py-1 rounded" onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
} 