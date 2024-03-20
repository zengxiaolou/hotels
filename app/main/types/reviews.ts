export interface ReviewBaseInfo {
  hotel_id: number;
  total_review?: number;
  recommended_review?: number;
  bad_review?: number;
  environment?: string;
  hygiene?: string;
  service?: string;
  facility?: string;
  score?: string;
}

export interface ReviewDetail {
  hotel_id: number;
  review_id: string;
  score: string;
  review_content: string;
  release_date: string;
  checkIn_date: string;
}
