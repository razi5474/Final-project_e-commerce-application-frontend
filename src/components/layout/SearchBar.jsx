import { useState,useEffect } from "react";
import { api } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

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
    <div className="relative w-full">
      <div className="flex items-center border border-base-300 bg-base-200 rounded-md px-3 py-.5">
        <FiSearch className="mr-2 text-base-content" />
        <input
          type="text"
          value={query}
          placeholder="Search for products"
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-1.5 rounded-md border border-base-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-base-content " 
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 bg-base-100 border border-base-300 w-full mt-1 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-2 cursor-pointer hover:bg-base-200 flex items-center gap-2"
              onClick={() => handleSelect(item._id)}
            >
              <img src={item.images?.[1] || "/default-product.jpg"} alt="product" className="w-8 h-8 object-contain rounded" />
              <span className="text-sm">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;