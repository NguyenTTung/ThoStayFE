import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import clsx from 'clsx'
import { ErrorMessage } from "@hookform/error-message"

import InputField from '@/components/form_controls/input_field'
import Checkbox from '@/components/form_controls/checkbox'
import { Inputs } from '..'

import style from '../styles/register.module.scss'

interface RegisterProps {
    onSubmit: ((data: Inputs) => void)
}

const RegisterForm: React.FC<RegisterProps> = ({ onSubmit }) => {

    const schema = yup
        .object({
            name: yup
                .string()
                .required("Họ và tên không được để trống")
                .matches(/^\D*$/, "Họ và tên không chứa số")
                .matches(/^[\p{L}\d\s'’]*$/u, "Họ và tên không chứa ký tự đặc biệt")
                .matches(/^(?!.*\s{2,}).*$/, "Không chứa quá nhiều khoãng trắng"),
                email: yup
                .string()
                .email("Email không hợp lệ")
                .required("Email không được để trống")
                .test(
                    "contains-dot-in-domain",
                    "Email phải chứa dấu chấm trong phần tên miền",
                    (value) => {
                        if (!value) return false;
                        const domain = value.split("@")[1];
                        return domain?.includes(".");
                    }
                ),
            phone: yup
                .string()
                .matches(/^0\d{9}$/, "Số điện thoại không đúng định dạng")
                .required("Số điện thoại không được để trống"),
            password: yup
                .string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                .matches(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất 1 ký tự chữ")
                .required("Mật khẩu không được để trống")
                .matches(/^\S*$/, "Mật khẩu không được chứa khoảng trắng"),
            checkbox: yup
                .boolean()
                .oneOf([true], "Bạn phải đồng ý với Điều khoản & Dịch vụ")
        })
        .required();

    const { control, handleSubmit, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            phone: '',
            password: '',
            name: '',
            email: '',
            checkbox: false
        },
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });
    return (
        <form className='container' onSubmit={handleSubmit(onSubmit)}>
            <div className={clsx(style.text, "form-group")} style={{ minHeight: '80px' }}>
                <InputField
                    control={control}
                    label="Họ và Tên"
                    name="name"
                    type="text"
                    errors={errors}
                    classname={clsx(style.box, `form-control ${errors['name']?.message ? "is-invalid" : ""}`)}
                    placeholder='Vui lòng nhập họ và Tên'
                />
            </div>

            <div className={clsx(style.text, "form-group")} style={{ minHeight: '80px' }}>
                <InputField
                    control={control}
                    label="Số điện thoại"
                    name="phone"
                    type="text"
                    errors={errors}
                    classname={clsx(style.box, `form-control ${errors['phone']?.message ? "is-invalid" : ""}`)}
                    placeholder='Vui lòng nhập số điện thoại'
                />
            </div>

            <div className={clsx(style.text, "form-group")} style={{ minHeight: '80px' }}>
                <InputField
                    control={control}
                    label="Email"
                    name="email"
                    type="email"
                    errors={errors}
                    classname={clsx(style.box, `form-control ${errors['email']?.message ? "is-invalid" : ""}`)}
                    placeholder='Vui lòng nhập email'
                />
            </div>

            <div className={clsx(style.text, "form-group")} style={{ minHeight: '80px' }}>
                <InputField
                    control={control}
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    errors={errors}
                    classname={clsx(style.box, `form-control ${errors['password']?.message ? "is-invalid" : ""}`)}
                    placeholder='Vui lòng nhập mật khẩu'
                />
            </div>

            <div className={clsx(style.text)}>
                <div className={clsx(style.checkboxContainer, `${errors['checkbox']?.message ? "is-invalid" : ""}`)}>
                    <Checkbox
                        control={control}
                        name="checkbox"
                        type="checkbox"
                        classname={clsx(style.checkbox)}
                    />
                    <label className='form-check-label'>
                        Đồng ý với <a href="#">Điều khoản & Dịch vụ</a>
                    </label>
                </div>
                <ErrorMessage
                    errors={errors}
                    name='checkbox'
                    render={({ message }) =>
                        <div className='invalid-feedback'>{message}</div>
                    }
                />
            </div>

            <div className={clsx(style.text)}>
                <button type="submit" className={clsx(style.buttonSubmit)}>
                    Đăng ký
                </button>
            </div>
        </form>
    )
}

export default RegisterForm