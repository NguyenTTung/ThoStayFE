import React from 'react'

interface EditRoomProps {
  onClose: () => void;
  motelId: string | undefined;
  roomId: number;
}

const Editroom: React.FC<EditRoomProps> = ({ onClose}) => {

  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
        <div className=''>
          <h2 className='h2-modal-admin'>Sửa phòng trọ</h2>
        </div>
        <form className="form-admin-modal position-relative">
        <div className="row form-group mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="description" className="">
                  Số phòng
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Số phòng"
                />
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="description" className="">
                  Số điện
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Số điện"
                />
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="description" className="">
                  Số nước
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mt-2"
                  placeholder="Số nước"
                />
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
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Editroom