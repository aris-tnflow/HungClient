import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Col,
  Drawer,
  Dropdown,
  Menu,
  Modal,
  Row,
  theme,
  Typography,
} from "antd";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { getMenuApi } from "~/redux/slices/menuSlice";

import "./Layout.css";
import "animate.css";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaGlobeAsia,
  FaHistory,
  FaMailBulk,
  FaPhoneAlt,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaYoutube,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { createRoot } from "react-dom/client";
import { getInfoApi } from "~/redux/slices/Data/infoSlice";
import { getCartDetailApi } from "~/redux/slices/cartDetailSlice";
import { getNotifyPublicApi } from "~/redux/slices/Data/notificationPublicSlice";
import { PiIdentificationCardFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillDashboard } from "react-icons/ai";
import { MdContacts } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";

const LayoutPublic = ({
  title,
  description,
  keywords,
  author,
  ldJson = {},
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const notifyRef = useRef(null);
  const cartRef = useRef(null);

  const [openNotify, setOpenNotify] = useState(false);
  const [notify, setNotify] = useState();

  const [notifiedIds, setNotifiedIds] = useState(() => {
    return JSON.parse(localStorage.getItem("notify")) || [];
  });
  const menuItems = useSelector((state) => state.menu);

  const { menu, loading: loadingMenu } = useSelector((state) => state.menu);
  const { user, loading: loadingUser } = useSelector((state) => state.auth);
  const { info, loading } = useSelector((state) => state.info);
  const { notificationPublic, loading: loadingNotify } = useSelector(
    (state) => state.notificationPublic
  );
  const { cart } = useSelector((state) => state.cart);
  const { cartDetail, loading: loadingCart } = useSelector(
    (state) => state.cartDetail
  );

  const menuMobile = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const menuItems = doc.querySelectorAll("#menu-aris .dropdown__item");
    const menuData = Array.from(menuItems).map((item) => {
      const title = item.querySelector("a").textContent; // Lấy tên menu
      const href = item.querySelector("a").getAttribute("href"); // Lấy href của menu
      const submenuItems = Array.from(
        item.querySelectorAll(".dropdown__subitem a")
      ).map((subitem) => {
        return {
          label: subitem.querySelector("h4.menu-text").textContent, // Tên submenu
          key: subitem.getAttribute("href"), // Href của submenu
        };
      });

      // Tạo đối tượng menu
      const menuItem = {
        label: title,
        key: href,
      };

      // Nếu submenuItems không rỗng, thêm thuộc tính children
      if (submenuItems.length > 0) {
        menuItem.children = submenuItems;
      }

      return menuItem;
    });

    if (user?.userType) {
      menuData.push(
        { label: "TÀI KHOẢN", key: "/user" },
        { label: "KHÓA HỌC CỦA TÔI", key: "/user/courses" },
        { label: "LỊCH SỬ MUA HÀNG", key: "/user/orders" },
        { label: "THÔNG BÁO", key: "/user/notify" }
      );
    }

    menuData.push({
      label: "GIỎ HÀNG",
      key: "/cart",
    });

    if (user?.userType) {
      menuData.push({
        label: "ĐĂNG XUẤT",
        key: "/logout",
      });
    }

    if (!user?.userType) {
      menuData.push({
        label: "ĐĂNG NHẬP",
        key: "/login",
      });
    }
    return menuData;
  };

  function getInitials(name) {
    return name
      .match(/(\b\S)?/g)
      .join("")
      .match(/(^\S|\S$)?/g)
      .join("")
      .toUpperCase();
  }

  useEffect(() => {
    const handleLinkClick = (event) => {
      const target = event.target.closest("a");
      if (target && target.href) {
        const url = new URL(target.href);
        const relativePath = url.pathname + url.search + url.hash;
        if (url.origin === window.location.origin) {
          event.preventDefault();
          navigate(relativePath);
        }
      }
    };

    const container = document.getElementById("root");
    if (container) {
      container.addEventListener("click", handleLinkClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleLinkClick);
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (menu?.[0]?.header) {
      const mobileMenuIcon = document.getElementById("menu-mobile");
      const handleClick = () => setOpen(true);
      if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener("click", handleClick);
      }
      return () => {
        if (mobileMenuIcon) {
          mobileMenuIcon.removeEventListener("click", handleClick);
        }
      };
    }
  }, [menuItems]);

  useEffect(() => {
    const userIcon = document.getElementById("icon-user");
    if (user?.userType && userIcon) {
      if (!rootRef.current) {
        rootRef.current = createRoot(userIcon);
      }
      const root = rootRef.current;

      const menuItems = [
        {
          key: "courses",
          icon: <FaYoutube className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Khóa học của tôi</div>,
          path: "/user",
        },
        {
          key: "info",
          icon: <FaUser className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Thông tin cá nhân</div>,
          path: "/user/info",
        },
        {
          key: "history",
          icon: <FaHistory className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Lịch sử học tập</div>,
          path: "/user/history",
        },
        {
          key: "orders",
          icon: (
            <PiIdentificationCardFill
              className="text-dropdown me-1"
              size={18}
            />
          ),
          label: <div className="text-dropdown">Lịch sử mua hàng</div>,
          path: "/user/orders",
        },
        {
          key: "change-password",
          icon: <RiLockPasswordFill className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Đổi mật khẩu</div>,
          path: "/user/change-password",
        },
        {
          key: "logout",
          icon: <FaSignOutAlt className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Đăng xuất</div>,
          path: "/logout",
        },
      ];

      const menuAdmin = [
        {
          key: "admin",
          icon: <AiFillDashboard className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Trang chủ Admin</div>,
          path: "/admin",
        },
        {
          key: "website",
          icon: <FaGlobeAsia className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Quản lý Website</div>,
          path: "/admin/info",
        },
        {
          key: "website",
          icon: <FaUser className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Quản lý Người Dùng</div>,
          path: "/admin/users",
        },
        {
          key: "courses",
          icon: <FaChartPie className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Quản lý Khóa Học</div>,
          path: "/admin/courses",
        },
        {
          key: "contacts",
          icon: <MdContacts className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Quản lý Liên Hệ</div>,
          path: "/admin/contacts",
        },
        {
          key: "orders",
          icon: <FaShoppingCart className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Quản lý Đơn Hàng </div>,
          path: "/admin/orders",
        },
        {
          key: "notification",
          icon: (
            <IoNotificationsSharp className="text-dropdown me-1" size={18} />
          ),
          label: <div className="text-dropdown">Quản lý Thông Báo</div>,
          path: "/admin/notification",
        },
        {
          key: "logout",
          icon: <FaSignOutAlt className="text-dropdown me-1" size={18} />,
          label: <div className="text-dropdown">Đăng xuất</div>,
          path: "/logout",
        },
      ];

      const renderAvatar = () => {
        const dropdownItems = (
          user?.userType === "user" ? menuItems : menuAdmin
        ).map(({ key, icon, label, path }) => ({
          key,
          label: (
            <div
              className="flex items-center gap-1"
              onClick={() => navigate(path)}
            >
              {icon}
              <Typography.Text>{label}</Typography.Text>
            </div>
          ),
        }));

        return (
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {user?.avatar ? (
              <Avatar
                onClick={(e) => {
                  e.preventDefault(); // Prevent default
                  e.stopPropagation();
                }}
                src={user.avatar}
                size={40}
              />
            ) : (
              <Avatar
                onClick={(e) => {
                  e.preventDefault(); // Prevent default
                  e.stopPropagation();
                }}
                style={{ backgroundColor: colorPrimary }}
                size={40}
              >
                {getInitials(user?.name)}
              </Avatar>
            )}
          </Dropdown>
        );
      };

      root.render(<>{renderAvatar()}</>);
    }
  }, [user, colorPrimary, menuItems]);

  useEffect(() => {
    const userNotify = document.getElementById("icon-notify");

    const dataNotify = notificationPublic?.newData?.map((data) => {
      const isNotified = notifiedIds.includes(data?._id);

      return {
        key: data?._id,
        label: (
          <Row
            onClick={() => {
              setNotify(data);
              setOpenNotify(true);
              if (!isNotified) {
                const updatedNotifiedIds = [...notifiedIds, data?._id];
                localStorage.setItem(
                  "notify",
                  JSON.stringify(updatedNotifiedIds)
                );
                setNotifiedIds(updatedNotifiedIds);
              }
            }}
            gutter={[24, 24]}
            style={{ width: 350 }}
          >
            <Col span={2}>
              <Avatar style={{ backgroundColor: colorPrimary }}>AD</Avatar>
            </Col>
            <Col className="flex justify-between items-center" span={22}>
              <Typography.Text className="text-inline-notify ms-2">
                {data?.title || "No message"}
              </Typography.Text>
              {!isNotified && <Badge color={colorPrimary} />}
            </Col>
          </Row>
        ),
      };
    });

    if (userNotify) {
      const parentElement = userNotify.parentNode;
      if (!notifyRef.current) {
        notifyRef.current = createRoot(parentElement);
      }
      const notifyRoot = notifyRef.current;

      const renderNotificationIcon = () => {
        const unreadCount =
          notificationPublic?.newData?.filter(
            (data) => !notifiedIds.includes(data?._id)
          ).length || 0;

        return notificationPublic?.newData?.length > 0 ? (
          <Dropdown
            menu={{
              items: dataNotify,
            }}
          >
            <Badge className="size-full" count={unreadCount}>
              <div dangerouslySetInnerHTML={{ __html: userNotify.outerHTML }} />
            </Badge>
          </Dropdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: userNotify.outerHTML }} />
        );
      };

      notifyRoot.render(<>{renderNotificationIcon()}</>);
    }
  }, [notificationPublic, notifiedIds]);

  useEffect(() => {
    const userCart = document.getElementById("icon-cart");
    const userCartMobile = document.getElementById("cart-mobile");
    if (userCart) {
      const parentElement = userCart.parentNode;
      if (!cartRef.current) {
        cartRef.current = createRoot(parentElement);
      }
      const cartRoot = cartRef.current;

      const renderCartIcon = () => {
        return cart?.length > 0 ? (
          <Badge className="size-full" count={cartDetail?.length}>
            <div dangerouslySetInnerHTML={{ __html: userCart.outerHTML }} />
          </Badge>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: userCart.outerHTML }} />
        );
      };

      cartRoot.render(<>{renderCartIcon()}</>);
    }

    if (userCartMobile) {
      userCartMobile.addEventListener("click", () => {
        navigate("/cart");
      });
    }
  }, [cart, cartDetail, menuItems]);

  useEffect(() => {
    if (!loadingUser) {
      if (loadingCart && cart?.length > 0) {
        dispatch(getCartDetailApi({ ids: cart, idRemove: user?.courses }));
      }
    }
  }, [cart, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];

        if (loadingNotify) {
          promises.push(dispatch(getNotifyPublicApi({ type: "public" })));
        }
        if (loadingMenu) {
          promises.push(dispatch(getMenuApi()));
        }
        if (loading) {
          promises.push(dispatch(getInfoApi()));
        }

        // Kiểm tra promises trước khi gọi Promise.all
        console.log("Promises:", promises);

        if (promises.length > 0) {
          // Đảm bảo Promise.all được gọi
          console.log("Running Promise.all");
          await Promise.all(promises);
          console.log("All promises resolved");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <meta
          name="description"
          content={description || info?.newData?.[0]?.description}
        />
        <meta
          name="keywords"
          content={keywords || info?.newData?.[0]?.keywords}
        />
        <meta name="author" content={author || info?.newData?.[0]?.manage} />
        <title>{title || info?.newData?.[0]?.name}</title>

        {typeof ldJson === "object" && Object.keys(ldJson).length > 0 && (
          <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
        )}
      </Helmet>
      {menu?.[0]?.css && (
        <>
          <style dangerouslySetInnerHTML={{ __html: menu?.[0]?.css }} />
        </>
      )}

      {menu?.[0]?.header && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 500,
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: menu?.[0]?.header }} />
          </div>
        </>
      )}

      <div
        className="flex flex-col justify-between items-stretch"
        style={{ minHeight: "100dvh" }}
      >
        <div>{children}</div>
        <div dangerouslySetInnerHTML={{ __html: menu?.[0]?.footer }} />
      </div>

      <Drawer
        title={info?.newData?.[0]?.name}
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={256}
      >
        <div
          className="flex flex-col justify-between"
          style={{ height: "100%" }}
        >
          <Menu
            mode="inline"
            onClick={(item) => {
              setOpen(false);
              setTimeout(() => {
                navigate(item.key);
              }, 500);
            }}
            style={{
              width: 256,
            }}
            items={menuMobile(menu?.[0]?.header)}
          />

          <div className="p-2">
            <div className="flex items-center gap-2 my-2">
              <FaMailBulk size={22} />
              {info?.newData?.[0]?.email}
            </div>
            <div className="flex items-center gap-2 my-2">
              <FaPhoneAlt size={22} />
              {info?.newData?.[0]?.phone}
            </div>
            <div className="flex items-center gap-2 my-2">
              <FaLocationDot size={22} />
              {info?.newData?.[0]?.address}
            </div>
          </div>
        </div>
      </Drawer>

      <Modal
        title={`Thông báo: ${notify?.title}`}
        centered
        open={openNotify}
        onOk={() => setOpenNotify(false)}
        onCancel={() => setOpenNotify(false)}
        width={1000}
      >
        {notify?.content}
      </Modal>
    </HelmetProvider>
  );
};
export default LayoutPublic;
