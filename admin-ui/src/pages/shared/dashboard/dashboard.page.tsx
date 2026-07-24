import {Sidebar} from "../../../components";
import {useState} from "react";
import { Layout } from "antd";
const { Content, Sider } = Layout;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
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
                    <h1>Admin Dashboard</h1>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Dashboard;
