import { Button, Input, Modal, Form, Select } from "antd";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";
import {
  addNotifyApi,
  delNotifyApi,
  putNotifyApi,
} from "~/redux/slices/Data/notificationSlice";
import { FilterDate, FilterSelect } from "~/components/table/Filter";
import { FormatDay, FormatDayTime } from "~/components/table/Format";
import { genericDispatch } from "~/redux/utils";

const Notification = () => {
  const dispatch = useDispatch();
  const [formAddPage] = Form.useForm();
  const [openAdd, setOpenAdd] = useState(false);
  const { notification, loading } = useSelector((state) => state.notification);

  const columns = [
    {
      title: "Tiêu đề thông báo",
      dataIndex: "title",
      width: "15%",
      editable: true,
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: "Nội dung thông báo",
      dataIndex: "content",
      width: "15%",
      editable: true,
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: "Loại thông báo",
      dataIndex: "type",
      width: "10%",
      editable: true,
      type: "select",
      ellipsis: {
        showTitle: true,
      },
      optionSelect: [
        { label: "public", value: "public" },
        { label: "private", value: "private" },
      ],
      ...FilterSelect("type", [
        { value: "public", text: "public" },
        { value: "private", text: "private" },
      ]),
    },
    {
      title: "Ẩn/Hiện",
      dataIndex: "show",
      width: "10%",
      editable: true,
      type: "select",
      ellipsis: {
        showTitle: true,
      },
      render: (show) => (show ? "Hiển thị" : "Ẩn"),
      optionSelect: [
        { label: "Hiển thị", value: true },
        { label: "Ẩn", value: false },
      ],
      ...FilterSelect("type", [
        { value: true, text: "Hiển thị" },
        { value: false, text: "Ẩn" },
      ]),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "10%",
      ...FilterDate({ dataIndex: "createdAt" }),
      render: (dayCreate) => FormatDay(dayCreate),
    },
    {
      title: "Cập nhập",
      dataIndex: "updatedAt",
      width: "10%",
      render: (updatedAt) => FormatDayTime(updatedAt),
    },
  ];

  const dataNotify = useMemo(
    () =>
      notification?.newData?.map((data) => ({
        ...data,
        key: data._id,
      })),
    [notification?.newData]
  );

  const handleAddNotifi = (data) => {
    genericDispatch(dispatch, addNotifyApi(data), () => {
      setOpenAdd(false);
      formAddPage.resetFields();
    });
  };

  const handlePutNotifi = (data) => {
    genericDispatch(dispatch, putNotifyApi(data));
  };

  const handleDelNotifi = (data) => {
    genericDispatch(dispatch, delNotifyApi(data));
  };

  return (
    <LayoutAdmin
      header="Thông báo"
      button={
        <Button type="primary" onClick={() => setOpenAdd(true)}>
          Thêm thông báo
        </Button>
      }
    >
      <Table
        dragMode={false}
        loading={loading}
        data={dataNotify}
        columns={columns}
        onSave={handlePutNotifi}
        onDelete={handleDelNotifi}
        width={"12%"}
      />

      <Modal
        title="Thêm thông báo"
        centered
        open={openAdd}
        onOk={() => formAddPage.submit()}
        onCancel={() => setOpenAdd(false)}
        width={600}
      >
        <Form
          form={formAddPage}
          name="customForm"
          layout="vertical"
          onFinish={handleAddNotifi}
        >
          <Form.Item
            label="Tiêu đề"
            className="mb-2"
            name="title"
            rules={[{ required: true, message: "Vui lòng tiêu đề!" }]}
          >
            <Input size="large" className="mb-2" placeholder="Nhập tiêu đề" />
          </Form.Item>

          <Form.Item
            label="Loại thông báo"
            className="mb-2"
            name="type"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Select
              size="large"
              placeholder="Chọn loại thông báo"
              options={[
                {
                  label: "Tất cả người dùng (Chưa Đăng Nhập - Đã Đăng Nhập)",
                  value: "public",
                },
                {
                  label: "Tất cả người dùng đã đăng nhập",
                  value: "private",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            className="mb-2"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea
              size="large"
              style={{ height: "200px" }}
              className="mb-2"
              placeholder="Nhập nội dung"
            />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutAdmin>
  );
};

export default Notification;
