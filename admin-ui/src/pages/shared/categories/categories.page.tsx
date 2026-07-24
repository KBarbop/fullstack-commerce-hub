import {CategoriesTable, Sidebar} from "../../../components";
import {useEffect, useState} from "react";
import {Button, Divider, Layout} from "antd";
import {ICategory} from "../../../../../shared";
import {getCategories} from "../../../utils";
const { Content, Sider } = Layout;
import styles from './categories.module.css';
import {AppstoreAddOutlined, SettingFilled} from "@ant-design/icons";
import { useNavigate } from 'react-router';

const Categories = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categoriesRes = await getCategories();
                if (categoriesRes.status === 200) {
                    setCategories(categoriesRes.data.data.categories);
                    setLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchCategories().catch((e) => console.error(e));
    }, []);

    const onCreateNewCategory = () => {
        navigate(`/create-category`);
    };

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
                    <div className={styles['places-content']}>
                        <Divider orientation="left">Κατηγορίες</Divider>
                        {!categories || categories.length === 0 ? (
                            <h3>Δεν υπάρχει καμία διαθέσιμη κατηγορία.</h3>
                        ) : (
                            <>
                                <CategoriesTable categories={categories} setCategories={setCategories}/>
                            </>
                        )}
                        <Divider/>
                        <Button
                            shape="round"
                            icon={<AppstoreAddOutlined/>}
                            onClick={onCreateNewCategory}
                        >
                            Δημιουργία Κατηγορίας
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Categories;
