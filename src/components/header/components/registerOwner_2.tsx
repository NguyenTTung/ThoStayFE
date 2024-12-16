import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import InputField from "@/components/form_controls/input_field";
import { Result, RoomType } from "./registerOwner";
import { ErrorMessage } from "@hookform/error-message"
import { FaRegCircleXmark } from "react-icons/fa6";
import { useState, useRef } from "react";
import Swal from "sweetalert2";

import '../styles/registerOwner_2.scss'
import { Editor } from "@tinymce/tinymce-react";

interface Props {
    onNext: (data: Result) => void;
}

const RegisterOwner_2 = ({ onNext }: Props) => {
    const [imgs, setImgs] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const schema = yup.object().shape({
        nameRoomType: yup.string().required("Vui lòng nhập tên phòng"),
        descriptionRoomType: yup.string().required("Vui lòng nhập mô tả phòng"),
        area: yup
            .number()
            .required("Vui lòng nhập diện tích")
            .positive("Diện tích phải là số dương"),
        price: yup
            .number()
            .required("Vui lòng nhập giá phòng")
            .positive("Giá phải là số dương"),
        quantityRoom: yup
            .number()
            .required("Vui lòng nhập số lượng phòng")
            .min(1, "Phải có ít nhất 1 phòng")
            .max(8 ,"Tối đa 8 phòng"),
        images: yup
            .array()
            .of(yup.mixed<File>().required("Vui lòng chọn ảnh"))
            .min(1, "Phải có ít nhất một ảnh")
            .required(),
        
    });

    const { control, handleSubmit, formState: { errors } } = useForm<RoomType>({
        resolver: yupResolver(schema),
        defaultValues: {
            nameRoomType: "",
            descriptionRoomType: "",
            area: 0,
            price: 0,
            quantityRoom: 1,
            images: [],
        },
    });

    const onSubmit = (data: RoomType) => {
        const result: Result = {
            nameRoomType: data.nameRoomType,
            descriptionRoomType: data.descriptionRoomType,
            area: data.area,
            price: data.price,
            quantityRoom: data.quantityRoom,
            images: data.images,
        };
        onNext(result);
    };

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        if (imgs.length + newFiles.length > 8) {
            Swal.fire('Giới hạn tối đa 8 hình ảnh');
            return;
        }

        const updatedImages = [...imgs, ...newFiles].slice(0, 8);
        setImgs(updatedImages);
        return updatedImages;
    };

    const handleImageDelete = (index: number, field: any) => {
        const updatedImages = imgs.filter((_, i) => i !== index);
        setImgs(updatedImages);
        field.onChange(updatedImages);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <form className="create-room-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="container mb-3">
                <h5>Phòng trọ</h5>
                <div className="mb-3 row">
                    <div className="col-3">
                        <InputField
                            control={control}
                            label="Tên phòng:"
                            name="nameRoomType"
                            type="text"
                            errors={errors}
                            classname={`form-control ${errors.nameRoomType ? "is-invalid" : ""}`}
                        />
                    </div>
                    <div className="col-3">
                        <InputField
                            control={control}
                            label="Diện tích (m2):"
                            name="area"
                            type="text"
                            errors={errors}
                            classname={`form-control ${errors.area ? "is-invalid" : ""}`}
                        />
                    </div>
                    <div className="col-3">
                        <InputField
                            control={control}
                            label="Giá:"
                            name="price"
                            type="text"
                            errors={errors}
                            classname={`form-control ${errors.price ? "is-invalid" : ""}`}
                        />
                    </div>
                    <div className="col-3">
                        <InputField
                            control={control}
                            label="Số lượng phòng:"
                            name="quantityRoom"
                            type="text"
                            errors={errors}
                            classname={`form-control ${errors.quantityRoom ? "is-invalid" : ""}`}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    {/* <InputField
                        control={control}
                        label="Giới thiệu phòng:"
                        name="descriptionRoomType"
                        type="textarea"
                        errors={errors}
                        rows={4}
                        classname={`form-control ${errors.descriptionRoomType ? "is-invalid" : ""}`}
                    /> */}
                    <Controller
                        name="descriptionRoomType"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Editor
                                    apiKey="5xbwcmrb59xx0v3s64b62ge0xvr0on8enfdafu51357g0d1a"
                                    value={field.value}
                                    onEditorChange={field.onChange}
                                    init={{
                                        height: 150, // Tương đương rows=4
                                        menubar: false,
                                        placeholder: "Giới thiệu phòng:",
                                        content_css: false,
                                        body_class: `form-control mt-2 input-motel-info`, // Thêm class
                                    }}
                                />
                                {errors.descriptionRoomType && (
                            <div className="error-description">
                                        {errors.descriptionRoomType.message}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className="container">
                <div className="row g-3 mb-3">
                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => (
                            <>
                                {/* Hiển thị ảnh đã chọn */}
                                {imgs && imgs.length > 0 && imgs.map((item, index) => (
                                    <div className="file-input col-3" key={`img-${index}`}>
                                        <div className="w-100 h-100 position-relative">
                                            <img className='file-input__img w-100 h-100' src={URL.createObjectURL(item)} alt={`preview-${index}`} />
                                            <div
                                                onClick={() => handleImageDelete(index, field)}
                                                className="d-flex justify-content-center align-items-center position-absolute top-0 start-100 translate-middle rounded-circle bg-danger">
                                                <FaRegCircleXmark className="fa-lg" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {imgs && imgs.length < 8 && (
                                    <div className={`file-input col-3 ${errors.images ? 'is-invalid' : ''}`}>
                                        <input
                                            type="file"
                                            id="file-input"
                                            className="file-input__input d-none"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const updatedFiles = handleFileChange(e.target.files);
                                                if (updatedFiles) {
                                                    field.onChange(updatedFiles);
                                                }
                                            }}
                                        />
                                        <label className="file-input__label d-flex justify-content-center align-items-center w-100 h-100" htmlFor="file-input">
                                            <i className="fa-regular fa-plus fa-flip-both fa-xs fa-lg"></i>
                                        </label>
                                    </div>
                                )}
                                <ErrorMessage
                                    errors={errors}
                                    name="images"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </>
                        )}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <button className="btn btn-danger" type="submit">Kết thúc</button>
            </div>
        </form>
    );
};

export default RegisterOwner_2
