import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { baseURL } from "~/utils";
import { toastError, toastSuccess } from "../toast";
import { pluginsApi } from "~/apis/pluginsApi";

const UploadPlugins = ({ name, id }) => {
  return (
    <Upload
      name="filePlugins"
      multiple={false}
      action={`${baseURL}/v2/plugins/file-plugin`}
      headers={{
        Authorization: "Bearer " + localStorage.getItem("token"),
      }}
      onChange={(info) => {
        const { response } = info.file;
        if (info.file.status === "done") {
          pluginsApi.put({ _id: id, src: response.src });
          toastSuccess("upload", "Tải file thành công!", "Đã thêm plugins mới");
        } else if (info.file.status === "error") {
          toastError("upload", "Tải file không thành công!", response.message);
        }
      }}
    >
      <Button icon={<UploadOutlined />}>{name}</Button>
    </Upload>
  );
};

export default UploadPlugins;
