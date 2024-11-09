import "./Invoice.css";
import { Col, Divider, Row, Typography } from "antd";
import { FormatDayTimeWithHour, FormatPrice } from "~/components/table/Format";

const Invoice = ({ info }) => {
  const priceTotal = (priceProducts) => {
    let total = 0;
    priceProducts.map((item) => {
      total += item.price;
    });
    return total;
  };
  return (
    <>
      <div className="invoice-wrapper">
        <div className="invoice">
          <div className="invoice-container">
            <div className="invoice-head">
              <Typography.Title type="warning" level={3}>
                Thông Tin Hóa Đơn
              </Typography.Title>
              <Row>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Mã Hóa Đơn:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.orderId}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Trạng Thái:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.status === true ? (
                        <Typography.Text className="!mb-0 text-order">
                          Đã Thanh Toán
                        </Typography.Text>
                      ) : (
                        <Typography.Text className="!mb-0 text-order">
                          Chưa Thanh Toán
                        </Typography.Text>
                      )}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Ngày Đặt Hàng:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {FormatDayTimeWithHour(info.createdAt)}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Ngày Thanh Toán:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {FormatDayTimeWithHour(info.updatedAt)}
                    </Typography.Text>
                  </div>
                </Col>
              </Row>

              <Divider />
              <Typography.Title type="warning" level={3}>
                Thông Tin Khách Hàng
              </Typography.Title>
              <Row>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Họ Và Tên:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.name}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Số Điện Thoại:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.phone}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Email:
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.email}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Xã/Phường:{" "}
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.ward}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Quận/Huyện:{" "}
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.district}
                    </Typography.Text>
                  </div>
                </Col>
                <Col md={{ span: 12 }} span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Tỉnh/Thành Phố:{" "}
                    </Typography.Title>
                    <Typography.Text className="!mb-1 text-order">
                      {info.province}
                    </Typography.Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="flex items-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Địa Chỉ:{" "}
                      <span>
                        {" "}
                        <Typography.Text className="!mb-1 text-order">
                          {info.address}
                        </Typography.Text>
                      </span>
                    </Typography.Title>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="flex flex-col justify-center gap-1">
                    <Typography.Title className="!mb-1 text-order" level={5}>
                      Ghi Chú:{" "}
                      <span>
                        <Typography.Text className="!mb-1 text-order">
                          {info?.note || (
                            <>
                              <Typography.Text type="danger">
                                Không có
                              </Typography.Text>
                            </>
                          )}
                        </Typography.Text>
                      </span>
                    </Typography.Title>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />
            <Typography.Title type="warning" level={3}>
              Khóa Học Đã Mua
            </Typography.Title>
            <div className="overflow-view pt-2">
              <div className="invoice-body">
                <table>
                  <thead>
                    <tr>
                      <td className="text-bold">Mã Khóa Học</td>
                      <td className="text-bold">Tên Khóa Học</td>
                      <td className="text-bold">Giá Tiền</td>
                    </tr>
                  </thead>
                  {info.product.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td className="text-start">
                          <Typography.Text type="danger">
                            {FormatPrice(item.price)}
                          </Typography.Text>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
                <div className="invoice-body-bottom">
                  <div className="invoice-body-info-item">
                    <div className="info-item-td text-end text-bold">
                      Thành Tiền:
                    </div>
                    <Typography.Text
                      strong
                      type="danger"
                      className="info-item-td text-end"
                    >
                      {FormatPrice(priceTotal(info.product))}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-foot text-center">
              <p>
                <span className="text-bold text-center">NOTE:&nbsp;</span>This
                is computer generated receipt and does not require physical
                signature.
              </p>
            </div>

            <div className="invoice-foot text-center">
              {info.status === true ? (
                <Typography.Title level={5} className="!!mb-0" type="danger">
                  Đã Thanh Toán
                </Typography.Title>
              ) : (
                <Typography.Title level={5} className="!!mb-0" type="danger">
                  Chưa Thanh Toán
                </Typography.Title>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
