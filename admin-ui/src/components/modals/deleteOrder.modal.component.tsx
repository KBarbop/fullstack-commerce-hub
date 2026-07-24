import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {deleteOrder, getOrders, getProducts, IModalProps} from "../../utils";

function DeleteOrderModal({ id, open, setOpen, setOrders }: IModalProps) {
    const navigate = useNavigate();
    /* Modal Data */
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την παραγγελία. Όλα τα δεδομένα της παραργγελίας θα διαγραφούν και δεν θα υπάρχει τρόπος ανάκτησης.'
    );

    const fetchOrders = async () => {
        try {
            const ordersRes = await getOrders();
            if (ordersRes.status === 200) {
                if (setOrders) {
                    setOrders(ordersRes.data.data.orders);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleOk = async () => {
        try {
            setModalText('Διαγραφή Παραγγελίας. Παρακαλώ περιμένετε...');
            setConfirmLoading(true);
            await deleteOrder(id);
            await fetchOrders();
            setOpen(false);
            setConfirmLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };
    /* Modal Data */
    return (
        <>
            <Modal
                title="Διαγραφή Παραγγελίας"
                open={open}
                confirmLoading={confirmLoading}
                footer={[
                    <Button type="text" onClick={handleCancel} key={`Cancel Button`}>
                        Ακύρωση
                    </Button>,
                    <Button
                        danger
                        onClick={() => {
                            handleOk().catch((e) => {
                                console.error(e);
                            });
                        }}
                        key={`Delete Button`}
                    >
                        Διαγραφή
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
}

export default DeleteOrderModal;
