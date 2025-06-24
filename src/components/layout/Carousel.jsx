import React, { useState } from 'react';

const images = [
  "/images/shopping-concept.jpg",
  "/images/girl-enjoying-nice-soft-sound-headphones-cheerful-romantic-delighted-pretty-redhead-woman-til.jpg"
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides container */}
      <div className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0 h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] relative">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-center">
                Welcome to Razkart
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-50 z-10"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-50 z-10"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
