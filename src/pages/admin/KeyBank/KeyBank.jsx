import { Card, Input, Form, Col, Row, Typography, Select, Button } from "antd";
import { useEffect } from "react";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getBankApi } from "~/redux/slices/Data/bankSlice";
import { genericDispatch } from "~/redux/utils";
import { getKeyBankApi, putKeyBankApi } from "~/redux/slices/Data/keyBankSlice";
import { id_keyBank } from "~/utils";
import { dataSettingApi } from "~/apis/settingApi";
import { toastError, toastSuccess } from "~/components/toast";
import { useNavigate } from "react-router-dom";

const KeyBank = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formPayment] = Form.useForm();
  const { loading, bank } = useSelector((state) => state.bank);
  const { loading: loadingKeyBank, keyBank } = useSelector(
    (state) => state.keyBank
  );
  const { user } = useSelector((state) => state.auth);

  const handldePutPayment = (data) => {
    const { nameAccount, name, account } = data;
    genericDispatch(
      dispatch,
      putKeyBankApi({ id: id_keyBank, nameAccount, name, account })
    );

    const {
      clientID,
      apiKey,
      checksumKey,
      momoKey1,
      momoKey2,
      zaloKey1,
      zaloKey2,
      vnKey1,
      vnKey2,
    } = data;
    dataSettingApi
      .put({
        "payment-bank": {
          clientID,
          apiKey,
          checksumKey,
        },
        // "payment-momo": {
        //     momoKey1,
        //     momoKey2
        // },
        // "payment-zalo": {
        //     zaloKey1,
        //     zaloKey2
        // },
        // "payment-vnpay": {
        //     vnKey1,
        //     vnKey2
        // }
      })
      .catch((err) => {
        toastError("key", "Không Thể Thay Đổi Cài Đặt!", err.message);
      });
  };

  const fetchSetting = () => {
    dataSettingApi.get().then((res) => {
      formPayment.setFieldsValue({
        ...res["payment-bank"],
        ...res["payment-momo"],
        ...res["payment-zalo"],
        ...res["payment-vnpay"],
      });
    });
  };

  useEffect(() => {
    if (user?.userType == "admin-control") {
      toastError(
        "key",
        "Không Thể Truy Cập Trang!",
        "Vui lòng đăng nhập với tài khoản Admin Chính!"
      );
      navigate("/admin");
    }
  }, [user]);

  useEffect(() => {
    if (loading) {
      dispatch(getBankApi());
    }
  }, []);

  useEffect(() => {
    if (loadingKeyBank) {
      dispatch(getKeyBankApi());
    }
  }, []);

  useEffect(() => {
    if (keyBank?.newData?.[0]) {
      formPayment.setFieldsValue(keyBank?.newData?.[0]);
    }
  }, [keyBank]);

  useEffect(() => {
    fetchSetting();
  }, []);

  return (
    <LayoutAdmin
      header="CHUYỂN KHOẢN"
      button={
        <Button onClick={() => formPayment.submit()} type="primary">
          Lưu thông tin
        </Button>
      }
    >
      <Form
        form={formPayment}
        className="w-full"
        name="customForm"
        layout="vertical"
        onFinish={handldePutPayment}
      >
        <Row gutter={[24, 24]}>
          <Col md={{ span: 12 }} span={24}>
            <Card loading={loadingKeyBank} title="Thông Tin Ngân Hàng">
              <Form.Item
                className="mb-2"
                name="name"
                label="Tên ngân hàng"
                rules={[{ required: true, message: "Nhập tên ngân hàng!" }]}
              >
                <Select
                  className="mb-2"
                  size="large"
                  showSearch
                  placeholder="Chọn ngân hàng"
                  options={bank?.data?.map((bank) => ({
                    label: bank.shortName,
                    value: bank.shortName,
                  }))}
                />
              </Form.Item>

              <Form.Item
                className="mb-2"
                name="account"
                label="Số tài khoản"
                rules={[{ required: true, message: "Nhập số tài khoản!" }]}
              >
                <Input
                  size="large"
                  className="mb-2"
                  placeholder="Nhập số tài khoản"
                />
              </Form.Item>

              <Form.Item
                className="mb-2"
                name="nameAccount"
                label="Tên tài khoản"
                rules={[{ required: true, message: "Nhập tên tài khoản!" }]}
              >
                <Input
                  size="large"
                  className="mb-2"
                  placeholder="Nhập tên tài khoản"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col md={{ span: 12 }} span={24}>
            <Card
              className="mb-6"
              title=<div className="flex items-center justify-between">
                <Typography>Thông Tin Chuyển Khoản Qua Ngân Hàng</Typography>
                <Typography.Link
                  target="_blank"
                  href="https://my.payos.vn/login"
                >
                  <img className="h-10" src="/payos/payos-logo.svg" alt="" />
                </Typography.Link>
              </div>
            >
              <Form.Item
                className="mb-2"
                name="clientID"
                label="Client ID"
                rules={[{ required: true, message: "Nhập Client ID!" }]}
              >
                <Input.Password
                  size="large"
                  iconRender={() => null}
                  className="mb-2"
                  placeholder="Nhập Client ID"
                />
              </Form.Item>

              <Form.Item
                className="mb-2"
                name="apiKey"
                label="Api Key"
                rules={[{ required: true, message: "Nhập Api key!" }]}
              >
                <Input.Password
                  size="large"
                  iconRender={() => null}
                  className="mb-2"
                  placeholder="Nhập Api key"
                />
              </Form.Item>

              <Form.Item
                className="mb-2"
                name="checksumKey"
                label="Checksum Key"
                rules={[{ required: true, message: "Nhập Checksum Key!" }]}
              >
                <Input.Password
                  size="large"
                  iconRender={() => null}
                  className="mb-2"
                  placeholder="Nhập Checksum Key"
                />
              </Form.Item>
            </Card>
          </Col>

          {/* <Col md={{ span: 8 }} span={24}>
                        <Card
                            title=<div className='flex items-center justify-between'>
                                <Typography>MoMo</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/momo/momo.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="momoKey1"
                                label="AccessKey"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="momoKey2"
                                label="SecretKey"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col md={{ span: 8 }} span={24}>
                        <Card
                            title=<div className='flex items-center justify-between'>
                                <Typography>ZaloPay</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/zalo/zalo.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="zaloKey1"
                                label="Key1"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="zaloKey2"
                                label="Key2"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col className='mb-6' md={{ span: 8 }} span={24}>
                        <Card
                            title=<div className='flex items-center justify-between'>
                                <Typography>VNPay</Typography>
                                <Typography.Link target='_blank' href='https://my.payos.vn/login'>
                                    <img className='h-10' src="/vn/vn.svg" alt="" />
                                </Typography.Link>
                            </div>
                        >
                            <Form.Item
                                className='mb-2'
                                name="vnKey1"
                                label="Key1"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>

                            <Form.Item
                                className='mb-2'
                                name="vnKey2"
                                label="Key2"
                            >
                                <Input.Password
                                    size='large'
                                    iconRender={() => null}
                                    className='mb-2'
                                    placeholder="Nhập key"
                                />
                            </Form.Item>
                        </Card>
                    </Col> */}
        </Row>
      </Form>
    </LayoutAdmin>
  );
};

export default KeyBank;
