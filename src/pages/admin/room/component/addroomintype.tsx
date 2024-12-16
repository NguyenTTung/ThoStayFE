import { AddRoomApi } from "@/services/api/MotelApi";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState, userAppDispatch } from "@/redux/store";
import { fetchPackage } from "@/components/header/redux/action";
import { useLocation, useParams } from "react-router-dom";
import { getCountRoomApi } from "@/services/api/HomeApi";

interface Addroomintype {
  onClose: () => void;
  roomTypeId: number;
}

interface AddRoomDTO {
  roomTypeId: number;
  quantityRoom: number;
}

const Addroomintype: React.FC<Addroomintype> = ({ onClose, roomTypeId }) => {
  const [data, setData] = useState<AddRoomDTO>({
    roomTypeId: roomTypeId,
    quantityRoom: 1,
  });

  const { myPackage } = useSelector((state: RootState) => state.user);
  const dispatch = userAppDispatch();
  useEffect(() => {
    dispatch(fetchPackage());
  }, [dispatch]);

  const [countRoom1, setCountRoom1] = useState<number>(0);
  const { id } = useParams();
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

  const [error, setError] = useState("");

  const validateQuantity = (value: number) => {
    if (!value) return "Vui lòng nhập số lượng phòng";
    if (value < 1 || value > 20) return "Số lượng phòng phải từ 1-20";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    setData((prev) => ({ ...prev, [name]: numValue }));
    setError(validateQuantity(numValue));
  };

  const handleSubmit = async () => {
    const errorMsg = validateQuantity(data.quantityRoom);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    const limitRoom = myPackage?.limitRoom ?? 8;
    if (countRoom1 + data.quantityRoom > limitRoom) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Bạn đã thêm quá giới hạn số lượng phòng được thêm",
      });
      return;
    }
    var response = await AddRoomApi(data);
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Thêm phòng thành công",
      }).then(() => {
        localStorage.setItem("showNotification", "true");
        onClose();
        window.location.reload();
      });

    } else {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Thêm phòng thất bại",
      });
    }
  };
  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin">Thêm phòng</h2>
          </div>
          <form className="form-admin-modal position-relative">
            <div className="row flex-wrap">
              <div className="col-12 form-group mt-3 px-2">
                <label htmlFor="title" className="label-motel-info">
                  Số lượng phòng
                </label>
                <input
                  type="number"
                  id="title"
                  className="form-control mt-2 input-motel-info"
                  placeholder="Số phòng"
                  name="quantityRoom"
                  value={data.quantityRoom}
                  onChange={handleChange}
                />
                <div className="err-text">{error}</div>
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

export default Addroomintype;
