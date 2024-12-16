import React, { useEffect, useState } from "react";
import tk from "@/assets/images/backgrounds/img-login.png";
import {
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddAccount from "./Component/addAccount";
import EditAccount from "./Component/editAccount";
import DeleteAccount from "./Component/deleteAccount";
import { getAllUser } from "@/services/api/userApi";
import '../account/account.scss'



interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  avatar: string | null;
  timeCreated: string;
  status: boolean;
  role: string;
  vip: string;
}

export const Account: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  //lấy id để sửa
  const handleOpenEditModal = (userID: number) => {
    setUserId(userID);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleOpenDeleteModal = (userID: number) => {
    setUserId(userID);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const token = localStorage.getItem("token");
  const fetchUser = async (pageNumber = 1, searchString = "") => {
    try {
      const res = await getAllUser({ token, pageNumber, searchString });
      if (res.data.code === 200) {
        setUsers(res.data.data.list);
        setTotalPages(res.data.data.totalPage);
      } else {
        setUsers([]);
        setTotalPages(0);
      }
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUser(currentPage, searchQuery);
  }, [currentPage, searchQuery]);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // gọi ở đây
    try {
      const res = await getAllUser({ token, pageNumber: pageNumber });

      // đặt lại ng dùng
      if (res.data.code === 200) {
        setUsers(res.data.data.list);
        setTotalPages(res.data.data.totalPage);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // reload
      window.location.reload();
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUser(1, searchQuery);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-stretch mt-3">
          <div className="card w-100">
            <div className="card-body p-4">
              <div className="">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="header-name-all">Quản lý tài khoản</h2>
                  <button
                    className="btn btn-create-notification btn-transform-y2"
                    onClick={handleOpenModal}
                  >
                    <i className="fa-regular fa-plus icon-table-motel fa-lg me-3"></i>
                    Thêm tài khoản
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <div className="form-group has-search position-relative">
                    <form className="d-flex align-items-center border border-secondary-subtle ps-3 rounded">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input
                        type="search"
                        className="form-control border-0"
                        placeholder="Tìm kiếm tài khoản"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-responsive mt-3" data-simplebar>
                <table className="test-table table table-borderless align-middle text-nowrap">
                  <thead>
                    <tr className="brg-table-tro">
                      <th scope="col">ID</th>
                      <th scope="col">Hình ảnh</th>
                      <th scope="col">Họ tên</th>
                      <th scope="col">Số điện thoại</th>
                      <th scope="col">Email</th>
                      <th scope="col">Vip</th>
                      <th scope="col">Quyền</th>
                      <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div className="me-4">
                            <img style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              src={user.avatar || tk} // Use a placeholder if avatar is null
                              width="50"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </td>
                        <td>{user.fullName}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td><p className="package-name2 rounded-2 px-0 mb-0 text-center">{user.vip}</p></td>
                        {/* <td className="text-overflow-motel">Address Placeholder</td> */}
                        <td>
                          <span className="tt-dangthue badge bg-light-success rounded-pill px-3 py-2 fs-3">
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.role !== "Admin" && (
                            <>
                              <a
                                className="px-2 py-1 mx-1 btn-transform-y2"
                                onClick={() => handleOpenEditModal(user.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="2xl"
                                  color="#298b90"
                                  className="icon-table-motel"
                                />
                              </a>
                              <a
                                href="#"
                                className="px-2 py-1 mx-1 btn-transform-y2"
                                onClick={() => handleOpenDeleteModal(user.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  size="2xl"
                                  color="#298b90"
                                  className="icon-table-motel"
                                />
                              </a>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-100 d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        style={{ caretColor: "transparent" }}
                        className="page-link btn-filter"
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    {pageNumbers.map((number) => (
                      <li className="page-item" key={number}>
                        <a
                          style={{ caretColor: "transparent" }}
                          className={`page-link btn-filter ${number === currentPage ? "active-filter-motel" : ""
                            }`}
                          onClick={() => handlePageChange(number)}
                        >
                          {number}
                        </a>
                      </li>
                    ))}
                    <li className="page-item">
                      <a
                        style={{ caretColor: "transparent" }}
                        className="page-link btn-filter"
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <AddAccount
          onClose={handleCloseModal}
          onSubmit={() => handlePageChange(currentPage)}
        />
      )}
      {/* Edit Account Modal */}
      {showEditModal && userId !== null && (
        <EditAccount
          userId={userId}
          onClose={handleCloseEditModal}
          onSubmit={() => handlePageChange(currentPage)}
        />
      )}
      {/* Delete Account Modal */}
      {showDeleteModal && userId !== null && (
        <DeleteAccount
          userId={userId}
          onClose={handleCloseDeleteModal}
          onSubmit={() => handlePageChange(currentPage)}
        />
      )}
    </>
  );
};
