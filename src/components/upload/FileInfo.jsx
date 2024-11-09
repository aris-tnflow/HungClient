import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { courseApi } from "~/apis/courseApi";
import { baseURL } from "~/utils";
import { toastSuccess } from "../toast";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FileInfo = ({ limit, apiUpload, fileLists, folder, success }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const initialFileList =
    fileLists === "undefined"
      ? []
      : [
          {
            uid: fileLists,
            name: fileLists,
            status: "done",
            url: `${baseURL}/uploads/${fileLists}`,
          },
        ];
  const [fileList, setFileList] = useState(initialFileList);
  useEffect(() => {
    setFileList(initialFileList);
  }, [fileLists]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    if (file.status === "done") {
      toastSuccess("data", "Tải file thành công!", "");
      success(file);
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh lên
      </div>
    </button>
  );

  return (
    <>
      <Upload
        headers={{
          Authorization: "Bearer " + localStorage.getItem("token"),
        }}
        data={{ folder: folder }}
        action={apiUpload}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};
export default FileInfo;
