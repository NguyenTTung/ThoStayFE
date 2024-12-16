import axios from "axios"
import { API } from '../apiConfig'

export interface optionRole {   
    value: string;
    label: string;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    role: optionRole;
}

export const getAllUser = (params: any) => {
    return axios.get(API.GETALLUSER, {
        params: params
    });
}

export const addUser = (data: User) => {
    
    return axios.post(API.GETALLUSER, data, {
        validateStatus: status => (status >= 200 && status < 300) || status === 400
    });
    
}
export const getUserById = (id: number) => {
    return axios.get(API.GETUSERBYID + id);
}
export const updateUser = (id: number, data: User) => {
    return axios.put(API.UPDATEUSER + id, data, {
        validateStatus: status => (status >= 200 && status < 300) || status === 400
    });
}
export const deleteUser = (id: number) => {
    return axios.delete(API.DELETEUSER + id, {
        validateStatus: status => (status >= 200 && status < 300) || status === 400
    });
}

export const getRole = () => {
    return axios.get(API.GETROLE);
}