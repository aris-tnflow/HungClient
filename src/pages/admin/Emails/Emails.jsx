import { Button, Tooltip } from 'antd';
import { useEffect, useMemo } from 'react'
import { FaFilePen } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import LayoutAdmin from '~/components/layout/Admin/Layout'
import Table from '~/components/table/Table';
import { getEmailApi } from '~/redux/slices/Data/emailSlice';
import { baseURL } from '~/utils';

const Emails = () => {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'name',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Chức năng',
            dataIndex: 'fuction',
            editable: true,
            ellipsis: {
                showTitle: true,
            },
        },
    ];

    const dispatch = useDispatch();
    const { email, loading } = useSelector((state) => state.email);

    const dataEmail = useMemo(() =>
        email?.newData?.map((data) => ({
            ...data,
            key: data._id,
        })),
        [email?.newData]
    );

    const handlePutEmail = (data) => {
        console.log(data);
    }

    const handleDelEmail = (data) => {
        console.log(data);
    }

    useEffect(() => {
        if (loading) {
            dispatch(getEmailApi());
        }
    }, []);

    return (
        <LayoutAdmin title={'Email'} header={'Email'}>
            <Table
                dragMode={false}
                loading={loading}
                data={dataEmail}
                columns={columns}
                onSave={handlePutEmail}
                onDelete={handleDelEmail}
                width={'12%'}
                button={(record) =>
                    <>
                        <Tooltip title='Chỉnh sửa trang'>
                            <a href={`/admin/email/${record._id}`}>
                                <FaFilePen size={22} color='rgb(255 127 0)' />
                            </a>
                        </Tooltip>
                    </>
                }
            />
        </LayoutAdmin>
    )
}

export default Emails