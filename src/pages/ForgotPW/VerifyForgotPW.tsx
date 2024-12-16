import React, { useEffect, useRef, useState } from 'react';
import "./styles/ForgotPW.scss";
import { Otp, getOtpApi } from '@/services/api/authApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const VerifyForgotPWForm = () => {
  const navigate = useNavigate();
  const { handleSubmit } = useForm<Otp>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '']); // Trạng thái để lưu giá trị 4 ô input
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(() => {
    const savedTime = localStorage.getItem('countdown');
    return savedTime ? parseInt(savedTime, 10) : 180; // Nếu có thời gian đã lưu, sử dụng nó; nếu không, mặc định là 180 giây
  });
// khi chạy sẽ tự động cvaof input đầu tiên
useEffect(() => {
  inputRefs.current[0]?.focus(); 
}, []); 

// đếm thời gian
useEffect(() => {
  const timer = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 0) {
        clearInterval(timer);
        localStorage.removeItem('countdown'); // Xóa thời gian khi đếm xong
        setError("Đã hết thời gian, vui lòng gửi lại."); // hiện thông báo khi hết thời gian
        return 0; // Ngăn không cho giá trị âm
      }
      const newTime = prev - 1;
      localStorage.setItem('countdown', newTime.toString()); // Lưu thời gian còn lại vào localStorage
      return newTime;
    });
  }, 1000);

  return () => {
    clearInterval(timer); // Dọn dẹp timer
    localStorage.setItem('countdown', countdown.toString()); // Lưu thời gian khi component bị hủy
  };
}, [countdown]); // useEffect này chỉ phụ thuộc vào countdown

  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Loại bỏ khoảng trắng
    if (!/^\d$/.test(value) && value !== '') return; // Chỉ chấp nhận số hoặc để trống
  
    setOtpValues((prev) => {
      const newOtpValues = [...prev];
      newOtpValues[index] = value; // Cập nhật giá trị
      return newOtpValues;
    });
  
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus(); // Tự động chuyển tới ô tiếp theo nếu có
    }
  };
  const onSubmit = async () => {
    const demtime = localStorage.getItem('countdown');
    if(demtime === null) {
      setError('Đã hết thời gian, vui lòng gửi lại.');
      return; //đừng nếu time = 0
    }
    console.log(otpValues.join(','));
    if (otpValues.some(val => val === '')) {
      setError('OPT phải có 4 số');
      return; // Dừng nếu OTP không đúng độ dài
    }

    setError('');
    const otpString = otpValues.join('');
    console.log(otpString)
    const data: Otp = { otp: otpString }; // Cấu trúc dữ liệu tùy thuộc vào API của bạn
    console.log(data)
    const response = await getOtpApi(data)
    console.log(response);
    console.log(data);
    try {
      if (response.data === true) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Nhập OTP thành công',
        });
        navigate('/forgot-password/set-password');

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'OTP chưa đúng',
        });
      }
    } catch (error) {
      console.error('send otp failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể nhập OTP',
      });
    }


  };

  return (
    <div className="formverifyfw container-fluid">
              <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row align-items-center w-100 align-items-center h-forgotpw">
          <div className="col-lg-6 col-12 d-flex flex-column align-items-center px-0">
            <div className='w-75 d-flex flex-column align-items-center'>
              <h2 className='h2-QMK'>Xác minh</h2>
              <p className='color-xam'>Vui lòng nhập mã được gửi đến số điện thoại của bạn</p>

              <div className="d-flex justify-content-between mb-3 mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    type="text"
                    name='otp'
                    maxLength={1}
                    pattern="\d*" // Chỉ cho phép số
                    className="form-control text-center mx-1 rounded-circle input-xacminh"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleInputChange(index, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        setOtpValues((prev) => {
                          const newOtpValues = [...prev];
                          newOtpValues[index] = ''; // Xóa giá trị ô hiện tại
                          return newOtpValues;
                        });
                    
                        if (index > 0 && e.currentTarget.value === '') {
                          inputRefs.current[index - 1]?.focus(); // Di chuyển về ô trước
                        }
                      }
                    }}
                  />
                ))}
              </div>

              <div className="mb-3">
                <p className="time-text">{minutes}:{seconds}</p>
              </div>
              {error && <div className="text-danger mt-1 mb-2">{error}</div>}
              <p className='color-xam'>Bạn chưa nhận được mã? <a href="#" className='dangky-color'>Gửi lại</a></p>
              <button type="submit" className="btn btn-color w-100 rounded-pill text-white heightinput-60 mt-4">Tiếp tục</button>
            </div>
          </div>

        <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center px-0">
          <img
            src="../src/assets/images/imgforgotPW/forgotpw_2_1.png"
            alt="Responsive"
            className="img-fluid image-verify"
          />
        </div>
      </div>
      </form>
    </div>
  );
};

export default VerifyForgotPWForm;
