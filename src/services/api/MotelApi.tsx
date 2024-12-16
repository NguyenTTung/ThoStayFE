// API motel
import axios from 'axios';
import axiosInstance, { API_URL } from '../apiConfig';
import { GetHistoryByRoomIdDTO, BillByIdDTO, GetPriceByRoomTypeDTO, GetRoomTypeByAddElicWaterDTO, SendElicWaterDTO, AddServiceDTO, AddUserRoomDTO, BillDTO, EditMotelDTO, EditServiceDTO, GetMotelEditDTO, GetRoomTypeByEditDTO, GetRoomTypeDTO, MotelPaginationResponse, RoomDTO, RoomUserDTO, BillPaginationResponse, HistoryPaginationResponse } from '../Dto/MotelDto';
import { ResponseDTO } from './RepositoryDto';
import { FilterProps } from '@/pages/admin/motel';
import { getAccountApi } from './authApi';
import { BillQueryDto } from '@/pages/admin/room/component/detailroom/billroom';
import { HistoryQueryDto } from '@/pages/admin/room/component/detailroom/historyroom';

export const getMotelByOwnerApi = async (
	query: FilterProps
): Promise<MotelPaginationResponse> => {
	var user = await getAccountApi();
	const response = await axios.get<ResponseDTO<MotelPaginationResponse>>(
		`${API_URL}/Room/get-motel-by-owner/${user.data.data.id}`,
		{
			params: query,
		}
	);
	return response.data.data;
};

export const getMotelByAdminApi = async (
	query: FilterProps
): Promise<MotelPaginationResponse> => {
	const response = await axiosInstance.get<
		ResponseDTO<MotelPaginationResponse>
	>(`${API_URL}/Room/get-all-motel-by-admin`, {
		params: query,
	});
	return response.data.data;
};

export const AddMotel = async (formData: FormData) => {
	const response = await axios.post<ResponseDTO<null>>(
		`${API_URL}/Room/add-motel`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return response.data;
};

export const GetMotelByEditApi = async (
	id: string | undefined
): Promise<ResponseDTO<GetMotelEditDTO>> => {
	const response = await axios.get<ResponseDTO<GetMotelEditDTO>>(
		`${API_URL}/Room/get-motel-edit/${id}`
	);
	return response.data;
};

export const EditMotel = async (data: EditMotelDTO) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/edit-motel`,
		data
	);
	return response.data;
};

export const AddService = async (data: AddServiceDTO[]) => {
	console.log(data);
	const response = await axios.post<ResponseDTO<null>>(
		`${API_URL}/Service/add-service`,
		data
	);
	return response.data;
};

export const DeleteService = async (data: number[]) => {
	const response = await axios.delete<ResponseDTO<null>>(
		`${API_URL}/Service/delete-service`,
		{
			data: data,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return response.data;
};

export const EditService = async (data: EditServiceDTO[]) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Service/edit-service`,
		data
	);
	return response.data;
};

export const ApproveMotelApi = async (id: number) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/approve-motel/${id}`
	);
	return response.data;
};

export const RejectMotelApi = async (id: number) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/reject-motel/${id}`
	);
	return response.data;
};

export const LockMotelApi = async (id: number) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/lock-motel/${id}`
	);
	return response.data;
};

export const UnLockMotelApi = async (id: number) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/unlock-motel/${id}`
	);
	return response.data;
};

export const DeleteMotel = async (id: number) => {
	const response = await axios.delete<ResponseDTO<null>>(
		`${API_URL}/Room/delete-motel/${id}`
	);
	return response.data;
};

export const GetRoomTypeByMotelId = async (id: string | undefined) => {
	if (!id) {
		console.log("idMotel is undefined");
		return;
	}
	const response = await axios.get<ResponseDTO<GetRoomTypeDTO[]>>(
		`${API_URL}/Room/get-room-type-by-motel-id/${id}`
	);
	return response.data;
};

