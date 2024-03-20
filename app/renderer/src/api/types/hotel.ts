import { ApiResponse, Page } from '@/api/types/base';

export interface GetHotelsDetailReq {
  name: string;
  page: Page
}

export interface HotelDetail {
  hotel_id: number;
  name: string;
  guest_room: number
  address: string;
  phone: string
  description: string;
  stars: string,
  origin_data: string,
  is_collected: boolean,
  last_collected: string,
}

export interface GetHotelsDetailResp extends ApiResponse{
  result: HotelDetail[]
}

export interface UpdateHotelsStatusReq {
  hotel_id: number;
  status: number;
}

export interface UpdateHotelsStatusResp extends ApiResponse{
  result: boolean
}
