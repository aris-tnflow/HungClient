import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Steps,
  theme,
  Typography,
} from "antd";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import { userApi } from "~/apis/userApi";
import { baseURL, forgotPass } from "~/utils";
import { emailApi } from "~/apis/emailAPi";
import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [formUser] = Form.useForm();
  const [formForgot] = Form.useForm();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { user } = useSelector((state) => state.auth);

  const [openForgot, setOpenForgot] = useState(false);
  const [currentForgot, setCurrentForgot] = useState(0);
  const [otp, setOtp] = useState();
  const [passWord, setPassWord] = useState();
  const [confirmPass, setConfirmPass] = useState();

  const handlePutPassword = (values) => {
    const { newPassword, confirmPassword } = values;
    toastLoading("auth", "Đang thay đổi mật khẩu...");
    if (newPassword !== confirmPassword) {
      toastError(
        "auth",
        "Mật khẩu không trùng khớp!",
        "Vui lòng kiểm tra lại mật khẩu của bạn!"
      );
    }
    userApi
      .putPassWord(values)
      .then((res) => {
        toastSuccess("auth", "Thay Đổi Mật Khẩu Thành Công!", res.message);
        formUser.resetFields();
      })
      .catch((err) => {
        toastError("auth", "Thay Đổi Mật Khẩu Không Thành Công!", err.message);
      });
  };

  const handleForgotPassword = async (values) => {
    const res = await userApi.checkEmail(values);
    if (res.exists) {
      setCurrentForgot(currentForgot + 1);
      emailApi.sig({ id: forgotPass }).then((res) => {
        emailApi.sendForgot({
          email: values.email,
          title: "CWS Mã xác nhận",
          content: res.content,
        });
      });
    } else {
      toastError(
        "auth",
        "Email không tồn tại!",
        "Vui lòng kiểm tra lại email của bạn!"
      );
    }
  };

  const handleOtp = () => {
    userApi
      .checkCode({ email: formForgot.getFieldValue("email"), verify: otp })
      .then((res) => {
        if (res.exists) {
          setCurrentForgot(currentForgot + 1);
        } else {
          toastError(
            "auth",
            "Mã Xác Nhận Không Đúng!",
            "Vui lòng kiểm tra lại mã xác nhận của bạn!"
          );
        }
      });
  };

  const handleChangePass = () => {
    const date = new Date();
    toastLoading(date, "Đang đổi mật khẩu");
    if (passWord === confirmPass) {
      userApi
        .putUserForgot({
          email: formForgot.getFieldValue("email"),
          password: passWord,
          verify: otp,
        })
        .then((res) => {
          if (res) {
            toastSuccess(
              date,
              "Đổi mật khẩu thành công!",
              "Hãy đăng nhập để trải nghiệm tốt nhất!"
            );
            setOpenForgot(false);
          }
        });
    } else {
      toastError(
        date,
        "Mật khẩu không trùng khớp!",
        "Vui lòng kiểm tra lại mật khẩu của bạn!"
      );
    }
  };

  const steps = [
    {
      key: "1",
      title: "Xác nhận thông tin",
      content: (
        <>
          <Form
            className="mt-4"
            form={formForgot}
            name="formForgotPass"
            layout="vertical"
            onFinish={handleForgotPassword}
          >
            <Form.Item
              label="Email"
              className="mb-4"
              name="email"
              validateFirst
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không đúng định dạng!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập email để lấy lại mật khẩu"
                readOnly
              />
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      key: "2",
      title: "Điền mã xác nhận",
      content: (
        <>
          <Form
            className="mt-4"
            name="sdfsdfsdfsdfsdfsdf"
            layout="vertical"
            onFinish={handleOtp}
          >
            <Form.Item
              label="Nhập mã xác nhận gửi về email bao gồm 6 chữ số"
              className="mb-4 flex flex-col justify-center items-center flex-wrap"
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã xác nhận!",
                },
              ]}
            >
              <Input.OTP
                onChange={(e) => setOtp(e)}
                size="large"
                placeholder="Nhập mã xác nhận"
              />
            </Form.Item>

            <div className="flex justify-center gap-2">
              <span>
                Không thấy mã{" "}
                <Button
                  icon={<IoIosSend />}
                  style={{ color: colorPrimary }}
                  type="text"
                >
                  Gửi lại mã
                </Button>
              </span>
            </div>
          </Form>
        </>
      ),
    },
    {
      key: "3",
      title: "Đặt lại mật khẩu",
      content: (
        <>
          <Form
            className="mt-4"
            name="adssdfsdfsdf"
            layout="vertical"
            onFinish={handleChangePass}
          >
            <Form.Item
              label="Mật khẩu mới"
              className="mb-4"
              name="password"
              validateFirst
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                  message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu mới"
                onChange={(e) => setPassWord(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              className="mb-4"
              name="confirmPassword"
              validateFirst
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                  message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu mới"
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (user) {
      formUser.setFieldsValue({ userId: user._id });
    }
  }, [user]);

  return (
    <LayoutAdmin
      title="Đổi mật khẩu"
      header={"ĐỔI MẬT KHẨU"}
      button={
        <>
          <Button type="primary" onClick={() => formUser.submit()}>
            Đổi Mật Khẩu
          </Button>
        </>
      }
    >
      <Card
        className="h-full overflow-auto"
        title={
          <div className="flex justify-between">
            <Typography.Text strong>Đổi mật khẩu</Typography.Text>
            <Typography.Link
              onClick={() => {
                setOpenForgot(true);
                formForgot.setFieldsValue({ email: user?.email });
              }}
            >
              Quên mật khẩu ?
            </Typography.Link>
          </div>
        }
      >
        <Form
          form={formUser}
          name="customForm"
          layout="vertical"
          onFinish={handlePutPassword}
        >
          <Row gutter={[14, 14]}>
            <Form.Item className="mb-2 hidden" name="userId" label="id">
              <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Col xl={{ span: 24 }} span={24}>
              <Form.Item
                className="mb-2"
                name="oldPassword"
                label="Mật khẩu cũ"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                  {
                    pattern: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu cũ" />
              </Form.Item>
            </Col>

            <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
              <Form.Item
                className="mb-2"
                name="newPassword"
                label="Mật khẩu mới"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                  {
                    pattern: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>

            <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
              <Form.Item
                className="mb-2"
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                  {
                    pattern: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal
        title="Quên mật khẩu"
        centered
        open={openForgot}
        onOk={() => setOpenForgot(false)}
        onCancel={() => setOpenForgot(false)}
        footer={null}
        width={650}
      >
        <Steps current={currentForgot} items={steps} />
        <div>{steps[currentForgot].content}</div>
        <div
          className="flex justify-end"
          style={{
            marginTop: 24,
          }}
        >
          {currentForgot > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => setCurrentForgot(currentForgot - 1)}
            >
              Trở Lại
            </Button>
          )}

          {currentForgot == 0 && (
            <Button type="primary" onClick={() => formForgot.submit()}>
              {" "}
              Gửi Email Xác Nhận
            </Button>
          )}

          {currentForgot == 1 && (
            <Button type="primary" onClick={handleOtp}>
              Xác Nhận
            </Button>
          )}

          {currentForgot === steps.length - 1 && (
            <Button type="primary" onClick={handleChangePass}>
              {" "}
              Đặt Lại Mật Khẩu{" "}
            </Button>
          )}
        </div>
      </Modal>
    </LayoutAdmin>
  );
};

export default HomePage;
