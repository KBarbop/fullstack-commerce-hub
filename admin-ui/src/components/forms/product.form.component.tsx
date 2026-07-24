import { useState, useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    Spin,
    Result,
    Select,
    InputNumber,
    Upload,
    message,
    Checkbox,
} from 'antd';
import {
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { ICategory, IProduct } from '../../../../shared';
import styles from './form.module.css';
import {
    createNewProduct,
    editProduct,
    getCategories,
    getProductById,
} from "../../utils";
import TextArea from "antd/es/input/TextArea";
import { useLocation, useParams } from "react-router-dom";
import InputList from "./inputList/inputList.component.tsx";

function ProductForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('none');
    const [price, setPrice] = useState(0);
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);
    const isEditMode = useLocation().pathname.includes('edit-product');
    const productId = useParams().productId;
    const [product, setProduct] = useState<IProduct>();

    const formInitialValues = isEditMode? {

    } : {
        remember: true,
    };

    useEffect(() => {
        const fetchValues = async () => {
            try {
                form.setFieldsValue(formInitialValues);
                if (isEditMode) {
                    const categoryRes = await getProductById(productId || '');
                    const formValues = categoryRes.data.data.products[0];
                    setProduct(categoryRes.data.data.products[0]);
                    console.log(formValues)
                    setSelectedCategory(formValues.category);
                    setPrice(parseFloat(formValues.price) / 100 || 0);
                    const ingredientsEn = formValues.ingredients_en.map(ingredient => ({
                        title: ingredient.title,
                        options: ingredient.options.join(', '), // Assuming options are strings or an array
                    }));

                    const ingredientsEl = formValues.ingredients_el.map(ingredient => ({
                        title: ingredient.title,
                        options: ingredient.options.join(', '),
                    }));

                    const optionsEn = formValues.options_en.map(option => ({
                        title: option.title,
                        options: option.options.join(', '),
                    }));

                    const optionsEl = formValues.options_el.map(option => ({
                        title: option.title,
                        options: option.options.join(', '),
                    }));
                    console.log({
                        ...formValues,
                        ingredients_en: ingredientsEn,
                        ingredients_el: ingredientsEl,
                        options_en: optionsEn,
                        options_el: optionsEl,
                        remember: true,
                    })

                    form.setFieldsValue({
                        ...formValues,
                        ingredients_en: ingredientsEn,
                        ingredients_el: ingredientsEl,
                        options_en: optionsEn,
                        options_el: optionsEl,
                        remember: true,
                    });
                }
                const categoriesRes = await getCategories();
                if (categoriesRes.status === 200) {
                    setCategories(categoriesRes.data.data.categories);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchValues().catch(e => console.error(e));
    }, []);

    const onFinish = async (values: IProduct) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title_en', values.title_en);
            formData.append('title_el', values.title_el);
            formData.append('description_en', values.description_en);
            formData.append('description_el', values.description_el);
            formData.append('category', selectedCategory);
            formData.append('price', price.toString());

            console.log(values)

            // // Process ingredients
            // const processedIngredientsEn = values.ingredients_en?.map(item => ({
            //     title: item.title,
            //     options: Array.isArray(item.options)
            //         ? item.options.map(option => option.trim())
            //         : [],
            // }));
            //
            // const processedIngredientsEl = values.ingredients_el?.map(item => ({
            //     title: item.title,
            //     options: Array.isArray(item.options)
            //         ? item.options.map(option => option.trim())
            //         : [],
            // }));
            //
            // // Process options
            // const processedOptionsEn = values.options_en?.map(item => ({
            //     title: item.title,
            //     options: Array.isArray(item.options)
            //         ? item.options.map(option => option.trim())
            //         : [],
            // }));
            //
            // const processedOptionsEl = values.options_el?.map(item => ({
            //     title: item.title,
            //     options: Array.isArray(item.options)
            //         ? item.options.map(option => option.trim())
            //         : [],
            // }));
            //
            formData.append('ingredients_en', JSON.stringify(values.ingredients_en));
            formData.append('ingredients_el', JSON.stringify(values.ingredients_el));
            formData.append('options_en', JSON.stringify(values.options_en));
            formData.append('options_el', JSON.stringify(values.options_el));

            if (image) {
                formData.append('image', image);
            }

            const response = isEditMode
                ? await editProduct(productId || '', formData as IProduct)
                : await createNewProduct(formData as IProduct);

            if (response.status === 200) {
                setSuccess(true);
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            setSuccess(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const onPriceChange = (value) => {
        const roundedUpPrice = value * 100;
        setPrice(roundedUpPrice);
    };

    return (
        <div className={styles['form-container']}>
            {success ? (
                <Result
                    status="success"
                    title={isEditMode ? 'Επεξεργαστήκατε το προϊόν επιτυχώς!' : 'Δημιουργήσατε ένα νέο προϊόν επιτυχώς!'}
                    data-cy={'successfull-result'}
                />
            ) : (
                <></>
            )}

            {!success && (
                <Spin tip="Loading..." spinning={loading}>
                    <Row justify="center">
                        <Col>
                            <h2> {isEditMode ? 'Επεξερασία Προϊόντος' : 'Δημιουργία Προϊόντος'} </h2>
                        </Col>
                    </Row>

                    <Form
                        name="register"
                        form={form}
                        layout="vertical"
                        initialValues={formInitialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        scrollToFirstError
                        className={styles['form']}
                        data-cy={'product-form'}
                    >
                        <Form.Item
                            name="title_en"
                            label="Τίτλος (English)"
                            rules={[{ required: true, message: 'Please provide a title in English.' }]}
                            data-cy={'product-title-en-form-item'}
                        >
                            <Input placeholder="Title in English" data-cy={'product-title-en-input'} />
                        </Form.Item>

                        <Form.Item
                            name="title_el"
                            label="Τίτλος (Ελληνικά)"
                            rules={[{ required: true, message: 'Please provide a title in Greek.' }]}
                            data-cy={'product-title-el-form-item'}
                        >
                            <Input placeholder="Title in Greek" data-cy={'product-title-el-input'} />
                        </Form.Item>

                        <Form.Item
                            name="description_en"
                            label="Περιγραφή (English)"
                            data-cy={'product-description-en-form-item'}
                        >
                            <TextArea placeholder="Description in English" rows={10} data-cy={'product-description-en-input'} />
                        </Form.Item>

                        <Form.Item
                            name="description_el"
                            label="Περιγραφή (Ελληνικά)"
                            data-cy={'product-description-el-form-item'}
                        >
                            <TextArea placeholder="Description in Greek" rows={10} data-cy={'product-description-el-input'} />
                        </Form.Item>

                        {categories && categories.length > 0 && (
                            <Form.Item name="category" label="Κατηγορία" data-cy={'product-category-form-item'}>
                                <Select
                                    defaultValue={categories[0].title_el}
                                    style={{ width: 240 }}
                                    data-cy={'product-category-input'}
                                    onChange={handleCategoryChange}
                                    options={categories.map((category) => ({
                                        value: category._id,
                                        label: category.title_el,
                                    }))}
                                />
                            </Form.Item>
                        )}

                        <Form.Item name="price" label="Τιμή" data-cy={'product-price-form-item'} rules={[{ required: true, message: 'Please provide a price for the product.' }]}>
                            <InputNumber
                                min={0}
                                max={10000}
                                step="0.01"
                                value={price}
                                defaultValue={price}
                                data-cy={'product-price-input'}
                                onChange={onPriceChange}
                            />
                        </Form.Item>

                        <Form.Item name="ingredients_en" label='Συστατικά (English)' data-cy={'product-ingredients-en-form-item'}>
                            <InputList name="ingredients_en" />
                        </Form.Item>

                        <Form.Item name="ingredients_el" label='Συστατικά (Ελληνικά)' data-cy={'product-ingredients-el-form-item'}>
                            <InputList name="ingredients_el" />
                        </Form.Item>

                        <Form.Item name="options_en" label='Επιλογές (English)' data-cy={'product-options-en-form-item'}>
                            <InputList name="options_en" />
                        </Form.Item>

                        <Form.Item name="options_el" label='Επιλογές (Ελληνικά)' data-cy={'product-options-el-form-item'}>
                            <InputList name="options_el" />
                        </Form.Item>
                        {
                            product && product.image &&
                            <img src={product.image} />
                        }
                        <Form.Item name="image" label="Φωτογραφία">

                            <Upload
                                name="file"
                                accept="image/*"
                                beforeUpload={file => {
                                    setImage(file);
                                    return false;
                                }}
                                maxCount={1}
                                data-cy={'product-image-upload'}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                data-cy={'product-form-submit'}
                            >
                                {isEditMode ? 'Ενημέρωση' : 'Δημιουργία'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            )}
        </div>
    );
}

export default ProductForm;
