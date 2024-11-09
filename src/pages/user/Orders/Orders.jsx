import { useEffect, useState, useMemo } from "react";
import { Button, Modal, Typography } from "antd";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";
import { FilterText, FilterDate } from "~/components/table/Filter";
import { useDispatch, useSelector } from "react-redux";
import { getOrderUserApi } from "~/redux/slices/User/orderSlice";
import { FormatDayTimeWithHour } from "~/components/table/Format";
import Invoice from "~/pages/admin/Orders/Invoice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orderUser, loading } = useSelector((state) => state.orderUser);
  const { user } = useSelector((state) => state.auth);

  const [openOrder, setOpenOrder] = useState(false);
  const [order, setOrder] = useState();

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      width: "10%",
      ...FilterText({ dataIndex: "orderId" }),
    },
    {
      title: "Ngày đặt đơn hàng",
      dataIndex: "createdAt",
      width: "10%",
      ...FilterDate({ dataIndex: "createdAt" }),
      render: (createdAt) => FormatDayTimeWithHour(createdAt),
    },
    {
      title: "Ngày thanh toán đơn hàng",
      dataIndex: "updatedAt",
      width: "10%",
      ...FilterDate({ dataIndex: "updatedAt" }),
      render: (updatedAt, record) => {
        if (record.status === true) {
          return (
            <Typography.Text type="danger">
              {FormatDayTimeWithHour(updatedAt)}
            </Typography.Text>
          );
        } else {
          return <>Chưa thanh toán</>;
        }
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      width: "10%",
      render: (status) =>
        status === true ? (
          <span className="text-success">Đã thanh toán</span>
        ) : (
          <span className="text-danger">Chưa thanh toán</span>
        ),
    },
    {
      title: "Thông tin đơn hàng",
      dataIndex: "info",
      width: "10%",
      render: (text, record) => (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => {
              setOpenOrder(true);
              setOrder(record);
            }}
          >
            {" "}
            Chi tiết đơn hàng{" "}
          </Button>
        </div>
      ),
    },
  ];

  const dataPages = useMemo(
    () =>
      orderUser
        ?.filter((order) => order?.status === true)
        ?.map((order) => ({
          ...order,
          key: order._id,
        })),
    [orderUser]
  );

  useEffect(() => {
    if (user._id && loading) {
      dispatch(getOrderUserApi(user._id));
    }
  }, [user]);

  return (
    <LayoutAdmin
      title="Đơn hàng"
      header={
        <>
          <div className="flex items-center">
            <h6 className="mb-0">ĐƠN HÀNG</h6>
          </div>
        </>
      }
    >
      <Table
        loading={loading}
        data={dataPages}
        columns={columns}
        colEdit={false}
        dragMode={false}
      />
      <Modal
        centered
        closeIcon={false}
        open={openOrder}
        onOk={() => setOpenOrder(false)}
        onCancel={() => setOpenOrder(false)}
        width={800}
      >
        <Invoice info={order} />
      </Modal>
    </LayoutAdmin>
  );
};

export default Orders;
