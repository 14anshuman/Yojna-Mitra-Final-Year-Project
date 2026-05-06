import { UserPlus, Search, CheckSquare } from "lucide-react";

const StepCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center bg-white p-4 md:p-7 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-h-[100px]">
    <Icon size={56} className="text-[#74B83E] mb-4 transition-transform duration-300 group-hover:scale-110" />
    <h3 className="text-xl md:text-2xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600 text-sm md:text-base">{description}</p>
  </div>
);

const HowToApply = () => {
  return (
    <section className="px-4 md:px-8 py-14 md:pb-16 bg-gray-100">
      <div className="container mx-auto flex flex-col gap-12">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center">How to Apply</h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StepCard
            icon={UserPlus}
            title="Enter Details"
            description="Start by entering your details to find relevant schemes"
          />
          <StepCard
            icon={Search}
            title="Search"
            description="Our search engine helps you find the relevant schemes"
          />
          <StepCard
            icon={CheckSquare}
            title="Select and Apply"
            description="Choose the schemes you're eligible for and apply online"
          />
        </div>
      </div>
    </section>
  );
};

export default HowToApply;
