import { Button, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';
import UploadPlugins from '~/components/upload/Plugins';
import { useDispatch, useSelector } from 'react-redux';
import { addPluginsApi, delPluginsApi, getPluginsApi, putPluginsApi } from '~/redux/slices/Data/pluginsSlice';
import { genericDispatch } from '~/redux/utils';
import { FormatDay, FormatDayTime } from '~/components/table/Format';

const Plugins = () => {
    const dispatch = useDispatch();
    const [formPlugins] = Form.useForm();
    const [openPlugins, setOpenPlugins] = useState(false);
    const { plugins, loading } = useSelector(state => state.plugins)

    const dataGroup = useMemo(() =>
        plugins?.newData?.map((plugin) => ({
            ...plugin,
            key: plugin._id,
        })),
        [plugins]
    );

    const columnsCourse = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '15%',
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Tên Plugins',
            dataIndex: 'name',
            width: '15%',
            editable: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '15%',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Trang thái',
            dataIndex: 'status',
            type: 'select',
            width: '8%',
            editable: true,
            optionSelect: [{ label: 'Hoạt động', value: true }, { label: 'Không hoạt động', value: false }],
            render: (status) => {
                return status ? 'Hoạt động' : 'Không hoạt động'
            }
        },
        {
            title: 'Ngày thêm',
            dataIndex: 'createdAt',
            width: '8%',
            render: (day) => FormatDay(day)
        },
        {
            title: 'Hết hạn',
            dataIndex: 'expiry',
            width: '8%',
            render: (day) => {
                return day ? FormatDay(day) : 'Vĩnh viễn'
            }
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            width: '10%',
            render: (day) => FormatDayTime(day)
        },
        {
            title: 'File',
            dataIndex: 'src',
            width: '10%',
            render: (src, record) => {
                return <div className="flex justify-center">
                    <UploadPlugins
                        id={record._id}
                        name={src ? 'Cập nhập' : 'Tải lên'}
                    />
                </div>
            }
        },
    ];

    const handleAddPlugins = (data) => {
        genericDispatch(dispatch, addPluginsApi(data),
            () => {
                setOpenPlugins(false)
                formPlugins.resetFields()
            }
        );
    }

    const handlePutPlugins = (data) => {
        data._id = data.id;
        delete data.id;
        genericDispatch(dispatch, putPluginsApi(data));
    }

    const handleDelPlugins = (data) => {
        genericDispatch(dispatch, delPluginsApi(data))
    }

    useEffect(() => {
        if (loading) {
            dispatch(getPluginsApi({ page: 1, limit: localStorage.getItem('pageSize') || 10 }));
        }
    }, []);

    return (
        <LayoutAdmin
            header={'PLUGINS'}
            button={<Button onClick={() => setOpenPlugins(true)} type='primary'>Thêm Plugins</Button>}
        >
            <Table
                dragMode={false}
                Api={getPluginsApi}
                total={plugins?.totalItems}
                loading={loading}
                data={dataGroup}
                columns={columnsCourse}
                onSave={handlePutPlugins}
                onDelete={handleDelPlugins}
            />

            <Modal
                title="Thêm Plugins"
                centered
                open={openPlugins}
                onOk={() => formPlugins.submit()}
                onCancel={() => setOpenPlugins(false)}
            >
                <Form form={formPlugins} onFinish={handleAddPlugins} layout="vertical">
                    <Form.Item
                        name="name"
                        className='!mb-2'
                        label="Tên Plugins"
                        rules={[{ required: true, message: 'Nhập tên Plugins!' }]}
                    >
                        <Input
                            placeholder="Nhập tên pluigns"
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </Form.Item>

                    <Form.Item
                        name="id"
                        className='!mb-2'
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Nhập id!' }]}
                    >
                        <Input
                            placeholder="Nhập mật khẩu"
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        className='!mb-2'
                        label="Trang thái"
                        rules={[{ required: true, message: 'Chọn trang thái!' }]}
                    >
                        <Select
                            placeholder="Chọn trang thái"
                            options={[
                                {
                                    label: 'Hoạt động',
                                    value: true
                                },
                                {
                                    label: 'Không hoạt động',
                                    value: false
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        className='!mb-2'
                        label="Mô tả"
                        rules={[{ required: true, message: 'Nhập mô tả!' }]}
                    >
                        <Input
                            placeholder="Nhập tên pluigns"
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </Form.Item>

                    <Form.Item
                        name="expiry"
                        className='!mb-2'
                        label="Ngày hết hạn"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </LayoutAdmin>
    )
}

export default Plugins