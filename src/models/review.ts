interface IUser {
  userId: number;
  userNickname: string;
  userImage: string | null;
  isLiked: boolean;
}

interface IReviewImage {
  reviewImgId: string;
  reviewImgSrc: string;
  reviewImageOrder: number;
}

interface IReview {
  reviewId: string;
  sltOrSpotId: number;
  reviewImg: IReviewImage[] | null;
  reviewDescription: string;
  reviewScore: number;
  updatedDate: string;
  user: IUser;
  likeCount: number;
}

interface IReviewsInfo {
  reviewAvg : number;
  reviewCount : number;
};

interface IReviewFormData {
  reviewScore: number;
  reviewDescription: string;
  reviewImg: IReviewImage[] | null;
}