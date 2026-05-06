import {
  GraduationCap,
  Heart,
  Users,
  Briefcase,
  Home,
  Sprout,
  Book,
  Truck,
  Sun,
  Wifi,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ icon: Icon, title, description, color }) => (
  <div
    className={`group bg-white cursor-pointer  md:p-8 rounded-lg  border border-gray-200 shadow-md transition-all duration-300  hover:shadow-xl hover:-translate-y-1 min-h-[140px] flex flex-col justify-start`}
  >
    <Icon
      size={60} // bigger icon
      className={`${color.text} mb-4 transition-transform duration-300 group-hover:scale-110`}
    />
    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 transition-colors duration-300 group-hover:text-black">
      {title}
    </h3>
    <p className="text-base md:text-lg text-neutral-600 transition-colors duration-300 group-hover:text-black/90">
      {description}
    </p>
  </div>
);


const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "50+ schemes available",
      color: { text: "text-blue-500" },
    },
    {
      icon: Heart,
      title: "Healthcare",
      description: "40+ schemes available",
      color: { text: "text-red-500" },
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "30+ schemes available",
      color: { text: "text-purple-500" },
    },
    {
      icon: Briefcase,
      title: "Employment",
      description: "45+ schemes available",
      color: { text: "text-yellow-500" },
    },
    {
      icon: Home,
      title: "Housing",
      description: "25+ schemes available",
      color: { text: "text-green-500" },
    },
    {
      icon: Sprout,
      title: "Agriculture",
      description: "35+ schemes available",
      color: { text: "text-lime-500" },
    },
    {
      icon: Book,
      title: "Skill Development",
      description: "20+ schemes available",
      color: { text: "text-indigo-500" },
    },
    {
      icon: Truck,
      title: "Transportation",
      description: "15+ schemes available",
      color: { text: "text-orange-500" },
    },
    {
      icon: Sun,
      title: "Energy",
      description: "10+ schemes available",
      color: { text: "text-yellow-400" },
    },
    {
      icon: Wifi,
      title: "Digital India",
      description: "25+ schemes available",
      color: { text: "text-blue-400" },
    },
    {
      icon: Zap,
      title: "Rural Development",
      description: "30+ schemes available",
      color: { text: "text-green-600" },
    },
  ];

  return (
    <section className="py-10 md:py-0.5 md:pb-16">
  <div className="container mx-auto px-4 md:px-8 flex flex-col gap-12 mt-12 md:mt-16">
    {/* Title */}
    <h2 className="text-3xl md:text-4xl font-bold text-center">
      Browse by Category
    </h2>

    {/* Cards Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
      {categories.map((category, index) => (
        <div
          key={index}
          onClick={() => navigate(`/schemes?cat=${category.title}`)}
        >
          <CategoryCard {...category} />
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Categories;
