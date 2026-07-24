import { Form, Input, Button, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

function InputList({ name, label }) {
    return (
        <Form.List name={name}>
            {(fields, { add, remove }) => (
                <>
                    {fields.map((field, index) => (
                        <div key={field.key}>
                            <Form.Item
                                label={index === 0 ? label : ''}
                                required={false}
                                style={{ marginBottom: 8 }}
                            >
                                <Row gutter={8}>
                                    <Col span={8}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'title']}
                                            noStyle
                                            rules={[{ required: true, message: `Please input title.` }]}
                                        >
                                            <Input placeholder={`${label} Title`} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={14}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'options']}
                                            noStyle
                                            rules={[{ required: true, message: `Please input options.` }]}
                                        >
                                            <Input placeholder={`Options (comma separated)`} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </div>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => {
                                add();
                            }}
                            block
                            icon={<PlusOutlined />}
                        >
                            Add {label}
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
}

export default InputList;
