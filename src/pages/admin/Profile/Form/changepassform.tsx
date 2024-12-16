import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay } from 'swiper/modules';
import InputField from "@/components/form_controls/input_field"
import React, { useState } from 'react'
import { PasswordUser } from '@/services/api/HomeApi'

interface Props {
    onSubmit: ((data: PasswordUser) => void)
}

const Changepassform: React.FC<Props> = ({ onSubmit }) => {
    const schema = yup
        .object({
            currentPassword: yup
                .string()
                .required("Mật khẩu cũ không được để trống"),
            newPassword: yup
                .string()
                .required("Mật khẩu mới không được để trống"),
            confirmNewPassword: yup
                .string()
                .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp với mật khẩu mới")
                .required("Xác nhận mật khẩu không được để trống")
        })
        .required();
    const { control, handleSubmit, formState: { errors } } = useForm<PasswordUser>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false);

    // Toggle visibility functions
    const toggleCurrentPasswordVisibility = () => {
        setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
    };

    const toggleNewPasswordVisibility = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible);
    };

    return (
        <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Form */}
            <div className="form-container col-4" style={{ width: '50%' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3 position-relative" style={{ width: '80%' }}>
                        <InputField
                            control={control}
                            label="Mật khẩu cũ"
                            name="currentPassword"
                            type={isCurrentPasswordVisible ? "text" : "password"}
                            errors={errors}
                            classname={`form-control ${errors['currentPassword']?.message ? "is-invalid" : ""}`}
                        />
                        <i
                            className={`fa-sharp fa-solid ${isCurrentPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-3 fs-4 cursor-pointer`}
                            onClick={toggleCurrentPasswordVisibility}
                        ></i>
                    </div>
                    <div className="form-group mb-3 position-relative" style={{ width: '80%' }}>
                        <InputField
                            control={control}
                            label="Mật khẩu mới"
                            name="newPassword"
                            type={isNewPasswordVisible ? "text" : "password"}
                            errors={errors}
                            classname={`form-control ${errors['newPassword']?.message ? "is-invalid" : ""}`}
                        />
                        <i
                            className={`fa-sharp fa-solid ${isNewPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-3 fs-4 cursor-pointer`}
                            onClick={toggleNewPasswordVisibility}
                        ></i>
                    </div>
                    <div className="form-group mb-4 position-relative" style={{ width: '80%' }}>
                        <InputField
                            control={control}
                            label="Xác nhận mật khẩu"
                            name="confirmNewPassword"
                            type={isConfirmNewPasswordVisible ? "text" : "password"}
                            errors={errors}
                            classname={`form-control ${errors['confirmNewPassword']?.message ? "is-invalid" : ""}`}
                        />
                        <i
                            className={`fa-sharp fa-solid ${isConfirmNewPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-3 fs-4 cursor-pointer`}
                            onClick={toggleConfirmNewPasswordVisibility}
                        ></i>
                    </div>
                    <button type="submit" className="btn btn-create-notification btn-transform-y2">Đổi mật khẩu</button>
                </form>
            </div>

            {/* Hình ảnh */}
            <div className="background-img col-8">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    speed={2000}
                    modules={[Autoplay]}
                >
                    <SwiperSlide>
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2F2cee2cc5-d019-46b1-be0b-e0fb6cccff43.png?alt=media"
                            alt="Slide 1"
                            style={{ width: '75%', borderRadius: '10px' }}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2F34763c93-fd68-4b2f-a6f8-b1397026030b.png?alt=media"
                            alt="Slide 2"
                            style={{ width: '75%', borderRadius: '10px' }}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2F6ec19993-d0c1-4b90-b686-45a9fa281973.png?alt=media"
                            alt="Slide 3"
                            style={{ width: '75%', borderRadius: '10px' }}
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>

    )
}

export default Changepassform