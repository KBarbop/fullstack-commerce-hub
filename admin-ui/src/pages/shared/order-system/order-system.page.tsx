import { OrdersTable, Sidebar } from "../../../components";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { getOrders } from "../../../utils";
import { IOrder } from "../../../../../shared";

const { Content, Sider } = Layout;

const OrderSystem = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data.data.orders);
            } catch (e) {
                console.error(e);
            }
        };

        fetchOrders().catch(e => console.error(e));

        // Determine the WebSocket protocol based on the current page's protocol
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://${window.location.hostname}:8000`;

        // Set up WebSocket connection
        const ws = new WebSocket(wsUrl);
        setSocket(ws);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newOrder') {
                setOrders((prevOrders) => [...prevOrders, message.order.data.order]);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Clean up WebSocket connection on component unmount
        return () => {
            ws.close();
        };
    }, []);

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
                    <h1>Παραγγελίες</h1>
                    <OrdersTable orders={orders} setOrders={setOrders} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default OrderSystem;
