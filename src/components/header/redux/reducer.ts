
import { getSentNotiApi, SentNoti } from '@/services/api/notiApi';
import { API } from '@/services/apiConfig';
import axios from 'axios';


export interface User {
  fullName: string;
  phone: string;
  avatar: string;
  email: string;
  role: string;
}

export interface MyMotel {
  id: number;
  name: string;
  address: string;
  description: string;
  createDate: Date;
  status: number;
  service: [
    {
      id: number;
      name: string;
      price: number;
    }
  ];
  roomType: [
    {
      id: number;
      name: string;
      area: number;
      description: string;
      price: number;
      totalRoom: number;
      images: [
        {
          id: number;
          link: string;
          type: string;
        }
      ]
    }
  ]
}

export interface Notification {
  userId: number;
  email: string;
  notificationCount: number;
  notifications: {
    id: number;
    type: number;
    title: string;
    content: string;
    status: boolean;
    createDate: Date;
    sender: string;
  }[];
}

export interface MyPackage {
  id: number;
  name: string;
  description: string;
  price: string;
  createDate: Date;
  limitMotel: number;
  limitRoom: number;
  status: boolean;
}


export const getAccount = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const res = await axios.get(API.USEDETAIL, { params: { token: token } })
    return res.data;
  }
  return null
}

export const getMyMotel = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const res = await axios.get(API.MYMOTEL, { params: { token: token } })
    return res.data.data;
  }
  return null
}

export const getNoti = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const res = await axios.get(API.USEDETAIL, { params: { token: token } })
    const emailuser: SentNoti = { email: res.data.email }
    const getNoti1 = await getSentNotiApi(emailuser);
    return getNoti1.data;
  }
  return null

}

export const getPackage = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const res = await axios.get(API.CHECKPACKAGE, { params: { token: token } })
    return res.data.data;
  }
  return null
}

