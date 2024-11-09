import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "~/redux/slices/cartSlice";
import Layout from "~/components/layout/Public/Layout";

// import Course from "~/components/course/CardCourse";
import { FormatPrice } from "~/components/table/Format";

import SkeletonCategory from "~/components/loading/SkeletonCategory";
import SkeletonCourse from "~/components/loading/SkeletonCourse";

import "./Course.css";
import {
  Col,
  Collapse,
  Row,
  Slider,
  theme,
  Card,
  Button,
  Radio,
  Space,
  Empty,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { getCategoryCouresApi } from "~/redux/slices/Data/categoryCourseSlice";

import { courseApi } from "~/apis/courseApi";
import { toastError } from "~/components/toast";
import { baseClient } from "~/utils";

const CardCourse = lazy(() => import("~/components/course/CardCourse"));

const Courses = () => {
  const dispatch = useDispatch();
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: "10px",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const [loading, setLoading] = useState(true);
  const { courses, status } = useSelector((state) => state.cart);
  // const { categoryCourses: categories, loading: loadingCategory } = useSelector(
  //   (state) => state.categoryCourses
  // );

  const [data, setData] = useState([]);
  const [search, setSearch] = useState({ priceCourse: "0-40000000" });
  const { cartDetail } = useSelector((state) => state.cartDetail);

  const onChangeCategory = (checkedValues) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      categoryCourse: checkedValues,
    }));
  };

  const onChangePrice = (value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      priceCourse: value.join("-"),
    }));
  };

  const selectCategory = (panelStyle) => [
    // {
    //   key: "category",
    //   label: "Danh mục khóa học",
    //   children: (
    //     <>
    //       <Radio.Group
    //         defaultValue=""
    //         onChange={(e) => onChangeCategory(e.target.value)}
    //       >
    //         <Space direction="vertical">
    //           <Radio value="">Tất cả</Radio>
    //           {categories?.newData?.map((item) => (
    //             <Radio key={item.slug} value={item._id}>
    //               {item.category}
    //             </Radio>
    //           ))}
    //         </Space>
    //       </Radio.Group>
    //     </>
    //   ),
    //   style: panelStyle,
    // },
    // {
    //   key: "price",
    //   label: "Giá tiền",
    //   children: (
    //     <Slider
    //       range
    //       onChange={onChangePrice}
    //       defaultValue={[0, 40000000]}
    //       min={0}
    //       max={40000000}
    //       tooltip={{
    //         formatter: (value) => FormatPrice(value),
    //       }}
    //       step={100000}
    //       styles={{
    //         track: {
    //           background: "transparent",
    //         },
    //         tracks: {
    //           background: "linear-gradient(to right, #ffbe00, #ffbe00)",
    //         },
    //       }}
    //     />
    //   ),
    //   style: panelStyle,
    // },
  ];

  const fetchData = () => {
    if (search && Object.keys(search).length > 0) {
      setLoading(true);
      courseApi.search(search).then((res) => {
        setData(res);
        setLoading(false);
      });
    } else {
      toastError(
        "",
        "Chưa chọn thông tin!",
        "Vui lòng chọn điều kiện tìm kiếm"
      );
    }
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItems());
    }
    if (status === "succeeded") {
      setLoading(false);
    }
  }, [dispatch, status]);

  useEffect(() => {
    setData(courses);
  }, [courses]);

  // useEffect(() => {
  //   if (loadingCategory) {
  //     dispatch(getCategoryCouresApi());
  //   }
  // }, []);

  const saleCourses = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses?.newData?.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        url: `${baseClient}/course/${course.slug}`,
        name: course.name,
        description: course.description,
        provider: {
          "@type": "Organization",
          name: "Chicken War Studio",
          sameAs: `${baseClient}`,
        },
        offers: [
          {
            "@type": "Offer",
            category: "Blended",
            priceCurrency: "VND",
            price: course.price,
            url: `${baseClient}/course/${course.slug}`,
            availability: "https://schema.org/InStock",
          },
        ],

        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            courseMode: "Blended",
            location: {
              "@type": "Place",
              name: "Chicken War Studio",
            },
            courseSchedule: {
              "@type": "Schedule",
              duration: "PT3H",
              repeatFrequency: "Daily",
              repeatCount: 31,
            },
            instructor: [
              {
                "@type": "Person",
                name: "Nguyen Bac Trung Nam",
                description: "3D Artist",
                image: `${baseClient}`,
              },
            ],
            offers: [
              {
                "@type": "Offer",
                priceCurrency: "VND",
                price: course.price,
                url: `${baseClient}/course/${course.slug}`,
              },
            ],
          },
          {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: "PT22H",
            offers: [
              {
                "@type": "Offer",
                priceCurrency: "VND",
                price: 1000000,
                url: "https://www.example.com/courses#intro-to-cs", // Thêm url nếu cần
              },
            ],
          },
        ],
      },
    })),

    // "itemListElement": [
    //   {
    //     "@type": "ListItem",
    //     "position": 1,
    //     "item": {
    //       "@type": "Course",
    //       "url": "https://www.example.com/courses#intro-to-cs",
    //       "name": "Introduction to Computer Science and Programming",
    //       "description": "This is an introductory CS course laying out the basics.",
    //       "provider": {
    //         "@type": "Organization",
    //         "name": "University of Technology - Example",
    //         "sameAs": "https://www.example.com"
    //       },
    //       "offers": [
    //         {
    //           "@type": "Offer",
    //           "category": "Blended",
    //           "priceCurrency": "VND",
    //           "price": 1000000,
    //           "url": "https://www.example.com/courses#intro-to-cs", // Thêm url
    //           "availability": "https://schema.org/InStock" // Ví dụ về trạng thái hàng có sẵn
    //         }
    //       ],
    //       "hasCourseInstance": [
    //         {
    //           "@type": "CourseInstance",
    //           "courseMode": "Blended",
    //           "location": {
    //             "@type": "Place",
    //             "name": "HoChiMinh University"
    //           },
    //           "courseSchedule": {
    //             "@type": "Schedule",
    //             "duration": "PT3H",
    //             "repeatFrequency": "Daily",
    //             "repeatCount": 31
    //           },
    //           "instructor": [
    //             {
    //               "@type": "Person",
    //               "name": "Nguyen Bac Trung Nam",
    //               "description": "3D Artist",
    //               "image": `${baseClient}`
    //             }
    //           ],
    //           "offers": [
    //             {
    //               "@type": "Offer",
    //               "priceCurrency": "VND",
    //               "price": 1000000,
    //               "url": "https://www.example.com/courses#intro-to-cs" // Thêm url nếu cần
    //             }
    //           ]
    //         },
    //         {
    //           "@type": "CourseInstance",
    //           "courseMode": "Online",
    //           "courseWorkload": "PT22H",
    //           "offers": [
    //             {
    //               "@type": "Offer",
    //               "priceCurrency": "VND",
    //               "price": 1000000,
    //               "url": "https://www.example.com/courses#intro-to-cs" // Thêm url nếu cần
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   }
    // ]
  };

  return (
    <Layout
      ldJson={courses.length > 0 ? saleCourses : {}}
      title="Danh sách khóa học"
    >
      <section>
        <Row gutter={[24, 24]}>
          <Col
            className="mx-auto"
            md={{ span: 24 }}
            lg={{ span: 22 }}
            xxl={{ span: 20 }}
            span={24}
          >
            {loading ? (
              <SkeletonCourse quantity={8} loading={loading} />
            ) : (
              <Row gutter={[24, 24]}>
                {data.length === 0 ? (
                  <div className="size-full">
                    <Empty />
                  </div>
                ) : (
                  data?.newData?.map(
                    (course, index) =>
                      course.status !== "Chưa bán" && (
                        <Col
                          key={index}
                          sm={{ span: 12 }}
                          md={{ span: 12 }}
                          lg={{ span: 8 }}
                          xl={{ span: 6 }}
                          xxl={{ span: 6 }}
                          span={24}
                        >
                          <Suspense fallback={<div>Loading...</div>}>
                            <CardCourse
                              carts={cartDetail}
                              openList={true}
                              ellipsisRow={1}
                              loading={loading}
                              info={course}
                            />
                          </Suspense>
                        </Col>
                      )
                  )
                )}
              </Row>
            )}
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export default Courses;
