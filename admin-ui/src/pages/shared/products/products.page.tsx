import {CategoriesTable, ProductsTable, Sidebar} from "../../../components";
import {useEffect, useState} from "react";
import {Button, Divider, Layout} from "antd";
import {ICategory, IProduct} from "../../../../../shared";
import {getCategories, getProducts} from "../../../utils";
const { Content, Sider } = Layout;
import {AppstoreAddOutlined, SettingFilled} from "@ant-design/icons";
import { useNavigate } from 'react-router';

const Products = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsRes = await getProducts();
                if (productsRes.status === 200) {
                    if (setProducts) {
                        setProducts(productsRes.data.data.products);
                        setLoading(false);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchProducts().catch((e) => console.error(e));
    }, []);

    const onCreateNewProduct = () => {
        navigate(`/create-product`);
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
                    <div>
                        <Divider orientation="left">Προϊόντα</Divider>
                        {!products || products.length === 0 ? (
                            <h3>No Categories have been created.</h3>
                        ) : (
                            <>
                                <ProductsTable products={products} setProducts={setProducts}/>
                            </>
                        )}
                        <Divider/>
                        <Button
                            shape="round"
                            icon={<AppstoreAddOutlined/>}
                            onClick={onCreateNewProduct}
                        >
                            Δημιουργία Προϊόντος
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Products;
