export interface Ticket {
    id: number;
    type: number;
    title: string;
    content: string;
    status: number;
}

export interface InfoTicket extends Ticket {
    receiver: string;
    createDate: Date;
    userId: number | null;
    userName: string;
    modelId: number | null;
    imgs: string[] | null;
}

export interface Data {
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    items: Ticket[];
}

export interface ParamsPage {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: number;
    token?: string;
}

export interface InfoTicketParams {
    id: number;
    token?: string;
}

export interface FormTicket {
    id: number;
    receiver: string;
    status: number;
}

export interface Receiver {
    id: number;
    fullName: string;
}

export interface FormCreate {
    type?: number;
    title: string;
    content: string;
    modelId?: number | null | undefined;
    imgs: (File | undefined)[];
}