import {CancelOrderModal, CompleteOrderModal, ProductForm, Sidebar} from '../../../components';
import { useEffect, useState } from "react";
import { Button, Descriptions, DescriptionsProps, Divider, InputNumber, InputNumberProps, Layout } from "antd";
import { useParams } from "react-router-dom";
import {ICategory, ICustomer, IOrder, IProduct, IUser} from "../../../../../shared";
import {
    cancelOrder,
    completeOrder,
    extractDate, extractFullAddress, extractTime,
    getOrderById,
    getProducts, getUserById,
    setOrderEstimatedTime
} from "../../../utils";
import styles from './order-view.module.css';
import { AppstoreAddOutlined } from "@ant-design/icons";
import DeleteProductModal from "../../../components/modals/deleteProduct.modal.component.tsx";

const { Content, Sider } = Layout;

const formatPrice = (price: number): string => {
    return (price / 100).toFixed(2) + ' €';
};

function OrderView() {
    const orderId = useParams().orderId;
    const [collapsed, setCollapsed] = useState(false);
    const [order, setOrder] = useState<IOrder>();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [estimatedTime, setEstimatedTime] = useState(30);
    const [user, setUser] = useState<ICustomer>();
    const [orderToBeCompleted, setOrderToBeCompleted] = useState('');
    const [orderToBeCancelled, setOrderToBeCancelled] = useState('');
    /* Modal Data */
    const [open, setOpen] = useState(false);

    /* Modal Data */
    /* Modal Data */
    const [openCancel, setOpenCancel] = useState(false);

    /* Modal Data */

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional for smooth scrolling
        });
    };

    const fetchData = async () => {
        const orderRes = await getOrderById(orderId || '');
        setOrder(orderRes.data.data.orders[0]);
        const productsRes = await getProducts();
        const userRes = await getUserById(orderRes.data.data.orders[0]._user);
        setUser(userRes.data.data.user);
        setProducts(productsRes.data.data.products);
    }

    useEffect(() => {
        fetchData().catch(e => console.error(e));
    }, [orderId]);

    const items: DescriptionsProps['items'] = order ? [
        {
            key: '0',
            label: 'Χρήστης',
            children: user?.username,
        },
        {
            key: '1',
            label: 'Status',
            children: order.status,
        },
        {
            key: '5',
            label: 'Συνολικό Ποσό',
            children: formatPrice(Number.parseInt(order.totalPrice)),
        },
        {
            key: '6',
            label: 'Τρόπος Πληρωμής',
            children: order.paymentWay,
        },
    ] : [];

    const orderTimeItems: DescriptionsProps['items'] = order ? [
        {
            key: '2',
            label: 'Ώρα Λήψης',
            children: <div>
                <p>{`${extractDate(order.timeReceived)}`}</p>
                <p>{`${extractTime(order.timeReceived)}`}</p>
            </div>
        },
        {
            key: '3',
            label: 'Ώρα Ολοκλήρωσης',
            children: order.timeCompleted !== 'N/A' ? <div>
                <p>{`${extractDate(order.timeCompleted)}`}</p>
                <p>{`${extractTime(order.timeCompleted)}`}</p>
            </div> : <div><p>N/A</p></div>,
        },
        {
            key: '4',
            label: 'Εκτιμώμενος Χρόνος Ολοκλήρωσης',
            children: order.estimatedTime,
        },
    ] : [];

    const orderAddressItems: DescriptionsProps['items'] = order ? [
        {
            key: '2',
            label: 'Διεύθυνση',
            children: extractFullAddress(order),
        },
        {
            key: '3',
            label: 'Κουδούνι',
            children: order.address.bellName,
        },
        {
            key: '4',
            label: 'Σχόλιο',
            children: order.address.comment,
        },
    ] : [];

    const getProductName = (productId: string) => {
        return products?.filter((product) => {
            return product._id === productId;
        })[0].title;
    }

    const onCompleteOrder = async () => {
        setOpen(true);
    }

    const onCancelOrder = async () => {
        try {
            await cancelOrder(orderId || '');
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    }

    const onSetEstimatedTime = async () => {
        try {
            await setOrderEstimatedTime(orderId || '', { estimatedTime });
            await fetchData();
            scrollToTop();
        } catch (e) {
            console.error(e);
        }
    }

    const onEstimatedTimeChange: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setEstimatedTime(value);
        } else {
            setEstimatedTime(0);
        }
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
                        order &&
                        <div className={styles['order-view-container']}>
                            <div className={styles['order-basic-details']}>
                                <Descriptions title="Στοιχεία Παραγγελίας" items={items} />
                                <Divider />
                                <Descriptions items={orderTimeItems} />
                                <Divider />
                                <Descriptions items={orderAddressItems} />
                            </div>
                            <Divider />
                            <h3>Προϊόντα</h3>
                            <div className={styles['order-products-container']}>

                                {
                                    order.products.map((product) => {
                                        return <div className={styles['order-product-container']} key={product.product}>
                                            <div className={styles['order-product-container-row']}>
                                                <div className={styles['order-product-container-col']}>
                                                    <h5>Προϊόν</h5>
                                                    {products.length > 0 && getProductName(product.product)}
                                                </div>
                                                <div className={styles['order-product-container-col']}>
                                                    <h5>Ποσότητα</h5>
                                                    {product.quantity}
                                                </div>
                                                <div className={styles['order-product-container-col']}>
                                                    <h5>Τιμή</h5>
                                                    {formatPrice(Number.parseInt(product.price))}
                                                </div>
                                            </div>
                                            <div className={styles['order-product-ingredients']}>
                                                <h5>
                                                    Συστατικά
                                                </h5>
                                                {
                                                    product.ingredients.map((ingredient) => {
                                                        return <p key={ingredient}>{ingredient}</p>
                                                    })
                                                }
                                            </div>
                                            <div className={styles['order-product-ingredients']}>
                                                <h5>
                                                    Επιλογές
                                                </h5>
                                                {
                                                    product.options.map((option) => {
                                                        return <p key={option}>{option}</p>
                                                    })
                                                }
                                            </div>
                                            <Divider/>
                                        </div>
                                    })
                                }
                            </div>
                            <div className={styles['controls-container']}>
                                <div className={styles['estimated-time-controls-container']}>
                                    <p>Ορίστε τον εκτιμώμενο χρόνο παράδοσης</p>
                                    <InputNumber
                                        addonAfter="Λεπτά"
                                        defaultValue={30}
                                        onChange={onEstimatedTimeChange}
                                    />
                                    <Button
                                        shape="round"
                                        icon={<AppstoreAddOutlined/>}
                                        onClick={onSetEstimatedTime}
                                    >
                                        Ορισμός
                                    </Button>
                                </div>
                                <div className={styles['order-controls-container']}>
                                    <Button
                                        shape="round"
                                        icon={<AppstoreAddOutlined/>}
                                        onClick={() => {
                                            setOpen(true);
                                            setOrderToBeCompleted(order?._id || '');
                                        }}
                                    >
                                        Ολοκλήρωση Παραγγελίας
                                    </Button>
                                    <Button
                                        shape="round"
                                        danger
                                        icon={<AppstoreAddOutlined/>}
                                        onClick={() => {
                                            setOpenCancel(true);
                                            setOrderToBeCancelled(order?._id || '');
                                        }}
                                    >
                                        Ακύρωση Παραγγελίας
                                    </Button>
                                </div>
                            </div>


                        </div>
                    }
                </Content>
                <CompleteOrderModal
                    id={orderToBeCompleted}
                    open={open}
                    setOpen={setOpen}
                    fetchData={fetchData}
                    scrollToTop={scrollToTop}
                />
                <CancelOrderModal
                    id={orderToBeCancelled}
                    open={openCancel}
                    setOpen={setOpenCancel}
                    fetchData={fetchData}
                    scrollToTop={scrollToTop}
                />
            </Layout>
        </Layout>
    );
}

export default OrderView;
