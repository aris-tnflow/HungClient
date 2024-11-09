import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Tree,
  Empty,
  message,
  Modal,
  Form,
  Tooltip,
  Typography,
  Popconfirm,
} from "antd";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import FileUi from "~/components/upload/FileUi";
import Video from "~/components/video/Video";

import { FaCheck, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { courseChildrenApi, courseModuleApi } from "~/apis/courseApi";

import "./Course.css";
import { useNavigate, useParams } from "react-router-dom";
import { toastError, toastSuccess } from "~/components/toast";
import { RiEditCircleFill } from "react-icons/ri";
import { baseURL } from "~/utils";
import FileUpload from "~/components/upload/File";
import { FaXmark } from "react-icons/fa6";

const Course = () => {
  const slug = useParams();
  const navigate = useNavigate();

  const [formAddCourseModule] = Form.useForm();
  const [formAddChildrenModule] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [data, setData] = useState();
  const [title, setTitle] = useState();
  const [course, setCourse] = useState();

  const [openAddCourseModule, setOpenAddCourseModule] = useState(false);
  const [openAddChildren, setOpenAddChildren] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [children, setChildren] = useState();

  const nameCourse = localStorage.getItem("name-course");

  const loop = (data, key, callback) => {
    data.some((item, index, arr) => {
      if (item.key === key) return callback(item, index, arr);
      if (item.children) return loop(item.children, key, callback);
    });
  };

  const onDrop = (info) => {
    const { dragNode, node, dropPosition: dropPos, dropToGap } = info;
    const dropKey = node.key;
    const dragKey = dragNode.key;
    const dataG = [...data];

    const findParent = (data, key) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          const index = data[i].children.findIndex(
            (child) => child.key === key
          );
          if (index > -1) {
            return data[i];
          }
        }
      }
      return null;
    };

    const dragParent = findParent(dataG, dragKey);
    const dropParent = findParent(dataG, dropKey);

    if (dragParent) {
      if (!dropToGap && node.children) {
        let dragObj;
        loop(dataG, dragKey, (item, index, arr) => {
          arr.splice(index, 1);
          dragObj = item;
        });
        loop(dataG, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
        message.success("Đã di chuyển bài học sang học phần mới");
      } else if (dropParent && dropParent.key === dragParent.key) {
        let dragObj;
        loop(dataG, dragKey, (item, index, arr) => {
          arr.splice(index, 1);
          dragObj = item;
        });
        loop(dataG, dropKey, (item, index, arr) => {
          arr.splice(dropPos < 0 ? index : index + 1, 0, dragObj);
        });
        message.success("Đã thay đổi thứ tự bài học trong học phần");
      } else {
        message.error("Không thể di chuyển bài học ra ngoài học phần");
        return;
      }
    } else {
      if (!dropToGap && node.children) {
        message.error(
          "Không thể di chuyển học phần vào bên trong học phần khác"
        );
        return;
      }

      let dragObj;
      loop(dataG, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      loop(dataG, dropKey, (item, index, arr) => {
        arr.splice(dropPos < 0 ? index : index + 1, 0, dragObj);
      });
      message.success("Đã thay đổi thứ tự học phần");
    }

    setData(dataG);
  };

  const findParent = (nodes, key) => {
    for (let node of nodes) {
      if (node.children && node.children.some((child) => child.key === key)) {
        return node;
      }
      if (node.children) {
        const result = findParent(node.children, key);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const handlePut = () => {
    console.log(data);
  };

  const handlePutTitle = (data) => {
    const { idEdit } = data;
    if (children?.children) {
      data.moduleId = idEdit;
      courseModuleApi
        .putModule({ id: slug.slug, ...data })
        .then(() => {
          toastSuccess("put", "Cập nhập học phần thành công");
          setOpenEdit(false);
          formEdit.resetFields();
          getModule();
        })
        .catch((err) =>
          toastError("put", "Cập nhập học phần thất bại", err.message)
        );
    } else {
      data.childId = idEdit;
      courseChildrenApi
        .putChildren({ id: slug.slug, ...data })
        .then(() => {
          toastSuccess("put", "Cập nhập bài học thành công");
          setOpenEdit(false);
          formEdit.resetFields();
          getModule();
        })
        .catch((err) =>
          toastError("put", "Cập nhập học phần thất bại", err.message)
        );
    }
  };

  const handleAddCourseModule = (data) => {
    courseModuleApi
      .addModule({ id: slug.slug, ...data })
      .then(() => {
        toastSuccess("add", "Thêm học phần thành công");
        setOpenAddCourseModule(false);
        formAddCourseModule.resetFields();
        getModule();
      })
      .catch((err) => toastError("add", "Thêm học phần thất bại", err.message));
  };

  const handleDelCourseModule = (data) => {
    const { _id } = data;
    if (data?.children) {
      data.moduleId = _id;
      courseModuleApi.delModule({ id: slug.slug, ...data }).then(() => {
        toastSuccess("del", "Xóa học phần thành công");
        getModule();
      });
    } else {
      data.childId = _id;
      courseChildrenApi.delChildren({ id: slug.slug, ...data }).then(() => {
        toastSuccess("del", "Xóa học phần thành công");
        getModule();
      });
    }
  };

  const handleAddChildrenModule = (data) => {
    courseChildrenApi
      .addChildren({ id: slug.slug, ...data })
      .then(() => {
        toastSuccess("add", "Thêm bài học thành công");
        formAddChildrenModule.resetFields();
        setOpenAddChildren(false);
        getModule();
      })
      .catch((err) => toastError("add", "Thêm học phần thất bại", err.message));
  };

  const getModule = () => {
    courseModuleApi.getModule({ id: slug.slug }).then((res) => {
      setData(res);
    });
  };

  useEffect(() => {
    getModule();
  }, []);

  useEffect(() => {
    formAddChildrenModule.setFieldsValue({ moduleId: children?._id });
    formEdit.setFieldsValue({
      idEdit: children?._id,
      title: children?.title,
      childId: children?.children?._id,
    });
  }, [children]);

  return (
    <LayoutAdmin
      title={`Khóa học ${nameCourse}`}
      header={
        <>
          <div className="flex items-center">
            <h6 className="mb-0">Khóa học {nameCourse}</h6>
          </div>
        </>
      }
      button={
        <>
          <Button type="primary" onClick={() => setOpenAddCourseModule(true)}>
            Thêm học phần
          </Button>
          {/* <Button type='primary' onClick={handlePut}>Lưu thông tin</Button> */}
        </>
      }
    >
      <Card title="Học phần" className="h-full mb-6">
        <Row gutter={[20, 20]}>
          <Col md={{ span: 8 }} span={24}>
            {data?.length > 0 ? (
              <Tree
                className="draggable-tree"
                style={{ overflow: "auto", height: 550 }}
                draggable
                defaultExpandAll={true}
                blockNode
                showLine
                onDrop={onDrop}
                titleRender={(nodeData) => {
                  return (
                    <div className="flex justify-between items-center gap-2">
                      <Typography.Paragraph className="!m-0">
                        {nodeData.title}
                      </Typography.Paragraph>
                      <div className="flex gap-1">
                        {nodeData.children && (
                          <Tooltip
                            placement="top"
                            title={`Thêm bài học - học phần`}
                          >
                            <Button
                              className="p-0"
                              type="primary"
                              ghost
                              icon={<FaPlusCircle />}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChildren(nodeData);
                                setOpenAddChildren(true);
                              }}
                            />
                          </Tooltip>
                        )}

                        <Button
                          className="p-0"
                          type="primary"
                          ghost
                          icon={<RiEditCircleFill />}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChildren(nodeData);
                            setOpenEdit(true);
                          }}
                        />

                        <Popconfirm
                          placement="right"
                          title="Xác nhận xóa!"
                          description="Bạn có muốn xóa học phần này không ?"
                          onConfirm={() => handleDelCourseModule(nodeData)}
                        >
                          <Tooltip placement="top" title={`Xóa`}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-0"
                              danger
                              icon={<FaMinusCircle />}
                              size="small"
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>
                  );
                }}
                onSelect={(selectedKeys, info) => {
                  const {
                    key,
                    title,
                    src,
                    poster,
                    textTracks,
                    thumbnailTracks,
                  } = info.node;
                  const parentNode = findParent(data, selectedKeys[0]);
                  if (selectedKeys.length === 0) {
                    setTitle(undefined);
                    return;
                  }
                  if (
                    info.selectedNodes &&
                    info.selectedNodes.length > 0 &&
                    info.selectedNodes[0].children
                  ) {
                    setTitle({
                      title: info.node.title,
                      type: "parent",
                      amount: info.node.children.length,
                      idEdit: info.node._id,
                    });
                  } else {
                    setTitle({
                      title: info.node.title,
                      type: "children",
                      idEdit: info.node._id,
                      edit: info.node.edit,
                      folderChirld: parentNode?.title,
                      _id: info.node._id,
                      public: info.node.public,
                    });
                    setCourse({
                      key,
                      title,
                      src,
                      poster,
                      textTracks,
                      thumbnailTracks,
                    });
                  }
                }}
                treeData={data}
              />
            ) : (
              <Empty
                description={
                  <div className="flex flex-col gap-2">
                    <Typography.Text>Chưa có học phần được tạo</Typography.Text>
                    <Button
                      type="primary"
                      onClick={() => setOpenAddCourseModule(true)}
                    >
                      Thêm học phần
                    </Button>
                  </div>
                }
              />
            )}
          </Col>

          <Col md={{ span: title?.type === "children" ? 13 : 16 }} span={24}>
            {(title?.type === "children" &&
              (course?.src ? (
                <Video
                  height="550px"
                  src={`${baseURL}/uploads${course?.src}`}
                  poster={course?.poster || undefined}
                  textTracks={course?.textTracks || []}
                  thumbnailTracks={course?.thumbnailTracks || undefined}
                />
              ) : (
                <FileUi
                  id={slug?.slug}
                  childId={title?.idEdit}
                  folder={`${nameCourse}/${title?.folderChirld}`}
                  course={course}
                  setCourse={setCourse}
                />
              ))) ||
              (title?.type === "parent" && (
                <Card title={`Thông tin về học phần ${title.title}`}>
                  <Typography.Text className="me-2">
                    Có tổng cộng{" "}
                    <span>
                      <Typography.Link>{title.amount}</Typography.Link>
                    </span>{" "}
                    bài học
                  </Typography.Text>
                  <Typography.Text className="me-2">
                    Nhấn vào một bài học để chỉnh sửa thông tin
                  </Typography.Text>
                </Card>
              )) || (
                <Card>
                  <Empty
                    description={
                      <Typography.Text>
                        Vui lòng chọn 1 học phần để xem thông tin chi tiết
                      </Typography.Text>
                    }
                  />
                </Card>
              )}
          </Col>

          {title?.type === "children" && (
            <Col className="flex flex-col gap-4" md={{ span: 3 }} span={24}>
              {title?.type === "children" && course?.src ? (
                <>
                  <Button
                    type="primary"
                    ghost
                    onClick={() =>
                      navigate(`/admin/course/${slug?.slug}/page/${title._id}`)
                    }
                  >
                    Bài viết
                  </Button>

                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      courseChildrenApi
                        .putChildren({
                          id: slug?.slug,
                          childId: title?.idEdit,
                          public: title?.public ? false : true,
                        })
                        .then(() => {
                          toastSuccess(
                            "public",
                            "Cập Nhập Trạng Thái Thành Công!",
                            "Bài học có thể xem thử"
                          );
                        });

                      setTitle({ ...title, public: !title?.public });
                    }}
                    icon={title?.public ? <FaCheck /> : <FaXmark />}
                  >
                    Xem Thử
                  </Button>

                  <FileUpload
                    id={slug?.slug}
                    childId={title?.idEdit}
                    folder={`${nameCourse}/${title?.folderChirld}`}
                    data={course}
                    setData={setCourse}
                  />
                </>
              ) : (
                <>
                  {/* <Button type='primary' ghost onClick={() => setOpenPage(true)}>Bài viết</Button> */}
                </>
              )}
            </Col>
          )}
        </Row>
      </Card>

      <Modal
        title="Thêm học phần"
        centered
        open={openAddCourseModule}
        onOk={() => formAddCourseModule.submit()}
        onCancel={() => setOpenAddCourseModule(false)}
        width={600}
      >
        <Form
          form={formAddCourseModule}
          name="customForm"
          layout="vertical"
          onFinish={handleAddCourseModule}
        >
          <Form.Item
            className="mb-2"
            name="title"
            label="Tên học phần"
            rules={[{ required: true, message: "Nhập tên học phần!" }]}
          >
            <Input placeholder="Nhập tên học phần" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Thêm bài học vào học phần: ${children?.title}`}
        centered
        open={openAddChildren}
        onOk={() => formAddChildrenModule.submit()}
        onCancel={() => setOpenAddChildren(false)}
        width={600}
      >
        <Form
          form={formAddChildrenModule}
          name="customForm"
          layout="vertical"
          onFinish={handleAddChildrenModule}
        >
          <Form.Item
            className="mb-2 hidden"
            name="moduleId"
            label="ID"
            rules={[{ required: true, message: "Nhập tên học phần!" }]}
          >
            <Input placeholder="Nhập tên học phần" size="large" />
          </Form.Item>

          <Form.Item
            className="mb-2"
            name="title"
            label="Tên bài học"
            rules={[{ required: true, message: "Nhập tên học phần!" }]}
          >
            <Input placeholder="Nhập tên học phần" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Cập nhập tên ${children?.children ? "học phần" : "bài học"}: ${
          children?.title
        }`}
        centered
        open={openEdit}
        onOk={() => formEdit.submit()}
        onCancel={() => setOpenEdit(false)}
        width={600}
      >
        <Form
          form={formEdit}
          name="customForm"
          layout="vertical"
          onFinish={handlePutTitle}
        >
          <Form.Item className="mb-2 hidden" name="idEdit" label="ID">
            <Input placeholder="Nhập tên học phần" size="large" />
          </Form.Item>

          <Form.Item
            className="mb-2"
            name="title"
            label="Tên bài học"
            rules={[{ required: true, message: "Nhập tên học phần!" }]}
          >
            <Input placeholder="Nhập tên học phần" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutAdmin>
  );
};

export default Course;
