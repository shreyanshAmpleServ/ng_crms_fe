import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import Loader from "./components/common/loader";
import PublicLayout from "./pages/layouts/PublicLayout";
import PrivateLayout from "./pages/layouts/PrivateLayout";
import { loadUser } from "./redux/auth/authSlice";
import {
  Login,
  Dashboard,
  privateRoutes,
  publicRoutes,
} from "./routes/router.link";
import NoPermissionPage from "./components/common/noPermission";
import RedirectCRMS from "./pages/Redirection";
import PreviewQuotation from "./pages/Quotation/modal/QuotationPdf";

const App = () => {
  const dispatch = useDispatch();
  const user1 = localStorage.getItem("user")
  const decodedUser = user1 ? atob(user1) : null;
  const isAdmin = decodedUser?.includes("admin");
  const isPermission = localStorage.getItem("crmspermissions")
  const Permissions = localStorage.getItem("crmspermissions")
    ? JSON?.parse(localStorage.getItem("crmspermissions"))
    : [];
  // const Permissions = [];
  // const isRedirectional = localStorage.getItem("redirectLogin");
// console.log("is Auth  : ",localStorage.getItem("isAuthenticated") === "true")
  // const pathName = window.location.pathname;
  // const { isAuthenticated } = useSelector((state) => state.ngAuth);
  // console.log("isRedirectional : ", isRedirectional);
  // const { isAuthenticated } = useSelector((state) =>
  //   domain == "mowara" ? state.ngAuth : state.auth
  // );
  // useEffect(() => {
  //   if (pathName !== "/login" && pathName !== "/") {
  //     console.log("kjkkjkj");
  //     dispatch(loadUser());
  //   }
  // }, [dispatch, isAuthenticated]);
  const filteredRoutes = isAdmin
    ? privateRoutes
    : privateRoutes?.filter((route) => {
        return Permissions.some(
          (permission) =>
            route?.title?.includes(permission.module_name) &&
            Object.values(permission.permissions).some((perm) => perm === true)
        );
      });
console.log("Route :",filteredRoutes)
  return (
    <HelmetProvider>
      <Router>
        {/* {loading && <Loader />} */}
        <Routes>
        <Route path="/crms/quotation-pdf/:id" element={<PreviewQuotation />} />
          {/* Public Layout and Routes */}
           {!isPermission &&  <Route path="/" element={<PublicLayout />}>
              <Route index element={<RedirectCRMS />} />
              <Route path="/login" element={<RedirectCRMS />} />
              <Route path="/crms" element={<RedirectCRMS />} />
              <Route
                path="*"
                element={<RedirectCRMS />} 
                // element={
                //   !isRedirectional &&
                //   (window.location.href = "https://mowara.dcclogsuite.com")
                // }
              />
              {/* <Route index element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} /> */}
            </Route>}
          {/* Private Layout and Routes */}
          {isPermission && filteredRoutes?.length > 0 && (
            <Route path="/" element={<PrivateLayout  />}>
              <Route
                index
                element={  <Navigate to={filteredRoutes[0]?.path || "/crms/dashboard"} replace />   }
              />
              {/* <Route index element={<Dashboard />} /> */}
              {filteredRoutes?.map((route, idx) => {
                return (
                  <Route path={route.path} routeItem={route} element={route.element} key={idx} />
                );
              })}
              <Route
                path="*"
                element={<Navigate to={filteredRoutes[0]?.path || "/crms/dashboard"} replace />}
              />

              {/* <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          /> */}
            </Route>
          ) 
          // : (  filteredRoutes?.length === 0 && (
          //     <Route path="/crms" element={<PublicLayout />}>
          //       <Route index element={<NoPermissionPage />} />
          //       <Route path="/crms/no-permission" element={<NoPermissionPage />} />
          //       <Route
          //         path="*"
          //         element={<Navigate to="/crms/no-permission" replace />}
          //       />
          //     </Route>
          //   )
          // )
          }

          {/* Redirect for unmatched routes */}
        </Routes>
      </Router>
      <Toaster />
    </HelmetProvider>
  );
};

export default App;
