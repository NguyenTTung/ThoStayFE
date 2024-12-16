
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgotPassword, postForgotApi } from '@/services/api/authApi'
import * as yup from 'yup';
import "./styles/ForgotPW.scss";
import Swal from 'sweetalert2'
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có đúng 10 số')
    .required('Số điện thoại là bắt buộc'),
});

const ForgotPWForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPassword) => {
    try {
      const response = await postForgotApi(data);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Gửi OTP thành công',
          text: 'Vui lòng check email của bạn',
        });
        navigate('/forgot-password/verify');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể gửi OTP đến số điện thoại này',
        });
      }
    } catch (error) {
      console.error('send otp failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể gửi OTP đến số điện thoại này',
      });
    }
  };

  return (
    <div className="formverifyfw container-fluid">
      <div className="row align-items-center w-100 align-items-center h-forgotpw">
        <div className="col-lg-6 col-12 ">
          <div className='w-100  d-flex flex-column align-items-center'>
            <h2 className='h2-QMK'>Quên mật khẩu</h2>
            <form className="w-75 mt-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="form-label color-sdt">Số điện thoại: </label>
                <input
                  type="text"
                  id="phoneNumber"
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder='Vui lòng nhập số điện thoại'
                  className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''} rounded-pill heightinput-60 boder-color color-pla`}
                  {...register('phoneNumber')}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement; // Ép kiểu e.target thành HTMLInputElement
                    target.value = target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
                  }}
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                )}
              </div>

              <button type="submit" className="btn heightinput-60 btn-color w-100 mb-3 rounded-pill text-white mt-4 ">Tiếp tục</button>

              <div className="d-flex align-items-center w-100 mb-3">
                <hr className="flex-grow-1" />
                <span className="px-2 color-xam">Đăng nhập bằng</span>
                <hr className="flex-grow-1" />
              </div>

              <div className="text-center">
                {/* Hình QR code thay bằng hình mẫu bạn có */}
                <img
                  src="src/assets/images/imgforgotPW/Group1000002783.png"
                  alt="QR code"
                  className="img-fluid mb-2"
                  style={{ maxWidth: '150px' }}
                />
                <p className="mb-0 color-xam">Bạn chưa có tài khoản? <a href="/register" className="dangky-color">Đăng ký</a></p>
              </div>
            </form>
          </div>

        </div>

        <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
          {/* Thay thế src bằng link hình ảnh của bạn */}
          <img
            src="src/assets/images/imgforgotPW/Forgotpassword-rafiki.png"
            alt="Responsive"
            className="img-fluid image-verify"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPWForm;