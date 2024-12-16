import React, { useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { getUserById } from "@/services/api/userApi";
import { updateUser } from "@/services/api/userApi";
import { getRole } from "@/services/api/userApi";
import Swal from 'sweetalert2';
interface EditAccountProps {
  userId: number;
  onClose: () => void;
  onSubmit: () => void;
}

interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  avatar: string ;
  timeCreated: string;
  status: boolean;
  role: string;
}


const EditAccount: React.FC<EditAccountProps> = ({ userId, onClose, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phone: "",
    email: "",
    role: "", // Set default role as "Nhân viên"
    avatar: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State lưu lỗi từng ô input
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "fullName") {
      if (!value.trim()) {
        errorMessage = "Họ và tên không được để trống hoặc chỉ chứa khoảng trắng.";
      } else if (!/^[a-zA-ZÀ-ỹ\s']+$/.test(value.trim())) {
        errorMessage = "Họ và tên chỉ chứa ký tự chữ, không bao gồm số hoặc ký tự đặc biệt.";
      }
    } else if (name === "phone" && (!value || !/^0\d{9}$/.test(value))) {
      errorMessage = "Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số.";
    } else if (name === "email" && (!value || !/\S+@\S+\.\S+/.test(value) || (value.match(/@/g) || []).length !== 1)) {
      errorMessage = "Vui lòng nhập email hợp lệ, chỉ chứa 1 dấu '@'.";
    }

    return errorMessage;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: base64String }));
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  //get data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(userId);
        //fecth role data
        const role = await getRole();
        //set role data

        const roleOptions = role.data.data.map((item: any) => ({
          value: item.name,
          label: item.name,
        }));
        if (roleOptions.some((role: { value: string; label: string }) => role.value === "Admin")) {
          roleOptions.splice(
            roleOptions.findIndex((role: { value: string; label: string }) => role.value === "Admin"),
            1
          );
        }
        setOptions(roleOptions);
        if (res.data.code === 200) {
          setUserData(res.data.data);
          for (let key in res.data.data) {
            console.log(key);
            setFormData((prev) => ({
              ...prev,
              [key]: res.data.data[key],
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: { [key: string]: string } = {};
    let hasError = false;
  
    // Kiểm tra xem các trường dữ liệu có bị xóa hoặc để trống không
    if (!formData.fullName.trim()) {
      formErrors.fullName = "Họ và tên không được để trống.";
      hasError = true;
    }
  
    if (!formData.phone.trim()) {
      formErrors.phone = "Số điện thoại không được để trống.";
      hasError = true;
    }
  
    if (!formData.email.trim()) {
      formErrors.email = "Email không được để trống.";
      hasError = true;
    }
  
    // Kiểm tra ảnh đại diện
    if (selectedImage === null && !userData?.avatar) {
      formErrors.avatar = "Ảnh đại diện không được để trống.";
      hasError = true;
    }
  
    setErrors(formErrors);
  
    if (!hasError) {
      const data: any = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        avatar: selectedImage || userData?.avatar || '', // Nếu không có ảnh mới, dùng ảnh cũ hoặc để trống
        role: formData.role,
      };
  
      try {
        const response = await updateUser(userId, data);
  
        if (response.data.code === 200) {
          onClose();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Sửa tài khoản thành công",
          });
        } else {
          let errorMessage = "Đã xảy ra lỗi không xác định.";
          if (response.data.errors) {
            const errors = Object.values(response.data.errors)
              .flat()
              .join(", ");
            errorMessage = errors || errorMessage;
          }
  
          Swal.fire({
            icon: "error",
            title: "Thất bại!",
            text: errorMessage,
          });
        }
        onSubmit();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Sửa tài khoản thất bại",
        });
        console.log(error);
      }
    }
  };

  const handleRoleChange = (selectedOption: { value: string; label: string }) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedOption.value,
    }));
  };



  //fecth data Role



  const handleTextChange = (key: any, value: any) => {
    const trimmedValue = value.trim().replace(/\s+/g, " "); // Loại bỏ khoảng trắng dư thừa
    const errorMessage = validateField(key, trimmedValue);
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [key]: errorMessage }));
    } else {
      setErrors((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
    setFormData((prev) => ({ ...prev, [key]: trimmedValue }));
  };

  const customStyles: StylesConfig<{ value: string; label: string }> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #e7ecf0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#e7ecf0',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#298B90' : undefined,
      color: state.isFocused ? 'white' : 'black',
    }),
  };
  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin pt-3 pb-5">Sửa tài khoản</h2>
            {/* <button
              className="btn-close-modal position-absolute"
              onClick={onClose}
            >
              ×
            </button> */}
          </div>
          <form className="form-admin-modal position-relative" onSubmit={handleSubmit}>
            <div className="icon-Camera-AddAccount rounded-circle position-absolute">
              {selectedImage || userData?.avatar ?   (
                <img
                  src={selectedImage|| userData?.avatar} 
                  alt="Selected"
                  className="icon-table-motel"
                  style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                />
              ) : (
                <FontAwesomeIcon icon={faCamera} color="#fffffff" size="3x" className="icon-table-motel" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }} // Ẩn input file
                id="file-input"
              />
              <label htmlFor="file-input" style={{ cursor: 'pointer', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </div>
            <div className="row form-group mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="description" className="">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Họ và tên"
                  defaultValue={userData?.fullName}
                  onChange={(e) => handleTextChange("fullName", e.target.value)}
                />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="description" className="">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Số điện thoại"
                  defaultValue={userData?.phone}
                  onChange={(e) => handleTextChange("phone", e.target.value)}
                />
                {errors.phone && <small className="text-danger">{errors.phone}</small>}
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="description" className="">
                  Email
                </label>
                <input
                  type="email"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Email"
                  defaultValue={userData?.email}
                  onChange={(e) => handleTextChange("email", e.target.value)}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              {/* <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="description" className="">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Mật khẩu"

                />
              </div> */}
            </div>
            <div className="row form-group mt-3">
              {/* <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="description" className="">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Địa chỉ"
                  onChange={(e) => handleTextChange("address", e.target.value)}
                />
              </div> */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="description" className="">
                  Quyền
                </label>
                <Select
                  id="role"
                  className="mt-2"
                  options={options}
                  styles={customStyles}
                  value={options.find((option) => option.value === formData.role)}
                  placeholder="Chọn vai trò"
                  onChange={(e) => handleRoleChange(e as { value: string; label: string })}


                />

              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn-trove-all btn-style btn-transform-y2"
                onClick={onClose}
              >
                Trở về
              </button>
              <button
                type="submit"
                className="btn-luu-all btn-style btn-transform-y2"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditAccount;
