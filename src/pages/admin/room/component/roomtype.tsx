import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetRoomTypeDTO } from "@/services/Dto/MotelDto";
import RowRoom from "./rowRoom";
import { useSelector } from "react-redux";
import { RootState, userAppDispatch } from "@/redux/store";
import { fetchPackage } from "@/components/header/redux/action";
import { getCountRoomApi } from "@/services/api/HomeApi";
import Swal from "sweetalert2";
import { GetRoomTypeByAddElicWaterApi } from "@/services/api/MotelApi";
const Roomtype = (props: {

  roomType: GetRoomTypeDTO;
  motelStatus: number;
  toggleModal: (modalName: string, param: number | number[]) => void;}) => {
  const { roomType, toggleModal } = props;
  const { user } = useSelector((state: RootState) => state.user);

  const [isDisabled, setIsDisabled] = useState(false);

  const { myPackage } = useSelector((state: RootState) => state.user);
  const dispatch = userAppDispatch();
  useEffect(() => {
    dispatch(fetchPackage());
  }, [dispatch]);
  const [countRoom, setCountRoom] = useState<number>(0);
  const { motelId } = useParams();
  useEffect(() => {
    const checkStatus = async () => {
      const result = await GetRoomTypeByAddElicWaterApi(roomType.id);
      setIsDisabled(result.data.length > 0);
    };
    checkStatus();
  }, [roomType.id]);

  useEffect(() => {
    const fetchCountRoom = async () => {
      const response = await getCountRoomApi(Number(motelId));
      if (response) {
        setCountRoom(response.count);
      }
    };
    fetchCountRoom();
  }, [motelId]);

  const handleAddRoom = () => {
    const limitRoom = myPackage?.limitRoom ?? 8;
    if (countRoom < limitRoom) {
      toggleModal("AddRoomInType", roomType.id);
    } else {
      Swal.fire({
        icon: "error",
        title: "Không thể thêm!",
        text: "Bạn đã đạt giới hạn số lần thêm dãy trọ.",
      });
    }
  };

  console.log(myPackage?.limitRoom, '1')

  return (
    <>
      <div className="room-type-owner mt-3">
        <div className="row justify-content-between p-3">
          <div className="col-12 col-lg-4 col-xxl-5 row justify-content-between pb-3">
            <div className="col-12 col-lg-12 col-xxl-6 mt-3 list-img-room-motel row g-2 mb-3">
              {roomType?.images?.map((image, index) => (
                <div className="col-3 col-md-2 col-lg-4 g-2">
                  <img
                    key={image.id}
                    src={image.link}
                    alt={`Room Image ${index + 1}`}
                    className="rounded-img-info-model img-fluid"
                  />
                </div>
              ))}
            </div>
            <div className="col-12 col-lg-12 col-xxl-6 row align-items-center justify-content-between flex-wrap">
              <div className="list-motel-body col-12">
                <div className="motel-item-name">
                  <a href="#" className="motel-item-link">
                    <h3 className="mb-0">{roomType.name}</h3>
                  </a>
                </div>
                <div className="motel-item-price">
                  <small className="me-2">Giá</small>
                  <span>
                    {(roomType.price.toLocaleString())} vnđ/tháng
                  </span>
                </div>
                <div className="motel-item-price">
                  <small className="me-2">Diện tích</small>
                  <span>
                    {roomType?.area} M<sup>2</sup>
                  </span>
                </div>
                <div className="motel-item-price">
                  <small className="me-2">Đánh giá</small>
                  <span>{roomType?.rating}</span>
                </div>
              </div>
              <div className="g-2">
                {user?.role === "Owner" ? (
                  <>
                    <div className="">
                      <button
                        className="btn btn-create-notification btn-transform-y2"
                        onClick={() => toggleModal("addElicWater", roomType.id)}
                        disabled={!isDisabled}
                      >
                        Xuất hoá đơn
                      </button>
                    </div>
                    <div className="d-flex justify-content-lg-between col-12 mt-3 px-0">
                      <button
                        className="btn btn-create-notification btn-transform-y2 p-2 me-2 me-lg-0 "
                        onClick={handleAddRoom}
                      >
                        Thêm phòng
                      </button>
                      <button
                        onClick={() => toggleModal("editRoomType", roomType.id)}
                        className="btn btn-create-notification btn-transform-y2 p-2 col-lg-4"
                      >
                        Sửa
                      </button>
                    </div>
                  </>
                ) : (
                  (user?.role === "Admin" || user?.role === "Staff") && <></>
                )}

              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8 col-xxl-7 row list-room-motel pb-3">
            {/* lặp vòng phòng*/}
            {roomType?.rooms?.map((room) => (
              <RowRoom
                id={room.id}
                roomNumber={room.roomNumber}
                totalUser={room.totalUser}
                status={room.status}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Roomtype;
