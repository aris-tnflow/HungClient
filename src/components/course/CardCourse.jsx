import { useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Skeleton,
  Typography,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { FormatPrice, FormatPriceSale } from "~/components/table/Format";
import { toastSuccess } from "~/components/toast";
import { FaCartShopping } from "react-icons/fa6";

import { addToCart } from "~/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdSlowMotionVideo } from "react-icons/md";
import { baseURL } from "~/utils";
import StarRating from "~/components/star/Star";

import "./Card.css";
import "~/pages/public/Cart/Cart.css";
import ListCart from "../cart/ListCart";
import { IoMdLogIn } from "react-icons/io";
import { addToCartDetail } from "~/redux/slices/cartDetailSlice";

const CardCourse = ({
  loading,
  info = "",
  carts = "",
  height = "15.75rem",
  ellipsisRow = 1,
  openList = true,
  link,
}) => {
  const ellipsis = true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isPurchased = user?.courses?.some((course) => course === info._id);

  return (
    <>
      <Card
        className="card-course-container ant-card-pro"
        loading={loading}
        cover={
          <div className="card-inner" style={{ height: height }}>
            <div className="box">
              <NavLink to={link || `/course/${info.slug}`}>
                <div className="imgBox">
                  {loading && (
                    <Skeleton.Image className="!w-full !h-full" active={true} />
                  )}
                  <motion.img
                    src={
                      info.img ? `${baseURL}/uploads/${info.img}` : `/empty.png`
                    }
                    alt={`Ảnh khóa học ${info.name}`}
                    style={{ display: loading ? "none" : "block" }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </NavLink>

              <div className="icon">
                {!loading && (
                  <>
                    {isPurchased || info.price === 0 ? (
                      user?.userType ? (
                        <Tooltip placement="right" title={"Học ngay"}>
                          <div
                            className="iconBox"
                            onClick={() =>
                              navigate(`/user/course/${info.slug}`)
                            }
                          >
                            <MdSlowMotionVideo
                              className="icon-shop"
                              size={25}
                            />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip placement="right" title={"Đăng nhập để học"}>
                          <div
                            className="iconBox"
                            onClick={() =>
                              navigate("/login", {
                                state: { from: `/user/course/${info.slug}` },
                              })
                            }
                          >
                            <IoMdLogIn className="icon-shop" size={25} />
                          </div>
                        </Tooltip>
                      )
                    ) : (
                      <Tooltip placement="right" title={"Thêm vào giỏ hàng"}>
                        <div
                          className="iconBox"
                          onClick={() => {
                            if (openList) setOpenCart(true);
                            dispatch(addToCart(info));
                            setTimeout(() => {
                              dispatch(addToCartDetail(info));
                            }, 0);
                            toastSuccess(
                              info.name,
                              "Thêm Vào Giỏ Hàng Thành Công!",
                              `Đã thêm ${info.name} vào giỏ hàng`
                            );
                          }}
                        >
                          <FaCartShopping className="icon-shop" size={22} />
                        </div>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        }
      >
        <NavLink to={`/course/${info.slug || ""}`}>
          <div className="card-course">
            <div className="content h-full">
              <Typography.Title
                ellipsis={ellipsis ? { rows: ellipsisRow, suffix: "" } : false}
                level={4}
              >
                {info.name}
              </Typography.Title>
              <Typography.Paragraph
                className="mb-2"
                ellipsis={ellipsis ? { rows: ellipsisRow, suffix: "" } : false}
              >
                {info.title || "Khóa học chưa có mô tả"}
              </Typography.Paragraph>

              <div className="flex flex-wrap items-center justify-between gap-2">
                {isPurchased && info.price > 0 ? (
                  <Typography.Title className="!mb-0" level={3} type="success">
                    Đã mua
                  </Typography.Title>
                ) : info.price === 0 ? (
                  <Typography.Title className="!mb-0" level={3} type="success">
                    Miễn phí
                  </Typography.Title>
                ) : (
                  <Typography.Title className="!mb-0" level={3} type="danger">
                    {" "}
                    {FormatPrice(FormatPriceSale(info.price, info.sale))}{" "}
                  </Typography.Title>
                )}

                <div
                  className="evaluate flex gap-1"
                  style={{ color: "#ffce3d", fontSize: 16 }}
                >
                  <StarRating star={info.star} />
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </Card>

      <Drawer
        width={500}
        title="Giỏ hàng"
        onClose={() => setOpenCart(false)}
        open={openCart}
      >
        <div className="p-4">
          {carts.length > 0 ? (
            <div className="flex flex-col">
              <ListCart carts={carts} />
              {user?.userType ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến Hành Thanh Toán!
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={() =>
                    navigate("/login", { state: { from: "/checkout" } })
                  }
                >
                  Đăng Nhập Để Thanh Toán
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Empty description="Chưa có khóa học nào trong giỏ hàng" />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default CardCourse;