export const AddRoomApi = async (data: {
	roomTypeId: number;
	quantityRoom: number;
}) => {
	const response = await axios.post<ResponseDTO<null>>(
		`${API_URL}/Room/add-room`,
		data
	);
	return response.data;
};

export const AddRoomTypeApi = async (data: FormData) => {
	const response = await axios.post<ResponseDTO<null>>(
		`${API_URL}/Room/add-room-type`,
		data
	);
	return response.data;
};

export const GetRoomByIdApi = async (id: string | undefined) => {
	if (!id) {
		console.log("id is undefined");
		return;
	}
	const response = await axios.get<ResponseDTO<RoomDTO>>(
		`${API_URL}/Room/get-room-by-id/${id}`
	);
	return response.data;
};

export const GetRoomTypeByEditApi = async (id: string | undefined) => {
	if (!id) {
		console.log("id is undefined");
		return;
	}
	const response = await axios.get<ResponseDTO<GetRoomTypeByEditDTO>>(
		`${API_URL}/Room/get-room-type-by-edit/${id}`
	);
	return response.data;
};

export const EditRoomTypeApi = async (data: FormData) => {
	const response = await axios.put<ResponseDTO<null>>(
		`${API_URL}/Room/edit-room-type`,
		data
	);
	return response.data;
};

export const FindUser = async (data: string) => {
	const response = await axios.get<ResponseDTO<RoomUserDTO[]>>(
		`${API_URL}/Room/find-user`,
		{
			params: {
				search: data,
			},
		}
	);
	return response.data;
};

export const AddUserRoomApi = async (data: AddUserRoomDTO) => {
	const response = await axios.post<ResponseDTO<null>>(
		`${API_URL}/Room/add-user-to-room`,
		data
	);
	return response.data;
};

export const DeleteUserRoomApi = async (roomId: number, userId: number) => {
	const response = await axios.delete<ResponseDTO<null>>(
		`${API_URL}/Room/delete-user-from-room`,
		{
			data: { roomId, userId },
		}
	);
	return response.data;
};

export const GetBill = async (id: number, query: BillQueryDto) => {
	console.log(query);
	const response = await axios.get<ResponseDTO<BillPaginationResponse>>(
		`${API_URL}/Room/get-bill-by-room-id/${id}`,
		{
			params: query,
		}
	);
	return response.data;
};

export const GetBillById = async (id: number) => {
	const response = await axios.get<ResponseDTO<BillByIdDTO>>(`${API_URL}/Room/get-bill-by-id/${id}`);
	return response.data;
};

export const GetHistoryByRoomIdApi = async (id: number, query: HistoryQueryDto) => {
	const response = await axios.get<ResponseDTO<HistoryPaginationResponse>>(`${API_URL}/Room/get-history-by-room-id/${id}`, {
		params: query,
	});
	return response.data;
};

export const GetRoomTypeByAddElicWaterApi = async (id: number) => {
	const response = await axios.get<ResponseDTO<GetRoomTypeByAddElicWaterDTO[]>>(`${API_URL}/Room/get-room-by-export-bill/${id}`);
	return response.data;
};

export const SendElicWaterApi = async (data: SendElicWaterDTO) => {
	const dataSend = {
		roomId: data.roomId,
		water: Number(data.water),
		electric: Number(data.electric),
		other: Number(data.other),
	};
	const response = await axios.post<ResponseDTO<null>>(`${API_URL}/Room/add-electric-and-water-to-bill`, dataSend);
	return response.data;
};

export const GetPriceByRoomTypeApi = async (id: number) => {
	const response = await axios.get<ResponseDTO<GetPriceByRoomTypeDTO>>(`${API_URL}/Room/get-price-by-room-type-id/${id}`);
	return response.data;
};

export const SentBillToEmail = async (billId: number) => {
	const response = await axios.get(`${API_URL}/send-bill-email`, {
		params: { billId }, // Gửi `billId` như query string
	  });
	return response.data;
};