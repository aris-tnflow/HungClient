import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Typography,
  Form,
  Tabs,
  Tooltip,
  Select,
} from "antd";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { toastError } from "~/components/toast";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";
import { FilterSelect, FilterText } from "~/components/table/Filter";
import { FindNameById, FormatTag } from "~/components/table/Format";

import { FaCopy, FaEye } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";

import { genericDispatch } from "~/redux/utils";
import { useDispatch, useSelector } from "react-redux";
4;
import {
  getPageApi,
  addPageApi,
  delPageApi,
  putPageApi,
  putOrderApi,
  copyPageApi,
  searchPageApi,
} from "~/redux/slices/Data/pagesSlice";
import {
  getGroupApi,
  addGroupApi,
  delGroupApi,
  putGroupApi,
} from "~/redux/slices/Data/groupPageSlice";

const Pages = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  const [formAddPage] = Form.useForm();
  const [formAddCategory] = Form.useForm();

  const { pages, loading } = useSelector((state) => state.pages);
  const { groupPages: data, loading: loadingGroup } = useSelector(
    (state) => state.groupPages
  );
  const groupPages = data?.newData;

  const [openAddPage, setOpenAddPage] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [search, setSearch] = useState({});
  const [isSearch, setIsSearch] = useState(false);

  const [drag, setDrag] = useState(
    localStorage.getItem("drag") === "true" ? true : false
  );

  const [current, setCurrent] = useState(
    localStorage.getItem(location?.pathname?.split("/")?.pop()) || 1
  );

  const dataPages = useMemo(
    () =>
      pages?.newData?.map((page) => ({
        ...page,
        key: page._id,
      })),
    [pages]
  );

  const dataGroup = useMemo(
    () =>
      groupPages?.map((groupPage) => ({
        ...groupPage,
        key: groupPage._id,
      })),
    [groupPages]
  );

  const handleSearchPage = ({ searchText, searchedColumn }) => {
    if (searchText) {
      genericDispatch(
        dispatch,
        searchPageApi({
          [searchedColumn]: searchText,
          page: 1,
          limit: localStorage.getItem("pageSize") || 10,
        })
      );
      setCurrent(1);
      setIsSearch(true);
      setSearch({ [searchedColumn]: searchText });
    } else {
      genericDispatch(
        dispatch,
        getPageApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
      setCurrent(1);
      localStorage.setItem(location?.pathname?.split("/")?.pop(), 1);
    }
  };

  // Column
  const columns = [
    {
      title: "Tên trang",
      dataIndex: "name",
      width: "12%",
      editable: true,
      ...FilterText({
        dataIndex: "name",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Đường dẫn trang",
      dataIndex: "slug",
      width: "12%",
      editable: false,
      ...FilterText({
        dataIndex: "slug",
        handleTableChange: handleSearchPage,
      }),
      render: (slug, data) => {
        const groupSlug = findGroupSlug(groupPages, data);

        return (
          <>
            <Typography.Text
              className="!mb-0"
              copyable={{
                text: groupSlug ? `/${groupSlug}/${slug}` : `/${slug}`,
              }}
            >
              {groupSlug ? `/${groupSlug}/${slug}` : `/${slug}`}
            </Typography.Text>
          </>
        );
      },
    },
    {
      title: "Tiêu đề trang",
      dataIndex: "title",
      width: "12%",
      editable: true,
      ellipsis: true,
      ...FilterText({
        dataIndex: "title",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "12%",
      editable: true,
      ...FilterText({
        dataIndex: "description",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Từ khóa",
      dataIndex: "keywords",
      width: "12%",
      type: "tag",
      editable: true,
      render: (keywords) => <FormatTag keywords={keywords} />,
    },
    {
      title: "Nhóm",
      dataIndex: "group",
      width: "12%",
      type: "select",
      editable: true,
      optionSelect: [
        { label: "Không có", value: null },
        ...(Array.isArray(groupPages) && groupPages.length > 0
          ? groupPages.map((item) => ({ label: item.group, value: item._id }))
          : []),
      ],
      ...(Array.isArray(groupPages) && groupPages?.length > 0
        ? FilterSelect({
            dataIndex: "group",
            handleTableChange: handleSearchPage,
            options: groupPages?.map((item) => ({
              label: item.group,
              value: item._id,
            })),
          })
        : {}),

      render: (group) =>
        group &&
        groupPages &&
        Array.isArray(groupPages) &&
        groupPages?.length > 0
          ? FindNameById(group, groupPages, "group")
          : null,
    },
  ];

  const columnsCategory = [
    {
      title: "Tên nhóm",
      dataIndex: "group",
      width: "60%",
      type: "text",
      editable: true,
    },
    {
      title: "Link trang",
      dataIndex: "slug",
      width: "60%",
      type: "text",
      render: (slug) => (
        <Typography.Text
          className="!mb-0"
          copyable={{
            text: `/${slug}`,
          }}
        >
          /{slug}
        </Typography.Text>
      ),
    },
  ];

  const findGroupSlug = (dataGroup, data) => {
    return dataGroup.find((group) => group._id === data.group)?.slug;
  };

  // Pages
  const handleAddPage = (data) => {
    genericDispatch(dispatch, addPageApi(data), () => {
      setOpenAddPage(false);
      formAddPage.resetFields();
    });
  };

  const handlePutPage = (data) => {
    genericDispatch(dispatch, putPageApi(data));
  };

  const handleDelPage = (data) => {
    genericDispatch(dispatch, delPageApi(data));
  };

  // Group
  const handleAddGroup = (data) => {
    genericDispatch(dispatch, addGroupApi(data), () => {
      setOpenAddCategory(false);
      formAddCategory.resetFields();
    });
  };

  const handlePutGroup = (data) => {
    genericDispatch(dispatch, putGroupApi(data));
  };

  const handleDelGroup = (data) => {
    genericDispatch(dispatch, delGroupApi(data));
  };

  useEffect(() => {
    if (loading) {
      dispatch(
        getPageApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
    }
  }, []);

  useEffect(() => {
    if (loadingGroup === true) {
      dispatch(getGroupApi());
    }
  }, []);

  return (
    <LayoutAdmin
      title={"Bài viết"}
      header={"BÀI VIẾT"}
      button={
        <>
          {isSearch && (
            <>
              <Typography.Text className="mb-0">Đang lọc theo</Typography.Text>
              {Object.entries(search).map(([key, value]) => (
                <Typography.Text type="danger" className="!mb-0" key={key}>
                  {key}: {value}
                </Typography.Text>
              ))}
              <Button
                onClick={() => {
                  setIsSearch(false);
                  genericDispatch(
                    dispatch,
                    getPageApi({
                      page: 1,
                      limit: localStorage.getItem("pageSize") || 10,
                    })
                  );
                  setCurrent(1);
                  localStorage.setItem(
                    location?.pathname?.split("/")?.pop(),
                    1
                  );
                }}
              >
                Bỏ lọc
              </Button>
            </>
          )}
          {drag ? (
            <Button
              onClick={() => {
                setDrag(false);
                localStorage.setItem("drag", "false");
              }}
            >
              <Typography>Tắt sắp xếp</Typography>
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setDrag(true);
                localStorage.setItem("drag", "true");
              }}
            >
              Bật sắp xếp
            </Button>
          )}

          <Button type="primary" onClick={() => setOpenAddCategory(true)}>
            Thêm nhóm
          </Button>
          <Button type="primary" onClick={() => setOpenAddPage(true)}>
            Thêm trang
          </Button>
        </>
      }
    >
      <Table
        dragMode={drag}
        Api={getPageApi}
        ApiSearch={searchPageApi}
        isSearch={isSearch}
        search={search}
        current={current}
        setCurrent={setCurrent}
        ApiPut={putOrderApi}
        total={pages?.totalItems}
        loading={loading}
        data={dataPages}
        columns={columns}
        onSave={handlePutPage}
        onDelete={handleDelPage}
        width={"10%"}
        button={(record) => {
          const groupSlug = findGroupSlug(groupPages, record);
          return (
            <>
              <Tooltip title="Xem trang">
                <NavLink
                  to={
                    record.slug === "trang-chu"
                      ? "/"
                      : groupSlug
                      ? `/${groupSlug}/${record.slug}`
                      : `/${record.slug}`
                  }
                  target="_blank"
                >
                  <FaEye size={22} color="#006aff" />
                </NavLink>
              </Tooltip>

              <Tooltip title="Sao chép trang">
                <Typography
                  onClick={() =>
                    genericDispatch(dispatch, copyPageApi(record._id))
                  }
                >
                  <FaCopy size={22} color="#55ff00" />
                </Typography>
              </Tooltip>

              {isMobile ? (
                <>
                  <Tooltip title="Chỉnh sửa trang">
                    <Typography.Link
                      onClick={() =>
                        toastError(
                          "",
                          "Bạn không thể truy cập trang này!",
                          "Vui lòng sử dụng máy tính để trãi nghiệm tốt nhất!"
                        )
                      }
                    >
                      <FaFilePen size={22} color="rgb(255 127 0)" />
                    </Typography.Link>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Chỉnh sửa trang">
                  <a href={`/admin/page/${record.slug}`}>
                    <FaFilePen size={22} color="rgb(255 127 0)" />
                  </a>
                </Tooltip>
              )}
            </>
          );
        }}
      />

      {/* Pages */}
      <Modal
        title="Thêm trang"
        centered
        open={openAddPage}
        onOk={() => formAddPage.submit()}
        onCancel={() => setOpenAddPage(false)}
        confirmLoading={loading}
        width={500}
      >
        <Form
          form={formAddPage}
          name="customForm"
          layout="vertical"
          onFinish={handleAddPage}
        >
          <Form.Item
            label="Tên trang"
            className="mb-2"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên trang!" }]}
          >
            <Input className="mb-2" placeholder="Nhập tên trang" />
          </Form.Item>

          <Form.Item label="Nhóm" className="mb-2" name="group">
            <Select
              placeholder="Chọn nhóm"
              options={groupPages?.map((item) => ({
                label: item.group,
                value: item._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Group */}
      <Modal
        centered
        open={openAddCategory}
        confirmLoading={loadingGroup}
        onOk={() => formAddCategory.submit()}
        onCancel={() => setOpenAddCategory(false)}
        footer={null}
        width={600}
      >
        <Tabs
          centered
          items={[
            {
              label: "Thêm nhóm",
              key: "1",
              children: (
                <>
                  <Form
                    form={formAddCategory}
                    name="customForm"
                    layout="vertical"
                    onFinish={handleAddGroup}
                  >
                    <Form.Item
                      className="mb-3"
                      name="group"
                      label="Tên nhóm"
                      rules={[{ required: true, message: "Nhập tên nhóm!" }]}
                    >
                      <Input placeholder="Nhập nhóm" />
                    </Form.Item>

                    <Button
                      type="primary"
                      loading={loadingGroup}
                      onClick={() => formAddCategory.submit()}
                      className="flex float-end"
                    >
                      Thêm nhóm
                    </Button>
                  </Form>
                </>
              ),
            },
            {
              label: "Chỉnh sửa nhóm",
              key: "2",
              children: (
                <>
                  <Table
                    dragMode={false}
                    loading={loadingGroup}
                    data={dataGroup}
                    isScroll={false}
                    columns={columnsCategory}
                    width={"10%"}
                    onSave={handlePutGroup}
                    onDelete={handleDelGroup}
                  />
                </>
              ),
            },
          ]}
        />
      </Modal>
    </LayoutAdmin>
  );
};

export default Pages;
