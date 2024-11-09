import React, { useEffect, useRef, useState } from "react";
import GjsEditor from "@grapesjs/react";
import { useDispatch, useSelector } from "react-redux";

import localeVi from "./I18n/vi";

import "./GrapeJs.css";
import { Block } from "./Block";
import { Panels } from "./Panels";
import { fileApi } from "~/apis/fileApi";
import { baseURL } from "~/utils";
import { toastError, toastLoading, toastSuccess } from "../toast";
import SkeletonGrapeJs from "~/components/loading/SkeletonGrapeJs";

const Page = ({
  data,
  canvas,
  pluginss,
  plugins,
  pluginsOpts,
  savePage,
  slug,
  folder,
  configGrapeJs,
  height = "100vh",
}) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const save = (editor) => {
    editor.Panels.addButton("options", [
      {
        id: "save-page",
        className: "fa fa-upload",
        attributes: { title: "Public" },
        command: "save-page",
        active: false,
        togglable: false,
      },
    ]);

    editor.Commands.add("save-page", {
      run(editor, sender) {
        var html = editor
          .getHtml()
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        var css = editor.getCss();
        var js = editor.getJs();

        const pageEdit = editor.getProjectData();
        const page = { html, css, js };
        savePage(pageEdit, page);
      },
    });
  };

  const onEditor = (editor) => {
    editorRef.current = editor;
    Block.masonry(editor, slug);
    Panels.openPage(editor, slug);
    editor.loadProjectData(data);

    editor.Components.addType("image", {
      model: {
        defaults: {
          name: "Ảnh",
          resizable: true,
          droppable: false,
          copyable: true,
          traits: ["alt"],
          attributes: {
            "data-fancybox": "gallery",
          },
        },
      },
    });

    Panels.openPage(editor, slug);
    localeVi(editor);
    configGrapeJs(editor);
    save(editor);

    editor.on("asset:open", () => {
      const amConfig = editor.AssetManager;
      console.log(amConfig);
    });
    setLoading(false);
  };

  return (
    <>
      {loading && <SkeletonGrapeJs />}
      <GjsEditor
        className="overflow-hidden"
        grapesjs="https://unpkg.com/grapesjs"
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        onEditor={onEditor}
        i18n={{ locale: "vi" }}
        plugins={pluginss}
        options={{
          height: height,
          canvas: {
            scripts: canvas?.scripts,
            styles: canvas?.styles,
          },
          plugins: plugins,
          pluginsOpts: pluginsOpts,
          storageManager: false,
          undoManager: { trackSelection: false },
          canvasCss: `
                        .gjs-dashed *[data-gjs-highlightable]{
                            outline-offset: -1px !important;
                        }
                        .gjs-selected {
                            outline: 3px solid #1677ff !important;
                            outline-offset: -2px;
                        }
                        .gjs-hovered{
                            outline: 2px solid #1677ff !important;
                        }
                        img{
                            width: 100%;
                        }
                    `,
          assetManager: {
            uploadFile: (ev) => {
              toastLoading(
                "file",
                "Kiên nhẫn đang tải file và resize file",
                "Các tấm ảnh có width > 1300 sẽ được tối ưu hóa!"
              );
              const files = ev.dataTransfer
                ? ev.dataTransfer.files
                : ev.target.files;
              if (!files || files.length === 0) {
                toastError("file", "Không có file nào được tải lên");
                return;
              }
              const formData = new FormData();
              formData.append("file", files[0]);
              formData.append("folder", `${folder}`);
              fileApi
                .uploadFile(formData)
                .then((data) => {
                  editorRef.current.AssetManager.add({
                    type: "image",
                    src: `${baseURL}/uploads/${data}`,
                    name: `${data}`,
                  });
                  toastSuccess("file", "Tải lên file thành công");
                })
                .catch(() => {
                  toastError(
                    "file",
                    "Tải lên file thất bại",
                    "Tấm ảnh không được tối ưu hóa!"
                  );
                });
            },
          },
          styleManager: {
            sectors: [
              {
                name: "General",
                buildProps: [
                  "float",
                  "display",
                  "position",
                  "top",
                  "right",
                  "left",
                  "bottom",
                ],
                properties: [
                  {
                    name: "Alignment",
                    property: "float",
                    type: "radio",
                    defaults: "none",
                    list: [
                      { value: "none", className: "fa fa-times" },
                      { value: "left", className: "fa fa-align-left" },
                      { value: "right", className: "fa fa-align-right" },
                    ],
                  },
                  { property: "position", type: "select" },
                ],
              },
              {
                name: "Flex",
                open: false,
                properties: [
                  {
                    name: "Flex Container",
                    property: "display",
                    type: "select",
                    defaults: "block",
                    list: [
                      { value: "block", name: "Disable" },
                      { value: "flex", name: "Enable" },
                    ],
                  },
                  {
                    name: "Flex Parent",
                    property: "label-parent-flex",
                    type: "integer",
                  },
                  {
                    name: "Direction",
                    property: "flex-direction",
                    type: "radio",
                    defaults: "row",
                    list: [
                      {
                        value: "row",
                        name: "Row",
                        className: "icons-flex icon-dir-row",
                        title: "Row",
                      },
                      {
                        value: "row-reverse",
                        name: "Row reverse",
                        className: "icons-flex icon-dir-row-rev",
                        title: "Row reverse",
                      },
                      {
                        value: "column",
                        name: "Column",
                        title: "Column",
                        className: "icons-flex icon-dir-col",
                      },
                      {
                        value: "column-reverse",
                        name: "Column reverse",
                        title: "Column reverse",
                        className: "icons-flex icon-dir-col-rev",
                      },
                    ],
                  },
                  {
                    name: "Justify",
                    property: "justify-content",
                    type: "radio",
                    defaults: "flex-start",
                    list: [
                      {
                        value: "flex-start",
                        className: "icons-flex icon-just-start",
                        title: "Start",
                      },
                      {
                        value: "flex-end",
                        title: "End",
                        className: "icons-flex icon-just-end",
                      },
                      {
                        value: "space-between",
                        title: "Space between",
                        className: "icons-flex icon-just-sp-bet",
                      },
                      {
                        value: "space-around",
                        title: "Space around",
                        className: "icons-flex icon-just-sp-ar",
                      },
                      {
                        value: "center",
                        title: "Center",
                        className: "icons-flex icon-just-sp-cent",
                      },
                    ],
                  },
                  {
                    name: "Align",
                    property: "align-items",
                    type: "radio",
                    defaults: "flex-start",
                    list: [
                      {
                        value: "flex-start",
                        title: "Start",
                        className: "icons-flex icon-al-start",
                      },
                      {
                        value: "flex-end",
                        title: "End",
                        className: "icons-flex icon-al-end",
                      },
                      {
                        value: "stretch",
                        title: "Stretch",
                        className: "icons-flex icon-al-str",
                      },
                      {
                        value: "center",
                        title: "Center",
                        className: "icons-flex icon-al-center",
                      },
                    ],
                  },
                  {
                    type: "aris-custom-prop",
                    property: "gap",
                    default: "15",
                    min: 0,
                  },
                  {
                    name: "Flex Children",
                    property: "label-parent-flex",
                    type: "integer",
                  },
                  {
                    name: "Order",
                    property: "order",
                    type: "integer",
                    defaults: 0,
                    min: 0,
                  },
                  {
                    name: "Flex",
                    property: "flex",
                    type: "composite",
                    properties: [
                      {
                        name: "Grow",
                        property: "flex-grow",
                        type: "integer",
                        defaults: 0,
                        min: 0,
                      },
                      {
                        name: "Shrink",
                        property: "flex-shrink",
                        type: "integer",
                        defaults: 0,
                        min: 0,
                      },
                      {
                        name: "Basis",
                        property: "flex-basis",
                        type: "integer",
                        units: ["px", "%", ""],
                        unit: "",
                        defaults: "auto",
                      },
                    ],
                  },
                  {
                    name: "Align",
                    property: "align-self",
                    type: "radio",
                    defaults: "auto",
                    list: [
                      {
                        value: "auto",
                        name: "Auto",
                      },
                      {
                        value: "flex-start",
                        title: "Start",
                        className: "icons-flex icon-al-start",
                      },
                      {
                        value: "flex-end",
                        title: "End",
                        className: "icons-flex icon-al-end",
                      },
                      {
                        value: "stretch",
                        title: "Stretch",
                        className: "icons-flex icon-al-str",
                      },
                      {
                        value: "center",
                        title: "Center",
                        className: "icons-flex icon-al-center",
                      },
                    ],
                  },
                ],
              },
              {
                name: "Dimension",
                open: false,
                buildProps: [
                  "width",
                  "flex-width",
                  "height",
                  "max-width",
                  "min-width",
                  "max-height",
                  "min-height",
                  "margin",
                  "padding",
                ],
                properties: [
                  {
                    id: "flex-width",
                    type: "integer",
                    name: "Width",
                    units: ["px", "%"],
                    property: "flex-basis",
                    toRequire: 1,
                  },
                  {
                    property: "margin",
                    properties: [
                      { name: "Top", property: "margin-top" },
                      { name: "Right", property: "margin-right" },
                      { name: "Bottom", property: "margin-bottom" },
                      { name: "Left", property: "margin-left" },
                    ],
                  },
                  {
                    property: "padding",
                    properties: [
                      { name: "Top", property: "padding-top" },
                      { name: "Right", property: "padding-right" },
                      { name: "Bottom", property: "padding-bottom" },
                      { name: "Left", property: "padding-left" },
                    ],
                  },
                ],
              },
              {
                name: "Typography",
                open: false,
                buildProps: [
                  "font-family",
                  "font-size",
                  "font-weight",
                  "letter-spacing",
                  "color",
                  "line-height",
                  "text-align",
                  "text-decoration",
                  "text-shadow",
                ],
                properties: [
                  {
                    name: "Font",
                    property: "font-family",
                  },
                  {
                    type: "aris-custom-select",
                    property: "overflow-wrap",
                    options: [
                      { name: "Không có", value: "no" },
                      { name: "Break Word", value: "break-word" },
                    ],
                    default: "no",
                  },
                  {
                    name: "Weight",
                    property: "font-weight",
                  },
                  {
                    name: "Font color",
                    property: "color",
                  },
                  {
                    property: "text-align",
                    type: "radio",
                    defaults: "left",
                    list: [
                      {
                        value: "left",
                        name: "Left",
                        className: "fa fa-align-left",
                      },
                      {
                        value: "center",
                        name: "Center",
                        className: "fa fa-align-center",
                      },
                      {
                        value: "right",
                        name: "Right",
                        className: "fa fa-align-right",
                      },
                      {
                        value: "justify",
                        name: "Justify",
                        className: "fa fa-align-justify",
                      },
                    ],
                  },
                  {
                    property: "text-decoration",
                    type: "radio",
                    defaults: "none",
                    list: [
                      { value: "none", name: "None", className: "fa fa-times" },
                      {
                        value: "underline",
                        name: "underline",
                        className: "fa fa-underline",
                      },
                      {
                        value: "line-through",
                        name: "Line-through",
                        className: "fa fa-strikethrough",
                      },
                    ],
                  },
                  {
                    property: "text-shadow",
                    properties: [
                      { name: "X position", property: "text-shadow-h" },
                      { name: "Y position", property: "text-shadow-v" },
                      { name: "Blur", property: "text-shadow-blur" },
                      { name: "Color", property: "text-shadow-color" },
                    ],
                  },
                ],
              },
              {
                name: "Image",
                open: false,
                properties: [
                  {
                    type: "aris-custom-select",
                    property: "object-fit",
                    options: [
                      { name: "Cover", value: "cover" },
                      { name: "Fill", value: "fill" },
                      { name: "Scale Down", value: "scale-down" },
                      { name: "Contain", value: "contain" },
                      { name: "None", value: "" },
                    ],
                    default: "no",
                  },
                  // {
                  //     type: 'aris-custom-prop',
                  //     property: 'font-size',
                  //     default: '15',
                  //     min: 10,
                  //     max: 70,
                  // },
                  // {
                  //     type: 'aris-custom-select',
                  //     property: 'overflow',
                  //     options: [
                  //         { name: 'Không có', value: 'no' },
                  //         { name: 'visible', value: 'visible' },
                  //         { name: 'hidden', value: 'hidden' },
                  //         { name: 'scroll', value: 'scroll' },
                  //         { name: 'auto', value: 'auto' },
                  //     ],
                  //     default: 'no'
                  // },
                ],
              },
              {
                name: "Decorations",
                open: false,
                buildProps: [
                  "opacity",
                  "border-radius",
                  "border",
                  "box-shadow",
                  "background",
                ],
                properties: [
                  {
                    type: "slider",
                    property: "opacity",
                    defaults: 1,
                    step: 0.01,
                    max: 1,
                    min: 0,
                  },
                  {
                    property: "border-radius",
                    properties: [
                      { name: "Top", property: "border-top-left-radius" },
                      { name: "Right", property: "border-top-right-radius" },
                      { name: "Bottom", property: "border-bottom-left-radius" },
                      { name: "Left", property: "border-bottom-right-radius" },
                    ],
                  },
                  {
                    property: "box-shadow",
                    properties: [
                      { name: "X position", property: "box-shadow-h" },
                      { name: "Y position", property: "box-shadow-v" },
                      { name: "Blur", property: "box-shadow-blur" },
                      { name: "Spread", property: "box-shadow-spread" },
                      { name: "Color", property: "box-shadow-color" },
                      { name: "Shadow type", property: "box-shadow-type" },
                    ],
                  },
                ],
              },
              {
                name: "Extra",
                open: false,
                buildProps: ["transition", "perspective", "transform"],
                properties: [
                  {
                    property: "transition",
                    properties: [
                      { name: "Property", property: "transition-property" },
                      { name: "Duration", property: "transition-duration" },
                      {
                        name: "Easing",
                        property: "transition-timing-function",
                      },
                    ],
                  },
                  {
                    property: "transform",
                    properties: [
                      { name: "Rotate X", property: "transform-rotate-x" },
                      { name: "Rotate Y", property: "transform-rotate-y" },
                      { name: "Rotate Z", property: "transform-rotate-z" },
                      { name: "Scale X", property: "transform-scale-x" },
                      { name: "Scale Y", property: "transform-scale-y" },
                      { name: "Scale Z", property: "transform-scale-z" },
                    ],
                  },
                ],
              },
            ],
          },
        }}
      />
    </>
  );
};

export default Page;
