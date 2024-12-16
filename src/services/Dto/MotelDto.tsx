// DTO chung------------------------------------------------------------------------------------------------

interface ImageInfo {
  id: number;
  link: string;
  name: string;
  type: string;
}
// ------------------------------------------------------------------------------------------------
interface OwnerInfo {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  createDate: string;
  status: boolean;
}



export interface MotelDTO {
  id: number;
  name: string;
  address: string;
  description: string; // Thêm trường mô tả
  location: string | null; // Thêm trường vị trí, có thể null
  rating: number; // Thêm trường đánh giá
  status: number;
  createDate: string;
  totalRoom: number;
  owner: OwnerInfo;
}

export interface MotelPaginationResponse {
  items: MotelDTO[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface BillPaginationResponse {
  items: BillDTO[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface HistoryPaginationResponse {
  items: GetHistoryByRoomIdDTO[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ------------------------------------------------------------------------------------------------


export interface AddMotelDTO {
  nameMotel?: string;
  address?: string;
  nameRoom?: string;
  area: number;
  priceRoom: number;
  totalRoom: number;
  description: string;
  userId: number | undefined;
}

// ------------------------------------------------------------------------------------------------

export interface GetMotelEditDTO {
  id: number;
  name: string;
  address: string;
  services: GetMotelEditDTO_Service[] | null;
}

export interface GetMotelEditDTO_Service {
  id: number;
  name: string;
  price: number;
  description: string;
}
// ------------------------------------------------------------------------------------------------

export interface EditMotelDTO {
  id: number;
  name: string;
  address: string;
}

// ------------------------------------------------------------------------------------------------

export interface AddServiceDTO {
  name: string;
  price: number;
  description: string;
  motelId: string;
}

export interface EditServiceDTO {
  id: number;
  name: string;
  price: number;
  description: string;
}

// ------------------------------------------------------------------------------------------------

export interface GetRoomTypeDTO_Room {
  id: number;
  roomNumber: number;
  totalUser: number;
  status: number;
}

interface GetRoomTypeDTO_Image {
  id: number;
  link: string;
  name: string;
  type: string;
}

interface GetRoomTypeDTO_Motel {
  id: number;
  address: string;
  name: string;
  description: string;
  location: string | null;
  rating: number;
  totalRoom: number;
  totalUser: number;
  status: number;
  createDate: string;
}

export interface GetRoomTypeDTO {
  id: number;
  name: string;
  area: number;
  description: string;
  price: number;
  newPrice: number;
  rating: number;
  totalRoom: number;
  totalUser: number;
  createDate: string;
  updateDate: string;
  status: number;
  rooms: GetRoomTypeDTO_Room[];
  images: GetRoomTypeDTO_Image[];
  motel: GetRoomTypeDTO_Motel;
}

// ------------------------------------------------------------------------------------------------

interface RoomDTO_RoomType {
  id: number;
  name: string;
  area: number;
  description: string;
  price: number;
}


interface RoomDTO_User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  avatar: string | null;
}

interface RoomDTO_Consumption {
  id: number;
  water: number;
  electricity: number;
  time: string;  // DateTime được chuyển thành string trong TypeScript
}

export interface RoomDTO {
  id: number;
  roomNumber: number;
  totalUser: number | null;
  status: number;
  roomType: RoomDTO_RoomType;
  images: ImageInfo[];
  users: RoomDTO_User[];
  consumption: RoomDTO_Consumption;
}

// ------------------------------------------------------------------------------------------------
export interface GetRoomTypeByEditDTO {
  id: number;
  name: string;
  area: number;
  description: string;
  price: number;
  newPrice: string;
  images: ImageInfo[];
}

//edit room type
export interface EditRoomTypeDTO {
  id: number;
  name: string;
  area: number;
  description: string;
  newPrice: number;
  newImages: File[];
  removeImageId: number[];
}

// ------------------------------------------------------------------------------------------------

export interface GetHistoryByRoomIdDTO {
  id: number;
  createDate: string;
  endDate: string | null;
  status: number;
  user: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    avatar: string | null;
    createDate: string;
    status: boolean;
  }
}
export interface RoomUserDTO {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  avatar: string | null;
}

export interface AddUserRoomDTO {
  roomId: number;
  userId: number;
}

// ------------------------------------------------------------------------------------------------

export interface GetRoomTypeByAddElicWaterDTO {
  id: number;
  roomNumber: number;
  consumption: {
    id: number;
    water: number;
    electricity: number;
  }
}

export interface SendElicWaterDTO {
	roomId: number;
	water: string;
	electric: string;
	other: string;
}

// ------------------------------------------------------------------------------------------------

export interface GetPriceByRoomTypeDTO {
  roomTypeId: number;
  price: number; 
  price_Electric: number;
  price_Water: number;
}
// Interface cho thông tin dịch vụ trong hóa đơn
export interface ServiceBillDTO {
    id: number;
    name: string;
    price_Service: number;
    quantity: number;
}

// Interface cho thông tin phòng trong hóa đơn
export interface RoomBillDTO {
    id: number;
    roomNumber: number;
}

// Interface chính cho hóa đơn
export interface BillDTO {
    id: number;
    priceRoom: number;
    status: number;
    createdDate: string;
    paymentDate: string;
    total: number;
    roomId: number;
    room: RoomBillDTO;
    userId: number | null;
    user: any | null; // Có thể thay bằng UserDTO nếu cần
    serviceBills: ServiceBillDTO[];
}

export interface BillByIdDTO{
  priceRoom: number;
  status: number;
  createdDate: string;
  total: number;
  roomId: number;
  room: RoomBillDTO;
  userId: number | null;
  user: any | null;
  serviceBills: ServiceBillDTO[];
}


