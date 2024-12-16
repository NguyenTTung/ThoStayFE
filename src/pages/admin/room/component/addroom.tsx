import { AddRoomTypeApi } from "@/services/api/MotelApi";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@tinymce/tinymce-react";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { RootState, userAppDispatch } from '@/redux/store';
import { fetchPackage } from '@/components/header/redux/action';

const Addroom: React.FC<{
  motelId: string | undefined;
  onClose: () => void;
}> = ({ motelId, onClose }) => {
  const [values, setValues] = useState({
    name: "",
    quantityRoom: 1,
    price: "",
    area: "",
    description: "",
    images: [] as File[],
    motelId: motelId,
  });

  const [images, setImages] = useState<string[]>([]);
  const { myPackage } = useSelector((state: RootState) => state.user);
  const dispatch = userAppDispatch();
  useEffect(() => {
    dispatch(fetchPackage());
  }, [dispatch]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).forEach((file) => {
        //
        setValues({ ...values, images: [...values.images, file] });
        //
        const imageUrl = URL.createObjectURL(file);
        setImages((prevImages) => [...prevImages, imageUrl]);
        if (images.length >= 1) {
          setErrors((prev) => ({
            ...prev,
            images: "Vui lòng tải lên tối đa 1 hình ảnh",
          }));
        } else {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (images.length < 2) {
      setErrors((prev) => ({
        ...prev,
        images: "Vui lòng tải lên ít nhất 1 hình ảnh",
      }));
    }
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Thêm hàm validate
  const validateField = (name: string, value: string) => {
    if (!value || (value.trim() === "" && name !== "description")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Trường này không được để trống",
      }));
      return false;
    }

    if (name === "price") {
      if (isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [name]: "Vui lòng nhập giá phòng" }));
        return false;
      }
      if (Number(value) < 100000) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value;
    setValues({ ...values, [field]: value });
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
      const limitRoom = myPackage?.limitRoom ?? 8;
      const totalRoom = values.quantityRoom;
      if (totalRoom > limitRoom) {
        Swal.fire({
          icon: "error",
          title: "Không thể thêm!",
          text: `Số lượng phòng vượt quá giới hạn VIP. Giới hạn tối đa là ${limitRoom} phòng.`,
        });
        return;
      }

      setErrors({});
      let hasError = false;

      // Kiểm tra các trường cơ bản
      const fieldsToValidate = {
        name: values.name,
        price: values.price,
        area: values.area,
        quantityRoom: values.quantityRoom,
        images: values.images,
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
        name: values.name,
        description: values.description,
        quantityRoom: values.quantityRoom,
        price: values.price,
        area: values.area,
        motelId: values.motelId,
      };

      // Append các trường cơ bản
      Object.entries(basicFields).forEach(([key, value]) => {
        submitFormData.append(key, String(value || ""));
      });

      // Append hình ảnh với tên field là Images theo DTO
      values.images.forEach((file) => {
        submitFormData.append("Images", file);
      });

      // Log để kiểm tra
      for (let pair of submitFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await AddRoomTypeApi(submitFormData);
      if (response.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Thêm phòng trọ thành công",
        }).then(() => {
          // Lưu trạng thái thông báo vào localStorage
          localStorage.setItem("showNotification", "true");
          window.location.reload();
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Thêm phòng trọ thất bại",
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin">Thêm loại phòng</h2>
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
                  value={values.name}
                  onChange={(e) => handleChange(e, "name")}
                />
                {errors.name && <div className="err-text">{errors.name}</div>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Số lượng phòng
                </label>
                <input
                  type="number"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Số phòng"
                  min={1}
                  max={20}
                  value={values.quantityRoom}
                  onChange={(e) => handleChange(e, "quantityRoom")}
                />
                {errors.quantityRoom && (
                  <div className="err-text">{errors.quantityRoom}</div>
                )}
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
                  value={values.area}
                  onChange={(e) => handleChange(e, "area")}
                />
                {errors.area && <div className="err-text">{errors.area}</div>}
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Giá phòng
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Giá phòng"
                  onChange={(e) => handleChange(e, "price")}
                />
                {errors.price && <div className="err-text">{errors.price}</div>}
              </div>
              <div className="col-12 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Mô tả phòng
                </label>
                {/* <textarea
                  className="form-control mt-2 input-motel-info"
                  placeholder="Mô tả phòng trọ"
                  onChange={(e) => handleChange(e, "description")}
                /> */}
                <Editor
                  apiKey="5xbwcmrb59xx0v3s64b62ge0xvr0on8enfdafu51357g0d1a"
                  value={values.description}
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
                      <div className="err-text">{errors.images}</div>
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
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addroom;
