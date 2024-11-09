import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Tree,
  Button,
  theme,
  Breadcrumb,
  Typography,
  Modal,
  Input,
  Spin,
  Empty,
  Form,
} from "antd";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import { FaRegListAlt, FaHome } from "react-icons/fa";
import { FaFile, FaFolderPlus, FaVideo } from "react-icons/fa6";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { FileMosaic } from "@files-ui/react";
import "./FileManager.css";
import { handleDownload } from "~/components/file/Function";
import Folder from "~/components/file/Folder";
import Files from "~/components/upload/Files";
import { useDispatch, useSelector } from "react-redux";
import { getFoldersApi } from "~/redux/slices/Data/folderManagerSlice";
import {
  getFileInFoldersApi,
  delFileInFoldersApi,
  addFolderInFoldersApi,
  delFolderInFoldersApi,
} from "~/redux/slices/Data/fileManagerSlice";
import { baseURL } from "~/utils";
import { convertBytes } from "~/utils/formatGrapeJs";
import { folderMangerApi } from "~/apis/fileMangerApi";
import { genericDispatch } from "~/redux/utils";

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useDispatch();

  const [type, setType] = useState("horizontal");
  const [openModal, setOpenModal] = useState(false);
  const { folder, loading } = useSelector((state) => state.folder);
  const { file, loading: loadingFile } = useSelector((state) => state.file);
  const [breadCrumb, setBreadCrumb] = useState(["uploads"]);

  const [form] = Form.useForm();

  const getBreadcrumbByKey = (targetKey, data, path = ["uploads"]) => {
    for (let node of data) {
      if (node.key === targetKey) {
        return [...path, node.title];
      }
      if (node.children) {
        const result = getBreadcrumbByKey(targetKey, node.children, [
          ...path,
          node.title,
        ]);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const getFileInFolder = (keys, event) => {
    const { node } = event;
    const breadCrumb = getBreadcrumbByKey(node.key, folder?.newData?.children);
    if (breadCrumb) {
      setBreadCrumb(breadCrumb);
      dispatch(getFileInFoldersApi({ folderName: breadCrumb.join("/") }));
    }
  };

  const handleAddFolder = (values) => {
    const parentPath = breadCrumb.join("/");
    const { name } = values;

    genericDispatch(
      dispatch,
      addFolderInFoldersApi({
        parentPath: parentPath,
        name,
      }),
      () => {
        setOpenModal(false);
        form.resetFields();
      }
    );
  };

  useEffect(() => {
    if (loading) {
      dispatch(getFoldersApi());
    }
  }, []);

  useEffect(() => {
    if (loadingFile) {
      dispatch(getFileInFoldersApi({ folderName: "uploads" }));
    }
  }, []);

  return (
    <LayoutAdmin
      title={"Quản lý file"}
      header="QUẢN LÝ FILE"
      button={
        <Button
          className="hidden-title"
          onClick={() =>
            dispatch(getFileInFoldersApi({ folderName: breadCrumb.join("/") }))
          }
          icon={<IoReload size={20} />}
          type="text"
        ></Button>
      }
    >
      <Row style={{ height: "calc(100vh - 104px)" }}>
        <Col
          className="p-3"
          style={{ backgroundColor: colorBgContainer, borderRadius: 6 }}
          span={24}
        >
          <Row>
            <Col className="flex gap-2" xxl={{ span: 11 }} span={24}>
              <FaHome size={20} />
              <Breadcrumb separator="/">
                {breadCrumb?.map((item, index) => (
                  <Breadcrumb.Item
                    className="cursor-pointer"
                    onClick={() => console.log(item)}
                    key={index}
                  >
                    {item}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </Col>

            <Col xxl={{ span: 13 }} md={{ span: 24 }} span={24}>
              <div className="flex flex-wrap gap-2 justify-center xl:justify-end">
                <Button
                  className="hidden-title"
                  onClick={() => setOpenModal(true)}
                  icon={<FaFolderPlus size={20} />}
                  type="text"
                >
                  Thêm thư mục
                </Button>
                <Files
                  name="files"
                  folder={breadCrumb.join("/")}
                  multiple={true}
                  api={getFileInFoldersApi}
                />
                <Button
                  className="hidden-title"
                  onClick={() => setType("horizontal")}
                  type="text"
                  icon={<BsFillGrid3X3GapFill size={20} />}
                ></Button>
                <Button
                  className="hidden-title"
                  onClick={() => setType("vertical")}
                  type="text"
                  icon={<FaRegListAlt size={20} />}
                ></Button>
              </div>
            </Col>

            <Col className="h-full overflow-auto" lg={{ span: 5 }} span={24}>
              <Tree.DirectoryTree
                className="p-4 w-full treeView"
                showLine
                onSelect={getFileInFolder}
                defaultSelectedKeys={["0-0-0"]}
                titleRender={(node) => {
                  return <p className="text-inline"> {node.title}</p>;
                }}
                treeData={folder?.newData?.children}
              />
            </Col>

            <Col className="h-full overflow-auto" lg={{ span: 19 }} span={24}>
              <Row
                className="overflow-auto p-4 h-full"
                style={{ backgroundColor: colorBgContainer, borderRadius: 6 }}
              >
                <Col span={24} style={{ height: "calc(100vh - 204px)" }}>
                  {!loadingFile ? (
                    <Row gutter={18}>
                      {file?.newData?.children?.length === 0 ? (
                        <Col span={24}>
                          <Empty description="Không có dữ liệu" />
                        </Col>
                      ) : (
                        file?.newData?.children?.map((item, index) => {
                          const isFile = item.type === "file";
                          const spanProps = {
                            xxl: { span: type === "horizontal" ? 3 : 8 },
                            xl: { span: type === "horizontal" ? 4 : 8 },
                            lg: { span: type === "horizontal" ? 6 : 12 },
                            md: { span: type === "horizontal" ? 6 : 12 },
                            span: type === "horizontal" ? 12 : 24,
                          };

                          const excludedFolders = [
                            "3d",
                            "backup",
                            "contacts",
                            "course",
                            "image",
                            "img",
                            "plugins",
                            "video",
                          ];

                          const fileComponent = (
                            <FileMosaic
                              key={index}
                              name={item?.name}
                              type={item.mimeType}
                              size={item?.size}
                              imageUrl={`${baseURL}/${item?.path}`}
                              onDownload={() =>
                                handleDownload(
                                  item?.name,
                                  `${baseURL}/${item?.path}`
                                )
                              }
                              onDelete={
                                item?.exists === false
                                  ? () => {
                                      Modal.confirm({
                                        title: `Bạn có chắc chắn muốn xóa tệp ${item?.name}?`,
                                        centered: true,
                                        onOk: () => {
                                          dispatch(
                                            delFileInFoldersApi({
                                              filePath: item?._id,
                                            })
                                          );
                                        },
                                      });
                                    }
                                  : undefined
                              }
                            />
                          );

                          const folderComponent = (
                            <Folder
                              // onDoubleClick={() => dispatch(getFileInFoldersApi({ folderName: `${breadCrumb.join('/')}/${item?.name}` }))}
                              name={item?.name}
                              size={convertBytes(item?.size)}
                              type={item.type}
                              onDownload={() => {
                                folderMangerApi
                                  .dowFolder({
                                    folderPath: `${breadCrumb.join("/")}/${
                                      item?.name
                                    }`,
                                  })
                                  .then((res) => {
                                    const blob = new Blob([res]);
                                    const url =
                                      window.URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.style.display = "none";
                                    a.href = url;
                                    a.download = `${item?.name}.zip`; // Đặt tên tệp zip
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                  })
                                  .catch((err) => {
                                    console.error(
                                      "Error downloading folder:",
                                      err
                                    );
                                  });
                              }}
                              // onDelete={
                              //   item?.exists === false ||
                              //   !excludedFolders.includes(item?.name)
                              //     ? () => {
                              //         dispatch(
                              //           delFolderInFoldersApi({
                              //             parentPath: breadCrumb.join("/"),
                              //             namefolder: item?.name,
                              //           })
                              //         );
                              //         setTimeout(() => {
                              //           dispatch(
                              //             getFileInFoldersApi({
                              //               folderName: breadCrumb.join("/"),
                              //             })
                              //           );
                              //         }, 50);
                              //       }
                              //     : undefined
                              // }
                            />
                          );

                          const content =
                            type === "horizontal" ? (
                              isFile ? (
                                fileComponent
                              ) : (
                                folderComponent
                              )
                            ) : (
                              <Row>
                                <Col span={24}>
                                  <div className="flex items-center gap-2 mb-2">
                                    {item.type === "file" ? (
                                      <>
                                        <>
                                          {item?.mimeType.includes("video") ? (
                                            <FaVideo size={30} />
                                          ) : item?.mimeType.includes(
                                              "image"
                                            ) ? (
                                            <img
                                              className="size-8 object-cover"
                                              src={`${baseURL}/${item?.path}`}
                                              alt={item?.name}
                                            />
                                          ) : (
                                            <FaFile size={30} />
                                          )}
                                        </>
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          className="size-8 object-cover"
                                          src="/asset/folder.png"
                                          alt=""
                                        />
                                      </>
                                    )}
                                    <Typography.Text className="text-inline">
                                      {item?.name}
                                    </Typography.Text>
                                  </div>
                                </Col>
                              </Row>
                            );

                          return (
                            <Col key={index} {...spanProps}>
                              {content}
                            </Col>
                          );
                        })
                      )}
                    </Row>
                  ) : (
                    <div
                      className="flex items-center justify-center"
                      style={{ height: "calc(100vh - 204px)" }}
                    >
                      <Spin tip="Loading" size="large" />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title="Thêm thư mục"
        centered
        open={openModal}
        onOk={() => form.submit()}
        onCancel={() => setOpenModal(false)}
      >
        <Form
          form={form}
          name="customForm"
          layout="vertical"
          onFinish={handleAddFolder}
        >
          <Form.Item
            label="Tên thư mục"
            name="name"
            className="mb-2"
            layout="vertical"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Nhập tên thư mục" />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutAdmin>
  );
};

export default App;
