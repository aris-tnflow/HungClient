import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Tabs,
  Form,
  Typography,
  Select,
  Tag,
  Spin,
} from "antd";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";

import {
  FilterDate,
  FilterSelect,
  FilterSelectArray,
  FilterText,
} from "~/components/table/Filter";
import { FindNameById, FormatDay, FormatTag } from "~/components/table/Format";
import { exportDataExcel } from "~/utils/export";

import { useDispatch, useSelector } from "react-redux";
import {
  getUsersApi,
  delUsersApi,
  putUsersApi,
  searchUserApi,
} from "~/redux/slices/Data/usersSlice";
import {
  getRoleApi,
  addRoleApi,
  delRoleApi,
  putRoleApi,
} from "~/redux/slices/Data/roleSlice";
import { getCourseApi } from "~/redux/slices/Data/coursesSlice";
import { genericDispatch } from "~/redux/utils";
import { IoIosAddCircle } from "react-icons/io";
import { HiViewGridAdd } from "react-icons/hi";
import { userApi } from "~/apis/userApi";
import { debounce } from "lodash";
import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import { IoReload } from "react-icons/io5";

const User = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth?.user?.userType);

  const { users, loading } = useSelector((state) => state.users);
  const { roles, loading: loadingRoles } = useSelector((state) => state.roles);
  const { courses, loading: loadingCourses } = useSelector(
    (state) => state.courses
  );

  const [formRole] = Form.useForm();
  const [formCourses] = Form.useForm();
  const [formMultiAdd] = Form.useForm();

  const [openRole, setOpenRole] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openMultiAdd, setOpenMultiAdd] = useState(false);

  const [search, setSearch] = useState({});
  const [isSearch, setIsSearch] = useState(false);

  const [current, setCurrent] = useState(
    localStorage.getItem(location?.pathname?.split("/")?.pop()) || 1
  );

  const dataUser = useMemo(
    () =>
      users?.newData
        ?.filter((user) => user?.userType !== "admin")
        ?.map((user) => ({
          ...user,
          key: user?._id,
          activeStatus: user?.activeStatus ? "Cho phép" : "Chặn",
        })),
    [users]
  );

  const dataRole = useMemo(
    () =>
      roles?.newData?.map((role) => ({
        ...role,
        key: role._id,
      })),
    [roles]
  );

  const dataCourses = useMemo(
    () =>
      courses?.newData
        ?.filter((course) => course.price !== 0)
        .map((course) => ({
          key: course._id,
          label: course.name,
          value: course._id,
        })),
    [courses]
  );

  const dataCoursesFliter = useMemo(
    () =>
      courses?.newData
        ?.filter((course) => course.price !== 0)
        .map((course) => ({
          key: course._id,
          text: course.name,
          value: course._id,
        })),
    [courses]
  );

  const handleSearchPage = ({ searchText, searchedColumn }) => {
    if (searchText) {
      genericDispatch(
        dispatch,
        searchUserApi({
          [searchedColumn]: searchText,
          page: 1,
          limit: localStorage.getItem("pageSize") || 10,
        })
      );
      setCurrent(1);
      setIsSearch(true);
      setSearch({ [searchedColumn]: searchText });
    } else {
      setIsSearch(false);
      genericDispatch(
        dispatch,
        getUsersApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
      setCurrent(1);
      localStorage.setItem(location?.pathname?.split("/")?.pop(), 1);
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      width: "9%",
      editable: false,
      ...FilterText({
        dataIndex: "name",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "12%",
      editable: false,
      ...FilterText({
        dataIndex: "email",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      width: "6%",
      editable: false,
      ...FilterText({
        dataIndex: "phone",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Hoạt động",
      dataIndex: "activeStatus",
      width: "6%",
      editable: true,
      type: "select",
      optionSelect: [
        { value: true, label: "Cho phép" },
        { value: false, label: "Chặn" },
      ],
    },
    ...(userType === "admin"
      ? [
          {
            title: "Quyền",
            dataIndex: "userType",
            width: "5%",
            editable: true,
            type: "select",
            optionSelect: [
              { value: "admin-control", label: "Admin" },
              { value: "user", label: "User" },
            ],
          },
        ]
      : []),
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "5%",
      ...FilterDate({ dataIndex: "createdAt" }),
      render: (data) => FormatDay(data),
    },
    {
      title: (
        <div className="flex justify-center items-center gap-2">
          <Typography>Khóa học</Typography>
          {userType === "admin" && (
            <Button
              onClick={() => setOpenMultiAdd(true)}
              icon={<HiViewGridAdd size={25} />}
              type="text"
            ></Button>
          )}
        </div>
      ),
      children: [
        ...(userType === "admin"
          ? [
              {
                title: <div className="text-center">Thêm</div>,
                width: "4%",
                editable: false,
                render: (text, record) => (
                  <div className="flex justify-center">
                    <Button
                      type="text"
                      icon={<IoIosAddCircle size={20} />}
                      onClick={() => {
                        formCourses.setFieldsValue(record);
                        setOpenCourses(true);
                      }}
                    ></Button>
                  </div>
                ),
              },
            ]
          : []),
        {
          title: <div className="text-center">Khóa học đã mua</div>,
          dataIndex: "courses",
          width: "10%",
          type: "select",
          editable: false,
          ...FilterSelectArray("courses", dataCoursesFliter),
          render: (text, record) =>
            text?.map((item, index) =>
              item &&
              courses?.newData &&
              Array.isArray(courses?.newData) &&
              courses?.newData?.length > 0 ? (
                <>
                  <div className="flex flex-col my-1">
                    <Tag className="flex items-center h-5" color="warning">
                      <Typography.Text
                        suffix="..."
                        ellipsis={{ rows: 1 }}
                        type="warning"
                        className="text-xs !m-0 !p-0"
                      >
                        {FindNameById(item, courses?.newData, "name")}
                      </Typography.Text>
                    </Tag>
                  </div>
                </>
              ) : null
            ),
        },
      ],
    },
  ];

  const columnsRole = [
    {
      title: "Tên quyền",
      dataIndex: "nameRole",
      width: "20%",
      editable: true,
      ...FilterText({ dataIndex: "nameRole" }),
      render: (data) => (
        <Typography.Text ellipsis={{ suffix: "" }}>{data}</Typography.Text>
      ),
    },
    {
      title: "Quản lý",
      dataIndex: "role",
      width: "40%",
      type: "select",
      optionSelect: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
      ],
      editable: true,
      render: (role) => (
        <>
          <FormatTag keywords={role} />
        </>
      ),
    },
  ];

  const handleDelUser = (data) => {
    genericDispatch(dispatch, delUsersApi(data));
  };

  const handlePutUser = (data) => {
    data.activeStatus =
      data.activeStatus === "Chặn"
        ? false
        : data.activeStatus === "Cho phép"
        ? true
        : data.activeStatus;
    genericDispatch(dispatch, putUsersApi(data));
  };

  const handleAddRole = (data) => {
    genericDispatch(dispatch, addRoleApi(data), () => {
      setOpenRole(false);
      formRole.resetFields();
    });
  };

  const handlePutRole = (data) => {
    genericDispatch(dispatch, putRoleApi(data));
  };

  const handleDelRole = (data) => {
    genericDispatch(dispatch, delRoleApi(data));
  };

  const handlePutCourse = (data) => {
    data.id = data.key;
    genericDispatch(dispatch, putUsersApi(data), () => {
      setOpenCourses(false);
    });
  };

  const handleMultiAdd = (data) => {
    userApi.putCourseByEmails(data).then(() => {
      toastSuccess("put", "Cập Nhập Thành Công!", "Dữ liệu đã được cập nhập!");
      setOpenMultiAdd(false);

      if (isSearch) {
        dispatch(
          searchUserApi({
            [Object.keys(search)[0]]: search[Object.keys(search)[0]],
            page: current,
            limit: localStorage.getItem("pageSize") || 10,
          })
        );
      } else {
        dispatch(
          getUsersApi({
            page: current,
            limit: localStorage.getItem("pageSize") || 10,
          })
        );
      }
    });
  };

  function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <Select
        size="large"
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
    );
  }

  async function fetchUserList(email) {
    const response = await userApi.search({ email });
    return response?.newData?.map((user) => ({
      label: user.email,
      value: user.email,
    }));
  }

  useEffect(() => {
    if (loading) {
      dispatch(
        getUsersApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
      dispatch(getRoleApi());
    }
  }, []);

  useEffect(() => {
    if (loadingCourses === true) {
      dispatch(getCourseApi());
    }
  }, []);

  return (
    <LayoutAdmin
      header={"NGƯỜI DÙNG"}
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
                    getUsersApi({
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

          <Button
            onClick={() => {
              toastLoading("course", "Đang Lấy Dữ Liệu Người Dùng...");

              userApi
                .get({ page: 1, limit: 999999999 })
                .then((res) => {
                  const formatUser = res?.newData
                    ?.filter((user) => user.userType !== "admin")
                    ?.map((user) => ({
                      _id: user._id,
                      "Họ và tên": user.name,
                      Email: user.email,
                      Quyền:
                        user.userType === "user" ? "Người dùng" : "Quản lý",
                      "Trạng thái": user.activeStatus ? "Cho phép" : "Chặn",
                      "Điện thoại": user.phone,
                      "Khóa học đã mua": user.courses
                        .map((courseId) => {
                          const course = dataCoursesFliter.find(
                            (item) => item.key === courseId
                          );
                          return course ? course.text : courseId;
                        })
                        .join(", "),
                      "Ngày tạo": FormatDay(user.createdAt),
                    }));
                  exportDataExcel(formatUser, "Aris-Users.xlsx");
                  toastSuccess(
                    "course",
                    "Xuất File Excel Thành Công!",
                    "Vui lòng tải file tại đây!"
                  );
                })
                .catch(() => {
                  toastError("course", "Xuất File Excel Thất Bại!");
                });
            }}
            type="primary"
          >
            Xuất file Excel
          </Button>
          <Button
            className="hidden-title"
            onClick={() => {
              if (isSearch) {
                genericDispatch(
                  dispatch,
                  searchUserApi({
                    [Object.keys(search)[0]]: search[Object.keys(search)[0]],
                    page: current,
                    limit: localStorage.getItem("pageSize") || 10,
                  })
                );
              } else {
                genericDispatch(
                  dispatch,
                  getUsersApi({
                    page: current,
                    limit: localStorage.getItem("pageSize") || 10,
                  })
                );
              }
            }}
            icon={<IoReload size={20} />}
            type="text"
          ></Button>
        </>
      }
    >
      <Table
        isSearch={isSearch}
        Api={getUsersApi}
        ApiSearch={searchUserApi}
        search={search}
        total={users?.totalItems}
        dragMode={false}
        width={"4%"}
        current={current}
        setCurrent={setCurrent}
        loading={loading}
        data={dataUser}
        columns={columns}
        onSave={handlePutUser}
        onDelete={handleDelUser}
      />

      <Modal
        centered
        open={openRole}
        onCancel={() => setOpenRole(false)}
        footer={null}
        width={750}
      >
        <Tabs
          centered
          items={[
            {
              label: "Thêm quyền quản trị",
              key: "1",
              children: (
                <>
                  <Form
                    form={formRole}
                    name="customForm"
                    layout="vertical"
                    onFinish={handleAddRole}
                  >
                    <Form.Item
                      className="mb-3"
                      name="nameRole"
                      label="Tên quyền"
                      rules={[{ required: true, message: "Nhập tên quyền!" }]}
                    >
                      <Input placeholder="Nhập tên quyền" />
                    </Form.Item>

                    <Form.Item
                      className="mb-3"
                      name="role"
                      label="Quyền"
                      rules={[{ required: true, message: "Chọn các quyền!" }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn chức năng quản lý"
                        options={[
                          { value: "user", label: "Người dùng" },
                          { value: "admin", label: "Admin" },
                        ]}
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      loading={loadingRoles}
                      onClick={() => formRole.submit()}
                      className="flex float-end"
                    >
                      Thêm quyền
                    </Button>
                  </Form>
                </>
              ),
            },
            {
              label: "Chỉnh sửa quyền quản trị",
              key: "2",
              children: (
                <>
                  <Table
                    dragMode={false}
                    loading={loadingRoles}
                    data={dataRole}
                    columns={columnsRole}
                    scroll={{ x: 500, y: 350 }}
                    width={"10%"}
                    onSave={handlePutRole}
                    onDelete={handleDelRole}
                  />
                </>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        title=<>
          Khóa học của học viên:{" "}
          <Typography.Text type="danger">
            {formCourses.getFieldValue("name")}
          </Typography.Text>
        </>
        centered
        open={openCourses}
        onOk={() => {
          formCourses.submit();
        }}
        onCancel={() => {
          setOpenCourses(false);
          formCourses.resetFields();
        }}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={formCourses}
          name="customFormCourses"
          layout="vertical"
          onFinish={handlePutCourse}
        >
          <Form.Item
            className="mb-4 hidden"
            name="key"
            label="Khóa học"
            rules={[
              { required: true, message: "Chọn khóa học cần kích hoạt!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="mb-4" name="courses" label="Kích hoạt khóa học">
            <Select
              mode="multiple"
              options={dataCourses}
              placeholder="Chọn khóa học cần kích hoạt"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm nhiều khóa học cho học viên"
        centered
        open={openMultiAdd}
        onOk={() => {
          formMultiAdd.submit();
        }}
        onCancel={() => setOpenMultiAdd(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={formMultiAdd}
          name="customFormMultiAdd"
          layout="vertical"
          onFinish={handleMultiAdd}
        >
          <Form.Item
            className="mb-4"
            name="email"
            label="Email người dùng"
            rules={[{ required: true, message: "Chọn email người dùng!" }]}
          >
            <DebounceSelect
              mode="multiple"
              placeholder="Nhập email người dùng"
              fetchOptions={fetchUserList}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            className="mb-4"
            name="courses"
            label="Khóa học"
            rules={[{ required: true, message: "Chọn khóa học!" }]}
          >
            <Select
              size="large"
              mode="multiple"
              options={dataCourses}
              placeholder="Chọn khóa học cần kích hoạt"
            />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutAdmin>
  );
};

export default User;
