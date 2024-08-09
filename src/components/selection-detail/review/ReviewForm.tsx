import React, { useState, useEffect } from "react";
import TextAreaInput from "@/components/common/input/TextAreaInput";
import Button from "@/components/common/button/Button";
import ReviewRating from "./ReviewRating";
import ReviewModalImage from "./ReviewModalImage";
import { v4 as uuidv4 } from 'uuid';

interface IReviewFormProps {
  review: IReview | null;
  onSubmit: (rating: number, reviewText: string, pictures: IReviewImage[]) => void;
  onCancel: () => void;
}

const ReviewForm = ({ 
  review, 
  onSubmit, 
  onCancel 
}: IReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [pictures, setPictures] = useState<IReviewImage[]>([]);

  useEffect(() => {
    if (review) {
      setRating(review.reviewScore);
      setReviewText(review.reviewDescription || '');
      setPictures(review.reviewImg || []);
    }
  }, [review]);

  const handlePictureAdd = (image: string) => {
    setPictures((prevPictures) => [...prevPictures, { reviewImgId: uuidv4(), reviewImageOrder: prevPictures.length, reviewImgSrc: image }]);
  };

  const handlePictureChange = (index: number, newPicture: string) => {
    setPictures((prevPictures) => {
      return prevPictures.map((pic, i) => (i === index ? { ...pic, reviewImgSrc: newPicture } : pic));
    });
  };

  const handlePictureRemove = (index: number) => {
    setPictures((prevPictures) => {
      const newPictures = prevPictures.filter((_, i) => i !== index);
      return newPictures.map((pic, i) => ({ ...pic, reviewImageOrder: i }));
    });
  };

  let isButtonDisabled = false;
  if (review) {
    isButtonDisabled = review.reviewScore === rating 
                    && review.reviewDescription === reviewText
                    && review.reviewImg === pictures;
  } else {
    isButtonDisabled = rating <= 0 || reviewText.length < 10;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      onSubmit(rating, reviewText, pictures);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="text-medium font-extrabold">
        {review ? "리뷰를 수정해주세요." : "리뷰를 등록해주세요."}
      </div>

      <ReviewRating rating={rating} onRatingChange={(newRating) => setRating(newRating)} />
      
      <TextAreaInput 
        height="large" 
        width="medium" 
        value={reviewText}
        placeholder="최소 10자 이상, 최대 1000자 이내로 작성하세요." 
        onTextChange={(text) => setReviewText(text)}
        minLength={10} 
        maxLength={1000} 
      >
        {review ? review?.reviewDescription : null}
      </TextAreaInput>

      <div className="text-medium font-extrabold">사진 등록(선택)</div>
      <ReviewModalImage 
        pictures={pictures} 
        onPictureAdd={handlePictureAdd}
        onPictureChange={handlePictureChange}
        onPictureRemove={handlePictureRemove}
      />

      <div className="flex justify-center">
        <Button 
          type="submit" 
          color={isButtonDisabled ? "default" : "primary"}
          disabled={isButtonDisabled}
        >
          {review ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
