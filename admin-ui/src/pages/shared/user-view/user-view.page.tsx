import {OrdersTable, Sidebar} from '../../../components';
import { useEffect, useState } from "react";
import { Descriptions, DescriptionsProps, Layout } from "antd";
import { useParams } from "react-router-dom";
import {getOrdersByUser, getUserById} from "../../../utils";
import {IAdmin, ICustomer, IOrder, IUser} from "../../../../../shared";

const { Content, Sider } = Layout;

function UserView() {
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [user, setUser] = useState<IUser | IAdmin | ICustomer | null>(null);
    const userId = useParams().userId;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserById(userId || '');
                const user = userData.data.data.user;
                const userOrders = await getOrdersByUser(user._id);
                setOrders(userOrders.data.data.orders);
                setUser(userData.data.data.user);
            } catch (e) {
                console.error(e);
            }
        }
        fetchUserData();
    }, [userId]);

    // Check if user is not null before using it
    const items: DescriptionsProps['items'] = user ? [
        {
            key: '0',
            label: 'Username',
            children: user.username,
        },
        {
            key: '1',
            label: 'Όνομα',
            children: user.firstName,
        },
        {
            key: '2',
            label: 'Επώνυμο',
            children: user.lastName,
        },
        {
            key: '3',
            label: 'Email',
            children: user.email,
        },
    ] : [];

    const addressItems: DescriptionsProps['items'] = user?.__t === 'Customer' ? [
        {
            key: '0',
            label: 'Οδός',
            children: `${(user as ICustomer).addresses[0]?.fullAddress}`,
        },
        {
            key: '1',
            label: 'Κουδούνι',
            children: (user as ICustomer).addresses[0]?.bellName,
        },
        {
            key: '2',
            label: 'Comment',
            children: (user as ICustomer).addresses[0]?.comment,
        }
    ] : [];


    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Sidebar />
            </Sider>
            <Layout>
                <Content>
                    {user && <Descriptions title="User Info" items={items} />}
                    {user && 'addresses' in user &&
                        user.addresses.map((address) => {
                        return <Descriptions title="Address" items={[
                            {
                                key: '0',
                                label: 'Οδός',
                                children: `${address?.fullAddress}`,
                            },
                            {
                                key: '1',
                                label: 'Κουδούνι',
                                children: address?.bellName,
                            },
                            {
                                key: '2',
                                label: 'Όροφος',
                                children: address?.floor || 'N/A',
                            },
                            {
                                key: '3',
                                label: 'Σχόλιο',
                                children: address?.comment,
                            }
                        ]} />
                        })
                    }
                    {
                        user && user.__t === 'Customer' && <>
                            <h4>Παραγγελίες</h4>
                            <OrdersTable orders={orders} setOrders={setOrders} />
                        </>
                    }
                </Content>
            </Layout>
        </Layout>
    );
}

export default UserView;
