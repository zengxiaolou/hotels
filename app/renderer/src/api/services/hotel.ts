import { UseApiOptions, useRequest } from '@/api/useRequest';
import {
  GetHotelsDetailReq,
  GetHotelsDetailResp,
  UpdateHotelsStatusReq,
  UpdateHotelsStatusResp,
} from '@/api/types/hotel';

const host = localStorage.getItem('host') || 'http://47.106.140.187';
const port = localStorage.getItem('port') || '8080';
const baseURL = `${host}:${port}/api`
export const useGetHotelDetailList = (data?: GetHotelsDetailReq,options?: UseApiOptions) => {
  return useRequest<GetHotelsDetailResp>(
    {
      url: '/hotels/name',
      method: 'post',
      baseURL
    },
    options
  )
}

export const useUpdateHotelStatus = (data?: UpdateHotelsStatusReq,options?: UseApiOptions) => {
  return useRequest<UpdateHotelsStatusResp>(
    {
      url: '/hotel/update',
      method: 'post',
      baseURL
    },
    options
  )
}
