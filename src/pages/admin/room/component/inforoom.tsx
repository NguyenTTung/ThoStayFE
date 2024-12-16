import React, { useEffect, useState } from "react";
import "../style/room.scss";
import Detailroom from "./detailroom/detailroom";
import Historyroom from "./detailroom/historyroom";
import { Billroom } from "./detailroom/billroom";
import Editroom from "./detailroom/editroom";
import AddUserRoom from "./detailroom/addUserRoom";
import Baotriroom from "./detailroom/baotriroom";
import { useParams } from "react-router-dom";
import { GetRoomByIdApi } from "@/services/api/MotelApi";
import { RoomDTO } from "@/services/Dto/MotelDto";

const Inforoom = () => {
  const [modalState, setModalState] = useState<{ [key: string]: boolean }>({
    addRoom: false,
    AddElicWater: false,
  });
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const toggleModal = (
    modalName: keyof typeof modalState,
    roomId: number | null = null
  ) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
    setSelectedRoomId(roomId);
  };
  const [activeTab, setActiveTab] = useState("detail"); // State lưu tab đang được chọn

  const { id } = useParams();

  

  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-stretch mt-3">
          <div className="card w-100">
            <div className="card-body p-4">
              {/* Thanh điều hướng */}
              <div>
                <div className="d-flex flex-wrap justify-content-between  align-items-center">
                  <div className="d-flex flex-wrap align-items-center">
                    <button
                      onClick={() => setActiveTab("detail")}
                      className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                        activeTab === "detail" ? "active-filter-motel" : ""
                      }`}
                    >
                      Chi tiết phòng
                    </button>
                    <button
                      onClick={() => setActiveTab("bill")}
                      className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                        activeTab === "bill" ? "active-filter-motel" : ""
                      }`}
                    >
                      Hóa đơn phòng
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                        activeTab === "history" ? "active-filter-motel" : ""
                      }`}
                    >
                      Lịch sử thuê phòng
                    </button>
                  </div>
                  <div className="d-flex flex-wrap align-items-center">
                    <button
                      className={`btn btn-create-notification btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2`}
                      onClick={() => toggleModal('editRoom', 1)}
                    >
                      Sửa phòng
                    </button>
                    <button
                      className={`btn btn-create-notification btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 `}
                      onClick={() => toggleModal('baotriroom', 1)}
                    >
                      Bảo trì
                    </button>
                  </div>
                </div>
              </div>

              {/* Nội dung hiển thị */}
              <div className="">
                {activeTab === "detail" && <Detailroom roomId={Number(id)} />}
                {activeTab === "history" && <Historyroom roomId={Number(id)} />}
                {activeTab === "bill" && <Billroom roomId={Number(id)} />}
              </div>
            </div>
          </div>
        </div>
        {modalState.editRoom && selectedRoomId && (
          <Editroom
            roomId={selectedRoomId}
            onClose={() => toggleModal("editRoom")}
            motelId={"1"}
          />
        )}
        {modalState.addUserRoom && selectedRoomId && (
          <AddUserRoom
            roomId={selectedRoomId}
            onClose={() => toggleModal("addUserRoom")}
          />
        )}
        {modalState.baotriroom && selectedRoomId && (
          <Baotriroom
            roomId={selectedRoomId}
            onClose={() => toggleModal("baotriroom")}
          />
        )}
      </div>
    </>
  );
};

export default Inforoom;
