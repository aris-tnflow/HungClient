import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { reLoginAuth } from "~/redux/slices/authSlice";

import { toastError } from "~/components/toast";

const PrivateRoute = ({ requiredPermission = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth?.user?.userType);
  const loading = useSelector((state) => state.auth?.loading);
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userId && token) {
      dispatch(reLoginAuth({ token }));
    } else if (!token) {
      if (requiredPermission.length != 0) {
        toastError("", "Không Thể Truy Cập Trang!", "Vui lòng đăng nhập!");
      }
      navigate("/login");
    }
  }, [dispatch, navigate, userId, requiredPermission]);

  const hasPermission =
    requiredPermission.length === 0 || requiredPermission.includes(userType);

  return hasPermission || loading ? (
    <Outlet />
  ) : (
    <Navigate to="/403" replace state={{ from: window.location.pathname }} />
  );
};

export default PrivateRoute;
