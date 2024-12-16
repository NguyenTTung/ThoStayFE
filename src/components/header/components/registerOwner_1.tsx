import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as yup from "yup";
import InputField from "@/components/form_controls/input_field";
import { Motel, Result } from "./registerOwner";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  onNext: (data: Result) => void;
}

const RegisterOwner_1 = ({ onNext }: Props) => {
  //phần địa chỉ :)))
  const [addressError, setAddressError] = useState<string | null>(null);
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
  const validateAddress = () => {
    if (!selectedProvince.name || selectedProvince.code === null) {
      setAddressError(
        "Vui lòng chọn Tỉnh/Thành phố, Quận/ Huyện và Phường/ Xã"
      );
      return false;
    } else if (!selectedDistrict.name || selectedDistrict.code === null) {
      setAddressError("Vui lòng chọn Quận/ Huyện và Phường/ Xã");
      return false;
    } else if (!selectedWard) {
      setAddressError("Vui lòng chọn Phường/ Xã");
      return false;
    }
    setAddressError(null); // Xóa lỗi nếu hợp lệ
    return true;
  };
  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên dãy trọ"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    description: yup.string().required("Vui lòng nhập mô tả"),
    services: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Vui lòng nhập tên dịch vụ"),
        price: yup
          .number()
          .required("Vui lòng nhập giá")
          .typeError("Giá phải là một số hợp lệ")
          .positive("Giá phải là số dương"),
        description: yup.string().required("Vui lòng nhập mô tả dịch vụ"),
      })
    ),
    addressValidation: yup
    .boolean()
    .test("", () => {
      return validateAddress(); // Gọi hàm validateAddress() của bạn
    }),
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Motel>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      services: [
        { name: "Điện", price: 0, description: "Dịch vụ cung cấp điện" },
        { name: "Nước", price: 0, description: "Dịch vụ cung cấp nước" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const onSubmit = (data: Motel) => {
    if (!validateAddress()) {
      return; // Ngừng xử lý nếu địa chỉ không hợp lệ
    }
    const fullAddress = ` ${selectedWard}, ${selectedDistrict.name}, ${selectedProvince.name}`;

    const result: Result = {
      name: data.name,
      address: `${data.address} - ${fullAddress}`,
      description: data.description,
      services: data.services,
    };
    onNext(result);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <h5>Dãy trọ</h5>
        <div className="mb-3 row">
          <div className="col-6">
            <InputField
              control={control}
              label="Tên nhà trọ:"
              name="name"
              type="text"
              errors={errors}
              classname={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
          </div>
          <div className="col-6">
            <InputField
              control={control}
              label="Địa chỉ chi tiết:"
              name="address"
              type="text"
              errors={errors}
              classname={`form-control ${errors.address ? "is-invalid" : ""}`}
            />
          </div>
        </div>
        <div className="col-12 form-group mb-3 px-2 position-relative z-3">
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
          {addressError && <div className="err-text">{addressError}</div>}
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
                    className={`dropdown-menu ${
                      selectedProvince.code == null ? "show" : ""
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
                    className={`dropdown-menu ${
                      selectedDistrict.code == null &&
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
                    className={`dropdown-menu ${
                      selectedDistrict.code != null &&
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
        <div className="mb-3">
          <Controller
            name="description"
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
                    body_class: `form-control mt-2 input-motel-info ${
                      errors.description ? "is-invalid" : ""
                    }`,
                  }}
                />
                {errors.description && (
                  <div className="error-description">
                    {errors.description.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="container">
        <h5>Dịch vụ</h5>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 row">
            <div className="col-6 col-lg-3">
              <InputField
                control={control}
                label={`Tên dịch vụ ${index + 1}:`}
                name={`services.${index}.name`}
                type="text"
                errors={errors}
                classname={`form-control ${
                  errors.services?.[index]?.name ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="col-6 col-lg-3">
              <InputField
                control={control}
                label="Giá:"
                name={`services.${index}.price`}
                type="text"
                errors={errors}
                classname={`form-control ${
                  errors.services?.[index]?.price ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="col-9 col-lg-5">
              <InputField
                control={control}
                label="Mô tả:"
                name={`services.${index}.description`}
                type="text"
                errors={errors}
                classname={`form-control ${
                  errors.services?.[index]?.description ? "is-invalid" : ""
                }`}
              />
            </div>
            <div
              className={`col-3 col-lg-1 d-flex  ${
                errors.services?.[index]
                  ? "align-items-center"
                  : "align-items-end"
              }`}
            >
              <button
                type="button"
                className="border border-danger py-2 w-100 rounded-2 bg-danger text-white"
                onClick={() => remove(index)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
        {/* <button
          type="button"
          className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2"
          onClick={() => append({ name: "", price: 0, description: "" })}
        >
          Thêm dịch vụ
        </button> */}
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-create-notification btn-sm px-3 py-2 btn-transform-y2"
          type="submit"
        >
          Tiếp tục
        </button>
      </div>
    </form>
  );
};

export default RegisterOwner_1;
