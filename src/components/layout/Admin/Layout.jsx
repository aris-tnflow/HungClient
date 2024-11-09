import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Popover,
  Row,
  Select,
  Tooltip,
  Tour,
  Typography,
  theme,
} from "antd";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "~/redux/slices/languageSlice";
import { useMediaQuery } from "react-responsive";
import { toastError, toastSuccess } from "~/components/toast";
import StrokeLogo from "~/components/animation/StrokeLogo";
import { toggleCompact } from "~/redux/slices/collapsedSlice";

import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaLanguage,
  FaShoppingCart,
  FaInfoCircle,
  FaKey,
  FaDatabase,
  FaChartPie,
  FaHistory,
} from "react-icons/fa";
import {
  FaYoutube,
  FaFolderOpen,
  FaEarthAmericas,
  FaFileCirclePlus,
  FaGear,
  FaBars,
  FaCircleQuestion,
  FaCartShopping,
} from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { AiFillLayout } from "react-icons/ai";
import { PiIdentificationCardFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { IoMdMail } from "react-icons/io";
import { BsPlugin } from "react-icons/bs";

import { TYPE_EMPLOYEE } from "~/utils";

import "./Layout.css";
import "animate.css";
import { getInfoApi } from "~/redux/slices/Data/infoSlice";
import { MdContacts } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import {
  getNotifyApi,
  removeNotify,
} from "~/redux/slices/Data/notificationSlice";
import { putUsersNotifyApi } from "~/redux/slices/Data/usersSlice";
import { getCartDetailApi } from "~/redux/slices/cartDetailSlice";

const { Header, Sider, Content } = Layout;

const LayoutAdmin = ({
  title,
  description,
  keywords,
  author,
  children,
  header,
  button,
  margin = 24,
  tours,
  openTours = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const popRef = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 998px)" });
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const {
    user: { userType, avatar },
  } = useSelector((state) => state.auth);
  const { user, loading: loadingUser } = useSelector((state) => state.auth);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const collapsed = useSelector((state) => state.collapsed.collapsedMode);
  const { darkMode } = useSelector((state) => state.theme);
  const { info, loading } = useSelector((state) => state.info);
  const [openTour, setOpenTour] = useState(false);
  const { notification, loading: loadingNotify } = useSelector(
    (state) => state.notification
  );

  const { cart } = useSelector((state) => state.cart);

  const { cartDetail, loading: loadingCart } = useSelector(
    (state) => state.cartDetail
  );
  const [dataNotify, setDataNotify] = useState([]);

  const [openNotify, setOpenNotify] = useState(false);
  const [notify, setNotify] = useState();
  const [open, setOpen] = useState(false);

  const languages = [
    {
      value: "vi_VN",
      label: "Việt Nam",
      desc: "Việt Nam",
    },
  ];

  const menuSidebars = useMemo(() => {
    const menuItems = [];
    switch (userType) {
      case TYPE_EMPLOYEE.admin: {
        menuItems.push({
          key: "dashboard",
          icon: <FaTachometerAlt size={18} />,
          label: "Bảng Điều Khiển",
          link: "/admin",
        });
        menuItems.push({
          key: "pages",
          icon: <FaEarthAmericas size={18} />,
          label: "Website",
          children: [
            {
              key: "website1",
              icon: <FaInfoCircle size={18} />,
              label: "Thông tin",
              link: "/admin/info",
            },
            {
              key: "layout",
              icon: <AiFillLayout size={18} />,
              label: "Bố cục",
              link: "/admin/layout",
            },
            {
              key: "page",
              icon: <FaFileCirclePlus size={18} />,
              label: "Bài viết",
              link: "/admin/pages",
            },
          ],
        });
        menuItems.push({
          key: "plugins",
          icon: <BsPlugin size={18} />,
          label: "Plugins",
          link: "/admin/plugins",
        });
        menuItems.push({
          key: "user",
          icon: <FaUser size={18} />,
          label: "Người dùng",
          link: "/admin/users",
        });
        menuItems.push({
          key: "courses",
          icon: <FaChartPie size={18} />,
          label: "Khóa học",
          link: "/admin/courses",
        });
        menuItems.push({
          key: "contacts",
          icon: <MdContacts size={18} />,
          label: "Liên hệ",
          link: "/admin/contacts",
        });
        menuItems.push({
          key: "orders",
          icon: <FaShoppingCart size={18} />,
          label: "Đơn hàng",
          link: "/admin/orders",
        });
        menuItems.push({
          key: "notification",
          icon: <IoNotificationsSharp size={18} />,
          label: "Thông báo",
          link: "/admin/notification",
        });
        menuItems.push({
          key: "email",
          icon: <IoMdMail size={18} />,
          label: "Email",
          link: "/admin/emails",
        });
        menuItems.push({
          key: "fileManager",
          icon: <FaFolderOpen size={18} />,
          label: "Quản lý file",
          link: "/admin/file-manager",
        });
        menuItems.push({
          key: "data",
          icon: <FaDatabase size={18} />,
          label: "Sao lưu - Khôi phục",
          link: "/admin/data",
        });
        menuItems.push({
          key: "key-payment",
          icon: <FaKey size={18} />,
          label: "Key thanh toán",
          link: "/admin/key-payment",
        });
        menuItems.push({
          key: "setting",
          icon: <FaGear size={18} />,
          label: "Cài đặt",
          link: "/admin/setting",
        });
        break;
      }

      case TYPE_EMPLOYEE.adminControl: {
        menuItems.push({
          key: "dashboard",
          icon: <FaTachometerAlt size={18} />,
          label: "Bảng Điều Khiển",
          link: "/admin",
        });
        menuItems.push({
          key: "pages",
          icon: <FaEarthAmericas size={18} />,
          label: "Website",
          children: [
            {
              key: "website",
              icon: <FaInfoCircle size={18} />,
              label: "Thông tin",
              link: "/admin/info",
            },
            {
              key: "layout",
              icon: <AiFillLayout size={18} />,
              label: "Bố cục",
              link: "/admin/layout",
            },
            {
              key: "page",
              icon: <FaFileCirclePlus size={18} />,
              label: "Bài viết",
              link: "/admin/pages",
            },
          ],
        });
        menuItems.push({
          key: "plugins",
          icon: <BsPlugin size={18} />,
          label: "Plugins",
          link: "/admin/plugins",
        });
        menuItems.push({
          key: "user",
          icon: <FaUser size={18} />,
          label: "Người dùng",
          link: "/admin/users",
        });
        menuItems.push({
          key: "courses",
          icon: <FaChartPie size={18} />,
          label: "Khóa học",
          link: "/admin/courses",
        });
        menuItems.push({
          key: "contacts",
          icon: <MdContacts size={18} />,
          label: "Liên hệ",
          link: "/admin/contacts",
        });
        menuItems.push({
          key: "orders",
          icon: <FaShoppingCart size={18} />,
          label: "Đơn hàng",
          link: "/admin/orders",
        });
        menuItems.push({
          key: "notification",
          icon: <IoNotificationsSharp size={18} />,
          label: "Thông báo",
          link: "/admin/notification",
        });
        menuItems.push({
          key: "email",
          icon: <IoMdMail size={18} />,
          label: "Email",
          link: "/admin/emails",
        });
        menuItems.push({
          key: "fileManager",
          icon: <FaFolderOpen size={18} />,
          label: "Quản lý file",
          link: "/admin/file-manager",
        });
        menuItems.push({
          key: "setting",
          icon: <FaGear size={18} />,
          label: "Cài đặt",
          link: "/admin/setting",
        });
        break;
      }

      case TYPE_EMPLOYEE.user: {
        menuItems.push({
          key: "/user",
          icon: <FaYoutube size={18} />,
          label: "Khóa học của tôi",
          link: "/user",
        });
        menuItems.push({
          key: "user",
          icon: <FaUser size={18} />,
          label: "Thông tin cá nhân",
          link: "/user/info",
        });
        menuItems.push({
          key: "dashboard",
          icon: <FaHistory size={18} />,
          label: "Lịch sử học tập",
          link: "/user/history",
        });
        menuItems.push({
          key: "orders",
          icon: <PiIdentificationCardFill size={18} />,
          label: "Lịch sử mua hàng",
          link: "/user/orders",
        });
        menuItems.push({
          key: "notify",
          icon: <IoNotificationsSharp size={18} />,
          label: "Thông báo",
          link: "/user/notification",
        });
        menuItems.push({
          key: "change-password",
          icon: <RiLockPasswordFill size={18} />,
          label: "Đổi mật khẩu",
          link: "/user/change-password",
        });
        break;
      }

      default: {
        break;
      }
    }

    menuItems.push({
      key: "logout",
      icon: <FaSignOutAlt size={18} color="red" />,
      label: "Đăng Xuất",
      link: "/logout",
    });
    return menuItems;
  }, [userType]);

  function getInitials(name) {
    return name
      ?.match(/(\b\S)?/g)
      ?.join("")
      ?.match(/(^\S|\S$)?/g)
      ?.join("")
      ?.toUpperCase();
  }

  const handleChange = (e) => {
    dispatch(setLanguage(e));
    toastSuccess(`Ngôn ngữ đã được chuyển sang ${e}`);
  };

  const selectedMenu = () => {
    const findMenuKey = (items) =>
      items.reduce(
        (acc, item) => {
          const { link, key, children } = item;
          if (link) {
            const singularLink = link.endsWith("s") ? link.slice(0, -1) : link;
            const pluralLink = link.endsWith("s") ? link : `${link}s`;
            const isActive =
              window.location.pathname.startsWith(link) ||
              window.location.pathname.startsWith(singularLink) ||
              window.location.pathname.startsWith(pluralLink);
            if (isActive && link.length > acc.length) {
              return { key, length: link.length };
            }
          }

          if (children) {
            const child = findMenuKey(children);
            if (child.length > acc.length) {
              return child;
            }
          }
          return acc;
        },
        { key: null, length: 0 }
      );

    const { key } = findMenuKey(menuSidebars);
    return key ? [key] : [];
  };

  const onClickMenu = (menuLink) => {
    const { link } = menuLink.item.props;

    if (link === "/admin/layout") {
      if (isMobile) {
        toastError(
          "",
          "Bạn không thể truy cập trang này!",
          "Vui lòng sử dụng máy tính để trãi nghiệm tốt nhất!"
        );
        return;
      }
    }

    const checkLink = (link) => {
      setTimeout(() => {
        if (link != undefined) {
          navigate(link);
        } else {
          toastError("", "Chức năng đang được phát triển");
        }
      }, 200);
    };

    if (isMobile) {
      setOpen(false);
      setTimeout(() => {
        checkLink(link);
      }, 200);
    }

    if (!isMobile) {
      checkLink(link);
    }
  };

  useEffect(() => {
    const see = localStorage.getItem("see") || false;
    if (location.pathname.startsWith("/user/course/")) {
      if (!see && !openTours && isTablet) {
        setOpenTour(true);
        localStorage.setItem("see", true);
      }
    }
  }, [location.pathname, openTours, isTablet]);

  useEffect(() => {
    const handleNotificationClick = (id, data) => {
      dispatch(removeNotify(id));
      setOpenNotify(true);
      setNotify(data);
      dispatch(putUsersNotifyApi({ id: user._id, notifyId: data._id }));
    };

    const filteredData = notification?.newData
      ?.filter((data) => data?.show && !user.notify?.includes(data?._id))
      .map((data) => ({
        key: data?._id,
        label: (
          <Row
            onClick={() => handleNotificationClick(data._id, data)}
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
              <Badge color={colorPrimary} />
            </Col>
          </Row>
        ),
      }));

    setDataNotify(filteredData);
  }, [notification, colorPrimary, user, dispatch]);

  //Fetch
  useEffect(() => {
    if (!loadingUser) {
      if (loadingCart) {
        dispatch(getCartDetailApi({ ids: cart, idRemove: user?.courses }));
      }
    }
  }, [cart, user]);

  useEffect(() => {
    if (loading) {
      dispatch(getInfoApi());
    }
  }, []);

  useEffect(() => {
    if (loadingNotify && user?.userType === "admin") {
      dispatch(getNotifyApi({ type: "" }));
      return;
    }

    if (loadingNotify && user?.userType === "user") {
      dispatch(getNotifyApi({ type: "private" }));
    }
  }, [user, loadingNotify]);

  return (
    <HelmetProvider>
      <Helmet prioritizeSeoTags>
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
      </Helmet>

      <Layout>
        {isMobile ? (
          <Drawer
            width={240}
            height={"100%"}
            className="menu-admin"
            title={
              <Typography.Link className="text-lg flex justify-center uppercase">
                {info?.newData?.[0]?.name}
              </Typography.Link>
            }
            closeIcon={null}
            placement="left"
            onClose={() => setOpen(false)}
            open={open}
          >
            <Menu
              className="overflow-y-auto"
              mode="inline"
              style={{ height: "calc(100dvh - 112px)" }}
              selectedKeys={selectedMenu()}
              onClick={onClickMenu}
              items={menuSidebars}
            />

            <Button
              type="link"
              className="h-[112px]"
              icon={
                !open ? (
                  <TbPlayerTrackNextFilled size={22} />
                ) : (
                  <TbPlayerTrackPrevFilled size={22} />
                )
              }
              onClick={() => setOpen(false)}
              style={{ width: "100%", height: "56px" }}
            ></Button>
          </Drawer>
        ) : (
          <Sider
            className={`border-r !overflow-hidden ${isMobile ? "d-none" : ""} `}
            width={230}
            style={{ zIndex: 10 }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <Button
              type="link"
              onClick={() => navigate("/")}
              icon={
                collapsed ? (
                  <img
                    src="/icon.png"
                    className="size-14"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <StrokeLogo text={"Chicken War"} fontSize={38} />
                )
              }
              style={{ width: "100%", height: "55px" }}
            ></Button>

            <Menu
              className="overflow-y-auto"
              mode="inline"
              style={{ height: "calc(100vh - 112px)" }}
              selectedKeys={selectedMenu()}
              onClick={onClickMenu}
              items={menuSidebars}
            />

            <Button
              type="text"
              icon={
                collapsed ? (
                  <TbPlayerTrackNextFilled color="white" size={22} />
                ) : (
                  <TbPlayerTrackPrevFilled color="white" size={22} />
                )
              }
              onClick={() => dispatch(toggleCompact())}
              style={{ width: "100%", height: "56px" }}
            ></Button>
          </Sider>
        )}

        <Layout className="h-screen overflow-x-hidden">
          {header ? (
            <>
              <Header
                className="header-admin border-b flex justify-between !px-7"
                style={{
                  height: "56px",
                  background: colorBgContainer,
                  position: "sticky",
                  top: 0,
                  zIndex: 100,
                }}
              >
                {isMobile && (
                  <div
                    className="flex items-center"
                    onClick={() => setOpen(true)}
                  >
                    <FaBars size={22} />
                  </div>
                )}

                <div className="flex items-center">
                  <Typography.Title level={4} className="!mb-0">
                    {header}
                  </Typography.Title>
                </div>

                {!isMobile && (
                  <div className="flex justify-center items-center ml-auto gap-2 flex-wrap">
                    {button}
                  </div>
                )}

                <div
                  className={`flex items-center ${
                    !isMobile ? "ms-2 gap-2" : "gap-1"
                  }`}
                >
                  {!isMobile && (
                    <Popover
                      placement="bottomRight"
                      title="Ngôn ngữ"
                      content={
                        <>
                          <Select
                            value={currentLanguage}
                            onChange={handleChange}
                            style={{ width: "180px" }}
                            placeholder="Thay đổi ngôn ngữ"
                            options={languages}
                            showSearch
                          />
                        </>
                      }
                    >
                      <div ref={popRef}>
                        <FaLanguage className="cursor-pointer" size={35} />
                      </div>
                    </Popover>
                  )}

                  {!isMobile && tours && isTablet && (
                    <>
                      <Tooltip placement="bottom" title="Trợ giúp">
                        <div ref={popRef} onClick={() => setOpenTour(true)}>
                          <FaCircleQuestion
                            className="cursor-pointer"
                            size={25}
                          />
                        </div>
                      </Tooltip>

                      <Tour
                        gap={{ offset: 5, radius: 10 }}
                        mask={{
                          style: {
                            boxShadow: "inset 0 0 15px #333",
                          },
                          color: darkMode
                            ? "rgba(153, 153, 153, 0.5)"
                            : "rgba(59, 59, 59, 0.5)",
                        }}
                        open={openTour}
                        onClose={() => setOpenTour(false)}
                        steps={tours}
                        disabledInteraction={true}
                      />
                    </>
                  )}

                  {userType === "user" && !isMobile && (
                    <Badge count={cartDetail?.length}>
                      <FaCartShopping
                        className="cursor-pointer"
                        onClick={() => navigate("/cart")}
                        size={27}
                      />
                    </Badge>
                  )}

                  {userType === "user" && (
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: dataNotify,
                      }}
                      placement={isMobile ? "bottomCenter" : "bottomRight"}
                    >
                      <Badge
                        className={dataNotify?.length > 0 ? "me-1" : ""}
                        count={dataNotify?.length}
                      >
                        <IoMdNotifications
                          size={32}
                          className="cursor-pointer"
                        />
                      </Badge>
                    </Dropdown>
                  )}

                  {userType === "admin" ? (
                    <>
                      {avatar ? (
                        <Avatar className="cursor-pointer" src={avatar} />
                      ) : (
                        <>
                          <Avatar
                            className="cursor-pointer"
                            style={{
                              backgroundColor: colorPrimary,
                            }}
                            icon={getInitials(user?.name)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "user",
                              label: (
                                <div
                                  className="flex items-center gap-1"
                                  onClick={() => navigate("/user")}
                                >
                                  <FaTachometerAlt size={18} />
                                  <Typography.Text>Trang chủ</Typography.Text>
                                </div>
                              ),
                            },
                            {
                              key: "info",
                              label: (
                                <div
                                  className="flex items-center gap-1"
                                  onClick={() => navigate("/user/info")}
                                >
                                  <FaUser size={18} />
                                  <Typography.Text>
                                    Thông tin cá nhân
                                  </Typography.Text>
                                </div>
                              ),
                            },
                            {
                              key: "courses",
                              label: (
                                <div
                                  className="flex items-center gap-1"
                                  onClick={() => navigate("/user")}
                                >
                                  <FaYoutube size={18} />
                                  <Typography.Text>
                                    Khóa học của tôi
                                  </Typography.Text>
                                </div>
                              ),
                            },
                            {
                              key: "orders",
                              label: (
                                <div
                                  className="flex items-center gap-1"
                                  onClick={() => navigate("/user/orders")}
                                >
                                  <PiIdentificationCardFill size={18} />
                                  <Typography.Text>
                                    Lịch sử mua hàng
                                  </Typography.Text>
                                </div>
                              ),
                            },
                            {
                              key: "change-password",
                              label: (
                                <div
                                  className="flex items-center gap-1"
                                  onClick={() =>
                                    navigate("/user/change-password")
                                  }
                                >
                                  <RiLockPasswordFill size={18} />
                                  <Typography.Text>
                                    Đổi mật khẩu
                                  </Typography.Text>
                                </div>
                              ),
                            },
                          ],
                        }}
                        placement="bottomRight"
                        arrow={{
                          pointAtCenter: true,
                        }}
                      >
                        {avatar ? (
                          <Avatar className="cursor-pointer" src={avatar} />
                        ) : (
                          <Avatar
                            className="cursor-pointer"
                            style={{
                              backgroundColor: colorPrimary,
                            }}
                            icon={getInitials(user?.name)}
                          />
                        )}
                      </Dropdown>
                    </>
                  )}
                </div>
              </Header>

              <Content
                style={{
                  margin: `${margin}px`,
                }}
              >
                {isMobile && button && (
                  <div
                    className="flex justify-center items-center gap-2 mb-4"
                    style={{ marginLeft: "auto", flexWrap: "wrap" }}
                  >
                    {button}
                  </div>
                )}
                {children}
              </Content>
            </>
          ) : (
            <Content>{children}</Content>
          )}
        </Layout>
      </Layout>

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
export default LayoutAdmin;
