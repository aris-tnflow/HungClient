import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "~/components/layout/Public/Layout";
import { pagesApi } from "~/apis/pagesApi";
import { Pagination, Result, Spin, Typography } from "antd";
import { toastSuccess } from "~/components/toast";
import { contactApi } from "~/apis/contact";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { groupPageApi } from "~/apis/groupPageApi";
import { FaChevronRight, FaClock } from "react-icons/fa";
import { FormatDay, FormatDayTime } from "~/components/table/Format";
import { getLdJsArticle } from "~/utils/seo";

const useDynamicContent = (page, handleFormSubmit) => {
  useEffect(() => {
    const cleanup = () => {
      const existingStyle = document.getElementById("dynamic-styles");
      const existingScript = document.getElementById("dynamic-script");
      if (existingStyle) existingStyle.remove();
      if (existingScript) existingScript.remove();
    };

    if (!page?.content) {
      cleanup();
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = "dynamic-styles";
    styleElement.innerHTML = page.content.css || "";

    const scriptElement = document.createElement("script");
    scriptElement.id = "dynamic-script";
    scriptElement.innerHTML = page.content.js || "";

    document.head.appendChild(styleElement);
    document.body.appendChild(scriptElement);

    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", handleFormSubmit);
    });

    return () => {
      cleanup();
      forms.forEach((form) => {
        form.removeEventListener("submit", handleFormSubmit);
      });
    };
  }, [page, handleFormSubmit]);
};

const Html = () => {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { info } = useSelector((state) => state.info);
  const { darkMode } = useSelector((state) => state.theme);
  const [multiple, setMultiple] = useState(false);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("pageSize") || 8
  );

  const currentPath = useMemo(() => {
    return window.location.pathname === "/"
      ? "trang-chu"
      : path?.split("/").pop();
  }, [path]);

  useEffect(() => {
    setPage(20);
  }, [pageSize]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        if (
          path === "trang-chu" ||
          path === undefined ||
          path?.indexOf("/") !== -1
        ) {
          const pageData = await pagesApi.sig(currentPath, "page");
          if (mounted) {
            setMultiple(false);
            setPage(pageData);
          }
        } else {
          const isGroup = await groupPageApi.check(path);
          if (mounted) {
            if (isGroup) {
              setMultiple(true);
              const groupData = await pagesApi.getGroupPage({
                slug: path,
                page: currentPage,
                limit: pageSize,
              });
              setPages(groupData);
            } else {
              const pageData = await pagesApi.sig(currentPath, "page");
              setMultiple(false);
              setPage(pageData);
            }
          }
        }
      } catch (error) {
        if (mounted) navigate("/404");
      } finally {
        if (mounted) {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [path, navigate, currentPath, currentPage]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);

      const jsonObject = Object.fromEntries(formData.entries());
      jsonObject._id = uuidv4();

      try {
        await contactApi.put({ filename: page?.name, data: jsonObject });
        toastSuccess(
          "sendData",
          "Cảm Ơn Bạn Đã Gửi Thông Tin!",
          "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!"
        );
        form.reset();
      } catch (error) {
        toastSuccess("sendData", "Có Lỗi Xảy Ra!", "Vui lòng thử lại sau!");
      }
    },
    [page]
  );
  useDynamicContent(page, handleFormSubmit);
  const pageTitle = useMemo(() => {
    if (page?.name === "Trang Chủ") return info?.newData?.[0]?.name;
    return page?.name || info?.newData?.[0]?.name;
  }, [page?.name, info?.newData]);

  const handlePaginationChange = async (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setLoading(true);
    localStorage.setItem("pageSize", pageSize);
    const groupData = await pagesApi.getGroupPage({
      slug: path,
      page: page,
      limit: pageSize,
    });
    setLoading(false);
    setPages(groupData);
  };

  return (
    <Layout
      title={pageTitle}
      description={page?.description || "Chicken War Studio"}
      keywords={page?.keywords || "Chicken War Studio"}
      ldJson={getLdJsArticle(page, info)}
    >
      {loading && <Spin indicator={1} spinning={true} fullscreen />}

      {!loading && !page?.content && !multiple && (
        <section>
          <Result
            status="403"
            title="Không có dữ liệu!"
            subTitle="Trang chưa được thêm dữ liệu vào trong, vui lòng thêm dữ liệu vào!"
          />
        </section>
      )}

      {!loading && page?.content && !multiple && (
        <div
          id="page-content"
          dangerouslySetInnerHTML={{ __html: page?.content?.html }}
        />
      )}

      {multiple && !loading && (
        <div className="mx-6 mt-[6.5rem] my-5">
          {pages?.newData?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-md:gap-4 md:gap-6">
                {pages.newData.map((post) => (
                  <article
                    key={post.slug}
                    style={{
                      backgroundColor: darkMode ? "#161616bd" : "#fff",
                    }}
                    className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 focus-within:ring-2"
                  >
                    <Link to={`/${post.group.slug}/${post.slug}`}>
                      <img
                        src={post.img}
                        alt={post.description}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="p-4">
                      <Typography.Paragraph
                        className="text-xl text-ellipsis !mb-1 capitalize text-yellow-500"
                        suffix="..."
                        ellipsis={{ rows: 3 }}
                        onClick={() =>
                          navigate(`/${post.group.slug}/${post.slug}`)
                        }
                      >
                        {post.title}
                      </Typography.Paragraph>

                      <Typography.Text className="text-base">
                        {post.description}
                      </Typography.Text>

                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <span>{info?.newData?.[0].name}</span>
                        <span>{FormatDay(post.createdAt)}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-1" />{" "}
                          {FormatDayTime(post.createdAt)}
                        </span>
                        <Typography.Link
                          className="flex items-center"
                          onClick={() =>
                            navigate(`/${post.group.slug}/${post.slug}`)
                          }
                        >
                          Xem thêm <FaChevronRight className="ml-1" />
                        </Typography.Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Pagination
                  onChange={handlePaginationChange}
                  total={pages.totalItems || 0}
                  showSizeChanger
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} trên ${total} trang`
                  }
                  pageSize={pageSize}
                  pageSizeOptions={["4", "8", "16", "24", "35", "45"]}
                  current={pages?.currentPage || 1}
                />
              </div>
            </>
          ) : (
            <section>
              <Result
                status="403"
                title="Không có dữ liệu!"
                subTitle="Trang chưa được thêm dữ liệu vào trong, vui lòng thêm dữ liệu vào!"
              />
            </section>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Html;
