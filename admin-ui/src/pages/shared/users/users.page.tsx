import {Sidebar, UsersTable} from "../../../components";
import {useEffect, useState} from "react";
import {Button, Divider, Layout} from "antd";
import {IUser} from "../../../../../shared";
import { getUsers} from "../../../utils";
import {AppstoreAddOutlined} from "@ant-design/icons";
import { useNavigate } from 'react-router';
import {useAppSelector, userSelector} from "../../../store";
const { Content, Sider } = Layout;

const Categories = () => {
    const signedInUser: IUser = useAppSelector(userSelector);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchUsers().catch((e) => console.error(e));
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
                    <div>
                        <Divider orientation="left">Χρήστες</Divider>
                        {!users || users.length === 0 ? (
                            <h3>Δεν υπάρχουν ενεργοί χρήστες.</h3>
                        ) : (
                            <>
                                <UsersTable users={users} setUsers={setUsers}/>
                            </>
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Categories;
