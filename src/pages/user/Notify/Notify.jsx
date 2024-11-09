import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import LayoutAdmin from '~/components/layout/Admin/Layout'
import { FormatDay, FormatDayTime } from '~/components/table/Format';
import Table from '~/components/table/Table';

const Notify = () => {
    const { notification, loading } = useSelector((state) => state.notification);
    const columns = [
        {
            title: 'Tiêu đề thông báo',
            dataIndex: 'title',
            width: '25%',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Nội dung thông báo',
            dataIndex: 'content',
            width: '25%',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: '10%',
            render: (dayCreate) => FormatDay(dayCreate),
        },
        {
            title: 'Cập nhập',
            dataIndex: 'updatedAt',
            width: '10%',
            render: (updatedAt) => FormatDayTime(updatedAt),
        },
    ];
    const dataNotify = useMemo(() =>
        notification?.newData?.map((data) => ({
            ...data,
            key: data._id,
        })),
        [notification?.newData]
    );
    return (
        <LayoutAdmin
            title='Thông báo'
            header={'THÔNG BÁO'}
        >
            <Table
                dragMode={false}
                loading={loading}
                data={dataNotify}
                columns={columns}
                colEdit={false}
                width={'12%'}
            />

        </LayoutAdmin>
    )
}

export default Notify