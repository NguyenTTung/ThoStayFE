import React from "react";
import "src/pages/admin/notification/notification.scss";
import Swal from "sweetalert2";
import { postAddNotiApi, AddNoti } from "@/services/api/authApi";
import * as yup from "yup";
import InputField from "@/components/form_controls/input_field";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

const CreateNotification: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const schema = yup
    .object({
      title: yup
        .string()
        .required("Tiêu đề không được bỏ trống")
        .min(20, "Tiêu đề phải có ít nhất 10 kí tự")
        .max(40, "Tiêu đề quá dài!!"),
      content: yup
        .string()
        .required("Mô tả không được bỏ trống")
        .min(10, "Mô tả phải có ít nhất 20 kí tự")
        .max(500, "Mô tả quá dài!!"),
      type: yup
        .number()
        .typeError("Loại phải là số")
        .required("Loại không được bỏ trống"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      type: 1,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AddNoti) => {
    const response = await postAddNotiApi(data);
    try {
      if (response.data.code == 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm mới thông báo thành công",
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Thêm mới thông báo thất bại",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Thêm mới thất bại",
      });
      console.log(`ERR thêm mới: ${error}`);
    }
  };

  return (
    <div className="modal-overlay-admin">
      <div className="modal-content-admin position-relative">
        <div className="">
          <h2 className="h2-modal-admin">Thêm thông báo</h2>
          {/* <button className="btn-close-modal position-absolute" onClick={onClose}>×</button> */}
        </div>
        <form className="form-admin-modal" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mt-3">
            <InputField
              control={control}
              label="tiêu đề"
              type="text"
              name="title"
              errors={errors}
              classname={`input form-control mt-2 ${errors["title"]?.message ? "is-invalid" : ""
                }`}
              placeholder="Cấp phép nhà trọ"
            />
          </div>
          <div className="form-group mt-3">
            <InputField
              control={control}
              label="Mô tả"
              type="textarea"
              name="content"
              errors={errors}
              classname={`input form-control mt-2 ${errors["content"]?.message ? "is-invalid" : ""
                }`}
              placeholder="Nhà trọ của bạn đã được duyệt, xem thêm thông tin chi tiết."
              rows={3}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="type">Loại</label>
            <Controller
              control={control}
              name="type"
              render={({ field }: { field: any }) => (
                <select
                  {...field}
                  className={`input form-control mt-2 ${errors["type"]?.message ? "is-invalid" : ""
                    }`}
                >
                  <option value={1} selected>
                    Thông thường
                  </option>
                  <option value={2}>Cảnh báo</option>
                  <option value={3}>Khẩn cấp</option>
                  <option value={4}>Hệ thống</option>
                </select>
              )}
            />
            {errors["type"] && (
              <div className="invalid-feedback">{errors["type"]?.message}</div>
            )}
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
  );
};

export default CreateNotification;
