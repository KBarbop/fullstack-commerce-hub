import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import {IProduct, IUser} from '../../../../shared';
import {
    IUsersTableProps, getUsersFilters, getUsers
} from "../../utils";
import DeleteUserModal from "../modals/deleteUser.modal.component.tsx";
import {useAppSelector, userSelector} from "../../store";

function UsersTable({ users, setUsers }: IUsersTableProps) {
    /* Modal Data */
    const signedInUser: IUser = useAppSelector(userSelector);
    const [open, setOpen] = useState(false);
    const [userToBeDeleted, setUserToBeDeleted] = useState('');
    const setOpenModal = (open: boolean, userId: string) => {
        setOpen(open);
        setUserToBeDeleted(userId);
    };
    /* Modal Data */
    const navigate = useNavigate();
    const usersFilters = getUsersFilters(users);

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

    useEffect(() => {
        fetchUsers().catch(e => console.error(e));
    }, []);


    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: usersFilters.sorters.usernameSorter,
            filters: usersFilters.filters.usernameFilters,
            onFilter: usersFilters.filterFunctions.onUsernameFilter,

        },
        {
            title: 'Όνομα',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: usersFilters.sorters.firstNameSorter,
            filters: usersFilters.filters.firstNameFilters,
            onFilter: usersFilters.filterFunctions.onFirstNameFilter,
        },
        {
            title: 'Επώνυμο',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: usersFilters.sorters.lastNameSorter,
            filters: usersFilters.filters.lastNameFilters,
            onFilter: usersFilters.filterFunctions.onLastNameFilter,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: usersFilters.sorters.emailSorter,
            filters: usersFilters.filters.emailFilters,
            onFilter: usersFilters.filterFunctions.onEmailFilter,
        },
        {
            title: 'Τύπος Χρήστη',
            dataIndex: '__t',
            key: '__t',
            sorter: usersFilters.sorters.typeSorter,
            filters: usersFilters.filters.typeFilters,
            onFilter: usersFilters.filterFunctions.onTypeFilter,
        },
        {
            title: 'Επιλογές',
            key: 'actions',
            render: (_, record: IProduct) => (
                <Space size="middle">
                    <Tooltip title="Προβολή">
                        <Button
                            type="text"
                            icon={<EyeFilled />}
                            onClick={() => {
                                navigate(`/users/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Διαγραφή">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                setOpenModal(true, record._id || '');
                            }}
                        />
                    </Tooltip>
                    <DeleteUserModal
                        id={userToBeDeleted}
                        open={open}
                        setOpen={setOpen}
                        setUsers={setUsers}
                    />
                </Space>
            ),

        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={users} />
        </>
    );
}

export default UsersTable;
