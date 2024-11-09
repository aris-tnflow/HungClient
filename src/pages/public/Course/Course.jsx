import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Modal,
  Progress,
  Row,
  Skeleton,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "~/components/layout/Public/Layout";

import Video from "~/components/video/Video";
import { toastError, toastSuccess } from "~/components/toast";

import {
  FaBars,
  FaCheckCircle,
  FaRegStar,
  FaStar,
  FaYoutube,
} from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";

import { courseApi } from "~/apis/courseApi";
import { FormatPrice } from "~/components/table/Format";

import "./Course.css";
import { addToCart, clearCart } from "~/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "~/utils";
import {
  addToCartDetail,
  clearCartDetail,
} from "~/redux/slices/cartDetailSlice";

const Crouses = () => {
  const slug = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const [openVideo, setOpenVideo] = useState(false);
  const [video, setVideo] = useState({});

  const mediaPlayerRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const isPurchased = user?.courses?.some((course) => course === data._id);
  const Includes = ({ data }) => {
    return (
      <>
        {data?.map((item, index) => (
          <Col key={index} span={12} className="flex items-center gap-2">
            <div
              style={{ width: "20px" }}
              dangerouslySetInnerHTML={{ __html: item.svgCode }}
            />
            {item.name}
          </Col>
        ))}
      </>
    );
  };
  useEffect(() => {
    courseApi
      .sig(slug.slug)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        navigate("/courses");
        toastError("", "Không Tìm Thấy Khóa Học!", "Vui lòng thử lại sau!");
      });
  }, [slug.slug]);

  const courseModules = useMemo(
    () =>
      data?.module?.map((module) => ({
        key: module._id,
        label: (
          <Typography.Title level={5} strong className="!mb-0">
            {module.title}
          </Typography.Title>
        ),
        extra: `${module.children.length} Bài Học`,
        children: module.children.map((video) => (
          <div key={video._id} className="flex justify-between cursor-pointer">
            <div className="flex items-center gap-1">
              <PiVideoFill color="ffc000" size={22} />
              <Typography.Title level={5} className="!mb-0 p-2">
                {video.title}
              </Typography.Title>
            </div>
            {video?.public && (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setOpenVideo(true);
                  setVideo({
                    src: `${baseURL}/uploads/${video.src}`,
                    title: video.title,
                  });
                  mediaPlayerRef.current?.play();
                }}
              >
                Xem thử
              </Button>
            )}
          </div>
        )),
      })),
    [data?.module]
  );

  return (
    <Layout
      ldJson={data?.seo || {}}
      title={`${data?.name || "Chicken War Studio"}`}
    >
      <section>
        <Row gutter={[24, 24]}>
          <Col
            xl={{ span: 17, order: 2 }}
            lg={{ span: 15, order: 2 }}
            md={{ span: 24, order: 2 }}
            span={24}
            xs={{ order: 2 }}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card loading={loading} hoverable>
                  <Card.Meta
                    className="mb-3"
                    title={
                      <Typography.Title className="!mb-0" level={3}>
                        {" "}
                        {data?.name}{" "}
                      </Typography.Title>
                    }
                    description={`${data?.title || "Chưa có thông tin"}`}
                  />

                  {!data?.hidden?.includes("benefit") && (
                    <Card className="my-2">
                      <Card.Meta
                        title={
                          <Typography.Title className="!mt-2 !mb-0" level={4}>
                            Lợi ích từ khóa học
                          </Typography.Title>
                        }
                        description={
                          <Row>
                            {data?.benefit?.length > 0 ? (
                              <>
                                {data.benefit.map((item, index) => (
                                  <Col
                                    key={index}
                                    span={24}
                                    className="flex items-center gap-2 my-1"
                                  >
                                    <FaCheckCircle color="ffc000" />
                                    <Typography className="text-base">
                                      {item}
                                    </Typography>
                                  </Col>
                                ))}
                                <img
                                  className="card-image"
                                  src={`/course.png`}
                                  alt="Mô tả ảnh"
                                />
                              </>
                            ) : (
                              <Typography.Text>
                                {" "}
                                Chưa có thông tin
                              </Typography.Text>
                            )}
                          </Row>
                        }
                      />
                    </Card>
                  )}

                  <Card.Meta
                    title={
                      <Typography.Title className="!mt-2 !mb-0" level={3}>
                        Giới thiệu khóa học
                      </Typography.Title>
                    }
                    description={
                      <>
                        <Typography className="!text-justify !text-base">
                          {data?.description || "Chưa có thông tin"}
                        </Typography>
                      </>
                    }
                  />
                </Card>
              </Col>

              {!data?.hidden?.includes("prerequisite") && (
                <Col span={24}>
                  <Card loading={loading} hoverable>
                    <Card.Meta
                      className="mb-2"
                      title={
                        <Typography.Title className="mb-2" level={3}>
                          {" "}
                          Yêu cầu khóa học
                        </Typography.Title>
                      }
                      description={
                        <>
                          <div className="mt-2">
                            {data?.prerequisite?.length > 0 ? (
                              data.prerequisite.map((item, index) => (
                                <div
                                  key={index}
                                  className="col-12 flex items-center gap-2 my-1"
                                >
                                  <FaCheckCircle color="ffc000" />
                                  <Typography.Text className="text-base">
                                    {item}
                                  </Typography.Text>
                                </div>
                              ))
                            ) : (
                              <Typography.Text>
                                Chưa có thông tin
                              </Typography.Text>
                            )}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              )}

              {!data?.hidden?.includes("customer") && (
                <Col Col span={24}>
                  <Card loading={loading} hoverable>
                    <Card.Meta
                      className="mb-2"
                      title={
                        <Typography.Title className="mb-2" level={3}>
                          Khóa học này phù hợp với
                        </Typography.Title>
                      }
                      description={
                        <>
                          {data?.customer?.length > 0 ? (
                            data.customer.map((item, index) => (
                              <div
                                key={index}
                                className="col-12 flex items-center gap-2 my-1"
                              >
                                <FaCheckCircle color="ffc000" />
                                <Typography.Text className="text-base">
                                  {item}
                                </Typography.Text>
                              </div>
                            ))
                          ) : (
                            <Typography.Text>Chưa có thông tin</Typography.Text>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Col>
              )}

              {!data?.hidden?.includes("output") && (
                <Col Col span={24}>
                  <Card loading={loading} hoverable>
                    <Card.Meta
                      className="mb-2"
                      title={
                        <Typography.Title className="mb-2" level={3}>
                          Hoàn Thành Khóa Học
                        </Typography.Title>
                      }
                      description={
                        <>
                          {data?.output?.length > 0 ? (
                            data.output.map((item, index) => (
                              <div
                                key={index}
                                className="col-12 flex items-center gap-2 my-1"
                              >
                                <FaCheckCircle color="ffc000" />
                                <Typography.Text className="text-base">
                                  {item}
                                </Typography.Text>
                              </div>
                            ))
                          ) : (
                            <Typography.Text>Chưa có thông tin</Typography.Text>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Col>
              )}

              {!data?.hidden?.includes("module") && (
                <Col span={24}>
                  <Card loading={loading} hoverable>
                    <Card.Meta
                      className="!mb-2"
                      title={
                        <Typography.Title className="mb-2" level={3}>
                          Nội Dung Khóa Học
                        </Typography.Title>
                      }
                      description={`Khóa học này bao gồm ${
                        data?.module?.length
                      } chương và ${data?.module?.reduce(
                        (acc, cur) => acc + cur.children.length,
                        0
                      )} bài học`}
                    />

                    <Collapse
                      items={courseModules}
                      defaultActiveKey={courseModules?.map((item) => item.key)}
                    />
                  </Card>
                </Col>
              )}

              {!data?.hidden?.includes("review") && (
                <Col span={24}>
                  <Card loading={loading} hoverable>
                    <Card.Meta
                      className="mb-2"
                      title={
                        <Typography.Title className="!mb-2" level={3}>
                          {" "}
                          Đánh Giá Từ Học Viên{" "}
                        </Typography.Title>
                      }
                    />
                    <Row gutter={[12, 12]}>
                      <Col
                        className="flex flex-col justify-center"
                        md={{ span: 6 }}
                        span={24}
                      >
                        <Typography.Title
                          level={1}
                          style={{ color: "#ffc000" }}
                          className="text-center !mb-0"
                        >
                          4.9
                        </Typography.Title>
                        <div
                          className="evaluate flex justify-center gap-1"
                          style={{ color: "#ffc000", fontSize: 18 }}
                        >
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                        <Typography.Text className="text-center text-base">
                          {" "}
                          Đánh giá khóa học
                        </Typography.Text>
                      </Col>

                      <Col md={{ span: 18 }} span={24}>
                        <div className="flex gap-2">
                          <Progress
                            className="mb-2"
                            percent={90}
                            status="active"
                            percentPosition={{
                              align: "center",
                              type: "inner",
                            }}
                            size={["100%", 22]}
                            strokeColor={{
                              from: "#F6E96B",
                              to: "#ffc000",
                            }}
                          />

                          <div
                            className="evaluate flex justify-center gap-1"
                            style={{ color: "#ffc000", fontSize: 18 }}
                          >
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Progress
                            className="mb-2"
                            percent={9}
                            percentPosition={{
                              align: "center",
                              type: "inner",
                            }}
                            size={["100%", 22]}
                            strokeColor={{
                              from: "#F6E96B",
                              to: "#ffc000",
                            }}
                          />

                          <div
                            className="evaluate flex justify-center gap-1"
                            style={{ color: "#ffc000", fontSize: 18 }}
                          >
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaRegStar />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Progress
                            className="mb-2"
                            percent={1}
                            percentPosition={{
                              align: "center",
                              type: "inner",
                            }}
                            size={["100%", 22]}
                            strokeColor={{
                              from: "#F6E96B",
                              to: "#ffc000",
                            }}
                          />

                          <div
                            className="evaluate flex justify-center gap-1"
                            style={{ color: "#ffc000", fontSize: 18 }}
                          >
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaRegStar />
                            <FaRegStar />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Progress
                            className="mb-2"
                            percent={0}
                            percentPosition={{
                              align: "center",
                              type: "inner",
                            }}
                            size={["100%", 22]}
                            strokeColor={{
                              from: "#F6E96B",
                              to: "#ffc000",
                            }}
                          />

                          <div
                            className="evaluate flex justify-center gap-1"
                            style={{ color: "#ffc000", fontSize: 18 }}
                          >
                            <FaStar />
                            <FaStar />
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Progress
                            className="mb-2"
                            percent={0}
                            percentPosition={{
                              align: "center",
                              type: "inner",
                            }}
                            size={["100%", 22]}
                            strokeColor={{
                              from: "#F6E96B",
                              to: "#ffc000",
                            }}
                          />

                          <div
                            className="evaluate flex justify-center gap-1"
                            style={{ color: "#ffc000", fontSize: 18 }}
                          >
                            <FaStar />
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                            <FaRegStar />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}
            </Row>
          </Col>

          <Col
            className="mx-auto"
            xl={{ span: 7, order: 2 }}
            lg={{ span: 9, order: 2 }}
            md={{ span: 12, order: 1 }}
            span={24}
            xs={{ order: 1 }}
          >
            <Card
              loading={loading}
              className="sticky card-course"
              style={{ top: "3rem" }}
              hoverable
              cover={
                <>
                  {loading ? (
                    <Skeleton.Image
                      className="!w-full"
                      active={true}
                      style={{ height: "15rem" }}
                    />
                  ) : (
                    <div className="px-5 pt-5">
                      <img
                        className="rounded-md"
                        style={{ height: "15rem", objectFit: "cover" }}
                        src={
                          data.imgDetail
                            ? `${baseURL}/uploads/${data.imgDetail}`
                            : `/empty.png`
                        }
                        alt=""
                      />
                    </div>
                  )}
                </>
              }
            >
              <Row gutter={[12, 12]}>
                <Divider
                  style={{ margin: "0px 0", borderColor: "rgb(173 173 173)" }}
                >
                  Khóa học bao gồm
                </Divider>

                <Col span={12} className="flex items-center gap-2">
                  <FaBars size={"20px"} />{" "}
                  <Typography>Chuyên Mục {data?.module?.length}</Typography>
                </Col>

                <Col span={12} className="flex items-center gap-2">
                  <FaYoutube size={"20px"} />{" "}
                  <Typography>
                    Bài Học{" "}
                    {data?.module?.reduce(
                      (acc, cur) => acc + cur.children.length,
                      0
                    )}
                  </Typography>
                </Col>

                {data?.includes?.length > 0 && (
                  <Includes data={data.includes} />
                )}

                {isPurchased || data.price === 0 ? (
                  <>
                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      ></Divider>
                      {user.userType === "user" ? (
                        <Button
                          size="large"
                          type="primary"
                          onClick={() => navigate(`/user/course/${data.slug}`)}
                          className="w-full"
                        >
                          Học ngay
                        </Button>
                      ) : (
                        <Button
                          size="large"
                          className="w-full"
                          onClick={() =>
                            navigate("/login", {
                              state: { from: `/user/course/${data.slug}` },
                            })
                          }
                        >
                          Đăng nhập để học
                        </Button>
                      )}
                    </Col>
                  </>
                ) : (
                  <>
                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      >
                        Giá khóa học
                      </Divider>

                      <div className="flex justify-center items-center gap-3 fs-3 text-center text-danger">
                        <Typography.Title
                          className="!mb-0"
                          type="danger"
                          level={3}
                        >
                          {FormatPrice(data.price * (1 - data.sale / 100))}
                        </Typography.Title>

                        {data.sale > 0 && (
                          <>
                            <Typography.Text className="!mb-0" delete>
                              {FormatPrice(data.price)}
                            </Typography.Text>
                            <span className="sale">{data.sale}%</span>
                          </>
                        )}
                      </div>
                    </Col>

                    <Col span={24}>
                      <Divider
                        style={{
                          margin: "10px 0",
                          borderColor: "rgb(173 173 173)",
                        }}
                      ></Divider>
                      <div className="flex flex-col">
                        <Button
                          type="primary"
                          className="mb-2"
                          onClick={() => {
                            dispatch(clearCart());
                            dispatch(clearCartDetail());
                            dispatch(addToCart(data));
                            dispatch(addToCartDetail(data));
                            setTimeout(() => {
                              navigate("/checkout");
                            }, 50);
                          }}
                          size="large"
                        >
                          Mua Ngay
                        </Button>

                        <Button
                          size="large"
                          onClick={() => {
                            dispatch(addToCart(data));
                            setTimeout(() => {
                              dispatch(addToCartDetail(data));
                            }, 0);
                            toastSuccess(
                              data.name,
                              "Thêm Vào Giỏ Hàng Thành Công!",
                              `Đã thêm ${data.name} vào giỏ hàng`
                            );
                          }}
                        >
                          Thêm Vào Giỏ Hàng
                        </Button>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </section>

      <Modal
        centered
        open={openVideo}
        onOk={() => setOpenVideo(false)}
        onCancel={() => {
          setOpenVideo(false);
          mediaPlayerRef.current?.pause();
        }}
        title={
          <Typography.Link className="text-lg">{video?.title}</Typography.Link>
        }
        width={1000}
        footer={null}
        className="mb-2"
      >
        <Video mediaPlayerRef={mediaPlayerRef} src={video?.src} />
      </Modal>
    </Layout>
  );
};

export default Crouses;
