import { useEffect, useMemo, useState } from "react";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import GrapeJs from "~/components/grapeJs/GrapeJs";
import { useNavigate, useParams } from "react-router-dom";

import pluginWebpage from "grapesjs-preset-webpage";
import blockBasic from "grapesjs-blocks-basic";
import pluginEditImage from "~/components/grapeJs/Custom/ImageEdit";
import pluginStyleBg from "grapesjs-style-bg";
import pluginTailwind from "grapesjs-tailwind";
import pluginTemplates from "grapesjs-templates";
import pluginFont from "@silexlabs/grapesjs-fonts";
import pluginCkeditor from "grapesjs-plugin-ckeditor";
import pluginSwiper from "~/components/grapeJs/Custom/Block/Swiper";

import pluginFlexbox from "~/components/grapeJs/Custom/Block/FlexBox/";
import pluginFlexrow from "~/components/grapeJs/Custom/Block/FlexRow";
import SkeletonGrapeJs from "~/components/loading/SkeletonGrapeJs";
import BlockUser from "~/components/grapeJs/Custom/BlockUser";
import testBlock from "~/components/grapeJs/Plugins/src/index";

import { Block } from "~/components/grapeJs/Block";
import { Styles } from "~/components/grapeJs/Style";

import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import { pagesApi } from "~/apis/pagesApi";

import { masonryPageApi } from "~/apis/customPageApi";
import { fileApi } from "~/apis/fileApi";

import { baseURL } from "~/utils";
import { useDispatch, useSelector } from "react-redux";
import { getPluginsScriptApi } from "~/redux/slices/Data/pluginsScriptSlice";
import { Button, Typography } from "antd";

import { TbArrowBack } from "react-icons/tb";
import { getPluginsApi } from "~/redux/slices/Data/pluginsSlice";

