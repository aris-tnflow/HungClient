import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Modal, Typography } from "antd";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";
import {
  FilterText,
  FilterDate,
  FilterSelect,
} from "~/components/table/Filter";
import Invoice from "./Invoice";

import { exportDataExcel, exportToPDF } from "~/utils/export";
import { useDispatch, useSelector } from "react-redux";
import { getOrderApi, searchPageApi } from "~/redux/slices/Data/orderSlice";
import { FormatDayTimeWithHour } from "~/components/table/Format";
import { orderApi } from "~/apis/orderApi";
import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import { genericDispatch } from "~/redux/utils";
import { IoReload } from "react-icons/io5";

const Orders = () => {
  const { order, loading } = useSelector((state) => state.order);
  const [openInFor, setOpenInFor] = useState(false);
  const [inFo, setInFo] = useState();
  const dispatch = useDispatch();
  const invoiceRef = useRef(null);

  const [search, setSearch] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  const [current, setCurrent] = useState(
    localStorage.getItem(location?.pathname?.split("/")?.pop()) || 1
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
      setIsSearch(false);
      genericDispatch(
        dispatch,
        getOrderApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
      setCurrent(1);
      localStorage.setItem(location?.pathname?.split("/")?.pop(), 1);
    }
  };

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "orderId",
      width: "7%",
      ...FilterText({
        dataIndex: "orderId",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: "14%",
      ...FilterText({
        dataIndex: "name",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "14%",
      ...FilterText({
        dataIndex: "email",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      width: "10%",
      ...FilterText({
        dataIndex: "phone",
        handleTableChange: handleSearchPage,
      }),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      width: "12%",
      ...FilterDate({ dataIndex: "createdAt" }),
      render: (dayCreate) => FormatDayTimeWithHour(dayCreate),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "updatedAt",
      width: "12%",
      ...FilterDate({ dataIndex: "updatedAt" }),
      render: (updatedAt) => FormatDayTimeWithHour(updatedAt),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "10%",
      ...FilterSelect("status", [
        { value: true, text: "Đã thanh toán" },
        { value: false, text: "Chưa thanh toán" },
      ]),
      render: (status) =>
        status === true ? (
          <span className="text-success">Đã thanh toán</span>
        ) : (
          <span className="text-danger">Chưa thanh toán</span>
        ),
    },
    {
      title: <div className="flex justify-center">Thông tin</div>,
      dataIndex: "info",
      width: "8%",
      render: (text, record) => (
        <div className="flex justify-center">
          <Button
            type="primary"
            ghost
            onClick={() => {
              setOpenInFor(true);
              setInFo(record);
            }}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const dataPages = useMemo(
    () =>
      order?.newData?.map((page) => ({
        ...page,
        key: page._id,
      })),
    [order]
  );

  useEffect(() => {
    if (loading) {
      dispatch(
        getOrderApi({ page: 1, limit: localStorage.getItem("pageSize") || 10 })
      );
    }
  }, []);

  return (
    <LayoutAdmin
      header={
        <>
          <div className="flex items-center">
            <h6 className="mb-0">ĐƠN HÀNG</h6>
          </div>
        </>
      }
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
                    getOrderApi({
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
              orderApi
                .delUnPaid()
                .then((res) => {
                  dispatch(
                    getOrderApi({
                      page: 1,
                      limit: localStorage.getItem("pageSize") || 10,
                    })
                  );
                  toastSuccess(
                    "data",
                    "Xóa Đơn Hàng Chưa Thanh Toán Thành Công!",
                    res.message
                  );
                })
                .catch((err) =>
                  toastError("data", "Không Thể Xóa Đơn Hàng!", err.message)
                );
            }}
            type="primary"
          >
            Xóa đơn hàng chưa thanh toán
          </Button>
          <Button
            onClick={() => {
              toastLoading("order", "Đang Lấy Dữ Liệu Đơn Hàng...");
              orderApi
                .get({ page: 1, limit: 999999999 })
                .then((res) => {
                  const formatOrder = (res) => {
                    return res.newData
                      .filter((order) => order.status === true)
                      .map((order) => {
                        return {
                          "Mã đơn hàng": order.orderId.trim(),
                          Tên: order.name,
                          Email: order.email,
                          "Điện thoại": order.phone,
                          "Xã/Phường": order.ward || "Chưa có",
                          "Quận/Huyện": order.district,
                          "Tỉnh/Thành phố": order.province,
                          "Địa chỉ": order.address,
                          "Sản phẩm": order.product
                            .map(
                              (product) =>
                                `${
                                  product.name
                                } + ${product.price.toLocaleString()} VND`
                            )
                            .join(", "),
                          "Ngày đặt": FormatDayTimeWithHour(order.createdAt),
                          "Ngày thanh toán": FormatDayTimeWithHour(
                            order.updatedAt
                          ),
                          "Trạng thái": "Đã thanh toán", // Vì đã lọc chỉ lấy order có status = true
                        };
                      });
                  };
                  exportDataExcel(formatOrder(res), "Aris-Order.xlsx");
                  toastSuccess(
                    "order",
                    "Xuất File Excel Thành Công!",
                    "Vui lòng tải file tại đây!"
                  );
                })
                .catch((err) => {
                  toastError(
                    "order",
                    "Không Thể Xuất File Excel!",
                    err.message
                  );
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
                  searchPageApi({
                    [Object.keys(search)[0]]: search[Object.keys(search)[0]],
                    page: current,
                    limit: localStorage.getItem("pageSize") || 10,
                  })
                );
              } else {
                genericDispatch(
                  dispatch,
                  getOrderApi({
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
        dragMode={false}
        isSearch={isSearch}
        Api={getOrderApi}
        ApiSearch={searchPageApi}
        search={search}
        current={current}
        setCurrent={setCurrent}
        total={order?.totalItems}
        loading={loading}
        data={dataPages}
        columns={columns}
        colEdit={false}
      />
      <Modal
        centered
        open={openInFor}
        onOk={() => setOpenInFor(false)}
        onCancel={() => {
          setOpenInFor(false);
          setInFo();
        }}
        footer={
          <>
            <Button
              onClick={() => {
                setOpenInFor(false);
                setInFo();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={() => exportToPDF(invoiceRef)}>
              Xuất file PDF
            </Button>
          </>
        }
        width={800}
      >
        <div ref={invoiceRef}>
          <Invoice info={inFo} />
        </div>
      </Modal>
    </LayoutAdmin>
  );
};

export default Orders;
