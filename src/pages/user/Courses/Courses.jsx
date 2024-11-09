import { Button, Card, Col, Empty, Row, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import SkeletonCourse from "~/components/loading/SkeletonCourse";
import { getCourseFreeApi } from "~/redux/slices/Data/coursesFreeSlice";
import { getCourseOutstandApi } from "~/redux/slices/Data/coursesOutstandSlice";
import { getCourseUserApi } from "~/redux/slices/User/courseSlice";
import CardCourse from "~/components/course/CardCourse";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { courseUser, loading } = useSelector((state) => state.courseUser);
  const { outstand, loading: loadingOutstand } = useSelector(
    (state) => state.outstand
  );
  const { free, loading: loadingFree } = useSelector((state) => state.free);

  useEffect(() => {
    if (user?.courses) {
      dispatch(getCourseOutstandApi({ ids: user?.courses, limit: 4 }));
    }
  }, [user]);

  useEffect(() => {
    if (user?.courses) {
      dispatch(getCourseUserApi({ ids: user.courses }));
    }
  }, [user]);

  useEffect(() => {
    if (loadingFree) {
      dispatch(getCourseFreeApi({ ids: user.courses }));
    }
  }, [user, dispatch, loadingFree]);

  return (
    <LayoutAdmin title="Khóa học của tôi" header={"KHÓA HỌC CỦA TÔI"}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="ant-card-box">
            <Typography.Title level={3}>Khóa học của tôi</Typography.Title>
            <Row gutter={[24, 12]}>
              {loading ? (
                <Col span={24}>
                  <SkeletonCourse loading={loading} quantity={4} />
                </Col>
              ) : user?.courses?.length == 0 ? (
                <Col span={24}>
                  <div className="flex justify-center">
                    <Empty
                      imageStyle={{
                        height: 150,
                      }}
                      description={
                        <Typography.Text>
                          Chưa có khóa học{" "}
                          <Typography.Link href="/cart">
                            được mua
                          </Typography.Link>
                        </Typography.Text>
                      }
                    >
                      <Button
                        onClick={() => navigate("/courses")}
                        type="primary"
                      >
                        Thêm khóa học ngay
                      </Button>
                    </Empty>
                  </div>
                </Col>
              ) : (
                courseUser.map((course, index) => (
                  <Col
                    key={index}
                    sm={{ span: 24 }}
                    md={{ span: 12 }}
                    lg={{ span: 8 }}
                    xl={{ span: 6 }}
                    xxl={{ span: 6 }}
                    span={24}
                  >
                    <CardCourse
                      openList={false}
                      ellipsisRow={1}
                      loading={loading}
                      info={course}
                      link={`/user/course/${course.slug}`}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="ant-card-box">
            <Typography.Title level={3}>Khóa học miễn phí</Typography.Title>
            <Row gutter={[24, 12]}>
              {loadingFree ? (
                <Col span={24}>
                  <SkeletonCourse loading={loadingFree} quantity={4} />
                </Col>
              ) : free.length === 0 ? (
                <Col span={24}>
                  <div className="flex justify-center">
                    <Empty
                      imageStyle={{
                        height: 150,
                      }}
                      description={
                        <Typography.Text>
                          Chưa có khóa học{" "}
                          <Typography.Link href="/cart">
                            miễn phí
                          </Typography.Link>
                        </Typography.Text>
                      }
                    >
                      <Button
                        onClick={() => navigate("/courses")}
                        type="primary"
                      >
                        Mua các khóa học khác
                      </Button>
                    </Empty>
                  </div>
                </Col>
              ) : (
                free.map((course, index) => (
                  <Col
                    key={index}
                    sm={{ span: 24 }}
                    md={{ span: 12 }}
                    lg={{ span: 8 }}
                    xl={{ span: 6 }}
                    xxl={{ span: 6 }}
                    span={24}
                  >
                    <CardCourse
                      openList={false}
                      ellipsisRow={1}
                      loading={loading}
                      info={course}
                      link={`/user/course/${course.slug}`}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Card>
        </Col>

        <Col className="mb-6" span={24}>
          <Card>
            <div className="flex flex-wrap justify-between items-center mb-2">
              <Typography.Title level={3} className="!mb-0">
                Có thể bạn sẽ thích
              </Typography.Title>
              <Typography.Link onClick={() => navigate("/courses")}>
                Xem thêm
              </Typography.Link>
            </div>

            {outstand?.length === 0 ? (
              <Empty />
            ) : (
              <Row gutter={[24, 12]}>
                {outstand.map(
                  (course, index) =>
                    course.status !== "Chưa bán" && (
                      <Col
                        key={index}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 8 }}
                        xl={{ span: 6 }}
                        xxl={{ span: 6 }}
                        span={24}
                      >
                        <CardCourse
                          openList={false}
                          ellipsisRow={1}
                          loading={loadingOutstand}
                          info={course}
                        />
                      </Col>
                    )
                )}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </LayoutAdmin>
  );
};

export default HomePage;
