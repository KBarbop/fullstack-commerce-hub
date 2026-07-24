import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, Avatar, Row, Col, Spin } from 'antd';
import { LockOutlined, InboxOutlined } from '@ant-design/icons';
import { IUser } from '../../../../../shared';
import styles from './log-in.module.css';
import {authorizeUserSession, loginUser} from "../../../utils";
import {logInUser, useAppDispatch} from "../../../store";


const LogIn = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const authorizeUserSessionRes =
                    await authorizeUserSession();
                if (authorizeUserSessionRes.status === 200) {
                    navigate('/orders-system');
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkSession().catch((error) => {
            console.error(error);
        });
    }, [navigate]);

    const onFinish = async (values: IUser) => {
        try {
            setLoading(true);
            const loginUserRes = await loginUser(values);
            if (loginUserRes.status === 200) {
                setLoading(false);
                const user = loginUserRes.data.data.user;
                dispatch(logInUser(user));

                navigate('/orders-system');
            } else {
                throw new Error('Wrong credentials');
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className={styles['login-container']}>
                <div>
                    <Spin tip="Loading..." spinning={loading}>
                        <Row justify="center">
                            <Col>
                                <h2> Login </h2>
                            </Col>
                        </Row>
                        <Form
                            name="login"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            scrollToFirstError
                            data-cy={'login-form'}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="email"
                                    prefix={<Avatar size="large" icon={<InboxOutlined/>}/>}
                                    data-cy={'email-input'}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    prefix={<Avatar size="large" icon={<LockOutlined/>}/>}
                                    data-cy={'password-input'}
                                />
                            </Form.Item>
                            <Row justify="center">
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        data-cy={'login-button-input'}
                                    >
                                        Login
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Form>
                    </Spin>
                </div>
            </div>
        </>
    );};
export default LogIn;
