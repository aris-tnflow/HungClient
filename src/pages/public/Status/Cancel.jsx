import { Button, Result, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "~/apis/orderApi";
import Layout from "~/components/layout/Public/Layout";
import { toastError } from "~/components/toast";

const Cancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    const orderId = searchParams.get("orderCode");
    orderApi
      .putOrderId({ orderId, urlPayment: "", idOrderNew: orderId })
      .then((res) => {
        setOrder(res);
        toastError(
          "orderDel",
          "Hủy Đơn Hàng Thành Công!",
          "Bạn đã hủy đơn hàng thành công."
        );
      })
      .catch((err) => {
        toastError(
          "orderDel",
          "Đơn Hàng Không Tồn Tại!",
          "Vui lòng thử lại sau."
        );
        // navigate("/");
      });
  }, [navigate, searchParams]);

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

  return (
    <Layout title="Thanh toán thất bại">
      <section>
        <Result
          className="p-0"
          title="Hủy Đơn Hàng Thành Công!"
          subTitle="Đơn hàng đã hủy thành công. Bạn có thể xem lại đơn hàng hoặc chọn khóa học khác."
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
          <Button
            size="large"
            onClick={() => navigate("/checkout")}
            type="primary"
          >
            Xem Lại Đơn Hàng
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/courses")}
            type="primary"
          >
            Xem Khóa Học Khác
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Cancel;
