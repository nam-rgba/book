import { FaSearch } from "react-icons/fa";
import searchProducts from "../api/search";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface Product {
  id: number;
  image: string;
  name: string;
  finalPrice: number;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]); // Clear results if search query is empty
        return;
      } // Skip if search query is empty
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results.data.products);
        console.log("Search results:", results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
      <form className="flex w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-[999px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-java-400 text-white rounded-r-[999px] hover:bg-java-500 transition-colors duration-200"
        >
          <FaSearch />
        </button>
      </form>
      {searchResults.length > 0 && (
        <div className="absolute top-12 left-1 w-[40rem] bg-white shadow-xl rounded-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Found {searchResults.length} product
              {searchResults.length !== 1 ? "s" : ""}
            </h3>
            
              <button
                onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                }}
                className="flex items-center text-amber-600  font-medium transition-colors"
              >
                <IoCloseCircleOutline className="mr-2" color="#f59e0b" />
                Clear
              </button>
            
          </div>
          <div className="py-2">
            {searchResults.map((product) => (
              <a
                key={product.id}
                href={`/detail/${product.id}`}
                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/48/48";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {product.name}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.finalPrice)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
