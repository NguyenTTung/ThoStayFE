import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AddUserRoom from "./addUserRoom";
import Deleteuseroom from "./deleteuseroom";
import { RoomDTO } from "@/services/Dto/MotelDto";
import { GetRoomByIdApi } from "@/services/api/MotelApi";

const Detailroom: React.FC<{ roomId: number | null }> = ({ roomId }) => {
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [modalState, setModalState] = useState<{ [key: string]: boolean }>({
    addUserRoom: false,
    deleteuseroom: false,
  });
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


  useEffect(() => {
    const LoadData = async () => {
      const response = await GetRoomByIdApi(roomId?.toString() || ""  );
      if (response && response.data) {
        setRoom(response.data);
        console.log('response', response.data);
      }
    }
    LoadData();
  }, []);

  const toggleModal = (
    modalName: keyof typeof modalState,
    roomId: number | null = null,
    userId: number | null = null
  ) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
    console.log("Room", room);
    setSelectedRoomId(roomId);
    setSelectedUserId(userId);
  };

  const motels =
    room && room.images
      ? [
          {
            id: room.id,
            status: room.status || 1,
            name: `Phòng số ${room.id}`,
            price: room.roomType?.price || 0,
            images: room.images.map((img) => img.link),
          },
        ]
      : [];

  const CheckStatus = (status: number) => {
    if (status === 1) {
      return (
        <span className="tt-choduyet badge bg-light-warning rounded-pill px-3 py-2 fs-3">
          Đang trống
        </span>
      );
    } else if (status === 2) {
      return (
        <span className="tt-dangthue bg-light-success rounded-pill px-3 py-2 fs-3">
          Đang thuê
        </span>
      );
    } else if (status === 3) {
      return (
        <span className="span-baotri-room-motel rounded-pill px-3 py-2 fs-3">
          bảo trì
        </span>
      );
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-9 mt-3">
          <div className="bgr-detail-room-info p-4">
            <div className="row">
              <div className=" col-12 col-lg-5 row  align-content-start flex-wrap">
                {room?.images?.map((image, index) => (

                  <div
                    key={index}
                    className="col-6 col-md-4 col-lg-4 mb-2 px-1"
                  >
                    <img
                      src={image.link}
                      alt={`Hình ${index + 1}`}
                      className="img-fluid img-info-room-detail"
                    />
                  </div>
                ))}
              </div>
              <div className=" col-12 col-lg-7">
                <div className=" bgr-detail-motel-text-user">
                  <h2 className="name-detail-motel-user">Số phòng {room?.roomNumber}</h2>

                  {/* Code phần dưới img ở đây là dc */}
                  <div className="d-flex mt-3 align-items-center">
                    <h5 className="me-3 mb-0 price-detail-motel-user">
                      {room?.roomType?.price?.toLocaleString("vi-VN")} / tháng
                    </h5>
                    <FontAwesomeIcon
                      icon={faCircle}
                      size="sm"
                      color="#0B1A46"
                      className="me-3"
                    />{" "}
                    <h5 className=" mb-0 area-detail-motel-user">
                      {room?.roomType?.area}M<sup>2</sup>
                    </h5>
                  </div>
                  <h5 className=" mb-0 table-deltail-motel-user">
                    <table className="table-none-all">
                      <tbody>
                        <tr>
                          <td className="pe-2">Số điện: </td>
                          <td>{room?.consumption?.electricity || 0}</td>
                        </tr>
                        <tr className="">
                          <td className="pe-2">Số nước: </td>
                          <td>{room?.consumption?.water || 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </h5>
                  {/* <h5 className="mt-3 mb-0 text-deltail-motel-user">
                    <i className="fa-light fa-clock me-1"></i>  Cập nhật:
                  </h5> */}
                  <div className="mt-3">{CheckStatus(room?.status || 0)}</div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-3">
          {/* Người thuê */}
          {room?.users.map((user) => (
            <div
              className="bgr-detail-room-info p-4 mt-3 position-relative"
              key={user.id}
            >
              <div className="close-user-detai-room">
                <button
                  className="close-btn-user btn-transform-y2"
                  onClick={() =>
                    toggleModal("deleteuseroom", room?.id, user.id)
                  }
                >
                  <i className="fa-regular fa-xmark fa-xl"></i>
                </button>
              </div>
              <div className="row">
                <div className="col-3 px-1">
                  <div className="width-height-1-1">
                  <img
                    src={user?.avatar || "https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2Fc68b44ba-41f4-4985-a339-f9378b7fec37.png?alt=media"}
                    alt="user-avatar"
                    className="img-fluid rounded-circle "
                  />
                  </div>
                </div>
                <div className="col-9 text-nowrap overflow-hidden">
                  <h5>{user?.fullName}</h5>
                  <h6 className="color-xam">{user?.email}</h6>
                  <h6 className="color-xam">{user?.phone}</h6>
                </div>
              </div>
            </div>
          ))}

          <button
            className={`btn btn-create-notification btn-sm px-3 py-2 mb-3 btn-transform-y2 mt-3`}
            onClick={() => toggleModal("addUserRoom", room?.id)}
          >
            Thêm người thuê
          </button>
        </div>
      </div>
      {modalState.addUserRoom && selectedRoomId && (
        <AddUserRoom
          roomId={motels[0].id}
          onClose={() => toggleModal("addUserRoom")}
        />
      )}
      {modalState.deleteuseroom && selectedRoomId && selectedUserId && (
        <Deleteuseroom
          roomId={selectedRoomId}
          userId={selectedUserId}
          onClose={() => toggleModal("deleteuseroom")}
        />
      )}
    </>
  );
};

export default Detailroom;
