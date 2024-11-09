import React from "react";
import { Button, Upload } from "antd";
import { toastError, toastSuccess } from "../toast";
import { baseURL } from "~/utils";
import { FaUpload } from "react-icons/fa6";
import { useDispatch } from "react-redux";

const FileManagerUpload = ({ api, name, folder, multiple = false }) => {
  const dispatch = useDispatch();

  return (
    <Upload
      name={name}
      multiple={multiple}
      action={`${baseURL}/v2/file/multi`}
      data={{ folder: folder }}
      showUploadList={false}
      headers={{
        Authorization: "Bearer " + localStorage.getItem("token"),
      }}
      onChange={(info) => {
        const { status, response } = info.file;
        const allFilesUploaded = info.fileList.every(
          (file) => file.status === "done"
        );

        if (status === "done") {
          if (allFilesUploaded) {
            dispatch(api({ folderName: folder }));
            toastSuccess("Success", "Tải file thành công!");
          }
        } else if (status === "error") {
          toastError("Error", "Lỗi khi tải file!", response.message);
          info.fileList = [];
        }
      }}
    >
      <Button
        className="hidden-title"
        icon={<FaUpload size={20} />}
        type="text"
      >
        Tải lên file
      </Button>
    </Upload>
  );
};

export default FileManagerUpload;
