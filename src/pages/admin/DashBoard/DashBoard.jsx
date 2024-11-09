import { useEffect, useState } from "react";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import { Avatar, Card, Col, Row, theme, Typography } from "antd";
import {
  FaCartShopping,
  FaRegChartBar,
  FaEye,
  FaUser,
  FaArrowUp,
} from "react-icons/fa6";

import RevenueDay from "~/components/charts/RevenueDay";
import RevenueWeek from "~/components/charts/RevenueWeek";
import { FormatPrice } from "~/components/table/Format";
import { useDispatch, useSelector } from "react-redux";
import { orderApi } from "~/apis/orderApi";
import { toastError } from "~/components/toast";

const DashBoard = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({});

  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  useEffect(() => {
    // Sử dụng Promise.all để gọi tất cả các API cùng lúc
    Promise.all([
      orderApi.getStats(),
      orderApi.getWeekly(),
      orderApi.getTotal(),
    ])
      .then(([statsRes, weeklyRes, totalRes]) => {
        setLoading(false);
        setRevenue({ statsRes, weeklyRes, totalRes });
      })
      .catch(() => {
        toastError("error", "Lỗi tải dữ liệu");
      });
  }, []);

  return (
    <LayoutAdmin title={"Trang chủ"} header="TRANG CHỦ">
      <Row gutter={[24, 24]} className="overflow-hidden">
        <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }}>
          <Card
            loading={loading}
            className="ant-card-pro h-full"
            title={
              <div className="flex justify-between items-center">
                <Typography.Title level={4} className="!mb-0">
                  Tổng Doanh Thu
                </Typography.Title>
                <Avatar
                  style={{
                    backgroundColor: colorPrimary,
                  }}
                  icon={<FaRegChartBar />}
                ></Avatar>
              </div>
            }
            bordered={false}
          >
            <Typography.Title className="fw-bold" level={2}>
              {FormatPrice(revenue?.totalRes)}
            </Typography.Title>
            <Typography.Title level={5} className="!mb-0">
              Tổng doanh thu tuần này
            </Typography.Title>
            <div className="flex justify-between">
              <Typography.Title level={4} type="danger" className="!my-2">
                {FormatPrice(revenue?.weeklyRes)}
              </Typography.Title>
            </div>
          </Card>
        </Col>

        <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }}>
          <Card
            loading={loading}
            className="ant-card-pro h-full"
            title={
              <div className="flex justify-between items-center">
                <Typography.Title level={4} className="!mb-0">
                  Tổng Đơn Đặt Hàng
                </Typography.Title>
                <Avatar
                  style={{
                    backgroundColor: colorPrimary,
                  }}
                  icon={<FaCartShopping />}
                ></Avatar>
              </div>
            }
            bordered={false}
          >
            <Typography.Title className="fw-bold" level={2}>
              {revenue?.statsRes?.totalOrders} Đơn đặt hàng
            </Typography.Title>
            <Typography.Title level={5} className="!mb-0">
              Tổng đơn hàng thanh toán tuần này
            </Typography.Title>
            <div className="flex justify-between">
              <Typography.Title level={4} type="danger" className="!my-2">
                {revenue?.statsRes?.paidOrdersThisWeek} Đơn
              </Typography.Title>
            </div>
          </Card>
        </Col>

        <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }}>
          <Card
            loading={loading}
            className="ant-card-pro h-full"
            title={
              <div className="flex justify-between items-center">
                <Typography.Title level={4} className="!mb-0">
                  Truy Cập Website
                </Typography.Title>
                <Avatar
                  style={{
                    backgroundColor: colorPrimary,
                  }}
                  icon={<FaEye />}
                ></Avatar>
              </div>
            }
            bordered={false}
          >
            <Typography.Title className="fw-bold" level={2}>
              {" "}
              ---{" "}
            </Typography.Title>
            <Typography.Title level={5} className="!mb-0">
              Tổng lượng truy cập tuần này
            </Typography.Title>
            <div className="flex justify-between">
              <Typography.Title level={4} type="danger" className="!my-2">
                ---
              </Typography.Title>
            </div>
          </Card>
        </Col>

        <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }}>
          <Card
            loading={loading}
            className="ant-card-pro h-full"
            title={
              <div className="flex justify-between items-center">
                <Typography.Title level={4} className="!mb-0">
                  Người Dùng
                </Typography.Title>
                <Avatar
                  style={{
                    backgroundColor: colorPrimary,
                  }}
                  icon={<FaUser />}
                ></Avatar>
              </div>
            }
            bordered={false}
          >
            <Typography.Title className="fw-bold" level={2}>
              {revenue?.statsRes?.totalUsers} Người dùng
            </Typography.Title>
            <Typography.Title level={5} className="!mb-0">
              Tổng người dùng tuần này
            </Typography.Title>
            <div className="flex justify-between">
              <Typography.Title level={4} type="danger" className="!my-2">
                {revenue?.statsRes?.newUsersThisWeek} Người dùng
              </Typography.Title>
            </div>
          </Card>
        </Col>

        <Col span={24} className="mb-6 max-lg:mb-0">
          <Card
            loading={loading}
            title={
              <Typography.Title level={4} className="!mb-0">
                Doanh thu - Đơn hàng hôm nay
              </Typography.Title>
            }
            bordered={false}
          >
            <div style={{ height: 500 }}>
              <RevenueDay
                data={[
                  {
                    value: revenue?.statsRes?.paidOrdersToday,
                    name: "Tổng đơn đặt hàng",
                  },
                  {
                    value: revenue?.statsRes?.unpaidOrdersToday,
                    name: "Tổng đơn đặt hàng chưa thanh toán",
                  },
                  {
                    value: revenue?.statsRes?.paidOrdersThisWeek,
                    name: "Tổng đơn đặt hàng đã thanh toán",
                  },
                ]}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </LayoutAdmin>
  );
};

export default DashBoard;
