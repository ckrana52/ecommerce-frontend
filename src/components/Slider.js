import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    fetch('/api/slider')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        // Only show active sliders
        const activeSlides = Array.isArray(data)
          ? data.filter(s => s.status === 'Active').map(s => s.image).filter(Boolean)
          : [];
        setSlides(activeSlides);
        setLoading(false);
      })
      .catch(() => {
        setSlides([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [slides]);

  if (loading) return <div className="w-full flex items-center justify-center" style={{ minHeight: 120 }}>Loading...</div>;
  if (error) return <div className="w-full flex items-center justify-center text-red-500" style={{ minHeight: 120 }}>{error}</div>;
  if (!slides.length) return null;

  const goTo = idx => setCurrent(idx);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <div
      className="w-full mb-6 relative flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 1200,
        height: 400,
        minHeight: 120,
        margin: '0 auto',
      }}
    >
      {/* Korean-style sliding carousel */}
      <div
        className="absolute top-0 left-0 w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((img, i) => (
          <div key={i} className="w-full h-full flex-shrink-0 flex items-center justify-center">
            <img
              src={img}
              alt="slide"
              className="w-full h-full object-contain bg-white rounded-xl"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                transition: 'box-shadow 0.3s',
              }}
              draggable="false"
            />
            </div>
          ))}
        </div>
      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-20 border border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-20 border border-gray-200">
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${i === current ? 'bg-blue-500 shadow-lg scale-125' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
}
