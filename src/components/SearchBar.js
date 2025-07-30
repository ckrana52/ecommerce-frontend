import React from "react";

export default function SearchBar() {
  return (
    <form className="flex items-center w-full max-w-xl mx-auto my-3 px-2">
      <input
        type="text"
        placeholder="Search Product Name . . . . . ."
        className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r font-semibold hover:bg-blue-700">Search</button>
    </form>
  );
} 