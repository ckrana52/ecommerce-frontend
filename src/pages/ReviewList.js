import { useEffect, useState } from 'react';

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded shadow p-4">
            <div className="font-bold">{r.reviewer}</div>
            <div className="text-yellow-500 mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            <div className="mb-1">{r.comment}</div>
            <div className="text-xs text-gray-500">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 