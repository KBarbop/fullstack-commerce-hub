import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import {ICategory, IOrder, IProduct, IUser} from '../../../../shared';
import {IOrdersTableProps, getOrdersFilters, extractTime, extractDate, getUsers} from "../../utils";
import DeleteOrderModal from "../modals/deleteOrder.modal.component.tsx";
import styles from './orders.table.module.css';

function OrdersTable({ orders, setOrders }: IOrdersTableProps) {
    /* Modal Data */
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [orderToBeDeleted, setOrderToBeDeleted] = useState('');
    const setOpenModal = (open: boolean, productId: string) => {
        setOpen(open);
        setOrderToBeDeleted(productId);
    };
    /* Modal Data */
    const [users, setUsers] = useState<IUser[]>([]);
    const navigate = useNavigate();
    const ordersFilters = getOrdersFilters(orders);

    const onCustomerClicked = (customerId: string) => {
        navigate(`/users/${customerId}`)
    }

    const formatPrice = (price: number): string => {
        return (price / 100).toFixed(2) + ' €';
    };

    const columns = [
        {
            title: 'Χρήστης',
            dataIndex: '_user',
            key: '_user',
            sorter: ordersFilters.sorters.userSorter,
            filters: ordersFilters.filters.userFilters,
            onFilter: ordersFilters.filterFunctions.onUserFilter,
            render: (_, record: IOrder) => (
                <p
                    className={styles['customer-title']}
                    onClick={() => {
                        onCustomerClicked(record._user);
                    }}
                >
                    {
                        users.filter((user) => {
                            return user._id === record._user;
                        })[0]?.username ?? ''
                    }
                </p>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: ordersFilters.sorters.statusSorter,
            filters: ordersFilters.filters.statusFilters,
            onFilter: ordersFilters.filterFunctions.onStatusFilter,

        },
        {
            title: 'Ώρα Λήψης',
            dataIndex: 'timeReceived',
            key: 'timeReceived',
            render: (_, record: IOrder) => (
                <>
                    <p>{`${extractDate(record.timeReceived)}`}</p>
                    <p>{`${extractTime(record.timeReceived)}`}</p>
                </>
            )
        },
        {
            title: 'Ώρα Ολοκλήρωσης',
            dataIndex: 'timeCompleted',
            key: 'timeCompleted',
            render: (_, record: IOrder) => record.timeCompleted !== 'N/A' ? (
                <>
                    <p>{`${extractDate(record.timeCompleted)}`}</p>
                    <p>{`${extractTime(record.timeCompleted)}`}</p>
                </>
            ) : <p>N/A</p>
        },
        {
            title: 'Συνολικό Ποσό',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: ordersFilters.sorters.totalPriceSorter,
            render: (_, record: IOrder) => <p>{`${formatPrice(Number.parseInt(record.totalPrice))}`}</p>
        },
        {
            title: 'Εκτιμώμενος Χρόνος Παράδοσης',
            dataIndex: 'estimatedTime',
            key: 'estimatedTime',
        },
        {
            title: 'Τρόπος Πληρωμής',
            dataIndex: 'paymentWay',
            key: 'paymentWay',
        },
        {
            title: 'Επιλογές',
            key: 'actions',
            render: (_, record: IProduct) => (
                <Space size="middle">
                    <Tooltip title="Preview">
                        <Button
                            type="text"
                            icon={<EyeFilled />}
                            onClick={() => {
                                navigate(`/orders/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                setOpenModal(true, record._id || '');
                            }}
                        />
                    </Tooltip>
                    <DeleteOrderModal
                        id={orderToBeDeleted}
                        open={open}
                        setOpen={setOpen}
                        setOrders={setOrders}
                    />
                </Space>
            ),

        },
    ];

    const fetchData = async () => {
        try {
            const users = await getUsers();
            setUsers(users.data.data.users);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchData().catch(e => console.error(e));
    }, []);

    return (
        <>
            <Table columns={columns} dataSource={orders} />
        </>
    );
}

export default OrdersTable;
