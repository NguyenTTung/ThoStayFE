import clsx from "clsx";
import { postRegisterUserApi, RegisterAccountOwner } from "@/services/api/authApi"
import style from './styles/register.module.scss';
import image from './image/SignUp.png';
import image1 from './image/SignUp(1).png';
import RegisterForm from "./components/registerForm";
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
export interface Inputs extends RegisterAccountOwner {
    name: string;
    password: string;
    phone: string;
    email: string;
    checkbox?: boolean;
}

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: Inputs) => {
        const { checkbox, ...registerData } = data;
        console.log(registerData);
        try {
            const res = await postRegisterUserApi(registerData);
            if (res.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đăng kí thành công',
                });
                navigate('/Login');
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đăng kí thất bại',
                });
            }
        } catch (error: unknown) { // Kiểu hóa lỗi để đảm bảo an toàn
            let errorMessage = 'Có lỗi xảy ra!';

            // Xử lý lỗi API từ Axios
            if (error instanceof Error && (error as any).response?.data?.message) {
                errorMessage = (error as any).response.data.message;
            }
        
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: `Đăng kí thất bại: ${errorMessage}`,
            });
        
            console.error(`ERR đăng ký: ${JSON.stringify(error)}`);
        }
    }

    return (
        <>
            <div className={clsx(style.container, "container-fluid d-flex align-items-center justify-content-center")}>
                <div className={clsx("row")}>
                    <div className={clsx("col-12 col-md-7 order-1 order-md-2 mt-5")}>
                        <div className={clsx(style.imageContainerBig)}>
                            <div className={clsx(style.imageContainer)}>
                                <img src={image1} alt="SignUp Image" className={clsx(style.smallImage)} />
                            </div>
                            <div className={clsx(style.imageContainer)}>
                                <img src={image} alt="SignUp Image" className={clsx(style.largeImage)} />
                            </div>
                        </div>
                    </div>

                    <div className={clsx("col-12 col-md-5 order-2 order-md-1 pt-5")}>
                        <div className={clsx(style.formSignUp)}>
                            <div className={clsx("card-body")}>
                                <h2 className={clsx("card-title", style.cardTitle)}>Đăng ký</h2>
                                <p>Đăng ký và khám phá cùng chúng tôi</p>
                            </div>
                            <RegisterForm onSubmit={handleSubmit} />
                            <div className={clsx(style.text)}>
                                <p>
                                    <label>
                                        Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                                    </label>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
