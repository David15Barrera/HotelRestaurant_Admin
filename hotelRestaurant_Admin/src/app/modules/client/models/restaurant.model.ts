export interface Restaurant {
  id: string;
  name: string;
  hotelId: string;
  address: string;
  phone: string;
  capacity: number;
  openingTime: LocalTime;
  closingTime: LocalTime;
  createdAt: string;
  hotelIdResponse?: string;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhone?: string;
  hotelTotalRooms?: number;
}

export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}