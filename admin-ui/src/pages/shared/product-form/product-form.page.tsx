import {ProductForm, Sidebar} from '../../../components';
import {useState} from "react";
import {Layout} from "antd";
const { Content, Sider } = Layout;

function CreateCategory() {
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
                    <ProductForm />
                </Content>
            </Layout>
        </Layout>
    );
}

export default CreateCategory;
