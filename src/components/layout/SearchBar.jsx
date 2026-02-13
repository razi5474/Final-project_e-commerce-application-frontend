import { useState, useEffect } from "react";
import { api } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce for smoother typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get(`/product/search?keyword=${query}`);
      setSuggestions(res.data.products);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (id) => {
    navigate(`/product/productDeatails/${id}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-base-content/50" />
        </div>
        <input
          type="text"
          value={query}
          placeholder="Search for products..."
          onChange={(e) => setQuery(e.target.value)}
          className="input input-sm input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-all rounded-lg"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 bg-base-100 border border-base-200 w-full mt-2 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-3 cursor-pointer hover:bg-base-200 flex items-center gap-3 border-b border-base-100 last:border-none transition-colors"
              onClick={() => handleSelect(item._id)}
            >
              <div className="w-10 h-10 rounded-md bg-base-200 flex items-center justify-center overflow-hidden">
                <img src={item.images?.[1] || "/default-product.jpg"} alt="product" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-base-content/50 capitalize">{item.category}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
