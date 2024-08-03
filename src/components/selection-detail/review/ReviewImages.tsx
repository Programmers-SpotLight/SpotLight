import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ReviewImages = () => {
  const imageUrl = "https://www.kagoshima-kankou.com/storage/tourism_themes/12/responsive_images/ElwnvZ2u5uZda7Pjcwlk4mMtr08kLNydT8zXA6Ie__1673_1115.jpeg";
  const images = Array(3).fill(imageUrl); 

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <div className="relative">
      <div className="flex space-x-1 overflow-hidden">
        {/* <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
        </div> */}
        {images.map((url, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            key={index} 
            src={url} 
            alt={`Image ${index + 1}`} 
            className={`w-[165px] h-[162px] object-cover 
            ${
              index === 0 
              ? 'rounded-tl-lg rounded-bl-lg' 
              : index === images.length - 1 
                ? 'rounded-tr-lg rounded-br-lg' 
                : ''
            }`}
          />
        ))}
      </div>
      <button
          onClick={prevSlide}
          className="w-[20px] h-[20px] absolute top-1/2 -left-[10px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      >
        <IoIosArrowBack />
      </button>
      <button
        onClick={nextSlide}
        className="w-[20px] h-[20px] absolute top-1/2 -right-[10px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default ReviewImages;