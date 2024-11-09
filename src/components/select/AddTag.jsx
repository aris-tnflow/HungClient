import { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Form } from 'antd';

let index = 0;

const AddTag = () => {
    const [items, setItems] = useState(['jack', 'lucy']);
    const [svgCodes, setSvgCodes] = useState({});
    const inputRef = useRef(null);

    // Ant Design Form
    const [form] = Form.useForm();

    const addItem = (values) => {
        const { name, svgCode } = values;
        const newItem = name || `New item ${index++}`;
        setItems([...items, newItem]);
        setSvgCodes({ ...svgCodes, [newItem]: svgCode }); // Lưu mã SVG cho item mới
        form.resetFields();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <Select
            style={{
                width: 300,
            }}
            mode='multiple'
            placeholder="custom dropdown render"
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider
                        style={{
                            margin: '8px 0',
                        }}
                    />
                    <Form form={form} onFinish={addItem} layout="vertical">
                        <div className="flex gap-2 mb-2">
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Please input name!' }]}
                            >
                                <Input
                                    placeholder="Nhập tên thông tin"
                                    ref={inputRef}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                            </Form.Item>

                            <Form.Item
                                name="svgCode"
                                rules={[{ required: true, message: 'Please input SVG icon code!' }]}
                            >
                                <Input
                                    placeholder="Nhập mã SVG icon"
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                            </Form.Item>
                        </div>

                        <Button
                            className="w-full"
                            type="primary"
                            ghost
                            htmlType="submit"
                            icon={<PlusOutlined />}
                        >
                            Add item
                        </Button>
                    </Form>
                </>
            )}
            options={items.map((item) => ({
                label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {svgCodes[item] && (
                            <div
                                dangerouslySetInnerHTML={{ __html: svgCodes[item] }}
                                style={{ width: '20px', marginRight: '8px' }}
                            />
                        )}
                        {item}
                    </div>
                ),
                value: item,
            }))}
        />
    );
};

export default AddTag;
