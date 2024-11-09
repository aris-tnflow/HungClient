import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { reLoginAuth } from "~/redux/slices/authSlice";

const PrivateRoute = ({ requiredPermission = [] }) => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth?.user?.userType);
  const loading = useSelector((state) => state.auth?.loading);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (loading) {
      dispatch(reLoginAuth({ token }));
    }
  }, []);

  const hasPermission =
    requiredPermission.length === 0 || requiredPermission.includes(userType);

  return hasPermission || loading ? (
    <Outlet />
  ) : (
    <Navigate to="/403" replace state={{ from: window.location.pathname }} />
  );
};

export default PrivateRoute;
