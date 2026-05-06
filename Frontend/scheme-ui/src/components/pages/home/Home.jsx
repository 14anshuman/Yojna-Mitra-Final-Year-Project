import AboutUs from "./components/AboutUs";
import Categories from "./components/Categories";
import FAQ from "./components/FAQ";
import HeroSection from "./components/HeroSection";
import HowToApply from "./components/HowToApply";
import TotalSchemes from "./components/TotalSchemes";
import Recommendations from "./components/Recommendations";
import Header from "../../common/header/Header";
// import About from "./components/About";
import Footer from "../../common/footer/Footer";

const Home = () => {
  return (
    <div className="overflow-x-hidden  bg-white">
      <div className="w-full mx-auto  flex flex-col ">
       
        <HeroSection />

        <TotalSchemes />

        <Categories />
        <HowToApply />
       /
        <FAQ />
        <Recommendations />
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
