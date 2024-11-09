import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { toastError, toastLoading, toastSuccess } from "../toast";
import { baseURL } from "~/utils";
import { courseChildrenApi } from "~/apis/courseApi";

const App = ({ folder, id, childId, course, setCourse }) => {
  return (
    <Upload.Dragger
      name="fileVideo"
      multiple={false}
      action={`${baseURL}/v2/file/video`}
      data={{ folder: `courses/${folder}` }}
      headers={{
        Authorization: "Bearer " + localStorage.getItem("token"),
      }}
      onChange={(info) => {
        const { status, response } = info.file;
        toastLoading("data", "Đang tải file...");
        if (status === "done") {
          toastSuccess("data", "Tải file thành công!", "");
          setCourse({ ...course, src: response });
          courseChildrenApi.putChildren({ id, childId, src: response });
        } else if (status === "error") {
          toastError("data", "Lỗi khi tải file!", response.message);
          info.fileList = [];
        }
      }}
      onDrop={(e) => {
        console.log("Dropped files", e.dataTransfer.files);
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Chọn hoặc kéo thả tệp để tải lên</p>
      <p className="ant-upload-hint">Hỗ trợ các file Video</p>
    </Upload.Dragger>
  );
};

export default App;
