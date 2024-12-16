import CreateNotification from "./component/CreateNotification";
import EditNotification from "./component/EditNotification";
import SendNotification from "./component/SendNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Noti } from "@/services/api/authApi";
import { Data } from "@/services/Dto/NotificationDto";
import Swal from "sweetalert2";
import { ParamsPage } from "@/services/Dto/NotificationDto";
import { getNotis } from "@/services/api/notiApi";

export const Notification: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Noti | null>(
    null
  );
  const [notifications, setNotifications] = useState<Data>();
  const [activeStatus, setActiveStatus] = useState<boolean | undefined>(
    undefined
  );

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    fetchNotifications();
    setShowModal(false);

    setCurrentNotification(null);
  };

  const handleOpenEditModal = (noti: Noti) => {
    setCurrentNotification(noti);
    setShowEditModal(true);
    setShowSendPopup(false);
  };

  const handleCloseEditModal = () => {
    fetchNotifications();
    setShowEditModal(false);
    setCurrentNotification(null);
  };

  const handleOpenSendPopup = (noti: Noti) => {
    setCurrentNotification(noti);
    setShowSendPopup(true);
    setShowEditModal(false);
  };
  const handleCloseSendPopup = () => {
    fetchNotifications();
    setShowSendPopup(false);
    setCurrentNotification(null);
  };

  const getNotificationTypeClass = (type: number) => {
    switch (type) {
      case 2:
        return "bg-yellow-noti"; // Cảnh báo (vàng)
      case 3:
        return "bg-red-noti"; // Khẩn cấp (đỏ)
      case 4:
        return "bg-blue-noti"; // Hệ thống (xanh dương)
      default:
        return "bg-green-noti"; // Thông thường (xanh lá cây)
    }
  };

  const fetchNotifications = async (param: ParamsPage = {}) => {
    try {
      const response = await getNotis(param);
      if (response.data.code === 200) {
        setActiveStatus(param.status || undefined);
        setNotifications(response.data.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể lấy danh sách thông báo",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Đã có lỗi xảy ra khi gọi API",
      });
      console.error("Lỗi API:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatContent = (content: string) => {
    const maxLength = 80;
    let formattedContent = "";
    let currentLine = "";
    // Tách nội dung thành các từ
    const words = content.split(" ");
    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        // Nếu thêm từ vào dòng hiện tại mà không vượt quá 100 ký tự, thêm từ đó vào
        currentLine += (currentLine ? " " : "") + word;
      } else {
        // Nếu thêm từ vào vượt quá 100 ký tự, kết thúc dòng hiện tại và bắt đầu dòng mới
        formattedContent += currentLine + "<br />";
        currentLine = word; // bắt đầu dòng mới với từ hiện tại
      }
    });
    // Thêm dòng cuối cùng (nếu có)
    if (currentLine) {
      formattedContent += currentLine;
    }
    return formattedContent;
  };

  return (
    <div className="container-fluid noti-container">
      <div className="row align-items-stretch mt-3">
        <div className="card w-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex flex-wrap">
                <button
                  onClick={() => fetchNotifications({})}
                  className={`btn btn-filter btn-sm px-3 py-1 mx-2 mb-1 btn-transform-y2 d-flex align-items-center  ${
                    activeStatus === undefined ? "active-filter-motel" : ""
                  }`}
                >
                  Tất cả
                </button>

                <button
                  onClick={() =>
                    fetchNotifications({
                      status: true,
                    })
                  }
                  className={`btn btn-filter btn-sm px-3 py-1 mx-2 mb-1 btn-transform-y2 d-flex align-items-center ${
                    activeStatus === true ? "active-filter-motel" : ""
                  }`}
                >
                  Đã gửi
                </button>

                <button
                  onClick={() =>
                    fetchNotifications({
                      status: false,
                    })
                  }
                  className={`btn btn-filter btn-sm px-3 py-1 mx-2 mb-1 btn-transform-y2 d-flex align-items-center ${
                    activeStatus === false ? "active-filter-motel" : ""
                  }`}
                >
                  Chưa gửi
                </button>
              </div>
              <div className="">
                <button
                  className="btn btn-create-notification btn-transform-y2"
                  onClick={handleOpenModal}
                >

                      <i className="fa-regular fa-plus icon-table-motel fa-lg me-3"></i>  


                  Thêm thông báo
                </button>

                {showModal && <CreateNotification onClose={handleCloseModal} />}
              </div>
            </div>

            <div className="table-responsive" data-simplebar>
              <table className="table table-borderless align-middle text-nowrap">
                <thead>
                  <tr className="brg-table-tro rounded-pill">
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Loại</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications?.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Bạn hiện tại chưa tạo thông báo nào
                      </td>
                    </tr>
                  ) : (
                    notifications?.items.map((noti, index) => (
                      <tr key={noti.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="mb-1 fw-bolder">{index + 1}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0">{noti.title}</p>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: formatContent(noti.content),
                              }}
                            />
                          </p>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 fs-3 ${getNotificationTypeClass(
                              noti.type
                            )}`}
                          >
                            {noti.type === 1
                              ? "Thông thường"
                              : noti.type === 2
                              ? "Cảnh báo"
                              : noti.type === 3
                              ? "Khẩn cấp"
                              : "Hệ thống"}
                          </span>
                        </td>
                        <td>
                          {noti.status === false ? (
                            <span
                              className={`tt-choduyet badge bg-warning rounded-pill px-3 py-2 fs-3 text-white`}
                            >
                              Chưa gửi
                            </span>
                          ) : (
                            <span
                              className={`tt-choduyet badge bg-success rounded-pill px-3 py-2 fs-3 text-white`}
                            >
                              Đã gửi
                            </span>
                          )}
                        </td>
                        <td>
                          <a
                            className="px-2 py-1 mx-1 btn-transform-y2"
                            style={{
                              pointerEvents: noti.status ? "none" : "auto",
                              opacity: noti.status ? 0.5 : 1,
                            }}
                            onClick={() => handleOpenEditModal(noti)}
                          >

                            <i className="fa-regular fa-pen-to-square  icon-table-motel fa-xl"></i>

                          </a>
                          <a
                            className="px-2 py-1 mx-1 btn-transform-y2"
                            style={{
                              pointerEvents: noti.status ? "none" : "auto",
                              opacity: noti.status ? 0.5 : 1,
                            }}
                            onClick={() => handleOpenSendPopup(noti)}
                          >
                            <i className="fa-regular fa-paper-plane icon-table-motel fa-xl"></i>

                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {notifications && notifications?.totalPages > 1 && (
              <div className="w-100 d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item block-page-item">
                      <button
                        onClick={() => {
                          if (notifications.pageNumber > 1) {
                            fetchNotifications({
                              // search: keySearch,
                              pageNumber: notifications.pageNumber - 1,
                              status: activeStatus,
                            });
                          }
                        }}
                        className={`page-link btn-filter ${
                          notifications.pageNumber === 1
                            ? "block-page-item__block-page-link--disabled"
                            : ""
                        }`}
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>
                    {notifications &&
                      notifications.totalPages &&
                      Array.from(
                        { length: notifications.totalPages },
                        (_, index) => (
                          <li key={index} className="page-item block-page-item">
                            <button
                              onClick={() => {
                                if (notifications.pageNumber !== index + 1) {
                                  fetchNotifications({
                                    // search: keySearch,
                                    pageNumber: index + 1,
                                    status: activeStatus,
                                  });
                                }
                              }}
                              className={`page-link btn-filter ${
                                notifications.pageNumber == index + 1
                                  ? "block-page-item__block-page-link--active"
                                  : ""
                              }`}
                            >
                              {index + 1}
                            </button>
                          </li>
                        )
                      )}
                    <li className="page-item block-page-item">
                      <button
                        onClick={() => {
                          if (
                            notifications.pageNumber < notifications.totalPages
                          ) {
                            fetchNotifications({
                              // search: keySearch,
                              pageNumber: notifications.pageNumber + 1,
                              status: activeStatus,
                            });
                          }
                        }}
                        className={`page-link btn-filter ${
                          notifications.pageNumber === notifications.totalPages
                            ? "block-page-item__block-page-link--disabled"
                            : ""
                        }`}
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* EditNotification Popup */}
            {showEditModal && currentNotification && (
              <EditNotification
                notificationId={currentNotification.id}
                initialData={{
                  type: currentNotification.type,
                  title: currentNotification.title,
                  content: currentNotification.content,
                }}
                onClose={handleCloseEditModal}
              />
            )}

            {showSendPopup && currentNotification && (
              <SendNotification
                notificationId={currentNotification.id}
                onClose={handleCloseSendPopup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
