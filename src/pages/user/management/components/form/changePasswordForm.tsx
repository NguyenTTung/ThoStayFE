import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputField from "@/components/form_controls/input_field";
import React, { useState } from "react";
import { PasswordUser } from "@/services/api/HomeApi";

interface Props {
  onSubmit: (data: PasswordUser) => void;
}

const ChangePasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const schema = yup
    .object({
      currentPassword: yup.string().required("Mật khẩu cũ không được để trống"),
      newPassword: yup.string().required("Mật khẩu mới không được để trống"),
      confirmNewPassword: yup
        .string()
        .oneOf(
          [yup.ref("newPassword")],
          "Xác nhận mật khẩu không khớp với mật khẩu mới"
        )
        .required("Xác nhận mật khẩu không được để trống"),
    })
    .required();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUser>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
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
    <form className="container" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group position-relative" style={{ minHeight: "80px" }}>
        <InputField
          control={control}
          label="Mật khẩu cũ"
          name="currentPassword"
          type={isCurrentPasswordVisible ? "text" : "password"}
          errors={errors}
          classname={`form-control ${errors["currentPassword"]?.message ? "is-invalid" : ""
            }`}
        />
        <i
          className={`fa-sharp fa-solid ${isCurrentPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-1 fs-4 cursor-pointer`}
          onClick={toggleCurrentPasswordVisibility}
        ></i>
      </div>
      <div className="form-group position-relative" style={{ minHeight: "80px" }}>
        <InputField
          control={control}
          label="Mật khẩu mới"
          name="newPassword"
          type={isNewPasswordVisible ? "text" : "password"}
          errors={errors}
          classname={`form-control ${errors["newPassword"]?.message ? "is-invalid" : ""
            }`}
        />
        <i
          className={`fa-sharp fa-solid ${isNewPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-1 fs-4 cursor-pointer`}
          onClick={toggleNewPasswordVisibility}
        ></i>
      </div>
      <div className="form-group position-relative" style={{ minHeight: "80px" }}>
        <InputField
          control={control}
          label="Xác nhận mật khẩu"
          name="confirmNewPassword"
          type={isConfirmNewPasswordVisible ? "text" : "password"}
          errors={errors}
          classname={`form-control ${errors["confirmNewPassword"]?.message ? "is-invalid" : ""
            }`}
        />
        <i
          className={`fa-sharp fa-solid ${isConfirmNewPasswordVisible ? "fa-eye-slash" : "fa-eye"} 
                        position-absolute top-50 end-0 translate-middle-y px-4 mt-1 fs-4 cursor-pointer`}
          onClick={toggleConfirmNewPasswordVisibility}
        ></i>
      </div>
      <button
        type="submit"
        className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2"
      >
        Đổi mật khẩu
      </button>
    </form>
  );
};
export default ChangePasswordForm;
