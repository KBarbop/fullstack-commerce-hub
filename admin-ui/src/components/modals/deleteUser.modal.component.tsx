import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {deleteUser, getUsers, IModalProps} from "../../utils";
import {IUser} from "../../../../shared";
import {useAppSelector, userSelector} from "../../store";

function DeleteUserModal({ id, open, setOpen, setUsers }: IModalProps) {
    const signedInUser: IUser = useAppSelector(userSelector);
    const navigate = useNavigate();
    /* Modal Data */
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον χρήστη; Όλα τα δεδομένα του χρήστη θα διαγραφούν πλήρως και δε θα υπάρχει δυνατότητα ανάκτησης.',
    );

    const fetchUsers = async () => {
        try {
            const usersRes = await getUsers();
            if (usersRes.status === 200) {
                const filteredUsers = usersRes.data.data.users.filter((user) => {
                    return user._id !== signedInUser._id;
                })
                if (setUsers) {
                    setUsers(filteredUsers);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleOk = async () => {
        try {
            setModalText('Διαγραφή χρήστη. Παρακαλώ περιμένετε...');
            setConfirmLoading(true);
            await deleteUser(id);
            await fetchUsers();
            setOpen(false);
            setConfirmLoading(false);
            navigate('/users');
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
                title="Διαγραφή χρήστη"
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

export default DeleteUserModal;
