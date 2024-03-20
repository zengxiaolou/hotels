import axios from 'axios';
import { ReviewBaseInfo, ReviewDetail } from '@/types/reviews';
import { store } from '@/components/singletons';
import { StoreKey } from '@/types/enum';

export const getIds = async () => {
  const service = store.get(StoreKey.SERVICE);
  const host = service?.host || 'http://47.106.140.187';
  const port = service?.port || '8080';
  const url = `${host}:${port}/api/hotels/ids`;
  try {
    const response = await axios.get(url);
    return response?.data?.result;
  } catch (error) {
    console.error('Error fetching ids:', error);
  }
};

export const save = async (reviewBaseInfo: ReviewBaseInfo, reviewDetailList?: ReviewDetail[] ) => {
  const service = store.get(StoreKey.SERVICE);
  const host = service.host || 'http://47.106.140.187';
  const port = service.port || '8080';
  const url = `${host}:${port}/api/reviews`;
  try {
    const response = await axios.post(url, { reviewBaseInfo, reviewDetail: reviewDetailList });
    return response?.data?.result;
  } catch (error) {
    console.error('Error saving id:', error);
  }
}
