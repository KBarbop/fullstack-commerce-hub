import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {deleteProduct, getProducts, IModalProps} from "../../utils";

function DeleteProductModal({ id, open, setOpen, setProducts }: IModalProps) {
    const navigate = useNavigate();
    /* Modal Data */
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν. Όλα τα δεδομένα του προϊόντος θα χαθούν και δε θα είναι δυνατή η ανάκτηση.'
    );

    const fetchProducts = async () => {
        try {
            const productsRes = await getProducts();
            if (productsRes.status === 200) {
                if (setProducts) {
                    setProducts(productsRes.data.data.products);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleOk = async () => {
        try {
            setModalText('Διαγραφή Προϊόντος. Παρακαλώ Περιμένετε...');
            setConfirmLoading(true);
            await deleteProduct(id);
            await fetchProducts();
            setOpen(false);
            setConfirmLoading(false);
            navigate('/products');
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
                title="Διαγραφή Προϊόντος"
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

export default DeleteProductModal;
