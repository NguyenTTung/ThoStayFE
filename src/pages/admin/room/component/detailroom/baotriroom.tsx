import React from "react";

interface BaotriroomProps {
  onClose: () => void;
  roomId: number;
}

const Baotriroom: React.FC<BaotriroomProps> = ({ onClose }) => {
  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative p-4">
        <div >
              <h2 className="h2-modal-duyet text-center">
                Bạn có chắc chắn bảo trì phòng này?
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
                  Bảo trì
                </button>
              </div>
            </form>
        </div>
      </div>
    </>
  );
};

export default Baotriroom;
