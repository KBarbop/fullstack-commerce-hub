import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import {ICategory, IProduct, IUser} from '../../../../shared';
import {useAppSelector, userSelector} from "../../store";
import {IProductsTableProps, getProductsFilters, getCategories} from "../../utils";
import DeleteProductModal from "../modals/deleteProduct.modal.component.tsx";

function ProductsTable({ products, setProducts }: IProductsTableProps) {
    /* Modal Data */
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [productToBeDeleted, setProductToBeDeleted] = useState('');
    const setOpenModal = (open: boolean, productId: string) => {
        setOpen(open);
        setProductToBeDeleted(productId);
    };
    /* Modal Data */
    const navigate = useNavigate();
    const user: IUser = useAppSelector(userSelector);
    const productsFilters = getProductsFilters(products);

    const fetchCategories = async () => {
        try {
            const categoriesRes = await getCategories();
            if (categoriesRes.status === 200) {
                if (setCategories) {
                    setCategories(categoriesRes.data.data.categories);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchCategories().catch(e => console.error(e));
    }, []);

    const getCategoryName = (categoryId: string) => {
        if (categories && categories.length > 0) {
            if (categories.filter((category) => categoryId === category._id)[0]) {
                return categories.filter((category) => categoryId === category._id)[0].title_el;
            } else {
                return 'Undefined Category'
            }
        }
    }

    const formatPrice = (price: string): string => {
        const formatted = (parseInt(price) / 100).toFixed(2);
        return `${formatted} €`;    }

    const columns = [
        {
            title: 'Τίτλος',
            dataIndex: 'title_el',
            key: 'title_el',
            sorter: productsFilters.sorters.titleSorter,
            filters: productsFilters.filters.titleFilters,
            onFilter: productsFilters.filterFunctions.onTitleFilter,

        },
        {
            title: 'Περιγραφή',
            dataIndex: 'description_el',
            key: 'description_el',
        },
        {
            title: 'Τιμή',
            dataIndex: 'price',
            key: 'price',
            sorter: productsFilters.sorters.priceSorter,
            render: (_, record: IProduct) => (
                <span>{`${formatPrice(record.price)}`}</span>
            )
        },
        {
            title: 'Κατηγορία',
            dataIndex: 'category',
            key: 'category',
            sorter: productsFilters.sorters.categorySorter,
            filters: productsFilters.filters.categoriesFilters,
            onFilter: productsFilters.filterFunctions.onCategoryFilter,
            render: (_, record: IProduct) => (
                <span>{categories && getCategoryName(record.category)}</span>
            )
        },
        {
            title: 'Επιλογές',
            key: 'actions',
            render: (_, record: IProduct) => (
                <Space size="middle">
                    <Tooltip title="Προβολή">
                        <Button
                            type="text"
                            icon={<EyeFilled />}
                            onClick={() => {
                                navigate(`/products/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Επεξεργασία">
                        <Button
                            type="text"
                            icon={<EditFilled />}
                            onClick={() => {
                                navigate(`/edit-product/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Διαγραφή">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                setOpenModal(true, record._id || '');
                            }}
                        />
                    </Tooltip>
                    <DeleteProductModal
                        id={productToBeDeleted}
                        open={open}
                        setOpen={setOpen}
                        setProducts={setProducts}
                    />
                </Space>
            ),

        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={products} />
        </>
    );
}

export default ProductsTable;
