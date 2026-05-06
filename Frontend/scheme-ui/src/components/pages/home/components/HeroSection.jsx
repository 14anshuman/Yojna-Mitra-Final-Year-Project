import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import banner10 from "./public/banner10.png";
import banner11 from "./public/banner11.png";
import banner9 from "./public/banner9.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const images = [
    { src: banner9, alt: "Government Schemes Banner 1", priority: true },
    { src: banner10, alt: "Government Schemes Banner 2" },
    { src: banner11, alt: "Government Schemes Banner 3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleExplore = () => navigate("/schemes");

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Slider */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={image.src}
              alt={image.alt}
              className="w-screen h-full object-fill object-center"
              loading={image.priority ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Contrast Overlay (separate layer – correct approach) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex items-center px-8 sm:px-16">
        <div className="max-w-2xl text-white space-y-4 ml-4 sm:ml-10 md:ml-16">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Explore Government Schemes for You
          </h1>

          <p className="text-lg md:text-xl text-white/90">
            Get information about all government schemes, organized and easy to explore.
          </p>

          <button
            onClick={handleExplore}
            className="
              inline-flex items-center gap-2
              bg-[#74B83E] text-white
              px-7 py-3.5 rounded-full
              font-semibold

              hover:bg-[#5d9b2b]
              active:scale-[0.98]

              transition-all duration-200
              shadow-lg hover:shadow-xl
            "
          >
            Explore Schemes
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="
          absolute left-5 top-1/2 -translate-y-1/2
          bg-white/70 backdrop-blur-md
          p-2.5 rounded-full hidden sm:flex
          hover:bg-white transition
          shadow-md
        "
      >
        <ChevronLeft className="text-black w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="
          absolute right-5 top-1/2 -translate-y-1/2
          bg-white/70 backdrop-blur-md
          p-2.5 rounded-full hidden sm:flex
          hover:bg-white transition
          shadow-md
        "
      >
        <ChevronRight className="text-black w-5 h-5" />
      </button>
    </section>
  );
};

export default HeroSection;