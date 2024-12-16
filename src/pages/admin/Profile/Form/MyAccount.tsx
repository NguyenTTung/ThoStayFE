import InputField from "@/components/form_controls/input_field"
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { UserDetail } from '@/services/api/HomeApi';
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import React from 'react'

interface Props {
    onSubmit: ((data: UserDetail) => void)
}
const MyAccount: React.FC<Props> = ({ onSubmit }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const schema = yup
        .object({
            fullName: yup
                .string()
                .required("Họ và tên không được để trống")
                .matches(/^\D*$/, "Họ và tên không chứa số")
                .matches(/^[\p{L}\d\s]*$/u, "Họ và tên không chứa ký tự đặc biệt"),
            email: yup
                .string()
                .email("Email không hợp lệ")
                .required("Email không được để trống"),
            phone: yup
                .string()
                .matches(/^0\d{9}$/, "Số điện thoại không đúng định dạng")
                .required("Số điện thoại không được để trống"),
        })
        .required();
    const { control, handleSubmit, formState: { errors } } = useForm<UserDetail>({
        defaultValues: {
            phone: user?.phone || '',
            fullName: user?.fullName || '',
            email: user?.email || ''
        },
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });



    return (
        <form className='container' onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group" style={{ minHeight: '80px', width: '80%' }}>
                <InputField
                    control={control}
                    label="Họ và tên"
                    name="fullName"
                    type="text"
                    errors={errors}
                    classname={`form-control ${errors['fullName']?.message ? "is-invalid" : ""}`}
                />
            </div>
            <div className="form-group" style={{ minHeight: '80px', width: '80%' }}>
                <InputField
                    control={control}
                    label="Số điện thoại"
                    name="phone"
                    type="text"
                    errors={errors}
                    classname={`form-control ${errors['phone']?.message ? "is-invalid" : ""}`}
                />
            </div>
            <div className="form-group" style={{ minHeight: '80px', width: '80%' }}>
                <InputField
                    control={control}
                    label="Email"
                    name="email"
                    type="text"
                    errors={errors}
                    classname={`form-control ${errors['email']?.message ? "is-invalid" : ""}`}
                />
            </div>


            <button type="submit" className="btn btn-create-notification btn-transform-y2">Cập nhật</button>
        </form>
    )

}

export default MyAccount