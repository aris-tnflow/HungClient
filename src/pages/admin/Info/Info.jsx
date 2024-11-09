import { Button, Card, Input, Form, Col, Row, Space } from "antd";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { infoApi } from "~/apis/infoApi";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import { toastSuccess } from "~/components/toast";
import FileInfo from "~/components/upload/FileInfo";
import { putInfoApi } from "~/redux/slices/Data/infoSlice";
import { genericDispatch } from "~/redux/utils";

import { baseURL, id_info } from "~/utils";

const Website = () => {
  const [formInfo] = Form.useForm();
  const dispatch = useDispatch();

  const { info } = useSelector((state) => state.info);

  const handlePutInfo = (data) => {
    genericDispatch(dispatch, putInfoApi({ id: id_info, ...data }));
  };

  useEffect(() => {
    if (info?.newData?.[0]) {
      formInfo.setFieldsValue(info?.newData?.[0]);
    }
  }, [info]);

  return (
    <LayoutAdmin
      title={"Thông tin Website"}
      header="WEBSITE"
      button={
        <>
          <Button type="primary" onClick={() => formInfo.submit()}>
            Lưu thông tin
          </Button>
        </>
      }
    >
      <Form
        form={formInfo}
        className="w-full"
        name="customForm"
        layout="vertical"
        onFinish={handlePutInfo}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="h-full" title="Thông tin webstie">
              <Row gutter={[18, 18]}>
                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="name"
                    label="Tên Website"
                    rules={[{ required: true, message: "Nhập tên Website!" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập tên Website"
                    />
                  </Form.Item>
                </Col>

                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="manage"
                    label="Tên quản lý"
                    rules={[{ required: true, message: "Nhập tên quản lý!" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập tên quản lý"
                    />
                  </Form.Item>
                </Col>

                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
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
                    />
                  </Form.Item>
                </Col>

                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Nhập email!" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập email"
                    />
                  </Form.Item>
                </Col>

                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: "Nhập địa chỉ!" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập địa chỉ"
                    />
                  </Form.Item>
                </Col>

                <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="description"
                    label="Mô tả webiste"
                    rules={[{ required: true, message: "Nhập Mô tả!" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập Mô tảỉ"
                    />
                  </Form.Item>
                </Col>

                {/* <Col md={{ span: 12 }} span={24}>
                  <Form.Item
                    className="mb-2"
                    name="keywords"
                    label="Từ khóa tìm kiếm"
                    rules={[{ required: true, message: "Nhập từ khóa !" }]}
                  >
                    <Input
                      size="large"
                      className="mb-2"
                      placeholder="Nhập từ khóa"
                    />
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>
          </Col>

          <Col className="mb-6" span={24}>
            <Card title="Ảnh website">
              <Row gutter={[24, 24]}>
                {/* <Col xl={{ span: 4 }} lg={{ span: 6 }} span={24}>
                  <Card
                    title="Icon website"
                    className="flex flex-col justify-center items-center"
                  >
                    <FileInfo
                      apiUpload={`${baseURL}/v2/file`}
                      name="img"
                      limit={1}
                      folder={"Info"}
                      fileLists={info?.newData?.[0]?.imgIcon}
                      success={(data) => {
                        infoApi
                          .put({ id: id_info, imgIcon: data.response })
                          .then(() => {
                            toastSuccess(
                              "data",
                              "Tải ảnh thành công!",
                              "Đã cập nhập ảnh Icon"
                            );
                          });
                        console.log(data);
                      }}
                    />
                  </Card>
                </Col> */}
                <Col xl={{ span: 4 }} lg={{ span: 6 }} span={24}>
                  <Card
                    title="Ảnh trang Login"
                    className="flex flex-col justify-center items-center"
                  >
                    <FileInfo
                      apiUpload={`${baseURL}/v2/file`}
                      name="img"
                      limit={1}
                      folder={"Info"}
                      fileLists={info?.newData?.[0]?.imgLogin}
                      success={(data) => {
                        infoApi
                          .put({ id: id_info, imgLogin: data.response })
                          .then(() => {
                            toastSuccess(
                              "data",
                              "Tải ảnh thành công!",
                              "Đã cập nhập ảnh Trang Login"
                            );
                          });
                        console.log(data);
                      }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </LayoutAdmin>
  );
};

export default Website;
