import React from "react";
const Folder = ({
  size,
  name,
  valid = false,
  type,
  onDownload,
  onDelete,
  onSee,
  onDoubleClick,
}) => {
  return (
    <div
      className="files-ui-file-mosaic-main-container files-ui-tooltip"
      onDoubleClick={onDoubleClick}
    >
      <div className="files-ui-file-mosaic-icon-layer-container files-ui-layer-container">
        {type === "directory" ? (
          <>
            <div className="files-ui-file-mosaic-image-layer files-ui-layer">
              <img
                height="100%"
                src="/asset/folder.png"
                alt="preview 123423423423432423423423423432432423.png"
                style={{ borderRadius: 0 }}
              />
            </div>
          </>
        ) : type === "glb" ? (
          <>
            <div className="files-ui-file-mosaic-image-layer files-ui-layer">
              <img
                height="100%"
                src="/asset/glb.webp"
                alt="preview 123423423423432423423423423432432423.png"
                style={{ borderRadius: 0 }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="files-ui-file-mosaic-image-layer blur files-ui-layer">
              <img
                width="100%"
                src="https://picsum.photos/200/300"
                alt="blur 123423423423432423423423423432432423.png"
              />
            </div>
            <div className="files-ui-file-mosaic-image-layer files-ui-layer">
              <img
                height="100%"
                src="https://picsum.photos/200/300"
                alt="preview 123423423423432423423423423432432423.png"
                style={{ borderRadius: 0 }}
              />
            </div>
          </>
        )}

        <div className="files-ui-file-mosaic-main-layer files-ui-layer">
          <div className="file-mosaic-main-layer-header">
            {onDelete && (
              <svg
                onClick={onDelete}
                className="files-ui-file-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="15px"
                viewBox="0 0 24 24"
                width="15px"
                fill="rgba(255,255,255,0.851)"
                style={{ cursor: "pointer" }}
              >
                <path d="M0 0h24v24H0V0z" fill="transparent" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            )}
          </div>
          <div className="file-mosaic-main-layer-footer">
            <div className="file-mosaic-footer-left">
              {type != "folder" && valid && (
                <div
                  className="filesui-file-item-status-container file-status-ok flex items-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "#5c7a1f",
                    borderRadius: "4px",
                    marginBottom: "3px",
                  }}
                >
                  <svg
                    className="status-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="15px"
                    viewBox="0 0 24 24"
                    width="15px"
                    fill="#4caf50"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Valid
                </div>
              )}
              <div className="filesui-file-item-size">{size}</div>
            </div>

            <div className="file-mosaic-footer-right">
              {type != "directory" && (
                <svg
                  onClick={onSee}
                  className="files-ui-file-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="15px"
                  viewBox="0 0 24 24"
                  width="15px"
                  fill="rgba(255,255,255,0.851)"
                  style={{ cursor: "pointer" }}
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
                    fill="none"
                  />
                  <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              )}
              <svg
                onClick={onDownload}
                className="files-ui-file-icon"
                enableBackground="new 0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                height="15px"
                viewBox="0 0 24 24"
                width="15px"
                fill="rgba(255,255,255,0.851)"
                style={{ cursor: "pointer" }}
              >
                <g>
                  <rect fill="none" height={15} width={15} />
                </g>
                <g>
                  <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="files-ui-file-mosaic-file-name">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default Folder;
