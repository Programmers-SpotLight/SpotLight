interface IUser {
  userId: number;
  userNickname: string;
  userImage: string | null;
  isLiked: boolean | null;
}

interface IReviewImage {
  reviewImgSrc: string;
  reviewImageOrder: number;
}

interface IReviewImageFormData {
  reviewImgId: string | Buffer;
  reviewImgSrc: string;
  reviewImageOrder: number;
}

interface IReview {
  reviewId: string;
  sltOrSpotId: number | string;
  reviewImg: IReviewImage[] | null;
  reviewDescription: string;
  reviewScore: number;
  createdDate: string;
  updatedDate: string;
  user: IUser;
  likeCount: number;
}

interface IReviewsInfo {
  reviewAvg : number;
  reviewCount : number;
};

interface IReviews {
  reviewAvg: number;
  reviewCount: number;
  reviewList: IReview[];
}

interface IReviewFormData {
  reviewScore: number;
  reviewDescription: string;
  reviewImg: IReviewImage[] | null;
}

interface IReviewUpdateFormData extends IReviewFormData { reviewId: string; }
interface IMyReviewUpdateFormData extends IReviewFormData { 
  reviewId: string; 
  sltOrSpotId: string | number;
}

interface IReviewInsertData {
  reviewId: string | Buffer;
  userId: number;
  sltOrSpotId: string | number;
  reviewDescription: string;
  reviewScore: number;
  reviewImg: IReviewImageFormData[] | null;
}

type ReviewType = "selection" | "spot";

interface IMyReview {
  reviewId: string;
  sltOrSpotId: number | string;
  sltName: string;
  spotName: string | null;
  reviewDescription: string;
  reviewScore: number;
  createdDate: string;
  updatedDate: string;
  likeCount: number;
  reviewImg: IReviewImage[] | null;
}

interface IMyReviews {
  reviews: IMyReview[];
  pagination: {
    currentPage: number;
    limit: number;
    totalCount: number;
  }
}

interface IReviewLikeData {
  reviewId: string;
  liked: boolean;
  likeCount: number;
}