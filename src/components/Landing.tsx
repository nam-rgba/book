import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import l1 from "../assets/landing/l1.jpg";
import l2 from "../assets/landing/l2.jpg";
import l3 from "../assets/landing/l3.jpg";


const books =[
    {
        id:1, 
        img: l1,
        title: "Sherlock Holmes",
        sale: 'Tháng trinh tháng, sale 1%!'
    },{
        id: 2,
        img: l2,
        title: "Tua and the Elephant",
        sale: 'Trở về tuổi thơ, sale 2%!'
    },
    {
        id: 3,
        img: l3,
        title: "Dế mèn phiêu lưu ký",
        sale: 'Trở về tuổi thơ, sale 3%!'
    }
]

const Landing = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <div className="w-full h-[600px] overflow-hidden">
            {/* Slides Container */}
            <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {books.map((book) => (
                    <div 
                        key={book.id} 
                        className="w-full h-full flex-shrink-0 relative"
                    >
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${book.img})` }}
                        >
                            <div className="absolute inset-0 bg-white opacity-50"></div>
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-row items-center justify-between">
                            <div className="text-left text-[#5A6A85] max-w-4xl mx-auto px-4">
                                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                                    {book.title}
                                </h1>
                                <p className="text-xl md:text-3xl mb-8 drop-shadow-md font-medium">
                                    {book.sale}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 ">
                                    <button className="bg-blue-500 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] text-white px-8 py-3  font-semibold transition-colors duration-200 ">
                                        Get This Deal
                                    </button>
                                </div>
                            </div>
                            <div className="hidden sm:block w-1/3 h-auto">
                                <img 
                                    src={book.img} 
                                    alt={book.title} 
                                    className="hidden sm:block w-1/2 h-auto rounded-lg shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-20"
            >
                <FaChevronLeft size={24} />
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-20"
            >
                <FaChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {books.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 p-1 rounded-full transition-all duration-200 ${
                            index === currentIndex 
                                ? 'bg-white scale-125' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-6 right-6 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg z-20">
                {currentIndex + 1} / {books.length}
            </div>
        </div>
    )
}
export default Landing;