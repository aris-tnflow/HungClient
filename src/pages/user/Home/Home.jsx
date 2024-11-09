import { Card, Col, Empty, Row, Typography } from "antd";
import LayoutAdmin from "~/components/layout/Admin/Layout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { userApi } from "~/apis/userApi";
import { baseURL } from "~/utils";
import { FormatDayTime } from "~/components/table/Format";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const collapsed = useSelector((state) => state.collapsed.collapsedMode);

  function createSlug(name) {
    const map = {
      à: "a",
      á: "a",
      ạ: "a",
      ả: "a",
      ã: "a",
      â: "a",
      ầ: "a",
      ấ: "a",
      ậ: "a",
      ẩ: "a",
      ẫ: "a",
      ă: "a",
      ằ: "a",
      ắ: "a",
      ặ: "a",
      ẳ: "a",
      ẵ: "a",
      è: "e",
      é: "e",
      ẹ: "e",
      ẻ: "e",
      ẽ: "e",
      ê: "e",
      ề: "e",
      ế: "e",
      ệ: "e",
      ể: "e",
      ễ: "e",
      ì: "i",
      í: "i",
      ị: "i",
      ỉ: "i",
      ĩ: "i",
      ò: "o",
      ó: "o",
      ọ: "o",
      ỏ: "o",
      õ: "o",
      ô: "o",
      ồ: "o",
      ố: "o",
      ộ: "o",
      ổ: "o",
      ỗ: "o",
      ơ: "o",
      ờ: "o",
      ớ: "o",
      ợ: "o",
      ở: "o",
      ỡ: "o",
      ù: "u",
      ú: "u",
      ụ: "u",
      ủ: "u",
      ũ: "u",
      ư: "u",
      ừ: "u",
      ứ: "u",
      ự: "u",
      ử: "u",
      ữ: "u",
      ỳ: "y",
      ý: "y",
      ỵ: "y",
      ỷ: "y",
      ỹ: "y",
      đ: "d",
      À: "A",
      Á: "A",
      Ạ: "A",
      Ả: "A",
      Ã: "A",
      Â: "A",
      Ầ: "A",
      Ấ: "A",
      Ậ: "A",
      Ẩ: "A",
      Ẫ: "A",
      Ă: "A",
      Ằ: "A",
      Ắ: "A",
      Ặ: "A",
      Ẳ: "A",
      Ẵ: "A",
      È: "E",
      É: "E",
      Ẹ: "E",
      Ẻ: "E",
      Ẽ: "E",
      Ê: "E",
      Ề: "E",
      Ế: "E",
      Ệ: "E",
      Ể: "E",
      Ễ: "E",
      Ì: "I",
      Í: "I",
      Ị: "I",
      Ỉ: "I",
      Ĩ: "I",
      Ò: "O",
      Ó: "O",
      Ọ: "O",
      Ỏ: "O",
      Õ: "O",
      Ô: "O",
      Ồ: "O",
      Ố: "O",
      Ộ: "O",
      Ổ: "O",
      Ỗ: "O",
      Ơ: "O",
      Ờ: "O",
      Ớ: "O",
      Ợ: "O",
      Ở: "O",
      Ỡ: "O",
      Ù: "U",
      Ú: "U",
      Ụ: "U",
      Ủ: "U",
      Ũ: "U",
      Ư: "U",
      Ừ: "U",
      Ứ: "U",
      Ự: "U",
      Ử: "U",
      Ữ: "U",
      Ỳ: "Y",
      Ý: "Y",
      Ỵ: "Y",
      Ỷ: "Y",
      Ỹ: "Y",
      Đ: "D",
    };

    return name
      .split("")
      .map((char) => map[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  }

  useEffect(() => {
    if (user?._id) {
      userApi.getSig(user?._id).then((res) => {
        const sortedVideos = res.video.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        const top10Videos = sortedVideos.slice(0, 20);
        setData(top10Videos);
      });
    }
  }, [user]);

  return (
    <LayoutAdmin title="Lịch sử học tập" header={"LỊCH SỬ HỌC TẬP"}>
      <Card className="h-full overflow-auto" title="Video khóa học gần đây">
        {data?.length > 0 ? (
          <Row gutter={[24, 24]}>
            <Col xxl={collapsed ? 15 : 13} xl={14} lg={24} span={24}>
              <div className="sticky top-6">
                <div className="group relative">
                  <img
                    className="w-full h-[450px] object-cover rounded-lg group-hover:opacity-50  transition-opacity duration-300"
                    src={`${baseURL}/uploads/${data?.[0]?.img}`}
                    alt=""
                  />
                  <div
                    onClick={() =>
                      navigate(
                        `/user/course/${createSlug(data?.[0]?.name)}?videoId=${
                          data?.[0]?.videoId
                        }`
                      )
                    }
                    className="absolute inset-0 flex items-center cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={96}
                      height={96}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffc000"
                        fillOpacity={0}
                        stroke="#ffc000"
                        strokeDasharray={40}
                        strokeDashoffset={40}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.9"
                        d="M8 6l10 6l-10 6Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="fill-opacity"
                          begin="0.5s"
                          dur="0.5s"
                          values="0;1"
                        />
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.5s"
                          values="40;0"
                        />
                      </path>
                    </svg>
                    <Typography.Title level={5}>
                      {data?.[0]?.title}
                    </Typography.Title>
                  </div>
                </div>
                <Typography.Title
                  type="warning"
                  className="text-center"
                  level={2}
                >
                  {data?.[0]?.name}
                </Typography.Title>
              </div>
            </Col>

            <Col xxl={collapsed ? 9 : 11} xl={10} lg={24} span={24}>
              <Row gutter={[15, 15]}>
                {data.slice(1).map((video) => (
                  <Col key={video?.videoId} span={24} className="flex gap-2">
                    <div className="group relative flex items-center">
                      <img
                        className="w-48 max-sm:w-28 object-cover rounded-lg group-hover:opacity-50 transition-opacity duration-300"
                        src={`${baseURL}/uploads/${video?.img}`}
                        alt=""
                      />
                      <div
                        onClick={() => {
                          navigate(
                            `/user/course/${createSlug(video?.name)}?videoId=${
                              video?.videoId
                            }`
                          );
                        }}
                        className="absolute inset-0 flex items-center cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={56}
                          height={56}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ffc000"
                            fillOpacity={0}
                            stroke="#ffc000"
                            strokeDasharray={40}
                            strokeDashoffset={40}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.9"
                            d="M8 6l10 6l-10 6Z"
                          >
                            <animate
                              fill="freeze"
                              attributeName="fill-opacity"
                              begin="0.5s"
                              dur="0.5s"
                              values="0;1"
                            />
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              dur="0.5s"
                              values="40;0"
                            />
                          </path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 justify-center w-full">
                      <Typography.Title
                        type="warning"
                        suffix="..."
                        ellipsis={{ rows: 2 }}
                        className="!m-0"
                        level={5}
                      >
                        {video?.name}
                      </Typography.Title>
                      <Typography.Title
                        suffix="..."
                        ellipsis={{ rows: 2 }}
                        className="!m-0 !text-sm"
                        level={5}
                      >
                        {video?.title}
                      </Typography.Title>
                      <Typography.Text className="!m-0" level={5}>
                        Xem cách đây: {FormatDayTime(video?.updatedAt)}
                      </Typography.Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : (
          <Empty
            description={<Typography.Text>Chưa có video</Typography.Text>}
          />
        )}
      </Card>
    </LayoutAdmin>
  );
};

export default Home;
