import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutAuth } from "~/redux/slices/authSlice";

// import { SkeletonSuspense } from '~/components/antd/skeleton/SkeletonPublic';

const LogoutRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAuth());
    navigate("/login");
  }, []);
};

export default LogoutRoute;
