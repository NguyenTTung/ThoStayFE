import axios from "axios"
import { API } from '../apiConfig'
import { ParamsPage } from "../Dto/NotificationDto"


export interface SentNoti {
    email: string;
}


export const getNotis = (param?: ParamsPage) => {
    return axios.get(API.LISTNOTI, { params: param });
}

export const getSentNotiApi = (getSentNoti: SentNoti) => {
    return axios.get(API.GET_SENTUSER, { params: getSentNoti });
}

