import { Noti } from "../api/authApi";

export interface Data {
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    items: Noti[];
}

export interface ParamsPage {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: boolean;
}