const Pages = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { plugins, loading: loadingPlugins } = useSelector(
    (state) => state.plugins
  );
  const { pluginsScript, loading: loadingscript } = useSelector(
    (state) => state.pluginsScript
  );

  const dataPlugins = useMemo(
    () =>
      plugins?.newData?.map((groupPage) => ({
        id: groupPage.id,
        src: `${baseURL}/uploads/${groupPage.src}`,
      })),
    [plugins?.newData]
  );

  const configGrapeJs = (editor) => {
    editor.on("component:add", (model) => {
      switch (model.attributes.type) {
        case "Masonry":
          masonryPageApi.addMasonry({ name: params.slug });
          break;
        default:
          break;
      }
    });

    editor.Panels.addButton("options", [
      {
        id: "google-fonts",
        className: "fa fa-font",
        attributes: { title: "Cài đặt kiểu chữ" },
        command: "open-fonts",
        togglable: true,
        visible: true,
      },
    ]);

    editor.Panels.addButton("options", [
      {
        id: "open-link",
        className: "fa fa-link",
        attributes: { title: "Public" },
        command: "open-link",
        active: false,
        togglable: false,
      },
    ]);

    editor.Commands.add("open-link", {
      run(editor, sender) {
        if (params.slug == "trang-chu") {
          window.open(`/`, "_blank");
        } else {
          window.open(`/${params.slug}`, "_blank");
        }
      },
    });

    const blocksToRemove = [
      // 'video',
      // 'map',
      // 'model-3D',
      "bootstrapIcon",
      "link",
      "quote",
      "link-block",
      "text-basic",
      "text-section",
      "column1",
      "column2",
      "column3",
      "column3-7",
    ];

    const buttonsToRemove = [
      // 'gjs-open-import-webpage',
      "open-templates",
      "link-page",
      // 'export-template'
    ];

    const categoriesToClose = ["Extra", "Blog", "Layout", "Short Codes"];

    const { models: categories } = editor.BlockManager.getCategories();

    blocksToRemove.forEach((block) => editor.BlockManager.remove(block));
    buttonsToRemove.forEach((buttonId) => {
      editor.Panels.removeButton("options", buttonId);
    });
    categories.forEach(
      (category) =>
        categoriesToClose.includes(category.get?.("id")) &&
        category.set("open", false)
    );
  };

  const putPages = async (pageEdit, pageView) => {
    const date = Date.now();
    toastLoading(date, "Đang Cập Nhật...");

    const { html, css, js } = pageView;
    const body = new DOMParser().parseFromString(html, "text/html");

    if (!body.body.innerHTML.trim()) {
      toastError(date, "Trang Không Được Để Trống!");
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Change Bae64 HTML
    const imgTags = doc.querySelectorAll('img[src^="data:image/"]');
    for (const img of imgTags) {
      const src = img.getAttribute("src");
      try {
        const response = await fileApi.fileBase64({ base64: src });
        if (response && response.file) {
          img.setAttribute("src", `${baseURL}/uploads/${response.file}`);
        } else {
          console.warn("Không tìm thấy tệp trong phản hồi:", response);
        }
      } catch (error) {
        console.error("Lỗi khi chuyển đổi base64:", error);
      }
    }

    // Change Image Link HTML
    const iframe = doc.querySelector('iframe[name="masonry"]');
    if (iframe) {
      const data = await masonryPageApi.getSingleMasonry(params.slug);

      const htmlMa = data.img
        .map(
          (item, index) =>
            `<div key="${index}" id="${
              item.idImg
            }" class="grid-item grid-item--width${
              item.width
            }" style="aspect-ratio: ${item.aspectRatio};">
                    <a class="w-full h-full" href="${item.link || "#"}">
                        <img loading="lazy" class="w-full h-full" src="${
                          item.imgSrc
                        }" alt="Học 3d cùng chicken war studio" title="Học 3d cùng chicken war studio"/>
                    </a>
                </div>`
        )
        .join("");
      iframe.parentNode.innerHTML = `<div class="grid">${htmlMa}</div>`;
    }

    try {
      const content = { html: doc.body.innerHTML, css, js };
      const edit = pageEdit;
      await pagesApi.put({ id: page._id, content: content, edit: edit });
      toastSuccess(
        date,
        "Đã Cập Nhật Trang!",
        <>
          Vui lòng truy cập trang:{" "}
          <span>
            <Typography.Link href={`/${page.slug}`} target="_blank">
              /{page.slug}
            </Typography.Link>
          </span>{" "}
          và disable cache để xem trang đã cập nhật.
        </>
      );
    } catch (error) {
      toastError(date, "Cập Nhật Trang Thất Bại", "Vui lòng thử lại sau.");
    }
  };

  const fetchData = () => {
    pagesApi
      .sigEdit(params.slug)
      .then((res) => {
        setPage(res);
        setLoading(false);
      })
      .catch((err) => {
        toastError("error", err.message, "Vui lòng thử lại sau!");
        navigate("/admin/pages");
      });
  };

  useEffect(() => {
    if (loadingscript === true) {
      dispatch(getPluginsScriptApi());
    }
  }, []);

  useEffect(() => {
    if (loadingPlugins) {
      dispatch(getPluginsApi());
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LayoutAdmin
      title={`Trang ${page?.name || ""}`}
      margin={0}
      header={
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/admin/pages")}>
            {" "}
            <TbArrowBack size={20} /> Trở về
          </Button>
          Tên trang: {page?.name || ""} | Đường dẫn: /{page?.slug || ""}
        </div>
      }
    >
      {loading && <SkeletonGrapeJs />}

      {!loading && !loadingPlugins && (
        <>
          <GrapeJs
            data={page?.edit || ""}
            loadData={loading}
            configGrapeJs={configGrapeJs}
            height="calc(100vh - 56px)"
            slug={params?.slug}
            folder={page?.name}
            canvas={pluginsScript[0]}
            pluginss={dataPlugins}
            plugins={[
              pluginWebpage,
              blockBasic,
              pluginEditImage,
              pluginCkeditor,
              pluginStyleBg,
              pluginTailwind,
              pluginTemplates,
              pluginFont,
              pluginFlexbox,
              pluginFlexrow,
              Block.model3d,
              Block.imageLink,
              Block.masonry,
              BlockUser,
              Styles.customType,
              Styles.customTypeSelect,
              pluginSwiper,
              testBlock,
            ]}
            pluginsOpts={{
              [pluginFont]: {
                api_key: "AIzaSyAdJTYSLPlKz4w5Iqyy-JAF2o8uQKd1FKc",
              },
              [pluginCkeditor]: {
                // ckeditor: 'https://cdn.ckeditor.com/4.22.0-lts/standard/ckeditor.js',
                options: {
                  extraPlugins:
                    "dialogui,sharedspace,justify,colorbutton,panelbutton,font",
                  language: "vi",
                  toolbarGroups: [
                    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
                    {
                      name: "paragraph",
                      groups: [
                        "list",
                        "indent",
                        "blocks",
                        "align",
                        "bidi",
                        "paragraph",
                      ],
                    },
                    { name: "links", groups: ["links"] },
                    { name: "insert", groups: ["insert"] },
                    "/",
                    { name: "styles", groups: ["styles"] },
                    { name: "colors", groups: ["colors"] },
                    { name: "tools", groups: ["tools"] },
                    { name: "others", groups: ["others"] },
                  ],
                },
                position: "center",
              },
            }}
            savePage={putPages}
          />
        </>
      )}
    </LayoutAdmin>
  );
};

export default Pages;
