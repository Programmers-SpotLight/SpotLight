import TextAreaInput from "@/components/common/input/TextAreaInput";
import ReviewRating from "./ReviewRating";
import Slider from "react-slick";
import PictureInput from "@/components/common/input/PictureInput";
import Button from "@/components/common/button/Button";
import { FormEvent, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PrevArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowBack
      className="w-[20px] h-[20px] absolute top-1/2 -left-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

const NextArrow = (props: any) => {
  const { onClick, show } = props;
  if (!show) return null;
  return (
    <IoIosArrowForward
      className="w-[20px] h-[20px] absolute top-1/2 -right-[7px] transform -translate-y-1/2 bg-grey3 text-white rounded-full flex items-center justify-center"
      onClick={onClick}
      style={{ zIndex: 1 }}
    />
  );
};

interface IReviewForm {
  review: IReview
  onSubmit: (e: FormEvent) => void;
}

const ReviewForm = ({
  review,
  onSubmit
}: IReviewForm) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [pictures, setPictures] = useState<IReviewImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (review) {
      setRating(review.reviewScore);
      setReviewText(review.reviewDescription || '');
      setPictures(review.reviewImg || []);
    }
  }, [review]);

  const settings = {
    infinite: false,
    speed: 500,
    centerMode: false,
    centerPadding: "0",
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    afterChange: (current: number) => setCurrentSlide(current),
    prevArrow: <PrevArrow show={currentSlide !== 0} />,
    nextArrow: <NextArrow show={currentSlide < pictures.length - 2} />
  };

  let isButtonDisabled = false;
  if(review) {
    isButtonDisabled = review.reviewScore === rating 
                    && review.reviewDescription === reviewText
                    && review.reviewImg === pictures;
  } else {
    isButtonDisabled = rating <= 0 || reviewText.length < 10;
  }

  const handlePictureAdd = (image: string) => {
    setPictures((prevPictures) => [...prevPictures, { reviewImageOrder: prevPictures.length, reviewImgSrc: image }]);
  };

  const handlePictureChange = (index: number, newPicture: string) => {
    setPictures((prevPictures) => {
      return prevPictures.map((pic, i) => (i === index ? { ...pic, reviewImgSrc: newPicture } : pic));
    });
  };

  const handlePictureRemove = (index: number) => {
    setPictures((prevPictures) => prevPictures.filter((_, i) => i !== index).map((pic, i) => ({ ...pic, reviewImageOrder: i })));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
            <div className="text-medium font-extrabold">
              {review ? "리뷰를 수정해주세요." : "리뷰를 등록해주세요."}
            </div>

            <ReviewRating rating={rating} onRatingChange={(newRating) => setRating(newRating)} />
            
            <TextAreaInput 
              height="large" 
              width="medium" 
              value={reviewText}
              placeholder="최소 10자 이상, 최대 100자 이내로 작성하세요." 
              onTextChange={(text) => setReviewText(text)}
            >
              {review ? review?.reviewDescription : null}
            </TextAreaInput>

            <div className="text-medium font-extrabold">사진 등록(선택)</div>
            <div className="slider-container">
              <Slider {...settings}  className="w-auto flex justify-start">
                <div className="px-1 inline-block">
                  <PictureInput 
                    inputSize="small" 
                    onPictureChange={handlePictureAdd} />
                </div>
                {pictures && pictures.map((pic, index) => (
                  <div key={index} className="px-1 inline-block relative">
                    <PictureInput 
                      inputSize="small" 
                      imgSrc={pic.reviewImgSrc} 
                      onPictureChange={(newPicture) => handlePictureChange(index, newPicture)} 
                      index={index} 
                    />
                    <div 
                      className="absolute top-2 right-2 cursor-pointer text-extraSmall text-white bg-grey4 rounded-full w-4 h-4 flex items-center justify-center hover:bg-grey3"
                      onClick={() => handlePictureRemove(index)}
                    >
                      x
                    </div>
                  </div>
                )).reverse()}
              </Slider>
            </div>
            

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