import { OrdersTable, Sidebar } from '../../../components';
import { useEffect, useState } from "react";
import { Button, Descriptions, DescriptionsProps, Layout } from "antd";
import { useParams } from "react-router-dom";
import { getCategories, getProductById } from "../../../utils";
import { ICategory, IProduct } from "../../../../../shared";
import styles from './product-view.module.css';
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Content, Sider } = Layout;

function ProductView() {
    const [collapsed, setCollapsed] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [product, setProduct] = useState<IProduct | null>(null);
    const productId = useParams().productId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await getProductById(productId || '');
                const product = productData.data.data.products[0];
                const categoriesData = await getCategories();
                const categories = categoriesData.data.data.categories;
                setCategories(categories);
                setProduct(product);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData().catch(e => console.error(e));
    }, [productId]);

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: product?._id,
        },
        {
            key: '2',
            label: 'Κατηγορία',
            children: categories?.find((category) => category._id === product?.category)?.title,
        },
        {
            key: '3',
            label: 'Τίτλος',
            children: product?.title_el,
        },
        {
            key: '4',
            label: 'Τιμή',
            children: product?.price,
        },
        {
            key: '5',
            label: 'Περιγραφή',
            children: product?.description_el,
        },
    ];

    const onEditProduct = () => {
        navigate(`/edit-product/${product?._id}`);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Sidebar />
            </Sider>
            <Layout>
                <Content>
                    {product && (
                        <>
                            <div className={styles['product-container']}>
                                <div className={styles['image-container']}>
                                    <img src={product?.image} alt='Product Image' />
                                </div>
                                <div className={styles['product-info-container']}>
                                    <Descriptions title="Πληροφορίες Προϊόντος" items={items} />
                                </div>
                            </div>
                            <div className={styles['ingredients-and-options-container']}>
                                <div className={styles['ingredients-container']}>
                                    <h3>Συστατικά</h3>
                                    <ul>
                                        {product.ingredients_el.map((ingredient) => (
                                            <li key={ingredient.title}>
                                                {ingredient.title}:
                                                <ul>
                                                    {ingredient.options.map((option, index) => (
                                                        <li key={index}>{option}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles['options-container']}>
                                    <h3>Επιλογές</h3>
                                    <ul>
                                        {product.options_el.map((option) => (
                                            <li key={option.title}>
                                                {option.title}:
                                                <ul>
                                                    {option.options.map((opt, index) => (
                                                        <li key={index}>{opt}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <Button
                                shape="round"
                                icon={<AppstoreAddOutlined />}
                                onClick={onEditProduct}
                            >
                                Επεξεργασία
                            </Button>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
}

export default ProductView;
