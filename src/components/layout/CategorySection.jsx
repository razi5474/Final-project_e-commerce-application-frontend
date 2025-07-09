import { MdOutlineSmartphone, MdHome } from "react-icons/md";
import { FaTv, FaHeadphones, FaLaptop } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const categories = [
  { id: "6835d877670ba804f6908e50", name: "TV's", icon: <FaTv className="text-2xl md:text-3xl" /> },
  { id: "6835d768670ba804f6908e4e", name: "Smart Phones", icon: <MdOutlineSmartphone className="text-2xl md:text-3xl" /> },
  { id: "685a6519c4b921c550fb5c0e", name: "Laptop", icon: <FaLaptop className="text-2xl md:text-3xl" /> },
  { id: "685a653ec4b921c550fb5c10", name: "Headphones", icon: <FaHeadphones className="text-2xl md:text-3xl" /> },
  { id: "685a663dc4b921c550fb5c12", name: "Home Appliances", icon: <MdHome className="text-2xl md:text-3xl" /> },
  { id: "all", name: "All Category", icon: <BiCategory className="text-2xl md:text-3xl" /> },
];

const CategorySection = () => {
  const scrollRef = useRef();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < maxScrollLeft - 10); // 10px buffer
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check

    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="w-full py-6 px-4 md:px-10 font-sans relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scrollByAmount(-150)}
          className="absolute left-2 top-12 z-10 text-3xl md:hidden text-base-content/50 bg-base-100 rounded-full shadow px-2"
        >
          ❮
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scrollByAmount(150)}
          className="absolute right-2 top-12 z-10 text-3xl md:hidden text-base-content/50 bg-base-100 rounded-full shadow px-2"
        >
          ❯

        </button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollRef}
        className="flex gap-x-4 gap-y-6 px-1 sm:px-4 overflow-x-auto no-scrollbar md:flex-wrap md:justify-evenly md:overflow-visible"
      >
        {categories.map((cat, index) => (
          <Link
            to={cat.id === "all" ? "/products" : `/category/${cat.id}`}
            key={index}
          >
            <div className="flex flex-col items-center justify-center w-24 sm:w-28 md:w-32 gap-2 text-center transition-transform hover:scale-105">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-base-200 text-base-content rounded-full flex items-center justify-center shadow-md hover:bg-base-300 transition duration-300 border border-base-300">
                {cat.icon}
              </div>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-base-content leading-tight whitespace-nowrap">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
