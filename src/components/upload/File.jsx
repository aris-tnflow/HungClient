import { Button, Upload } from "antd";
import { toastError, toastLoading, toastSuccess } from "../toast";
import { baseURL } from "~/utils";
import { courseChildrenApi } from "~/apis/courseApi";

const FileUpload = ({ folder, id, childId, data, setData }) => {
  return (
    <Upload
      name="fileVideo"
      multiple={false}
      action={`${baseURL}/v2/file/video`}
      data={{ folder: `courses/${folder}` }}
      headers={{
        Authorization: "Bearer " + localStorage.getItem("token"),
      }}
      showUploadList={false}
      onChange={(info) => {
        const { status, response } = info.file;
        toastLoading("data", "Đang tải file...");
        if (status === "done") {
          toastSuccess("data", "Tải file thành công!");
          courseChildrenApi.putChildren({ id, childId, src: response });
          setData({ ...data, src: response });
        } else if (status === "error") {
          toastError("data", "Lỗi khi tải file!", response.message);
          info.fileList = [];
        }
      }}
      onDrop={(e) => {
        console.log("Dropped files", e.dataTransfer.files);
      }}
    >
      <Button type="primary" ghost danger>
        Thay đổi video
      </Button>
    </Upload>
  );
};

export default FileUpload;
