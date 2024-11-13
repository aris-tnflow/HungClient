import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Popconfirm,
  Row,
  theme,
  Typography,
} from "antd";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  useBeforeUnload,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { courseApi } from "~/apis/courseApi";
import { userApi } from "~/apis/userApi";

import LayoutAdmin from "~/components/layout/Admin/Layout";
import { toastError } from "~/components/toast";
import Video from "~/components/video/Video";
import { baseURL } from "~/utils";

const HomePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");

  const {
    token: { colorPrimary },
  } = theme.useToken();
  const mediaPlayerRef = useRef(null);
  const contentContainerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState(null);
  const [data, setData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);

  const refs = {
    videoRef: useRef(null),
    modulesRef: useRef(null),
    contentRef: useRef(null),
  };

  const tourSteps = [
    {
      title: "VIDEO KHÓA HỌC",
      description: "Xem kỹ video và thực hành theo từng bước!",
      target: () => refs.videoRef.current,
    },
    {
      title: "HỌC PHẦN",
      placement: "right",
      description: "Hãy xem theo thứ tự từ trên xuống dưới!",
      target: () => refs.modulesRef.current,
    },
    {
      title: "GHI CHÚ BÀI HỌC",
      placement: "right",
      description:
        "Trong bài học có phần ghi chú lý thuyết, mọi người nên lưu ý!",
      target: () => refs.contentRef.current,
    },
  ];

  const checkCourseAccess = useCallback((courses, userCourses, targetSlug) => {
    const course = courses?.find((course) => course.slug === targetSlug);
    return course?._id || null;
  }, []);

  const getLatestWatchedVideo = useCallback((user, courseModules) => {
    if (!user?.video || !courseModules) {
      return null;
    }

    const watchedVideos = user.video
      .filter((video) => video.watched)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const latestVideo = watchedVideos[0];
    if (!latestVideo) {
      return null;
    }

    for (const module of courseModules) {
      for (const child of module.children) {
        if (child._id === latestVideo.videoId) {
          return { ...child, watchTime: latestVideo.watchTime };
        }
      }
    }
    return null;
  }, []);

  const addWatchTimeToCourse = useCallback((courseData, userWatchedVideos) => {
    if (!courseData?.module || !userWatchedVideos) {
      return courseData;
    }

    return {
      ...courseData,
      module: courseData.module.map((module) => ({
        ...module,
        children: module.children.map((video) => {
          const watchedVideo = userWatchedVideos.find(
            (v) => v.videoId === video._id
          );
          return {
            ...video,
            watchTime: watchedVideo ? watchedVideo.watchTime : undefined,
            watched: !!watchedVideo,
          };
        }),
      })),
    };
  }, []);

  const updateVideoWatchStatus = useCallback((videoId) => {
    setCourse((prevCourse) => {
      if (!prevCourse) {
        return null;
      }
      return {
        ...prevCourse,
        module: prevCourse.module.map((module) => ({
          ...module,
          children: module.children.map((video) =>
            video._id === videoId ? { ...video, watched: true } : video
          ),
        })),
      };
    });
  }, []);

  const handleVideoClick = useCallback(
    async (video, course) => {
      setCurrentVideo(video);
      if (refs.videoRef.current) {
        refs.videoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (video?.src && user?._id && !video.watched) {
        try {
          await userApi.putVideo({
            id: user._id,
            name: course?.name,
            img: course?.img,
            title: video.title,
            videoId: video._id,
            watchTime: 0,
            watched: true,
          });
          updateVideoWatchStatus(video._id);
        } catch (error) {
          toastError(
            "video",
            "Không thể cập nhật trạng thái video",
            "Đã xảy ra lỗi khi cập nhật trạng thái xem video"
          );
        }
      }
    },
    [user, updateVideoWatchStatus]
  );

  const injectStyles = useCallback(() => {
    if (currentVideo?.content?.css) {
      const styleElement = document.createElement("style");
      styleElement.textContent = currentVideo.content.css;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [currentVideo]);

  const injectScripts = useCallback(() => {
    if (currentVideo?.content?.js) {
      const scriptContent = `
        (function() {
          try {
            ${currentVideo.content.js}
          } catch (error) {
            console.error('Error in lesson script:', error);
          }
        })();
      `;

      const scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.textContent = scriptContent;

      if (contentContainerRef.current) {
        contentContainerRef.current.appendChild(scriptElement);

        return () => {
          if (contentContainerRef.current?.contains(scriptElement)) {
            contentContainerRef.current.removeChild(scriptElement);
          }
        };
      }
    }
  }, [currentVideo]);

  useEffect(() => {
    const cleanupStyle = injectStyles();
    const cleanupScript = injectScripts();

    return () => {
      if (cleanupStyle) {
        cleanupStyle();
      }
      if (cleanupScript) {
        cleanupScript();
      }
    };
  }, [currentVideo, injectStyles, injectScripts]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await courseApi.checkCourseUser({
          idUser: user._id,
          slugCourse: slug,
        });

        if (!response.module || response.module.length === 0) {
          toastError(
            "courses",
            "Không Thể Xem Khóa Học!",
            "Khóa học này chưa có thông tin và video!"
          );
          navigate("/user");
          return;
        }

        const processedCourse = addWatchTimeToCourse(
          response,
          video?.video || user?.video
        );
        const latestWatchedVideo = getLatestWatchedVideo(
          video,
          processedCourse.module
        );
        setCourse(processedCourse);
        setData(processedCourse);
        if (latestWatchedVideo !== null) {
          setCurrentVideo(latestWatchedVideo);
        } else {
          setCurrentVideo(processedCourse.module[0].children[0]);
        }
        setLoading(false);
      } catch (error) {
        toastError(
          "courses",
          "Không Thể Xem Khóa Học!",
          "Khóa học không tồn tại hoặc bạn chưa mua khóa học này!"
        );
        navigate("/user");
      }
    };

    if (user?._id && slug) {
      fetchCourseData();
    }
  }, [
    user,
    navigate,
    slug,
    checkCourseAccess,
    addWatchTimeToCourse,
    getLatestWatchedVideo,
    video,
  ]);

  useBeforeUnload(
    useCallback(() => {
      const handleBeforeUnload = () => {
        const currentTime = mediaPlayerRef.current?.currentTime || 0;
        if (user?._id && currentVideo?._id) {
          userApi.putVideo({
            id: user._id,
            videoId: currentVideo._id,
            img: course?.img,
            name: course?.name,
            title: currentVideo.title,
            watched: true,
            watchTime: currentTime,
          });
        }
      };
      handleBeforeUnload();
    }, [currentVideo, user])
  );

  const courseModules = useMemo(
    () =>
      course?.module?.map((module) => {
        const isCurrentVideoInModule = module.children.some(
          (video) => video._id === currentVideo?._id
        );
        const isAllVideosWatched = module.children.every(
          (video) => video.watched
        );

        return {
          key: module._id,
          label: (
            <div className="flex items-center gap-2">
              <Typography.Title level={5} strong className="!mb-0">
                {module.title}
              </Typography.Title>

              {isCurrentVideoInModule && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2rem"
                    height="1.2rem"
                    viewBox="0 0 24 24"
                  >
                    <rect width="6" height="14" x="1" y="4" fill="#ff0000">
                      <animate
                        id="svgSpinnersBarsScaleFade0"
                        fill="freeze"
                        attributeName="y"
                        begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                        dur="0.75s"
                        values="1;5"
                      />
                      <animate
                        fill="freeze"
                        attributeName="height"
                        begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                        dur="0.75s"
                        values="22;14"
                      />
                      <animate
                        fill="freeze"
                        attributeName="opacity"
                        begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                        dur="0.75s"
                        values="1;0.2"
                      />
                    </rect>
                    <rect
                      width="6"
                      height="14"
                      x="9"
                      y="4"
                      fill="#ff0000"
                      opacity="0.4"
                    >
                      <animate
                        fill="freeze"
                        attributeName="y"
                        begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                        dur="0.75s"
                        values="1;5"
                      />
                      <animate
                        fill="freeze"
                        attributeName="height"
                        begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                        dur="0.75s"
                        values="22;14"
                      />
                      <animate
                        fill="freeze"
                        attributeName="opacity"
                        begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                        dur="0.75s"
                        values="1;0.2"
                      />
                    </rect>
                    <rect
                      width="6"
                      height="14"
                      x="17"
                      y="4"
                      fill="#ff0000"
                      opacity="0.3"
                    >
                      <animate
                        id="svgSpinnersBarsScaleFade1"
                        fill="freeze"
                        attributeName="y"
                        begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                        dur="0.75s"
                        values="1;5"
                      />
                      <animate
                        fill="freeze"
                        attributeName="height"
                        begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                        dur="0.75s"
                        values="22;14"
                      />
                      <animate
                        fill="freeze"
                        attributeName="opacity"
                        begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                        dur="0.75s"
                        values="1;0.2"
                      />
                    </rect>
                  </svg>
                </>
              )}
            </div>
          ),
          extra: (
            <Typography.Text
              type={`${isAllVideosWatched ? "warning" : undefined}`}
            >
              {module.children.length} Bài Học
            </Typography.Text>
          ),
          icon: "1",
          children: module.children.map((video) => (
            <div
              id={video._id}
              onClick={() => {
                handleVideoClick(video, course);
              }}
              key={video._id}
              className="flex justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1">
                {video?.watched ? (
                  <>
                    <MdOutlineSlowMotionVideo color={colorPrimary} size={20} />
                    <Typography.Title
                      level={5}
                      style={{ color: colorPrimary }}
                      className="!mb-0 p-2"
                    >
                      {video.title}
                    </Typography.Title>
                  </>
                ) : (
                  <>
                    <MdOutlineSlowMotionVideo size={20} />
                    <Typography.Title level={5} className="!mb-0 p-2">
                      {video.title}
                    </Typography.Title>
                  </>
                )}
              </div>

              {currentVideo?._id === video._id && (
                <Typography.Text type="danger" className="!mb-0 p-2">
                  {video?.src && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2rem"
                        height="1.2rem"
                        viewBox="0 0 24 24"
                      >
                        <rect width="6" height="14" x="1" y="4" fill="#ff0000">
                          <animate
                            id="svgSpinnersBarsScaleFade0"
                            fill="freeze"
                            attributeName="y"
                            begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                            dur="0.75s"
                            values="1;5"
                          />
                          <animate
                            fill="freeze"
                            attributeName="height"
                            begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                            dur="0.75s"
                            values="22;14"
                          />
                          <animate
                            fill="freeze"
                            attributeName="opacity"
                            begin="0;svgSpinnersBarsScaleFade1.end-0.25s"
                            dur="0.75s"
                            values="1;0.2"
                          />
                        </rect>
                        <rect
                          width="6"
                          height="14"
                          x="9"
                          y="4"
                          fill="#ff0000"
                          opacity="0.4"
                        >
                          <animate
                            fill="freeze"
                            attributeName="y"
                            begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                            dur="0.75s"
                            values="1;5"
                          />
                          <animate
                            fill="freeze"
                            attributeName="height"
                            begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                            dur="0.75s"
                            values="22;14"
                          />
                          <animate
                            fill="freeze"
                            attributeName="opacity"
                            begin="svgSpinnersBarsScaleFade0.begin+0.15s"
                            dur="0.75s"
                            values="1;0.2"
                          />
                        </rect>
                        <rect
                          width="6"
                          height="14"
                          x="17"
                          y="4"
                          fill="#ff0000"
                          opacity="0.3"
                        >
                          <animate
                            id="svgSpinnersBarsScaleFade1"
                            fill="freeze"
                            attributeName="y"
                            begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                            dur="0.75s"
                            values="1;5"
                          />
                          <animate
                            fill="freeze"
                            attributeName="height"
                            begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                            dur="0.75s"
                            values="22;14"
                          />
                          <animate
                            fill="freeze"
                            attributeName="opacity"
                            begin="svgSpinnersBarsScaleFade0.begin+0.3s"
                            dur="0.75s"
                            values="1;0.2"
                          />
                        </rect>
                      </svg>
                    </>
                  )}
                </Typography.Text>
              )}
            </div>
          )),
        };
      }),
    [course, colorPrimary, currentVideo, handleVideoClick]
  );

  useEffect(() => {
    if (user?._id) {
      userApi.getSig(user?._id).then((res) => {
        setVideo(res);
      });
    }
  }, [user]);

  // const handlePlay = (videoId, time) => {
  //   mediaPlayerRef.current.currentTime = time;
  //   mediaPlayerRef.current.intervalId = setInterval(() => {
  //     userApi.putVideo({
  //       id: user?._id,
  //       videoId: videoId,
  //       img: course?.img,
  //       name: course?.name,
  //       title: currentVideo.title,
  //       watched: true,
  //       watchTime: mediaPlayerRef.current.currentTime,
  //     });
  //   }, 2000);
  // };

  // const handlePause = () => {
  //   if (mediaPlayerRef.current?.intervalId) {
  //     clearInterval(mediaPlayerRef.current.intervalId);
  //   }
  // };

  const handlePlay = (videoId, time) => {
    // Đảm bảo `currentTime` chỉ thiết lập một lần, hoặc theo điều kiện
    if (mediaPlayerRef.current.paused) {
      mediaPlayerRef.current.currentTime = time;
    }

    // Xóa interval cũ nếu đã tồn tại
    if (mediaPlayerRef.current.intervalId) {
      clearInterval(mediaPlayerRef.current.intervalId);
    }

    // Tạo một interval mới để cập nhật thông tin video
    mediaPlayerRef.current.intervalId = setInterval(() => {
      userApi.putVideo({
        id: user?._id,
        videoId: videoId,
        img: course?.img,
        name: course?.name,
        title: currentVideo.title,
        watched: true,
        watchTime: mediaPlayerRef.current.currentTime,
      });
    }, 15000);
  };

  // Hàm xử lý khi dừng video
  const handlePause = () => {
    if (mediaPlayerRef.current.intervalId) {
      clearInterval(mediaPlayerRef.current.intervalId);
      mediaPlayerRef.current.intervalId = null;
    }
  };

  useEffect(() => {
    return () => {
      if (mediaPlayerRef.current?.intervalId) {
        clearInterval(mediaPlayerRef.current.intervalId);
      }
    };
  }, []);

  useEffect(() => {
    if (videoId && data) {
      const video = data?.module
        .map((module) => module.children)
        .flat()
        .find((video) => video._id === videoId);

      if (video) {
        setCurrentVideo(video);
      }
    }
  }, [videoId, data]);

  return (
    <LayoutAdmin
      title={course?.name || "Khóa học của tôi"}
      tours={tourSteps}
      openTours={loading}
      header={"KHÓA HỌC CỦA TÔI"}
      button={
        <>
          <Popconfirm
            placement="left"
            title={"Xác nhận học lại khóa học?"}
            description={"Bạn có chắc chắn muốn học lại khóa học này không?"}
            onConfirm={() => {
              userApi.putVideoUser({ id: user?._id, name: course?.name });
              setCurrentVideo(course?.module[0].children[0]);
              mediaPlayerRef.current.currentTime = 0;
              setCourse((prevCourse) => {
                if (!prevCourse) {
                  return null;
                }
                return {
                  ...prevCourse,
                  module: prevCourse.module.map((module, moduleIndex) => ({
                    ...module,
                    children: module.children.map((video, videoIndex) => ({
                      ...video,
                      watched:
                        moduleIndex === 0 && videoIndex === 0 ? true : false,
                    })),
                  })),
                };
              });
            }}
          >
            <Button>Học Lại Khóa Học</Button>
          </Popconfirm>
        </>
      }
    >
      <Row gutter={[24, 24]}>
        <Col
          xxl={{ span: 16 }}
          xl={{ span: 15 }}
          lg={{ span: 14 }}
          md={{ span: 24 }}
          span={24}
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card
                loading={loading}
                title={
                  <Typography.Title level={3} className="!mb-0">
                    {course?.name || "Khóa học của tôi"}
                  </Typography.Title>
                }
                ref={refs.videoRef}
              >
                {currentVideo?.src ? (
                  <>
                    <Video
                      onPlay={handlePlay}
                      onPause={handlePause}
                      mediaPlayerRef={mediaPlayerRef}
                      iduser={user?._id}
                      videoId={currentVideo._id}
                      autoPlay={true}
                      time={currentVideo.watchTime}
                      src={`${baseURL}/uploads/${currentVideo.src}`}
                    />

                    {/* <video
                      src={`${baseURL}/uploads/${currentVideo.src}`}
                      controls
                      autoPlay
                    ></video> */}
                  </>
                ) : (
                  <Empty description="Chưa có video được tải lên!" />
                )}
              </Card>
            </Col>

            <Col span={24}>
              <Card
                className="mb-0 lg:mb-6"
                loading={loading}
                ref={refs.contentRef}
                title={
                  <Typography.Title className="!mb-0" level={3}>
                    {currentVideo?.title}
                  </Typography.Title>
                }
              >
                {currentVideo?.content ? (
                  <>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentVideo.content.html,
                      }}
                    />
                  </>
                ) : (
                  <Empty description="Chưa có nội dung được tải lên!" />
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        <Col
          xxl={{ span: 8 }}
          xl={{ span: 9 }}
          lg={{ span: 10 }}
          md={{ span: 24 }}
          span={24}
        >
          <Card
            className="!mb-6"
            loading={loading}
            title={
              <div className="flex justify-between">
                <Typography.Title level={3} className="!mb-0">
                  Nội Dung Khóa Học
                </Typography.Title>
                <Button
                  onClick={() => {
                    const currentTime =
                      mediaPlayerRef.current?.currentTime || 0;
                    userApi.putVideo({
                      id: user._id,
                      videoId: currentVideo._id,
                      img: course?.img,
                      name: course?.name,
                      title: currentVideo.title,
                      watched: true,
                      watchTime: currentTime,
                    });
                  }}
                >
                  Lưu lịch sử học tập
                </Button>
              </div>
            }
            ref={refs.modulesRef}
          >
            <Collapse
              expandIconPosition="start"
              items={courseModules}
              defaultActiveKey={courseModules?.map((module) => module.key)}
            />
          </Card>
        </Col>
      </Row>
    </LayoutAdmin>
  );
};

export default HomePage;
