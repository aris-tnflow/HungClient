import { Button, Result, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "~/apis/orderApi";

import Layout from "~/components/layout/Public/Layout";
import { toastError, toastSuccess } from "~/components/toast";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderCode");
  const [order, setOrder] = useState();

  const columns = [
    {
      title: "Id",
      dataIndex: "orderId",
      key: "name",
      width: "6%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15%",
    },
    {
      title: "Tỉnh/Thành Phố",
      dataIndex: "province",
      key: "address",
      width: "13%",
    },
    {
      title: "Quận/Huyện",
      dataIndex: "district",
      key: "district",
      width: "13%",
    },
    {
      title: "Phường/Xã",
      dataIndex: "ward",
      key: "ward",
      width: "13%",
    },
    {
      title: "Khóa học",
      key: "product",
      dataIndex: "product",
      render: (products) => (
        <>
          {products?.map((product) => (
            <div className="flex flex-col my-1" key={product._id}>
              <Tag color="warning">
                {product.name} - {product.quantity} x{" "}
                {product.price.toLocaleString()}₫
              </Tag>
            </div>
          ))}
        </>
      ),
    },
  ];

  useEffect(() => {
    orderApi
      .getOrderId(orderId)
      .then((res) => {
        setOrder(res);
        toastSuccess(
          "orderSuc",
          "Thanh Toán Đơn Hàng Thành Công!",
          "Bạn đã thanh toán đơn hàng thành công."
        );
      })
      .catch((err) => {
        toastError(
          "orderSuc",
          "Đơn Hàng Không Tồn Tại!",
          "Vui lòng thử lại sau."
        );
        navigate("/");
      });
  }, [navigate, searchParams, orderId]);

  return (
    <Layout title="Thanh toán thành công">
      <section>
        <Result
          className="p-0"
          status="success"
          title={`Đơn hàng ${orderId} của bạn đã được thanh toán thành công!`}
          subTitle={
            <>
              Vui lòng truy cập!{" "}
              <Typography.Link href="/user/orders">
                Trang đơn hàng của bạn
              </Typography.Link>{" "}
              để xem chi tiết đơn hàng!
            </>
          }
        />
        <Table
          className="mt-6"
          columns={columns}
          scroll={{ x: 1200, y: "calc(100vh - 255px)" }}
          dataSource={[order]}
          pagination={false}
          footer={() => <div className="h-5"></div>}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Button type="primary" onClick={() => navigate("/courses")} key="buy">
            Mua thêm khóa học
          </Button>
          ,
          <Button
            type="primary"
            onClick={() => navigate("/user")}
            key="console"
          >
            Đến trang khóa học của bạn
          </Button>
          ,
        </div>
      </section>
    </Layout>
  );
};

export default Success;
