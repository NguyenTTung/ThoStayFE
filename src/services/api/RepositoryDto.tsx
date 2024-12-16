export interface ResponseDTO<T> {
    code: number;
    data: T;
    message: string;
    status: string;
}
