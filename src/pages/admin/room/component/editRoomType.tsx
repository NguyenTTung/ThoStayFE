import { EditRoomTypeApi, GetRoomTypeByEditApi } from "@/services/api/MotelApi";
import { GetRoomTypeByEditDTO } from "@/services/Dto/MotelDto";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface EditRoomProps {
  onClose: () => void;
  roomTypeId: string;
}

const EditRoomType: React.FC<EditRoomProps> = ({ onClose, roomTypeId }) => {
  // Thêm state errors ở đầu component
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  // Thêm hàm validate
  const validateField = (name: string, value: string) => {
    if (
      name !== "description" &&
      name !== "newPrice" &&
      (!value || value.trim() === "")
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Trường này không được để trống",
      }));
      return false;
    }

    if (name === "newPrice" && value && value.trim() !== "") {
      if (Number(value) < 100000 || isNaN(Number(value))) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Giá trị phải lớn hơn hoặc bằng 100.000",
        }));
        return false;
      }
    }

    if (name === "area" || name === "quantityRoom") {
      if (isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [name]: "Vui lòng nhập số" }));
        return false;
      }
      if (Number(value) <= 0) {
        setErrors((prev) => ({ ...prev, [name]: "Giá trị phải lớn hơn 0" }));
        return false;
      }
    }

    if (name === "images") {
      if (images.length === 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Vui lòng tải lên ít nhất 1 hình ảnh",
        }));
        return false;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    return true;
  };

  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removeImages, setRemoveImages] = useState<number[]>([]);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, imageUrl]);
        setNewImages((prev) => [...prev, file]);
      });
    }
  };

  const removeImage = (index: number) => {
    // Tìm id của ảnh trong danh sách ảnh cũ bằng cách so sánh link
    const imageId = values?.images?.find(
      (image) => image.link === images[index]
    )?.id;

    if (imageId) {
      // Nếu là ảnh cũ (có imageId), thêm vào danh sách ảnh cần xóa
      setRemoveImages((prev) => [...prev, imageId]);
    } else {
      // Nếu là ảnh mới, xóa khỏi cả images và newImages
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const [values, setValues] = useState<GetRoomTypeByEditDTO>();

  useEffect(() => {
    const LoadData = async () => {
      const response = await GetRoomTypeByEditApi(roomTypeId);
      console.log(response);

      if (response?.data) {
        setValues(response.data);
        setImages(response.data.images.map((image) => image.link));
      }
    };
    LoadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value;
    if (values) {
      setValues({ ...values, [field]: value });
    }
    validateField(field, value);
  };

  const handleChangeDescription = (value: string, field: string) => {
    if (values) {
      setValues({ ...values, [field]: value });
    }
    validateField(field, value);
    console.log("Updated description:", value);
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      let hasError = false;

      // Kiểm tra các trường cơ bản
      const fieldsToValidate = {
        name: values?.name,
        description: values?.description,
        newPrice: values?.newPrice,
        area: values?.area,
      };

      // Kiểm tra từng trường
      Object.entries(fieldsToValidate).forEach(([key, value]) => {
        if (!validateField(key, String(value || ""))) {
          hasError = true;
        }
      });

      if (hasError) {
        return;
      }

      const submitFormData = new FormData();

      // Map đúng tên field với DTO
      const basicFields = {
        id: values?.id,
        name: values?.name,
        description: values?.description,
        newPrice: values?.newPrice,
        area: values?.area,
      };

      // Append các trường cơ bản
      Object.entries(basicFields).forEach(([key, value]) => {
        submitFormData.append(key, String(value || ""));
      });

      // Append hình ảnh với tên field là Images theo DTO
      newImages.forEach((file) => {
        submitFormData.append("newImages", file);
      });

      //truyền qua id của ảnh cũ
      removeImages.forEach((imageId) => {
        submitFormData.append("RemoveImageId", String(imageId));
      });

      // Log để kiểm tra
      for (let pair of submitFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await EditRoomTypeApi(submitFormData);
      if (response.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Sửa loại phòng thành công",
        }).then(() => {
          // Lưu trạng thái thông báo vào localStorage
          localStorage.setItem("showNotification", "true");
          navigate(0);

        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Sửa loại phòng thất bại",
      });
    }
  };

  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin">Sửa loại phòng</h2>
          </div>
          <form className="form-admin-modal position-relative">
            <div className="row flex-wrap">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Tên loại phòng
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Tên phòng"
                  value={values?.name}
                  onChange={(e) => handleChange(e, "name")}
                />
                <div className="err-text">{errors.name}</div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Diện tích phòng (m2)
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Diện tích"
                  value={values?.area}
                  onChange={(e) => handleChange(e, "area")}
                />
                {errors.area && <div className="err-text">{errors.area}</div>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Giá phòng
                </label>
                <span className="text-muted">*Không thế thay đổi</span>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Giá phòng"
                  value={values?.price}
                  disabled
                />
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Giá phòng mới
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Giá phòng"
                  value={values?.newPrice || ""}
                  onChange={(e) => handleChange(e, "newPrice")}
                />
                {errors.newPrice && (
                  <div className="err-text">{errors.newPrice}</div>
                )}
              </div>
              <div className="col-12 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Mô tả phòng
                </label>
                {/* <textarea
                  className="form-control mt-2 input-motel-info"
                  placeholder="Mô tả phòng trọ"
                  value={values?.description}
                  onChange={(e) => handleChange(e, "description")}
                /> */}
                <Editor
                  apiKey="5xbwcmrb59xx0v3s64b62ge0xvr0on8enfdafu51357g0d1a"
                  value={values?.description}
                  onEditorChange={(content) =>
                    handleChangeDescription(content, "description")
                  }
                  init={{
                    height: 300,
                    menubar: false,
                    placeholder: "Mô tả phòng trọ",
                    content_css: false,
                    body_class: "form-control mt-2 input-motel-info", // Thêm class vào nội dung editor
                  }}
                />
                <div className="err-text">{errors.description}</div>
              </div>
              <div className="row">
                <div className="col-12 form-group mt-3">
                  <label htmlFor="title" className="label-motel-info">
                    Hình ảnh
                  </label>
                  <div className="row flex-wrap g-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 col-xxl-3 px-1 position-relative"
                      >
                        <img
                          src={image}
                          className="rounded-img-info-model img-fluid"
                          alt="Không có ảnh"
                        />
                        <button
                          type="button"
                          className="btn-close-img-add-motel position-absolute text-end"
                          onClick={() => removeImage(index)}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    ))}
                    <div className="px-2 col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                      <div className="file-input-wrapper ">
                        <label
                          htmlFor="file-upload"
                          className="file-upload-label w-100"
                        >
                          <FontAwesomeIcon
                            icon={faCamera}
                            className="camera-icon"
                          />
                          <input
                            type="file"
                            id="file-upload"
                            multiple
                            className="file-upload-input"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                    {errors.images && (
                      <div className="invalid-feedback">{errors.images}</div>
                    )}
                  </div>
                </div>
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
                type="button"
                className="btn-luu-all btn-style btn-transform-y2"
                onClick={handleSubmit}
              >
                Sửa
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditRoomType;
