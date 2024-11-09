import { Card, Col, Form, Input, Row, Select, Typography } from 'antd'
import React from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
const HomePage = () => {
    const [formUser] = Form.useForm();

    const handlePutPassword = (values) => {
    }

    return (
        <LayoutAdmin
            title='Quên mật khẩu'
            header={'QUÊN MẬT KHẨU'}
        >
            <Form
                form={formUser}
                name="customForm"
                layout="vertical"
                onFinish={handlePutPassword}
            >
                <Row gutter={[18, 18]}>
                    <Col span={24}>
                        <Card>
                            <Row gutter={[14, 14]}>
                                <Col span={14}>
                                    <Form.Item
                                        className='mb-0'
                                        name="forgotPassword"
                                        label="Email đăng ký tài khoản"
                                        rules={[{ required: true, message: 'Nhập email đăng ký tài khoản!' }]}
                                    >
                                        <Input.Password
                                            size='large'
                                            placeholder='Nhập email đăng ký tài khoản'
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </LayoutAdmin>
    )
}

export default HomePage