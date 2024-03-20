import axios from 'axios';
import { ReviewBaseInfo, ReviewDetail } from '@/types/reviews';

export const getCronJobIds = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/hotels/cronjob');
    return response?.data?.result;
  } catch (error) {
    console.error('Error fetching ids:', error);
  }
};

export const save = async (reviewBaseInfo: ReviewBaseInfo, reviewDetailList?: ReviewDetail[] ) => {
  try {

    const response = await axios.post('http://localhost:8000/api/reviews/update', { reviewBaseInfo, reviewDetail: reviewDetailList });
    return response?.data?.result;
  } catch (error) {
    console.error('Error saving id:', error);
  }
}
