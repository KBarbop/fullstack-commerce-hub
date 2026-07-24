import {
    ClusterOutlined,
    DashboardOutlined,
    TabletOutlined,
    UserOutlined,
    LogoutOutlined, ProductOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import {
    reduxLogOutUser,
    useAppDispatch,
} from '../../../store';
import LinkMenuItem from '../linkMenuItem/LinkMenuItem.component.tsx';
import {logOutUser} from "../../../utils";

function Sidebar() {
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onLogout = async () => {
        try {
            const logOutPlaceOwnerRes = await logOutUser();
            if (logOutPlaceOwnerRes.status === 200) {
                dispatch(reduxLogOutUser());
                navigate('/');
            } else {
                throw new Error('Unable to Log Out');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Menu
                theme="dark"
                selectedKeys={[pathname]}
                mode="vertical"
                data-cy={'custom-slider-menu'}
            >
                <LinkMenuItem
                    path="/users"
                    title="Χρήστες"
                    icon={<UserOutlined />}
                />
                <LinkMenuItem
                    path="/categories"
                    title="Κατηγορίες"
                    icon={<TabletOutlined />}
                />
                <LinkMenuItem
                    path="/products"
                    title="Προϊόντα"
                    icon={<ProductOutlined />}
                />
                <LinkMenuItem
                    path="/orders-system"
                    title="Παραγγελίες"
                    icon={<ClusterOutlined />}
                />
                <Menu.Item
                    onClick={onLogout}
                    key="/logout"
                    icon={<LogoutOutlined />}
                >
                    Αποσύνδεση
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Sidebar;
