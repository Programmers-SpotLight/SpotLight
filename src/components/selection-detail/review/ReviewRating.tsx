import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface IProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
}

export default function ReviewRating({ rating, onRatingChange }: IProps) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRatingClick = (ratingValue: number) => {
    setScore(ratingValue);
    onRatingChange(ratingValue);
  };

  return (
    <div className="flex">
      <div className="flex">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;

          return (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => handleRatingClick(ratingValue)}
                className="hidden"
              />
              <FaStar
                size={35}
                className={
                  ratingValue <= (hover || rating) ? "text-yellow-400" : "text-grey2"
                }
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-lg">{rating}</p>
    </div>
  );
}