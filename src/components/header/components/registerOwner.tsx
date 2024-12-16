import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import RegisterOwner_1 from './registerOwner_1';
import RegisterOwner_2 from './registerOwner_2';
import { getAccountApi } from '@/services/api/authApi';
import { AddMotel } from '@/services/api/MotelApi';
import Swal from 'sweetalert2';

import { userAppDispatch } from '@/redux/store';
import { fetchMyMotel } from '@/components/header/redux/action';

interface Props {
    show: boolean;
    onHide: () => void;
}

export interface Motel {
    name: string;
    address: string;
    description: string;
    services?: Service[];
    ownerId?: number;
}

interface Service {
    name: string;
    price: number;
    description: string;
}

export interface RoomType {
    nameRoomType: string;
    descriptionRoomType: string;
    area: number;
    price: number;
    quantityRoom: number;
    images: File[];
}

export type Result = Partial<Motel> & Partial<RoomType>;

const RegisterOwner = ({ show, onHide }: Props) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<Result>();

    const dispatch = userAppDispatch();

    const nextStep = (formData: Result) => {
        setData((prev) => ({ ...prev, ...formData }));
        setStep((prev) => prev + 1);
    };

    useEffect(() => {
        if (step === 3) {
            const sendDataToApi = async () => {
                const res = await getAccountApi();
                try {
                    const user = res.data.data;
                    if (user) {
                        const submitFormData = new FormData();
                        const basicFields = {
                            name: data?.name,
                            address: data?.address,
                            description: data?.description,
                            nameRoomType: data?.nameRoomType,
                            descriptionRoomType: data?.descriptionRoomType,
                            area: data?.area,
                            price: data?.price,
                            quantityRoom: data?.quantityRoom,
                            ownerId: user.id,
                        };

                        Object.entries(basicFields).forEach(([key, value]) => {
                            submitFormData.append(key, String(value || ''));
                        });


                        data?.services && data.services.forEach((service, index) => {
                            submitFormData.append(`Services[${index}].name`, service.name);
                            submitFormData.append(`Services[${index}].description`, service.description);
                            submitFormData.append(`Services[${index}].price`, service.price.toString());
                        });

                        data?.images && data?.images.forEach((file) => {
                            submitFormData.append('images', file);
                        });

                        try {
                            onHide();
                            setStep(1);
                            const response = await AddMotel(submitFormData);
                            if (response.code === 200) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Thành công',
                                    text: 'Thành công',
                                });
                                dispatch(fetchMyMotel());
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi!',
                                    text: 'Thất bại',
                                });
                            }
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi!',
                                text: 'Tạo mới dãy trọ',
                            });
                        }
                    }
                } catch (error) {
                    onHide();
                    setStep(1);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không có token',
                    });
                }
            };

            sendDataToApi();
        }
    }, [step, data]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm nhà trọ ban đầu của bạn
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && <RegisterOwner_1 onNext={nextStep} />}
                {step === 2 && <RegisterOwner_2 onNext={nextStep} />}
            </Modal.Body>
        </Modal>
    )
}

export default RegisterOwner