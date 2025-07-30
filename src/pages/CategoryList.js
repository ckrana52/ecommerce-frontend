export default function CategoryList() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="bg-gray-100 p-6 rounded shadow text-center font-semibold">Category {i}</div>
        ))}
      </div>
    </div>
  );
} 