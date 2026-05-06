import {
  Target,
  Users,
  Shield,
  FileText,
  MessageCircle,
  Compass,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Header from "../../../common/header/Header";
import Footer from "../../../common/footer/Footer";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {

  const navigate=useNavigate();
  return (
    <>
      

      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-28 py-28 md:py-6 bg-gradient-to-br from-green-50 via-white to-emerald-50  overflow-hidden">
        <div className="container mx-auto max-w-7xl text-center space-y-2">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#74B83E] via-green-600 to-emerald-500 bg-clip-text text-transparent leading-tight tracking-tight">
            Yojna Mitra
          </h1>
          <p className="text-xl  sm:text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            Your trusted digital bridge to government opportunities — where
            innovation meets empowerment.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 pt-10 md:pt-12">
            {[
              { value: "24/7", label: "Support Available" },
              { value: "AI", label: "Powered Platform" },
              { value: "100%", label: "Free to Use" },
              { value: "∞", label: "Possibilities" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center py-12 px-6 bg-green-50 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl font-bold text-[#74B83E] mb-3">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-28 py-24 md:py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl text-center space-y-12">
          <h2 className="text-4xl md:text-4xl font-bold text-gray-900 leading-snug">
            Bridging the Gap Between Citizens and Opportunities
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            We simplify the complex world of government schemes through
            AI-powered personalization, instant chatbot support, and seamless
            application processes — empowering every citizen to access the
            benefits they deserve.
          </p>

          <div className="flex flex-wrap justify-center gap-5 md:gap-8 pt-2">
            {["Transparent Process", "Real-time Updates", "Personalized Experience"].map(
              (item, i) => (
                <div
                  key={i}
                  className="flex items-center bg-gradient-to-r from-[#74B83E] to-green-600 px-8 py-4 rounded-full shadow-sm hover:shadow-md transition"
                >
                  <CheckCircle className="text-black mr-3" size={22} />
                  <span className="text-gray-900 font-medium">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-28 py-28 md:py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl space-y-20">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-4xl md:text-4xl font-bold pb-4 text-gray-800">
              How We Make a Difference
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-lg leading-relaxed">
              Discover the features that make Scheme Setu your ideal companion
              for navigating government schemes.
            </p>
          </div>

          <div className="grid py-1 grid-cols-1 md:grid-cols-3 gap-12 md:gap-12">
            {[
              {
                icon: <Target className="text-white" size={34} />,
                title: "Personalized Schemes",
                desc: "AI analyzes your profile to recommend the most relevant schemes tailored specifically for you.",
                color: "from-[#74B83E] to-green-600",
              },
              {
                icon: <FileText className="text-white" size={34} />,
                title: "Seamless Applications",
                desc: "Apply directly through our platform and download detailed PDFs for offline access.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <MessageCircle className="text-white" size={34} />,
                title: "Smart Chatbot",
                desc: "Our AI chatbot provides instant, accurate responses 24/7 to guide you through every step.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group bg-white p-12 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border border-gray-100 space-y-4"
              >
                <div className="flex justify-center">
                  <div
                    className={`p-6 bg-gradient-to-br ${card.color} rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-28 py-28 md:py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-7xl space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-4xl font-bold text-gray-800">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12">
            {[
              {
                icon: <Compass className="text-white" size={34} />,
                title: "Our Mission",
                desc: "To democratize access to government schemes through transparent, actionable information.",
                color: "from-[#74B83E] to-green-600",
              },
              {
                icon: <Users className="text-white" size={34} />,
                title: "Who We Serve",
                desc: "Students, farmers, entrepreneurs, and citizens seeking growth through government support.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <Shield className="text-white" size={34} />,
                title: "Our Promise",
                desc: "To deliver accurate, up-to-date information with an exceptional user experience.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group bg-gray-50 p-10 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 space-y-6"
              >
                <div className="flex justify-center">
                  <div
                    className={`p-6 bg-gradient-to-br ${card.color} rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-28 py-24 md:py-24 bg-gradient-to-r from-[#74B83E] to-green-600 text-center">
        <div className="container mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
            Ready to Discover Your Opportunities?
          </h2>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of citizens who have already transformed their lives
            through Scheme Setu.
          </p>

          <button onClick={()=>navigate("/schemes")} className="group bg-white text-[#74B83E] px-10 py-3 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl">
            Explore Schemes Now
            <ArrowRight
              className="ml-3 group-hover:translate-x-1 transition-transform duration-300"
              size={22}
            />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;
