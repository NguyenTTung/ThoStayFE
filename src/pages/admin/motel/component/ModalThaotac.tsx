import React from "react";

const ModalThaotac: React.FC<{ onClose: () => void; modalType: string }> = ({
  onClose,
  modalType,
}) => {
  return (
    <>
      {modalType === "duyet" && (
        <div className="modal-overlay-duyet">
          <div className="modal-content-duyet position-relative">
            <div>
              <h2 className="h2-modal-duyet">
                Bạn có chắc chắn muốn duyệt trọ này?
              </h2>
            </div>
            <form className="form-duyet-modal">
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
                >
                  Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "mokhoa" && (
        <div className="modal-overlay-admin">
          <div className="modal-content-admin position-relative">
            <div>
              <h2 className="h2-modal-admin">
                Bạn có chắc chắn muốn mở khóa trọ này?
              </h2>
            </div>
            <form className="form-admin-modal">
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
                >
                  Mở khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalType === "khoa" && (
        <div className="modal-overlay-admin">
          <div className="modal-content-admin position-relative">
            <div>
              <h2 className="h2-modal-admin">Lý do khóa trọ?</h2>
            </div>
            <form className="form-admin-modal">
              <div className="form-group mt-3">
                <label htmlFor="title" className="">
                  Lí do
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Lí do"
                />
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
                  className="btn-luu-all  btn-style btn-transform-y2"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalType === "tuchoi" && (
        <div className="modal-overlay-khoa">
          <div className="modal-content-khoa position-relative">
            <div>
              <h2 className="h2-modal-khoa">Lý do từ chối?</h2>
            </div>
            <form className="form-khoa-modal">
              <div className="form-group mt-3">
                <label htmlFor="title" className="">
                  Lí do
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Lí do"
                />
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
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalThaotac;
