import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {cancelOrder, IModalProps} from "../../utils";

function CancelOrderModal({ id, open, setOpen, fetchData, scrollToTop }: IModalProps) {
    const navigate = useNavigate();
    /* Modal Data */
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την παραγγελία;'
    );

    const handleOk = async () => {
        try {
            setModalText('Ακύρωση Παραγγελίας. Παρακαλώ περιμένετε...');
            setConfirmLoading(true);
            try {
                await cancelOrder(id || '');
                if (fetchData) {
                    await fetchData();
                }
                if (scrollToTop) {
                    scrollToTop();
                }
            } catch (e) {
                console.error(e);
            }
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
                title="Ακύρωση Παραγγελίας"
                open={open}
                confirmLoading={confirmLoading}
                footer={[
                    <Button type="text" onClick={handleCancel} key={`Cancel Button`}>
                        Ακύρωση
                    </Button>,
                    <Button
                        onClick={() => {
                            handleOk().catch((e) => {
                                console.error(e);
                            });
                        }}
                        key={`Delete Button`}
                    >
                        Ακύρωση Παραγγελίας
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
}

export default CancelOrderModal;
