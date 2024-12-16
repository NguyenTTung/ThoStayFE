import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { addUser } from "@/services/api/userApi";
import { getRole } from "@/services/api/userApi";
import Swal from 'sweetalert2';
interface AddAccountProps {
  onClose: () => void;
  onSubmit: () => void;
}

const AddAccount: React.FC<AddAccountProps> = ({ onClose, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State lưu lỗi từng ô input
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    role: { label: "", value: "" }, // Set default role as "Nhân viên"
    avatar: "",
  });
  const validateField = (name: string, value: string) => {
     let errorMessage = "";

    // Kiểm tra tên đầy đủ chỉ chứa ký tự chữ (bao gồm tiếng Việt và khoảng trắng)
    if (name === "fullName") {
      const trimmedValue = value.trim().replace(/\s+/g, " "); // Loại bỏ khoảng trắng dư thừa
      if (!trimmedValue) {
        errorMessage = "Họ và tên không được để trống hoặc chỉ chứa khoảng trắng.";
      } else if (!/^[a-zA-ZÀ-ỹ\s']+$/.test(trimmedValue)) {
        errorMessage = "Họ và tên chỉ chứa ký tự chữ, không bao gồm số hoặc ký tự đặc biệt.";
      } else if (trimmedValue.length !== value.trim().length) {
        errorMessage = "Họ và tên không được chứa khoảng trắng thừa.";
      }
    }
    // Kiểm tra số điện thoại
    else if (name === "phoneNumber" && (!value || !value || !/^0\d{9}$/.test(value))) {
        errorMessage = "Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số.";
    } 
    // Kiểm tra email hợp lệ
    else if (name === "email" && (!value || !/\S+@\S+\.\S+/.test(value))) {
        errorMessage = "Vui lòng nhập email hợp lệ.";
    } 
    // Kiểm tra mật khẩu (ít nhất một chữ cái và một số)
    else if (name === "password" && (!value || !/(?=.*[a-z])(?=.*\d)/.test(value))) {
        errorMessage = "Mật khẩu phải chứa ít nhất một chữ cái thường và một số.";
    }
    return errorMessage;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //create base64 string from image
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, avatar: base64String });
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);

    }

  };

  // Fetch the role data
  React.useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await getRole();
        if (response.data.code === 200) {
          const roleOptions = response.data.data.map((item: any) => ({
            value: item.name,
            label: item.name,
          }));
          //nếu vai trò có admin thì loại bỏ giá trị
          if (roleOptions.some((role: { value: string; label: string }) => role.value === "Admin")) {
            roleOptions.splice(
              roleOptions.findIndex((role: { value: string; label: string }) => role.value === "Admin"),
              1
            );
          }
          console.log("Role: ",roleOptions);
          setOptions(roleOptions);
          setFormData((prev) => ({ ...prev, role: roleOptions[2] || roleOptions[0] })); // Đặt vai trò mặc định
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchRole();
  }, []);

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (selectedOption: { value: string; label: string }) => {
    setFormData({ ...formData, role: selectedOption });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: { [key: string]: string } = {};
    let hasError = false;

    // Validate all fields
    for (const [name, value] of Object.entries(formData)) {
      const errorMessage = validateField(name, value as string);
      if (errorMessage) {
        formErrors[name] = errorMessage;
        hasError = true;
      }
    }

    setErrors(formErrors);
    // Prepare the data for the API call
    if (!hasError) {
      const data: any = {
        fullName: formData.fullName,
        phone: formData.phoneNumber, // Match the property name
        email: formData.email,
        password: formData.password, // This is probably not in the User interface; consider where you use it.
        avatar: selectedImage || '', // Use empty string if no image is selected
        role: typeof formData.role === "string" ? formData.role : formData.role.value,
      };

      try {
        // Make the API call
        const response = await addUser(data);

        if (response.data.code === 200) {
          // Close modal or dialog
          onClose();
  
          // Show success notification
          Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Thêm tài khoản thành công",
          }).then(() => {
              // Save notification state to localStorage
              localStorage.setItem("showNotification", "true");
          });
  
          // Call submit callback function
          onSubmit();
      } else if (response.data.code === 404) {
          // Show error notification for a 404 error
          Swal.fire({
              icon: "error",
              title: "Thất bại!",
              text: response.data.message,
          });
  
          console.error(response.data.message);
      } else {
          // Handle validation or other error scenarios
          let errorMessage = "Đã xảy ra lỗi không xác định."; // Default error message
  
          // Check if there are validation errors
          if (response.data.errors) {
              // Extract error messages from the response
              const errors = Object.values(response.data.errors)
                  .flat() // Flatten nested arrays
                  .join(", "); // Combine into a single string
              errorMessage = errors || errorMessage; // Use extracted errors if available
          }
  
          // Display the error message in Swal.fire
          Swal.fire({
              icon: "error",
              title: "Thất bại!",
              text: errorMessage,
          });
  
          console.error(response.data.errors);
      }
       
        // Optionally, handle success (like resetting the form, showing a success message, etc.)

      } catch (error) {
        console.error('Error adding user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Thêm tài khoản thất bại' + error,
          timer: 1500
        });
        
      }
    };
  };

  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin pt-3 pb-5">Thêm tài khoản</h2>
          </div>
          <form className="form-admin-modal position-relative" onSubmit={handleSubmit} >
            <div className="icon-Camera-AddAccount rounded-circle position-absolute">
              {selectedImage ? (
                <img
                  src={selectedImage}
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
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" style={{ cursor: 'pointer', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </div>
            <div className="row form-group mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control mt-2"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control mt-2"
                  placeholder="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control mt-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                 {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form-control mt-2"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
                 {errors.password && <div className="text-danger">{errors.password}</div>}

              </div>
            </div>
            <div className="row form-group mt-3">
              {/* <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  className="form-control mt-2"
                  placeholder="Địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div> */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5">
                <label htmlFor="role">Quyền</label>
                <Select
                  id="role"
                  className="mt-2"
                  options={options}
                  styles={customStyles}
                  value={formData.role}
                  onChange={(e: any) => handleRoleChange(e)}
                  placeholder="Chọn vai trò"
                />
                {errors.role && <div className="text-danger">{errors.role}</div>}
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
                type="submit" // Change to submit type
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

export default AddAccount;
