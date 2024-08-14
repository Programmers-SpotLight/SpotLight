interface IUser {
  userId: number;
  userNickname: string;
  userImage: string | null;
  isLiked: boolean;
}

interface IReviewImage {
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

interface IReviewInsertData {
  reviewId: string | Buffer;
  userId: number;
  sltOrSpotId: string | number;
  reviewDescription: string;
  reviewScore: number;
  reviewImg: IReviewImage[] | null;
}

type ReviewType = "selection" | "spot";
