import axios from "axios";


export const API_URL = 'https://localhost:7299';

export enum API {
    //autherize
    LOGIN = API_URL + '/login',
    REGISTER = API_URL + '/register-customer',
    FOGOTPASSWORD = API_URL + '/senderOtpToEmail',
    OTP = API_URL + '/checkOtp',
    NEWPASS = API_URL + '/changePassword',

    //notification
    LISTNOTI = API_URL + '/api/Noti',
    CREATE_NOTI = API_URL + '/addNoti',
    UPDATE_NOTI = API_URL + '/api/Noti/',
    GET_SENTUSER = API_URL + '/api/Noti/get-sent-notifications',
    SENDNOTI = API_URL + '/api/Noti/SendByRole/',

    // statistical
    AVAILABLEROOM = API_URL + '/api/statistical/motels-with-empty-rooms',
    REVENUESTATISTIC = API_URL + '/api/statistical/api/revenue/last-six-months',
    PERCENTAGE = API_URL + '/api/statistical/expense-percentage',
    REVENUEADMIN = API_URL + '/api/statistical/revenue-admin',
    COUNTACCOUNT = API_URL + '/api/statistical/count-account',
    //ticket
    TICKETS = API_URL + '/api/Ticket/Tickets',
    UPDATETICKET = API_URL + '/api/Ticket/Assignee',
    CREATEtICKET = API_URL + '/api/Ticket/Tickets',
    RECEIVERS = API_URL + '/api/Ticket/GetReceivers',
    GETTICKETBYID = API_URL + '/api/Ticket/GetTicketById',

    //Room
    GETALLMOTEL = API_URL + '/Room/get-all-room-by-admin',
    GETMOTELBYID = API_URL + '/Room/get-motel-by-id',
    GETCOUNTMOTEL = API_URL + '/api/Main/get-count-motel',
    GETCOUNTROOM = API_URL + '/api/Main/get-Room-by-Motel',

    //RoomType
    GETROOMTYPEBYID = API_URL + '/api/Main/',

    //user
    GETALLUSER = API_URL + '/User',
    GETUSERBYID = API_URL + '/User/',
    UPDATEUSER = API_URL + '/User/',
    DELETEUSER = API_URL + '/User/',
    GETROLE = API_URL + '/Role',

    //Package
    GETALLPACKAGE = API_URL + '/api/Package',
    REGISTERPACKAGE = API_URL + '/api/Package',
    CHECKPACKAGE = API_URL + '/api/Package/check',

    //Home
    OUTSTANDINGMOTELS = API_URL + '/api/Main/outstanding-motels',
    NEWMOTELS = API_URL + '/api/Main/new',
    ROOMTYPEUNDERMILION = API_URL + '/api/Main/room-types-under-one-million',
    USEDETAIL = API_URL + '/GetUserDetailsFromToken',
    MYMOTEL = API_URL + '/api/Main/get-infomation-register-motel',
    RELATED = API_URL + '/api/Main/get-RealatedRoom-By-Adress',

    // search Motel
    SEARCHMOTEL = API_URL + '/api/Main/search',

    //UserManagement
    UPDATEUSERDETAIL = API_URL + '/update-user-from-token',
    PASSWORDUSER = API_URL + '/ChangePasswordFromToken',
    RENTALROOMDETAIL = API_URL + '/GetRentalRoomDetail',
    RENTALROOMHISTORY = API_URL + '/api/Main/get-rental-history',
    BILLUSER = API_URL + '/api/Main/get-Bill',
    BILLDETAIL = API_URL + '/api/Main/get-Bill-detail/',
    VNPAY = API_URL + '/api/Main/create-order',
    DELETEMYMOTEL = API_URL + '/api/Main/delete-register-motel-owner'
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

const roleRoutes: Record<string, string> = {
    'ADMIN': '/admin/',
    'CUSTOMER': '/',
    'OWNER': '/admin/',
    'STAFF': '/admin/notification'
};

export const getRouteFromToken = (token: string): string => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const normalizedRole = role.toUpperCase();

        return roleRoutes[normalizedRole] || '/unauthorized';
    } catch (error) {
        console.error('Lỗi khi decode token:', error);
        return '/unauthorized';
    }
};

//get role 
export const getRoleFromToken = (token: string): string => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        return role;
    } catch (error) {
        console.error('Lỗi khi decode token:', error);
        return 'CUSTOMER';
    }
}

// Interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


//refreshtoken nếu token hết hạn

export default axiosInstance;



