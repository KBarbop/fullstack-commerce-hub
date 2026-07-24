import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {completeOrder, IModalProps} from "../../utils";

function CompleteOrderModal({ id, open, setOpen, fetchData, scrollToTop }: IModalProps) {
    const navigate = useNavigate();
    /* Modal Data */
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Είστε σίγουροι ότι θέλετε να ολοκληρώσετε αυτή την παραγγελία;'
    );

    const handleOk = async () => {
        try {
            setModalText('Ολοκλήρωση Παραγγελίας. Παρακαλώ περιμένετε...');
            setConfirmLoading(true);
            try {
                await completeOrder(id || '');
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
                title="Ολοκλήρωση Παραγγελίας"
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
                        Ολοκλήρωση
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
}

export default CompleteOrderModal;
