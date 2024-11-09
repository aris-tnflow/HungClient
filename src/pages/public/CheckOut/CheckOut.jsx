import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import Layout from "~/components/layout/Public/Layout";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormatPrice } from "~/components/table/Format";
import { paymentApi } from "~/apis/paymentApi";
import { orderApi } from "~/apis/orderApi";
import { keyBankApi } from "~/apis/keyBankApi";
import { provinceApi } from "~/apis/provinceVNApi";
import { toastError, toastLoading } from "~/components/toast";

const Payment = () => {
  const navigate = useNavigate();
  const [formInfo] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);
  const { info } = useSelector((state) => state.info);
  const { cartDetail } = useSelector((state) => state.cartDetail);
  const dataCourses = useMemo(
    () =>
      cartDetail?.map((course) => ({
        ...course,
        price: course.price - (course.price * course.sale) / 100,
      })),
    [cartDetail]
  );

  const [keyBank, setKeyBank] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [order, setOrder] = useState();

  const [selectedItems, setSelectedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);

  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const finalPrice = item.salePrice || item.price;
      return sum + finalPrice;
    }, 0);
  };

  useEffect(() => {
    if (cartDetail?.length) {
      const updatedCartDetail = cartDetail.map((item) => {
        return {
          ...item,
          price: item.price - (item.price * item.sale) / 100,
        };
      });
      setSelectedItems(updatedCartDetail);
    }
  }, [cartDetail]);

  const handleItemSelect = (item, checked) => {
    const newSelectedItems = checked
      ? [...selectedItems, item]
      : selectedItems.filter((selected) => selected._id !== item._id);

    setSelectedItems(newSelectedItems);

    setIndeterminate(
      newSelectedItems.length > 0 &&
        newSelectedItems.length < dataCourses.length
    );
    setCheckAll(newSelectedItems.length === dataCourses.length);
  };

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    setSelectedItems(event.target.checked ? dataCourses : []);
    setIndeterminate(false);
    setCheckAll(event.target.checked);
  };

  const handleCheckPayment = (values) => {
    if (selectedItems.length === 0) {
      toastError("", "Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    setOpenConfirm(true);
    setOrder(values);
  };

  const handlePayment = async (values) => {
    if (selectedItems.length === 0) {
      toastError(
        "",
        "Không Thể Đặt Hàng",
        "Vui lòng chọn ít nhất một sản phẩm để thanh toán"
      );
      return;
    }

    toastLoading("", "Đang Xử Lý Thanh Toán");
    const { name } = user;

    const selectedProducts = selectedItems.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.salePrice || item.price,
      quantity: 1,
    }));

    const orderId = Number(
      String(Date.now()).slice(-3) +
        String(Math.floor(Math.random() * 1000)).slice(-3)
    );

    values.product = selectedProducts;
    values.idUser = user._id;

    try {
      const response = await orderApi.check({
        id: user._id,
        product: selectedProducts,
        data: values,
      });

      if (response.urlPayment === "") {
        const { url } = await paymentApi.Bank({
          id: orderId,
          product: selectedProducts,
          total: calculateTotal(selectedItems),
          name: name,
        });

        orderApi
          .putOrderId({
            orderId: response.orderId,
            urlPayment: url,
            idOrderNew: orderId,
          })
          .then((response) => {
            setOrder(response);
            window.location.href = url;
          });
      } else {
        window.location.href = response.urlPayment;
      }
    } catch (error) {
      const { url } = await paymentApi.Bank({
        id: orderId,
        product: selectedProducts,
        total: calculateTotal(selectedItems),
        name: name,
      });

      values.urlPayment = url;
      values.orderId = orderId;

      orderApi
        .add(values)
        .then(() => {
          window.location.href = url;
        })
        .catch(() => {
          toastError("", "Thanh toán thất bại");
        });
    }
  };

  useEffect(() => {
    if (user?.courses) {
      console.log(cartDetail);
      console.log(user?.courses);
    }
  }, [cartDetail, user]);

  useEffect(() => {
    keyBankApi.get().then((response) => {
      setKeyBank(response[0]);
    });
  }, []);

  useEffect(() => {
    provinceApi.province().then((response) => {
      const formattedProvinces = response.map((item) => ({
        label: item.name,
        value: item.name,
        key: item.code,
      }));
      setProvince(formattedProvinces);
    });
  }, []);

  useEffect(() => {
    if (user?._id) {
      formInfo.setFieldsValue({
        name: user.name,
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <Layout title="Thanh toán">
      <section>
        <Row gutter={[24, 24]}>
          <Col
            span={24}
            xl={{ span: 17 }}
            lg={{ span: 15 }}
            md={{ span: 24, order: 1 }}
            xs={{ order: 2 }}
          >
            <Card>
              <Form
                scrollToFirstError={true}
                form={formInfo}
                name="customForm"
                layout="vertical"
                onFinish={handleCheckPayment}
              >
                <Form.Item
                  className="mb-4"
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Nhập họ và tên!" }]}
                >
                  <Input size="large" placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                  className="mb-4"
                  name="phone"
                  label="Số điện thoại"
                  validateFirst
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      pattern: /^0/,
                      message: "Số điện thoại phải bắt đầu bằng số 0!",
                    },
                    {
                      len: 10,
                      message: "Số điện thoại phải có đúng 10 số!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập số điện thoại"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    onCopy={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item
                  className="mb-4"
                  name="email"
                  label="Email"
                  validateFirst
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không đúng định dạng!" },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email" />
                </Form.Item>

                <Row gutter={[24]}>
                  <Col md={{ span: 8 }} span={24}>
                    <Form.Item
                      className="mb-2"
                      name="province"
                      label="Tỉnh/Thành phố"
                      rules={[
                        {
                          required: true,
                          message: "Chọn tỉnh hoặc thành phố!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="label"
                        size="large"
                        className="mb-2"
                        placeholder="Chọn tỉnh hoặc thành phố"
                        options={province}
                        onChange={(value, record) => {
                          provinceApi.district(record.key).then((response) => {
                            const formattedDistricts = response
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((item) => ({
                                label: item.name,
                                value: item.name,
                                key: item.code,
                              }));
                            setDistrict(formattedDistricts);
                            formInfo.setFieldsValue({ district: undefined });
                            formInfo.setFieldsValue({ ward: undefined });
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={{ span: 8 }} span={24}>
                    <Form.Item
                      className="mb-2"
                      name="district"
                      label="Quận/Huyện"
                      rules={[
                        { required: true, message: "Chọn quận hoặc huyện!" },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="label"
                        size="large"
                        className="mb-2"
                        placeholder="Chọn quận hoặc huyện"
                        options={district}
                        onChange={(value, record) => {
                          provinceApi.ward(record.key).then((response) => {
                            const formattedWards = response
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((item) => ({
                                label: item.name,
                                value: item.name,
                                key: item.code,
                              }));
                            setWard(formattedWards);
                            formInfo.setFieldsValue({ ward: undefined });
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={{ span: 8 }} span={24}>
                    <Form.Item className="mb-2" name="ward" label="Xã/Phường">
                      <Select
                        showSearch
                        optionFilterProp="label"
                        size="large"
                        className="mb-2"
                        placeholder="Chọn xã hoặc phường"
                        options={ward}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  className="mb-4"
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Nhập địa chỉ!" }]}
                >
                  <Input size="large" placeholder="Nhập địa chỉ" />
                </Form.Item>

                <Form.Item className="mb-0" name="note" label="Ghi chú">
                  <Input.TextArea
                    maxLength={250}
                    showCount
                    style={{ height: 120, minHeight: 190 }}
                    size="large"
                    placeholder="Nhập ghi chú"
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col
            className="mx-auto"
            span={24}
            xl={{ span: 7 }}
            lg={{ span: 9 }}
            md={{ span: 14, order: 2 }}
            xs={{ order: 1 }}
          >
            <Card className="sticky top-24">
              <Divider
                className="!mt-2"
                style={{ borderColor: "rgb(212 212 212)" }}
              >
                Đơn hàng của bạn
              </Divider>

              {dataCourses.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleSelectAll}
                    checked={checkAll}
                    className="mb-2 font-medium"
                  >
                    Chọn tất cả
                  </Checkbox>

                  <div className="flex flex-col gap-3">
                    {dataCourses.map((item) => {
                      const isSelected = selectedItems.some(
                        (selected) => selected._id === item._id
                      );
                      const finalPrice = item.salePrice || item.price;

                      return (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex gap-2">
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) =>
                                handleItemSelect(item, event.target.checked)
                              }
                            />
                            <Typography.Text>{item.name}</Typography.Text>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Typography.Text type="danger" strong>
                              {FormatPrice(finalPrice)}
                            </Typography.Text>
                            {item.salePrice && (
                              <Typography.Text
                                delete
                                type="secondary"
                                className="text-sm"
                              >
                                {FormatPrice(item.price)}
                              </Typography.Text>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Divider style={{ borderColor: "rgb(212 212 212)" }}>
                    Tổng tiền ({selectedItems.length} sản phẩm)
                  </Divider>

                  <div className="flex justify-center">
                    <Typography.Title
                      className="!my-0 !text-center"
                      level={4}
                      type="danger"
                    >
                      {FormatPrice(calculateTotal(selectedItems))}
                    </Typography.Title>
                  </div>

                  <Divider style={{ borderColor: "rgb(212 212 212)" }}>
                    Phương thức thanh toán
                  </Divider>
                  <div className="flex justify-center">
                    <Typography.Text type="warning">
                      Chuyển khoản qua ngân hàng
                    </Typography.Text>
                  </div>

                  <Divider
                    style={{ borderColor: "rgb(212 212 212)" }}
                  ></Divider>

                  {user?.userType ? (
                    <Button
                      type="primary"
                      onClick={() => formInfo.submit()}
                      className="w-full"
                      size="large"
                      disabled={selectedItems.length === 0}
                    >
                      Thanh Toán ({selectedItems.length} sản phẩm)
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() =>
                        navigate("/login", { state: { from: `/checkout` } })
                      }
                      className="w-full"
                      size="large"
                    >
                      Đăng Nhập Để Thanh Toán
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Empty description="Chưa có khóa học nào trong giỏ hàng" />
                  <Button className="w-full mb-4 mt-4" size="large">
                    Chưa có sản phẩm trong giỏ hàng
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => navigate("/courses")}
                    className="w-full"
                    size="large"
                  >
                    Thêm Sản Phẩm
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </section>

      <Modal
        title="Xác nhận thanh toán"
        centered
        open={openConfirm}
        onOk={() => handlePayment(order)}
        okText="Thanh toán"
        onCancel={() => setOpenConfirm(false)}
        width={800}
      >
        <Typography className="!mb-3">
          Trước khi thanh toán vui lòng xác nhận lại{" "}
          <span>
            <Typography.Link>đơn hàng </Typography.Link>
          </span>{" "}
          và{" "}
          <span>
            <Typography.Link>tài khoản nhận tiền</Typography.Link>
          </span>{" "}
          của {info?.newData?.[0]?.name}:{" "}
        </Typography>

        <Divider className="!mt-2" style={{ borderColor: "rgb(212 212 212)" }}>
          Đơn hàng của bạn
        </Divider>

        <div className="flex flex-col gap-3">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => {
              const finalPrice = item.salePrice || item.price;
              return (
                <div
                  key={item._id}
                  className="flex justify-between w-full mb-2"
                >
                  <Typography.Text>{item.name}</Typography.Text>
                  <div className="flex gap-2 items-center">
                    <Typography.Text type="danger" strong>
                      {FormatPrice(finalPrice)}
                    </Typography.Text>
                    {item.salePrice && (
                      <Typography.Text
                        delete
                        type="secondary"
                        className="text-sm"
                      >
                        {FormatPrice(item.price)}
                      </Typography.Text>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <Empty description="Chưa có khóa học nào được chọn" />
          )}
        </div>

        <Divider style={{ borderColor: "rgb(212 212 212)" }}>
          Tổng tiền ({selectedItems.length} sản phẩm)
        </Divider>

        <div className="flex justify-center">
          <Typography.Title
            className="!my-0 !text-center"
            level={4}
            type="danger"
          >
            {FormatPrice(calculateTotal(selectedItems))}
          </Typography.Title>
        </div>

        <Divider style={{ borderColor: "rgb(212 212 212)" }}>
          Phương thức thanh toán
        </Divider>

        <div className="flex justify-center">
          <Typography.Link className="!my-0 !text-center" level={4}>
            Chuyển khoản ngân hàng
          </Typography.Link>
        </div>

        <Divider style={{ borderColor: "rgb(212 212 212)" }}>
          Thông tin tài khoản nhận tiền của{" "}
          <span>
            <Typography.Link>{info?.newData?.[0]?.name}</Typography.Link>
          </span>
        </Divider>

        <Typography.Title className="!my-3" level={5}>
          Tên Ngân Hàng:{" "}
          <span>
            <Typography.Link>{keyBank?.name}</Typography.Link>
          </span>{" "}
        </Typography.Title>

        <Typography.Title className="!my-3" level={5}>
          Tên Tài Khoản:{" "}
          <span>
            <Typography.Link>{keyBank?.nameAccount} </Typography.Link>{" "}
          </span>{" "}
        </Typography.Title>

        <Typography.Title className="!my-3" level={5}>
          Số Tài Khoản:{" "}
          <span>
            <Typography.Link>{keyBank?.account} </Typography.Link>
          </span>{" "}
        </Typography.Title>

        <Typography.Title level={5} type="danger" className="!my-3 text-end">
          Không biết thanh toán?
          <span className="ms-2">
            <NavLink target="_blank" to="/huong-dan-thanh-toan">
              Hướng dẫn
            </NavLink>
          </span>
        </Typography.Title>
      </Modal>
    </Layout>
  );
};

export default Payment;
