import { Button, Card, Empty, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { contactApi } from "~/apis/contact";
import { fileMangerApi } from "~/apis/fileMangerApi";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import Table from "~/components/table/Table";
import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import { exportDataExcel } from "~/utils/export";

const Contacts = () => {
  const [fileJson, setFileJson] = useState();
  const [file, setFile] = useState([]);
  const [fileName, setFileName] = useState();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelContact = async (id) => {
    await contactApi.del({ filename: fileName, _id: id });
    toastSuccess("order", "Xóa Liên Hệ Thành Công!");

    const fileDetails = await contactApi.get({ filename: fileName });
    setFile(fileDetails.data);
  };

  useEffect(() => {
    fileMangerApi
      .filesInFolder({ folderName: "uploads/contacts" })
      .then((res) => {
        const children = res.newData.children;
        setFileJson(children);
        if (children.length > 0) {
          const file = children[0].name.split(".")[0];
          return contactApi.get({ filename: file }).then((fileDetails) => {
            children[0] = { ...children[0], details: fileDetails };
            setFile(children[0].details.data);
            setFileName(children[0].name.split(".")[0]);
            setLoading(false);
            const longestObject = children[0].details.data.reduce((a, b) =>
              Object.keys(a).length > Object.keys(b).length ? a : b
            );
            const newData = Object.keys(longestObject).map((key) => ({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              dataIndex: key,
              key: key,
            }));
            setColumns(newData);
          });
        }
        return children;
      });
  }, []);

  return (
    <LayoutAdmin
      button={
        <Button
          onClick={() => {
            toastLoading("order", "Đang Lấy Dữ Liệu Liên Hệ...");
            try {
              exportDataExcel(file, "Aris-Contacts.xlsx");
              toastSuccess(
                "order",
                "Xuất File Excel Thành Công!",
                "Vui lòng tải file tại đây!"
              );
            } catch (error) {
              toastError("order", "Xuất File Excel Không Thành Công!");
            }
          }}
          type="primary"
        >
          Xuất File Excel
        </Button>
      }
      title={"Liên hệ"}
      header={"LIÊN HỆ"}
    >
      {!loading ? (
        <>
          {fileJson?.length > 0 ? (
            <Tabs
              onChange={(key) => {
                contactApi
                  .get({ filename: key.split(".")[0] })
                  .then((fileDetails) => {
                    fileJson.map((data, index) => {
                      if (data.name === key) {
                        data.details = fileDetails;
                        setFile(data.details.data);
                        setFileName(data.name.split(".")[0]);
                        setLoading(false);
                        const longestObject = data.details.data.reduce((a, b) =>
                          Object.keys(a).length > Object.keys(b).length ? a : b
                        );
                        const newData = Object.keys(longestObject).map(
                          (key) => ({
                            title: key.charAt(0).toUpperCase() + key.slice(1),
                            dataIndex: key,
                            key: key,
                          })
                        );
                        setColumns(newData);
                      }
                    });
                  });
              }}
              type="card"
              tabPosition="left"
              items={fileJson?.map((data, index) => {
                return {
                  label: data.name,
                  key: data.name,
                  children: (
                    <Table
                      colEdit={true}
                      dragMode={false}
                      data={file}
                      columns={columns}
                      onDelete={handleDelContact}
                      isPagination={false}
                    />
                  ),
                };
              })}
            />
          ) : (
            <Card className="h-full flex justify-center items-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            </Card>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-full">
          <Spin />
        </div>
      )}
    </LayoutAdmin>
  );
};

export default Contacts;
