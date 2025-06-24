import { MdOutlineSmartphone, MdHome } from "react-icons/md";
import { FaTv, FaHeadphones, FaLaptop } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "6835d877670ba804f6908e50", // TV's
    name: "TV's",
    icon: <FaTv className="text-3xl" />,
  },
  {
    id: "6835d768670ba804f6908e4e", // Smart Phones
    name: "Smart Phones",
    icon: <MdOutlineSmartphone className="text-3xl" />,
  },
  {
    id: "685a6519c4b921c550fb5c0e", // Laptop
    name: "Laptop",
    icon: <FaLaptop className="text-3xl" />,
  },
  {
    id: "685a653ec4b921c550fb5c10", // Headphones
    name: "Headphones",
    icon: <FaHeadphones className="text-3xl" />,
  },
  {
    id: "685a663dc4b921c550fb5c12", // Home Appliances
    name: "Home Appliances",
    icon: <MdHome className="text-3xl" />,
  },
  {
    id: "all", // All category
    name: "All Category",
    icon: <BiCategory className="text-3xl" />,
  },
];

const CategorySection = () => {
  return (
    <div className="w-full py-6 px-4 md:px-10 font-sans">
      <div className="flex flex-wrap justify-evenly gap-y-8">
        {categories.map((cat, index) => (
          <Link
            to={cat.id === "all" ? "/products" : `/category/${cat.id}`}
            key={index}
          >
            <div className="flex flex-col items-center justify-center w-28 gap-2 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-base-200 text-base-content rounded-full flex items-center justify-center shadow hover:bg-base-300 transition duration-300">
                {cat.icon}
              </div>
              <p className="text-sm md:text-base font-semibold text-base-content leading-tight whitespace-nowrap">
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
