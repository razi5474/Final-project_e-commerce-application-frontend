import { Tv, Smartphone, Laptop, Headphones, Home, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { id: "6835d877670ba804f6908e50", name: "TV's", icon: Tv },
  { id: "6835d768670ba804f6908e4e", name: "Smart Phones", icon: Smartphone },
  { id: "685a6519c4b921c550fb5c0e", name: "Laptop", icon: Laptop },
  { id: "685a653ec4b921c550fb5c10", name: "Headphones", icon: Headphones },
  { id: "685a663dc4b921c550fb5c12", name: "Home Appliances", icon: Home },
  { id: "all", name: "All Category", icon: LayoutGrid },
];

const CategorySection = () => {
  return (
    <section className="py-12 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
          Shop by Category
        </h2>
        <p className="text-base-content/60 mt-2">Explore our wide range of products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link
              to={cat.id === "all" ? "/products" : `/category/${cat.id}`}
              key={index}
              className="group"
            >
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="font-semibold text-sm md:text-base text-base-content/80 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
