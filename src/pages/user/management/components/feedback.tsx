import { FormCreate } from '@/services/Dto/ticketDto';
import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TicketForm from '@/components/form/ticketForm';
import { CreateTicket } from '@/services/api/ticketApi';
import Swal from 'sweetalert2';

import '../styles/feedback.scss'

type Props = {
    motelId: number;
}

const Feedback = ({ motelId }: Props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const formRef = useRef<{ submitForm: () => void }>(null);

    const handleSubmit = async (data: FormCreate) => {
        data.modelId = motelId;
        try {
            const res = await CreateTicket(data);
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thành công',
                });
                handleClose();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thất bại',
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra trong quá trình gửi phản hồi',
            });
            console.error('Lỗi API:', error);
        }
    }

    return (
        <>
            <div className='col-6'>
                <Button variant="btn col-10 btn-motel" onClick={handleShow}>
                    Phản hồi
                </Button>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Phản hồi</Modal.Title>
                </Modal.Header>
                <Modal.Body className='create-feedback'>
                    <TicketForm ref={formRef} onSubmit={handleSubmit} buttonNone='d-none' motel={true} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={() => formRef.current?.submitForm()}>
                        Gửi phản hồi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Feedback