import { useState, useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    Spin,
    Result,
} from 'antd';
import {
    SaveOutlined,
} from '@ant-design/icons';
import {ICategory} from '../../../../shared';
import styles from './form.module.css';
import {createNewCategory, editCategory, getCategoryById} from "../../utils";
import TextArea from "antd/es/input/TextArea";
import {useLocation, useParams} from "react-router-dom";

function CategoryForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form] = Form.useForm();
    const isEditMode = useLocation().pathname.includes('edit-category');
    const categoryId = useParams().categoryId;

    const formInitialValues =  {
        remember: true,
    };

    useEffect(() => {
        const fetchValues = async () => {
            try {
                form.setFieldsValue(formInitialValues);
                if(isEditMode) {
                    const categoryRes = await getCategoryById(categoryId || '');
                    const formValues = categoryRes.data.data.categories[0];
                    form.setFieldsValue({
                        ...formValues,
                        remember: true,
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchValues().catch(e => console.error(e));
    }, []);

    const onFinish = async (values: ICategory) => {
        try {
            setLoading(true);
            //TO-DO: Add image upload functionality
            if (isEditMode) {
                const categoryResponse = await editCategory(categoryId || '', {...values, image: 'image.jpg'});
                if (categoryResponse.status === 200) {
                    setSuccess(true);
                    setLoading(false);
                } else {
                    throw new Error('Wrong credentials 2');
                }
            } else {
                const categoryResponse = await createNewCategory({...values, image: 'image.jpg'});
                if (categoryResponse.status === 200) {
                    setSuccess(true);
                    setLoading(false);
                } else {
                    throw new Error('Wrong credentials 2');
                }
            }
        } catch (error) {
            setSuccess(false);
            setLoading(true);
            console.error(error);
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={styles['form-container']}>
            {success ? (
                <Result
                    status="success"
                    title={isEditMode ? 'Επεξεργαστήκατε την κατηγορία επιτυχώς!' : 'Δημιουργήσατε μία νέα κατηγορία επιτυχώς!'}
                    data-cy={'successfull-result'}
                />
            ) : (
                <></>
            )}

            {!success && (
                <Spin tip="Loading..." spinning={loading}>
                    <Row justify="center">
                        <Col>
                            <h2> {isEditMode ? 'Επεξεργασία Κατηγορίας' : 'Δημιουργία Κατηγορίας'} </h2>
                        </Col>
                    </Row>

                    <Form
                        name="categoryForm"
                        form={form}
                        layout="vertical"
                        initialValues={formInitialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        scrollToFirstError
                        className={styles['form']}
                        data-cy={'category-form'}
                    >
                        <Form.Item
                            name="title_en"
                            label="Title (English)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide a category title in English.',
                                },
                            ]}
                            data-cy={'category-title-en-form-item'}
                        >
                            <Input
                                placeholder="Title (English)"
                                data-cy={'category-title-en-input'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="title_el"
                            label="Title (Greek)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide a category title in Greek.',
                                },
                            ]}
                            data-cy={'category-title-el-form-item'}
                        >
                            <Input
                                placeholder="Title (Greek)"
                                data-cy={'category-title-el-input'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description_en"
                            label="Description (English)"
                            data-cy={'category-description-en-form-item'}
                        >
                            <TextArea
                                placeholder="Description (English)"
                                rows={10}
                                data-cy={'category-description-en-input'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description_el"
                            label="Description (Greek)"
                            data-cy={'category-description-el-form-item'}
                        >
                            <TextArea
                                placeholder="Description (Greek)"
                                rows={10}
                                data-cy={'category-description-el-input'}
                            />
                        </Form.Item>

                        <Row justify="center">
                            <Col>
                                <Form.Item data-cy={'submit-form-item'}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        shape="round"
                                        data-cy={'submit-button-input'}
                                    >
                                        {isEditMode ? 'Επεξεργασία' : 'Δημιουργία'}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            )}
        </div>
    );
}

export default CategoryForm;
