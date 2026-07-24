import {ProductsTable, Sidebar} from '../../../components';
import { useEffect, useState } from "react";
import {Button, Descriptions, DescriptionsProps, Layout} from "antd";
import { useParams } from "react-router-dom";
import {
    getCategoryById,
    getProductsByCategory,
} from "../../../utils";
import {ICategory, IProduct} from "../../../../../shared";
import styles from './category-view.module.css'
import {AppstoreAddOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";

const { Content, Sider } = Layout;

function CategoryView() {
    const [collapsed, setCollapsed] = useState(false);
    const [category, setCategory] = useState<ICategory>();
    const [products, setProducts] = useState<IProduct[]>(null);
    const categoryId = useParams().categoryId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await getCategoryById(categoryId || '');
                const category = categoryData.data.data.categories[0];
                const productsData = await getProductsByCategory(categoryId || '');
                const products = productsData.data.data.products;
                setCategory(category);
                setProducts(products);
            } catch (e) {
                console.error(e);
            }
        }
        fetchData().catch(e => console.error(e));
    }, [categoryId]);

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: category?._id,
        },
        {
            key: '3',
            label: 'Τίτλος',
            children: category?.title_el,
        },
        {
            key: '5',
            label: 'Περιγραφή',
            children: category?.description_en,
        },
    ];

    const onEditCategory = () => {
        navigate(`/edit-category/${category?._id}`);
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
                    {
                        category &&
                        <div className={styles['category-container']}>
                            <div className={styles['category-info-container']}>
                                <Descriptions title="Πληροφορίες Κατηγορίας" items={items}/>
                            </div>
                            <div className={styles['ingredients-container']}>
                                <ProductsTable products={products} setProducts={setProducts} />
                            </div>
                            <Button
                                shape="round"
                                icon={<AppstoreAddOutlined/>}
                                onClick={onEditCategory}
                            >
                                Επεξεργασία
                            </Button>
                        </div>
                    }
                </Content>
            </Layout>
        </Layout>
    );
}

export default CategoryView;
