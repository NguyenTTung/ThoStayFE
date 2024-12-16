import axios from "axios"
import { API } from '../apiConfig'

export const getAllPackage = (params: any) => {
    return axios.get(API.GETALLPACKAGE, {
        params: params
    });
}
export const registerPackage = (params: any) => {
    return axios.post(API.REGISTERPACKAGE, params);  // Pass params directly as the body
};

export const checkPackage = (params: any) => {
    return axios.get(API.CHECKPACKAGE, {
        params: params
    });
}