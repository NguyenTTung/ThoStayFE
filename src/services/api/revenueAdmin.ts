import axios from "axios"
import { API} from '../apiConfig'
export interface RevenueAdmin {
    token: string
 }
 export interface CountAccount {
    token: string,
    role: string,
 }



 export const GetRevenueAdmin = async (GetRevenue: RevenueAdmin) => {
    try {
        const response = await axios.get(API.REVENUEADMIN, {
            params: {
                token: GetRevenue.token,  // Chỉ truyền token
            },
        });
        return response;  // Trả về kết quả từ API
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw error;  // Ném lỗi nếu có
    }
};

export const GetCountAccount = async (item : CountAccount) => {
    try {
        const response = await axios.get(API.COUNTACCOUNT, {
            params: {
                token: item.token,  // Chỉ truyền token
                role: item.role
            },
        });
        return response;  // Trả về kết quả từ API
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw error;  // Ném lỗi nếu có
    }
}
