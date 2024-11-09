import LayoutAdmin from "~/components/layout/Admin/Layout";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tabs,
  theme,
  Typography,
} from "antd";
import { dataSettingApi } from "~/apis/settingApi";
import { toastError, toastSuccess } from "~/components/toast";
import { CopyBlock, dracula } from "react-code-blocks";
import { FaLink } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { decrypt, encrypt } from "~/utils/crypto";
import { useEffect, useState } from "react";

const Setting = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [formApiLogin] = Form.useForm();
  const [formApiSend] = Form.useForm();
  const [data, setData] = useState();

  const handlePutApiLogin = (data) => {
    const value = encrypt(data.key);
    dataSettingApi
      .put({
        "api-key-google": {
          login: value,
        },
      })
      .then(() => {
        toastSuccess(
          value,
          "Cập Nhập Cài Đặt Thành Công!",
          `Api Key đã được lưu!`
        );
      })
      .catch((err) => {
        toastError(value, "Không Thể Thay Đổi Cài Đặt!", err.message);
      });
  };

  const handlePutApiSend = (data) => {
    dataSettingApi
      .put({
        "api-key-google": {
          sendEmail: data,
        },
      })
      .then(() => {
        toastSuccess(
          data.user,
          "Cập Nhập Cài Đặt Thành Công!",
          `Api Key đã được lưu!`
        );
      })
      .catch((err) => {
        toastError(data.user, "Không Thể Thay Đổi Cài Đặt!", err.message);
      });
  };

  const fetchSetting = () => {
    dataSettingApi.get().then((res) => {
      setData(res);
      formApiLogin.setFieldsValue({ key: res["api-key-google"].login });
      formApiSend.setFieldsValue({
        user: res["api-key-google"].sendEmail.user,
        password: res["api-key-google"].sendEmail.password,
        name: res["api-key-google"].sendEmail.name,
      });
    });
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  return (
    <LayoutAdmin header={"CÀI ĐẶT"}>
      <Card className="h-full overflow-auto">
        <Tabs
          centered
          type="card"
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Cài đặt chung",
              children: (
                <>
                  <Row gutter={[24, 24]}>
                    <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
                      <Card className="h-full" title="Khôi phục - Sao lưu">
                        <div className="flex justify-between items-center">
                          <Typography>
                            {" "}
                            Tự động sao lưu dữ liệu theo:{" "}
                          </Typography>
                          <Select
                            value={data?.["restore-backup"]?.time}
                            onChange={(value, option) => {
                              dataSettingApi
                                .put({
                                  "restore-backup": {
                                    time: value,
                                  },
                                })
                                .then(() => {
                                  fetchSetting();
                                  toastSuccess(
                                    value,
                                    "Đã thay đổi cài đặt sao lưu dữ liệu!",
                                    `Sao lưu dữ liệu theo ${option.label}`
                                  );
                                })
                                .catch((err) => {
                                  toastError(
                                    value,
                                    "Không thể thay đổi cài đặt sao lưu dữ liệu!",
                                    err.message
                                  );
                                });
                            }}
                            options={[
                              { label: "Ngày", value: "0 0 * * *" },
                              { label: "Tuần", value: "0 0 * * 1" },
                              { label: "Tháng", value: "0 0 1 * *" },
                            ]}
                            className="!ml-2"
                            style={{ width: "90px" }}
                            defaultValue={"0 0 * * *"}
                          />
                        </div>
                      </Card>
                    </Col>

                    <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
                      <Card className="h-full" title="Đơn Hàng">
                        <div className="flex justify-between items-center">
                          <Typography>
                            {" "}
                            Tự động xóa các đơn hàng chưa thanh toán theo:{" "}
                          </Typography>
                          <Select
                            value={data?.["order"]?.time}
                            onChange={(value, option) => {
                              dataSettingApi
                                .put({
                                  order: {
                                    time: value,
                                  },
                                })
                                .then(() => {
                                  toastSuccess(
                                    value,
                                    "Đã thay đổi cài đặt sao lưu dữ liệu!",
                                    `Sao lưu dữ liệu theo ${option.label}`
                                  );
                                })
                                .catch((err) => {
                                  toastError(
                                    value,
                                    "Không thể thay đổi cài đặt sao lưu dữ liệu!",
                                    err.message
                                  );
                                });
                            }}
                            options={[
                              { label: "Ngày", value: "0 0 * * *" },
                              { label: "Tuần", value: "0 0 * * 1" },
                              { label: "Tháng", value: "0 0 1 * *" },
                            ]}
                            className="!ml-2"
                            style={{ width: "90px" }}
                            defaultValue={"0 0 * * *"}
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "2",
              label: "Code mẫu",
              children: (
                <>
                  <Row gutter={[24, 24]}>
                    <Col xl={{ span: 12 }} span={24}>
                      <Card
                        className="h-full"
                        title=<div className="flex justify-between items-center">
                          <p>Giảm kích thước video</p>
                          <div className="flex gap-2">
                            <Typography.Link
                              className="flex items-center gap-1"
                              target="_blank"
                              href="https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z"
                            >
                              <FaLink className="cursor-pointer" size={20} />{" "}
                              Cài đặt
                            </Typography.Link>
                            <Typography.Link
                              className="flex items-center gap-1"
                              target="_blank"
                              href="https://youtu.be/vsIIJ83sjpc?si=XhL8qjKupZ3U0C-J"
                            >
                              <FaLink className="cursor-pointer" size={20} />{" "}
                              Hướng dẫn
                            </Typography.Link>
                          </div>
                        </div>
                      >
                        <Row gutter={[24, 24]}>
                          <Col span={24}>
                            <CopyBlock
                              text={`$compressedFolder = "compressed"
if (-not (Test-Path -Path $compressedFolder)) {
    New-Item -ItemType Directory -Path $compressedFolder
}
$videoFiles = Get-ChildItem -Path . -Filter *.mp4
foreach ($file in $videoFiles) {
    $inputFile = $file.FullName
    $outputFile = Join-Path -Path $compressedFolder -ChildPath $file.Name
    ffmpeg -i $inputFile -vcodec h264 -acodec aac $outputFile
    Write-Host "Đã xử lý và lưu file: $($file.Name) vào thư mục $compressedFolder"
}
Write-Host "Hoàn thành việc nén tất cả video vào thư mục $compressedFolder."
                                                        `}
                              language={"js"}
                              showLineNumbers={true}
                              theme={dracula}
                              codeBlock
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "3",
              label: "Api Key",
              children: (
                <>
                  <Row gutter={[24, 24]}>
                    <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
                      <Card
                        className="h-full"
                        title=<div className="flex justify-between items-center">
                          <Typography> Api Key Đăng Nhập Google</Typography>
                          <div className="flex gap-2">
                            <Typography.Link
                              href="https://duthanhduoc.com/blog/p5-giai-ngo-authentication-OAuth2"
                              target="_blank"
                            >
                              Bài viết hướng dẫn
                            </Typography.Link>
                            <Typography.Link
                              href="https://www.youtube.com/watch?v=tgO_ADSvY1I"
                              target="_blank"
                            >
                              Video hướng dẫn
                            </Typography.Link>
                            <FaSave
                              className="cursor-pointer"
                              onClick={() => formApiLogin.submit()}
                              size={20}
                              color={colorPrimary}
                            />
                          </div>
                        </div>
                      >
                        <Form
                          form={formApiLogin}
                          name="API_LOGIN"
                          layout="vertical"
                          onFinish={handlePutApiLogin}
                        >
                          <Form.Item
                            className="mb-2"
                            name="key"
                            label="Api Key"
                            rules={[
                              { required: true, message: "Nhập api key!" },
                            ]}
                          >
                            <Input.Password
                              iconRender={() => null}
                              placeholder="Nhập api key"
                              size="large"
                            />
                          </Form.Item>
                        </Form>
                      </Card>
                    </Col>

                    <Col xl={{ span: 12 }} md={{ span: 12 }} span={24}>
                      <Card
                        className="h-full"
                        title={
                          <div className="flex justify-between items-center">
                            <Typography>Api Key Gửi Email Google</Typography>
                            <div className="flex gap-2">
                              <Typography.Link
                                href="https://www.youtube.com/watch?v=kTcmbZqNiGw"
                                target="_blank"
                              >
                                Video hướng dẫn
                              </Typography.Link>
                              <FaSave
                                className="cursor-pointer"
                                onClick={() => formApiSend.submit()}
                                size={20}
                                color={colorPrimary}
                              />
                            </div>
                          </div>
                        }
                      >
                        <Form
                          form={formApiSend}
                          name="API_SEND"
                          layout="vertical"
                          onFinish={handlePutApiSend}
                        >
                          <Form.Item
                            className="mb-2"
                            name="name"
                            label="Tên người gửi"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input
                              placeholder="Nhập tên người gửi"
                              size="large"
                            />
                          </Form.Item>
                          <Form.Item
                            className="mb-2"
                            name="user"
                            label="Email"
                            rules={[
                              { required: true, message: "Nhập email user!" },
                            ]}
                          >
                            <Input placeholder="Nhập email user" size="large" />
                          </Form.Item>
                          <Form.Item
                            className="mb-2"
                            name="password"
                            label="Password"
                            rules={[
                              { required: true, message: "Nhập api key!" },
                            ]}
                          >
                            <Input.Password
                              iconRender={() => null}
                              placeholder="Nhập api key"
                              size="large"
                            />
                          </Form.Item>
                        </Form>
                      </Card>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Card>
    </LayoutAdmin>
  );
};

export default Setting;
