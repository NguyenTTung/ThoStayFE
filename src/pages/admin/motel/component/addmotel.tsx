import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/stylemotel.scss";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddMotel } from "@/services/api/MotelApi";
import { useUser } from "@/services/api/UserContext";
import { AddMotelDTO } from "@/services/Dto/MotelDto";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { RootState, userAppDispatch } from '@/redux/store';
import { fetchPackage } from '@/components/header/redux/action';
import { getCountRoomApi } from "@/services/api/HomeApi";
import { useParams } from "react-router-dom";

export const AddMotelOwner = () => {
  const { user } = useUser();
  const { myPackage } = useSelector((state: RootState) => state.user);
  const dispatch = userAppDispatch();
  useEffect(() => {
    dispatch(fetchPackage());
  }, [dispatch]);

  const [countRoom1, setCountRoom1] = useState<number>(0);
  const { motelId } = useParams();

  useEffect(() => {
    const fetchCountRoom = async () => {
      const response = await getCountRoomApi(Number(motelId));
      if (response) {
        setCountRoom1(response.count);
      }
    };
    fetchCountRoom();
  }, [motelId]);
  //rút gọn giao diện
  //trở lại trang trước đó
  const navigate = useNavigate();

  const [values, setValues] = useState<AddMotelDTO>({
    nameMotel: "",
    address: "",
    nameRoom: "",
    area: 1,
    priceRoom: 100000,
    totalRoom: 1,
    description: "",
    userId: user?.id,
  });

  const [formData, setFormData] = useState(new FormData());
  //dịch vụ ở đây nha
  console.log(setFormData);
  const [services, setServices] = useState([
    { id: 1, name: "Điện", price: "3000", description: "Điện của phòng" },
    { id: 2, name: "Nước", price: "3000", description: "Nước của phòng" },
  ]);
  const removeService = (id: number) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };
  //phần của nút địa chỉ
  type LocationOption = {
    name: string;
    code: number | null;
  };
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<LocationOption>({
    name: "",
    code: null,
  });
  const [selectedDistrict, setSelectedDistrict] = useState<LocationOption>({
    name: "",
    code: null,
  });
  const [selectedWard, setSelectedWard] = useState<string>("");
  useEffect(() => {
    // Lấy danh sách tỉnh
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince.code) {
      // Lấy danh sách quận/huyện khi tỉnh được chọn
      axios
        .get(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}/?depth=2`
        )
        .then((response) => setDistricts(response.data.districts))
        .catch((error) => console.error("Error fetching districts:", error));
    }
    setSelectedDistrict({ name: "", code: null });
    setWards([]);
    setSelectedWard("");
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict.code) {
      // Lấy danh sách phường/xã khi quận/huyện được chọn
      axios
        .get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}/?depth=2`
        )
        .then((response) => setWards(response.data.wards))
        .catch((error) => console.error("Error fetching wards:", error));
    }
    setSelectedWard("");
  }, [selectedDistrict]);

  useEffect(() => {
  }, [selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const section = document.querySelector(
        ".section-search-add-motel-address"
      );
      const input = document.querySelector(".input-add-motel-address-1");

      if (
        section &&
        !section.contains(target) &&
        input &&
        !input.contains(target)
      ) {
        setIsSectionVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  //hết phần địa chỉ
  // Thêm state errors ở đầu component
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).forEach((file) => {
        // Thêm file vào formData với key là 'imageFile'
        formData.append("imageFile", file);
        const imageUrl = URL.createObjectURL(file);
        setImages((prevImages) => [...prevImages, imageUrl]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Thêm hàm validate
  const validateField = (name: string, value: string) => {
    if (name === "province") {
      if (!selectedProvince.name || selectedProvince.code === null) {
        setErrors((prev) => ({
          ...prev,
          province: "Vui lòng chọn Tỉnh/Thành phố, Quận/ Huyện và Phường/ Xã",
        }));
        return false;
      } else if (!selectedDistrict.name || selectedDistrict.code === null) {
        setErrors((prev) => ({
          ...prev,
          province: "Vui lòng chọn Quận/ Huyện và Phường/ Xã",
        }));
        return false;
      } else if (!selectedWard) {
        setErrors((prev) => ({
          ...prev,
          province: "Vui lòng chọn Phường/ Xã",
        }));
        return false;
      }
    }

    if (!value || (value.trim() === "" && name !== "description")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Trường này không được để trống",
      }));
      return false;
    }

    if (name === "priceRoom") {
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

    if (name === "area" || name === "totalRoom") {
      if (isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [name]: "Vui lòng nhập số" }));
        return false;
      }
      if (Number(value) <= 0) {
        setErrors((prev) => ({ ...prev, [name]: "Giá trị phải lớn hơn 0" }));
        return false;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    return true;
  };

  // Cập nhật onChange handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value;
    setValues({ ...values, [field]: value });
    validateField(field, value);
  };
  const handleChangeDescription = (value: string, field: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    try {
      const limitRoom = myPackage?.limitRoom ?? 8;
      const totalRoom = values.totalRoom;
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
      const addressall: string = `${values.address}, ${selectedWard}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      // Kiểm tra các trường cơ bản
      const fieldsToValidate = {
        nameMotel: values.nameMotel,
        address: values.address,
        nameRoom: values.nameRoom,
        area: values.area,
        priceRoom: values.priceRoom,
        totalRoom: values.totalRoom,
        province: selectedProvince.name,
      };

      // Kiểm tra từng trường
      Object.entries(fieldsToValidate).forEach(([key, value]) => {
        if (!validateField(key, String(value || ""))) {
          hasError = true;
        }
      });

      // Kiểm tra dịch vụ
      services.forEach((service, index) => {
        if (!service.name.trim()) {
          setErrors((prev) => ({
            ...prev,
            [`service_name_${index}`]: "Tên dịch vụ không được để trống",
          }));
          hasError = true;
        }
        if (!service.price.trim()) {
          setErrors((prev) => ({
            ...prev,
            [`service_price_${index}`]: "Giá dịch vụ không được để trống",
          }));
          hasError = true;
        }
        if (isNaN(Number(service.price)) || Number(service.price) <= 0) {
          setErrors((prev) => ({
            ...prev,
            [`service_price_${index}`]: "Giá dịch vụ phải là số dương",
          }));
          hasError = true;
        }
        const duplicateIndex = services.findIndex(
          (s, i) =>
            i !== index &&
            s.name.trim().toLowerCase() === service.name.trim().toLowerCase()
        );
        if (duplicateIndex !== -1) {
          setErrors((prev) => ({
            ...prev,
            [`service_name_${index}`]: "Tên dịch vụ đã tồn tại",
          }));
          hasError = true;
        }
      });

      // Kiểm tra hình ảnh
      if (images.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: "Vui lòng tải lên ít nhất 1 hình ảnh",
        }));
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const submitFormData = new FormData();
      // Map đúng tên field với DTO
      const basicFields = {
        name: values.nameMotel,
        address: addressall,
        description: values.description || "",
        nameRoomType: values.nameRoom,
        descriptionRoomType: values.description || "", // Thêm trường này theo DTO
        area: values.area,
        price: values.priceRoom,
        quantityRoom: values.totalRoom, // Đổi tên field theo DTO
        ownerId: values.userId,
      };

      // Append các trường cơ bản
      Object.entries(basicFields).forEach(([key, value]) => {
        submitFormData.append(key, String(value || ""));
      });

      services.forEach((service, index) => {
        submitFormData.append(`Services[${index}].name`, service.name);
        submitFormData.append(
          `Services[${index}].description`,
          service.description
        );
        submitFormData.append(
          `Services[${index}].price`,
          service.price.toString()
        );
      });

      // Append hình ảnh với tên field là Images theo DTO
      formData.getAll("imageFile").forEach((file) => {
        submitFormData.append("Images", file);
      });

      // Log để kiểm tra
      for (const pair of submitFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await AddMotel(submitFormData);
      if (response.code === 200) {
        const limitRoom = myPackage?.limitRoom ?? 8;
        if (countRoom1 < limitRoom) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thêm dãy trọ thành công",
          }).then(() => {
            navigate('/admin/indexOwner');
            localStorage.setItem("showNotification", "true");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Không thể thêm!",
            text: "Dãy trọ vượt quá giới hạn VIP, giới hạn của dãy là " + limitRoom + " dãy trọ.",
          });
        }
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Thêm dãy trọ thất bại",
      });
    }

  };

  return (
    <div className="container-fluid-add-motel">
      <div className="row align-items-stretch mt-3">
        <div className="w-100 text-center bg-color-theme-thostay">
          <h2 className="">Thêm dãy trọ</h2>
        </div>
        <div className="card w-100">
          <div className="card-body p-4 info-motel">
            <form className="form-motel-info">
              <div className="mt-2">
                <h4 className="h4-add-motel">Dãy trọ</h4>
              </div>
              <div className="row flex-wrap">
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 form-group mt-3 px-2">
                  <label htmlFor="title" className="label-motel-info">
                    Tên dãy trọ
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control mt-2 input-motel-info"
                    placeholder="Tên dãy trọ"
                    value={values.nameMotel}
                    onChange={(e) => handleChange(e, "nameMotel")}
                  />
                  {errors.nameMotel && (
                    <div className="err-text">{errors.nameMotel}</div>
                  )}
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-8 col-xl-8 col-xxl-8 form-group mt-3 px-2 position-relative">
                  <label htmlFor="title" className="label-motel-info">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control mt-2 input-motel-info input-add-motel-address-1"
                    placeholder="Tỉnh/ Thành phố, Quận/ Huyện, Phường/ Xã"
                    value={
                      selectedProvince?.name
                        ? selectedDistrict?.name
                          ? selectedWard
                            ? `${selectedProvince.name}, ${selectedDistrict.name}, ${selectedWard}`
                            : `${selectedProvince.name}, ${selectedDistrict.name}`
                          : selectedProvince.name
                        : ""
                    }
                    onFocus={() => setIsSectionVisible(true)}
                    readOnly
                  />
                  {errors.province && (
                    <div className="err-text">{errors.province}</div>
                  )}
                  {isSectionVisible && (
                    <section className="section-search-add-motel-address">
                      <div className=" d-flex align-items-center col-12 col-sm-12 col-md-12 flex-wrap">
                        <div className="dropdown ">
                          <button
                            className="btn-search-add-motel-address  px-3 py-2  dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Tỉnh/Thành phố
                          </button>
                          <ul
                            className={`dropdown-menu ${selectedProvince.code == null ? "show" : ""
                              }`}
                            aria-labelledby="dropdownMenuButton1"
                          >
                            {provinces.map((province) => (
                              <li key={province.code}>
                                <a
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedProvince({
                                      name: province.name,
                                      code: province.code,
                                    });
                                    setSelectedDistrict({
                                      name: "",
                                      code: null,
                                    });
                                  }}
                                >
                                  {province.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="dropdown ">
                          <button
                            className="btn-search-add-motel-address  px-3 py-2 dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={!selectedProvince.code}
                          >
                            Quận/ Huyện
                          </button>
                          <ul
                            className={`dropdown-menu ${selectedDistrict.code == null &&
                              selectedProvince.code != null
                              ? "show"
                              : ""
                              }`}
                            aria-labelledby="dropdownMenuButton2"
                          >
                            {districts.map((district) => (
                              <li key={district.code}>
                                <a
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedDistrict({
                                      name: district.name,
                                      code: district.code,
                                    });
                                  }}
                                >
                                  {district.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="dropdown ">
                          <button
                            className="btn-search-add-motel-address  px-3 py-2 dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton3"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={!selectedDistrict.code}
                          >
                            Phường/ Xã
                          </button>
                          <ul
                            className={`dropdown-menu ${selectedDistrict.code != null &&
                              selectedProvince.code != null &&
                              selectedWard == ""
                              ? "show"
                              : ""
                              }`}
                            aria-labelledby="dropdownMenuButton3"
                          >
                            {wards.map((ward) => (
                              <li key={ward.code}>
                                <a
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedWard(ward.name);
                                    setIsSectionVisible(false);
                                  }}
                                >
                                  {ward.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
                <div className="col-12 form-group mt-3 px-2">
                  <label htmlFor="title" className="label-motel-info">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control mt-2 input-motel-info"
                    placeholder="Địa chỉ cụ thể"
                    value={values?.address}
                    onChange={(e) => handleChange(e, "address")}
                  />
                  {errors.address && (
                    <div className="err-text">{errors.address}</div>
                  )}
                </div>
                <div className="mt-3">
                  <h4 className="h4-add-motel">Dịch vụ dãy trọ</h4>
                </div>
                <div className="d-flex flex-wrap px-0">
                  {services.map((service, index) => (
                    <div
                      key={service.id}
                      className="row flex-wrap col-12 mt-2 px-2"
                    >
                      <div className="col-12 col-sm-12 col-md-6 col-lg-3 mt-2">
                        <label className="label-motel-info">Tên dịch vụ</label>
                        <input
                          type="text"
                          className="form-control mt-2 input-motel-info"
                          placeholder="Tên dịch vụ"
                          value={service.name}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((s) =>
                                s.id === service.id
                                  ? { ...s, name: e.target.value }
                                  : s
                              )
                            )
                          }
                          disabled={service.id === 1 || service.id === 2}
                        />
                        {errors[`service_name_${index}`] && (
                          <div className="err-text">
                            {errors[`service_name_${index}`]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-3 mt-2">
                        <label className="label-motel-info">Giá dịch vụ</label>
                        <input
                          type="text"
                          className="form-control mt-2 input-motel-info"
                          placeholder="Giá dịch vụ"
                          value={service.price}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((s) =>
                                s.id === service.id
                                  ? { ...s, price: e.target.value }
                                  : s
                              )
                            )
                          }
                        />
                        {errors[`service_price_${index}`] && (
                          <div className="err-text">
                            {errors[`service_price_${index}`]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-4 mt-2">
                        <label className="label-motel-info">
                          Mô tả dịch vụ
                        </label>
                        <input
                          type="text"
                          className="form-control mt-2 input-motel-info"
                          placeholder="Mô tả dịch vụ"
                          value={service.description}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((s) =>
                                s.id === service.id
                                  ? { ...s, description: e.target.value }
                                  : s
                              )
                            )
                          }
                        />
                      </div>
                      {errors[`service_description_${index}`] && (
                        <div className="err-text">
                          {errors[`service_description_${index}`]}
                        </div>
                      )}
                      <div className="col-12 col-sm-12 col-lg-2 d-flex justify-content-lg-around align-items-lg-end">
                        {service.id !== 1 && service.id !== 2 && (
                          <button
                            type="button"
                            className="btn btn-transform-y2 btn-xoa-add-motel mt-3"
                            onClick={() => removeService(service.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* <div className="px-2">
                    <button
                      className="btn btn-transform-y2 btn-luu-all mt-3"
                      onClick={addService}
                      type="button"
                    >
                      Thêm dịch vụ
                    </button>
                  </div> */}
                </div>
                <div className="mt-4">
                  <h4 className="h4-add-motel">Phòng trọ</h4>
                </div>
                <div className="row flex-wrap">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 form-group mt-3 px-2">
                    <label htmlFor="title" className="label-motel-info">
                      Tên phòng
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="form-control mt-2 input-motel-info"
                      placeholder="Tên phòng"
                      value={values.nameRoom}
                      onChange={(e) => handleChange(e, "nameRoom")}
                    />
                    {errors.nameRoom && (
                      <div className="err-text">{errors.nameRoom}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 form-group mt-3 px-2">
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
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.area && (
                      <div className="err-text">{errors.area}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 form-group mt-3 px-2">
                    <label htmlFor="title" className="label-motel-info">
                      Giá phòng
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="form-control mt-2 input-motel-info"
                      placeholder="Giá phòng"
                      value={values.priceRoom}
                      onChange={(e) => handleChange(e, "priceRoom")}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.priceRoom && (
                      <div className="err-text">{errors.priceRoom}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 form-group mt-3 px-2">
                    <label htmlFor="title" className="label-motel-info">
                      Số phòng
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="form-control mt-2 input-motel-info"
                      placeholder="Số phòng"
                      value={values.totalRoom}
                      onChange={(e) => handleChange(e, "totalRoom")}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.totalRoom && (
                      <div className="err-text">{errors.totalRoom}</div>
                    )}
                  </div>
                  <div className="col-12 form-group mt-3 px-2">
                    <label htmlFor="title" className="label-motel-info">
                      Mô tả phòng
                    </label>
                    {/* <textarea
                      className="form-control mt-2 input-motel-info"
                      placeholder="Mô tả phòng trọ"
                      value={values.description}
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
                      <div className="row flex-wrap mt-2 g-1">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xxl-2  position-relative"
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
                        <div className=" col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xxl-2">
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
                <div className="mx-auto col-12 col-md-12 col-lg-8 col-xl-6 col-xxl-6 mt-4">
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn-style btn-trove-all btn-transform-y2"
                      onClick={() => navigate(-1)}
                    >
                      Trở về
                    </button>
                    <button
                      type="button"
                      className="btn-style btn-luu-all btn-transform-y2"
                      onClick={handleSubmit}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddMotelOwner;
