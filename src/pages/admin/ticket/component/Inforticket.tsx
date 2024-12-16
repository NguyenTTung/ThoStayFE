import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { InfoTicket, Receiver } from "@/services/Dto/ticketDto"
import { useEffect, useState } from "react"
import { getReceiver, getTicketById, UpdateTicket } from '@/services/api/ticketApi';
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import { FormTicket } from '@/services/Dto/ticketDto';

import '../styles/infoticket.scss'
import { Selectbox, Option } from '@/components/form_controls/select';
import { getAccountApi } from '@/services/api/authApi';
import { Account } from '@/services/Dto/authDto';

const Infoticket = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [infoticket, setInfoticket] = useState<InfoTicket>();

    const [selectReceiver, setSelectReceiver] = useState<Option[]>([]);

    const [user, setUser] = useState<Account>();

    const loadUser = async () => {
        const res = await getAccountApi();
        setUser(res.data.data);
    }

    const selectStatus: Option[] = [
        { value: 1, label: 'Tiếp nhận' },
        { value: 2, label: 'Đang xử lý' },
        { value: 3, label: 'Hoàn thành' }
    ];

    const { control, handleSubmit, reset } = useForm<FormTicket>();

    const fetchInfoticket = async (ticketId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await getTicketById({ id: ticketId, token: token });
                setInfoticket(res.data.data);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu api:', error);
        }
    }

    const fetchReceivers = async (roleName?: string) => {
        try {
            const res = await getReceiver(roleName);
            const receiver: Receiver[] = res.data.data;
            const options: Option[] = (receiver ?? []).map((item) => ({
                value: item.id,
                label: item.fullName
            }));
            setSelectReceiver(options);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu api:', error);
        }
    }

    useEffect(() => {
        if (id) {
            const ticketId = +id;
            fetchInfoticket(ticketId);
            fetchReceivers();
            loadUser();
        }
    }, [id]);

    useEffect(() => {
        if (infoticket) {
            reset({
                id: infoticket.id,
                receiver: infoticket.receiver,
                status: infoticket.status
            });
        }
    }, [infoticket, reset]);

    const onSubmit = async (data: FormTicket) => {
        try {
            const res = await UpdateTicket(data);
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Sửa ticket thành công',
                });
                navigate('/admin/ticket');

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Sửa ticket thất bại',
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra trong quá trình cập nhật',
            });
            console.error('Lỗi API:', error);
        }
    };

    return (
        <div className="container-fluid infoticket">
            <div className="row align-items-stretch">
                <div className="card w-100">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="header-name-all">Chi tiết ticket</div>
                        </div>
                        <div className='row'>
                            <div className='col-6 block-content'>
                                <div className='title d-flex justify-content-center mb-3'>
                                    <div className='title__content'>{infoticket?.title}</div>
                                </div>
                                <div className='mb-3 row'>
                                    <div className='type col-6'>
                                        <div className='type__label mb-2'>Người gửi:</div>
                                        <input
                                            value={infoticket?.userName}
                                            className='type__content form-control'
                                            disabled
                                        />
                                    </div>
                                    <div className='date col-6'>
                                        <div className='date__label mb-2'>Ngày tạo:</div>
                                        <input
                                            value={format(infoticket?.createDate ? new Date(infoticket.createDate) : new Date(), 'dd/MM/yyyy')}
                                            className='date__content form-control'
                                            disabled />
                                    </div>
                                </div>
                                <div className='content mb-3'>
                                    <div className='content__label mb-2'>Nội dung:</div>
                                    <textarea
                                        value={infoticket?.content}
                                        className='content__content form-control'
                                        disabled
                                    />
                                </div>
                                <div className='row mb-3'>
                                    {user && user.role === "Owner" ?
                                        <div className='receiver col-6'>
                                            <div className='receiver__label mb-2'>Người xử lý:</div>
                                            <input
                                                value={infoticket?.receiver}
                                                className='receiver__content form-control'
                                                disabled />
                                        </div>
                                        :
                                        <div className='receiver col-6'>
                                            <div className='receiver__label mb-2'>Người xử lý:</div>
                                            <Selectbox control={control} name='receiver' className='form-select' options={selectReceiver} />
                                        </div>
                                    }
                                    <div className='status col-6'>
                                        <div className='status__label mb-2'>Tiến trình:</div>
                                        <Selectbox control={control} name='status' className='form-select' options={selectStatus} isDisable={infoticket?.status === 3} />
                                    </div>
                                </div>
                                <div className='type mb-3'>
                                    <div className='type__label mb-2'>Loại ticket:</div>
                                    <input
                                        value={infoticket?.type === 1 ? "Lỗi hệ thống" : infoticket?.type === 2 ? "Yêu cầu" : infoticket?.type === 3 ? "Tố cáo" : infoticket?.type === 4 ? "Trợ giúp" : "Chưa có"}
                                        className='type__content form-control'
                                        disabled
                                    />
                                </div>
                                <div className='action d-flex justify-content-between'>

                                    <Link className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2" to={'/admin/ticket'} role="button">Trở về</Link>
                                    {infoticket?.status !== 3 && (
                                        <button className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2" onClick={handleSubmit(onSubmit)} role="button">Lưu</button>
                                    )}
                                </div>
                            </div>
                            <div className='col-6 block-image row align-items-center'>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div className="col-6" key={index}>
                                        <div className={`ratio ratio-4x3 fixed-size ${infoticket?.imgs && infoticket.imgs[index] ? '' : 'image-empty d-flex justify-content-center align-items-center'}`}>
                                            {infoticket?.imgs && infoticket.imgs[index] ? (
                                                <img
                                                    src={infoticket.imgs[index]}
                                                    alt={`Hình ${index + 1}`}
                                                    className="img-fluid"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : 'Chưa có hình ảnh'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Infoticket