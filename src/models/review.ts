interface IUser {
  userId: number;
  userNickname: string;
  userImage: string | null;
  isLiked: boolean;
}

interface IReviewImage {
  reviewImageOrder: number;
  reviewImgSrc: string;
}

interface IReview {
  reviewId: number;
  sltOrSpotId: number;
  reviewImg: IReviewImage[] | null;
  reviewDescription: string;
  reviewScore: number;
  createdDate: string;
  updatedDate: string;
  user: IUser;
  likeCount: number;
}

interface IReviews {
  reviewAvg : number;
  reviewCount : number;
  reviewList : IReview[];
};

interface IReviewFormData {
  reviewScore: number;
  reviewDescription: string;
  reviewImg: IReviewImage[] | null;
}