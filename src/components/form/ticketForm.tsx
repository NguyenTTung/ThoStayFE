import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Swal from "sweetalert2";
import { ErrorMessage } from "@hookform/error-message";
import InputField from "@/components/form_controls/input_field";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Selectbox, Option } from "@/components/form_controls/select";
import { FormCreate } from "@/services/Dto/ticketDto";
import clsx from "clsx";
import { useRef } from "react";

import { FaRegCircleXmark } from "react-icons/fa6";
import "./styles/ticketForm.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

interface Props {
  onSubmit: (data: FormCreate, reset: Function) => void;
  className?: string;
  buttonNone?: string;
  motel?: boolean;
}

const TicketForm = forwardRef(
  ({ onSubmit, className, buttonNone, motel }: Props, ref) => {
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const selectType: Option[] = motel
      ? [
          { value: 3, label: "Tố cáo" },
          { value: 2, label: "Yêu cầu" },
          { value: 4, label: "Trợ giúp" },
        ]
      : [
          { value: 1, label: "Lỗi hệ thống" },
          { value: 2, label: "Yêu cầu" },
          { value: 4, label: "Trợ giúp" },
        ];

    const defaultTypeValue = motel ? 3 : 1;

    const schema = yup.object().shape({
      title: yup.string().required("Vui lòng nhập tiêu đề"),
      content: yup.string().required("Vui lòng nhập nội dung"),
      modelId: yup.number().nullable().notRequired(),
      imgs: yup
        .array()
        .of(
          yup.mixed<File>().test("isFile", "Chỉ chấp nhận ảnh", (value) => {
            return value instanceof File && value.type.startsWith("image/");
          })
        )
        .min(1, "Vui lòng chọn ít nhất một ảnh")
        .max(4, "Chỉ cho phép tối đa 4 ảnh")
        .required(),
    });

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<FormCreate>({
      resolver: yupResolver(schema),
      defaultValues: {
        title: "",
        content: "",
        type: defaultTypeValue,
        modelId: null,
        imgs: [],
      },
    });

    const handleFileChange = (files: FileList | null) => {
      if (!files) return;

      const newFiles = Array.from(files);
      if (images.length + newFiles.length > 4) {
        Swal.fire("Giới hạn tối đa 4 hình ảnh");
        return;
      }

      const updatedImages = [...images, ...newFiles].slice(0, 4);
      setImages(updatedImages);
      return updatedImages;
    };

    const handleImageDelete = (index: number, field: any) => {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      field.onChange(updatedImages);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        handleSubmit((data) => onSubmit(data, reset))();
        setImages([]);
      },
    }));

    return (
      <form
        className="ticket-form"
        onSubmit={handleSubmit((data) => {
          onSubmit(data, reset);
          setImages([]);
        })}
      >
        <div className="row">
          <div className={className}>
            <div className="title mb-3">
              <InputField
                control={control}
                label="Tiêu đề:"
                name="title"
                type="text"
                errors={errors}
                classname={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
            </div>
            <div className="content mb-3">
              <InputField
                control={control}
                label="Nội dung:"
                name="content"
                type="textarea"
                errors={errors}
                rows={5}
                classname={`form-control ${errors.content ? "is-invalid" : ""}`}
              />
            </div>
            <div className="type col-6 mb-3">
              <div className="receiver__label mb-2">Loại:</div>
              <Selectbox
                control={control}
                name="type"
                className={`form-select ${errors.type ? "is-invalid" : ""}`}
                options={selectType}
              />
            </div>
            <div className="file row g-3 mb-3">
              <Controller
                name="imgs"
                control={control}
                render={({ field }) => (
                  <>
                    {/* Hiển thị ảnh đã chọn */}
                    {images &&
                      images.length > 0 &&
                      images.map((item, index) => (
                        <div className="file-input col-3" key={`img-${index}`}>
                          <div className="w-100 h-100 position-relative">
                            <img
                              className="file-input__img w-100 h-100"
                              src={URL.createObjectURL(item)}
                              alt={`preview-${index}`}
                            />
                            <div
                              onClick={() => handleImageDelete(index, field)}
                              className="d-flex justify-content-center align-items-center position-absolute top-0 start-100 translate-middle rounded-circle bg-danger"
                            >
                              <FaRegCircleXmark className="fa-lg" />
                            </div>
                          </div>
                        </div>
                      ))}

                    {images && images.length < 4 && (
                      <div
                        className={`file-input-wrapper file-input col-3 ${
                          errors.imgs ? "is-invalid" : ""
                        }`}
                      >
                        <label
                          className="file-upload-label w-100"
                          htmlFor="file-input"
                        >
                          <FontAwesomeIcon
                            icon={faCamera}
                            className="camera-icon"
                          />
                          <input
                            type="file"
                            id="file-input"
                            className="file-input__input d-none file-upload-input"
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => {
                              const updatedFiles = handleFileChange(
                                e.target.files
                              );
                              if (updatedFiles) {
                                field.onChange(updatedFiles);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}

                    <ErrorMessage
                      errors={errors}
                      name="imgs"
                      render={({ message }) => (
                        <div className="invalid-feedback">{message}</div>
                      )}
                    />
                  </>
                )}
              />
            </div>
            <div className={clsx("action", buttonNone)}>
              <button
                type="submit"
                className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2"
              >
                Gửi trợ giúp
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default TicketForm;
