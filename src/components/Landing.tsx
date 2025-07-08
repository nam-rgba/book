import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import l1 from "../assets/landing/l1.jpg";
import l2 from "../assets/landing/l2.jpg";
import l3 from "../assets/landing/l3.jpg";
import { Link } from "react-router-dom";

const books = [
  {
    id: 270,
    img: l3,
    title: "Dế mèn phiêu lưu ký",
    sale: "Trở về tuổi thơ, sale 3%!",
  },
  {
    id: 268,
    img: l1,
    title: "Sherlock Holmes",
    sale: "Tháng trinh tháng, sale 1%!",
  },
  {
    id: 269,
    img: l2,
    title: "Tua and the Elephant",
    sale: "Trở về tuổi thơ, sale 2%!",
  },
];

const Landing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === books.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Mouse handlers for auto-play
  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  return (
    <div 
      className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {books.map((book) => (
          <div key={book.id} className="w-full h-full flex-shrink-0 relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${book.img})` }}
            >
              <div className="absolute inset-0 bg-black opacity-20 sm:bg-white sm:opacity-50"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-center sm:justify-around px-4 sm:px-8 lg:px-16">
              {/* Text Content */}
              <div className="text-center sm:text-left text-white sm:text-[#5A6A85] max-w-full sm:max-w-2xl lg:max-w-4xl mb-8 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-lg leading-tight">
                  {book.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 drop-shadow-md font-medium opacity-90 sm:opacity-100">
                  {book.sale}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                  <button className="bg-blue-500 hover:bg-blue-600 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold transition-all duration-200 rounded-md sm:rounded-none">
                    <Link to={`/detail/${book.id}`} className="block w-full h-full">
                      Xem chi tiết
                    </Link>
                  </button>
                </div>
              </div>

              {/* Image - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:flex sm:w-1/3 lg:w-2/5 xl:w-1/2 justify-center items-center">
                <img
                  src={book.img}
                  alt={book.title}
                  className="w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 h-auto rounded-lg shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] max-h-[60%] object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20"
      >
        <FaChevronLeft size={16} className="sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20"
      >
        <FaChevronRight size={16} className="sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
        {books.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 p-1 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-lg z-20 text-sm sm:text-base">
        {currentIndex + 1} / {books.length}
      </div>
    </div>
  );
};
export default Landing;
