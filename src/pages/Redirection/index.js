// src/components/Login.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/loader";
import { loginWithToken } from "../../redux/redirectCrms";

const RedirectCRMS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.ngAuth
  );
  const [errMsg, setErrMsg] = useState("");
  // Sync initial error state to errMsg
  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    }
  }, [error]);
  const Token = localStorage.getItem("token")
  const domain = localStorage.getItem("domain")
  const decodedDomain = domain ?  atob(domain) : null;
  const parseDomain = JSON.parse(decodedDomain)?.[0]?.SubDomain
  // console.log("Token from local storage ; ", Token)
  useEffect(() => {
    const performLogin = async () => {
      localStorage.setItem("menuOpened", "Dashboard");
      const result = await dispatch(
        loginWithToken({
          token:
            Token  || "eyJhbGciOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIn0.eyJ1c2VyaWQiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImRibmFtZSI6IkRDQ0J1c2luZXNzU3VpdGVfbW93YXJhIiwibmJmIjoxNzUxMjYwNzQ2LCJleHAiOjE3NTE0NDA3NDYsImlhdCI6MTc1MTI2MDc0Nn0.Dwqh21ymzMDRbz5XTT9D1h2khnxeaPB8mSlqCvoNPlJFeTpNeVh3hfsvAEteKJd8SoXNQ1OmeDqd_Cc4c6DWgg",
                Domain:parseDomain|| "mowara",
        })
      );
      if (loginWithToken.fulfilled.match(result)) {
        // navigate("/crms/dashboard");
        // console.log("Login : ", loginWithToken.fulfilled.match(result));
      } else {
        console.error("Login failed:", result.payload || result.error);
      window.location.href = "https://mowara.dcclogsuite.com/";
      }
    };

    performLogin();
  }, [dispatch]);
  const Permissions = localStorage.getItem("crmspermissions")

  useEffect(() => {
    if (Permissions) {
      window.location.href = "/crms/dashboard";
    }
  }, [Permissions, navigate]);

  return (
    <div className="account-content">
      <Helmet>
        <title>Redirecting - DCC CRMS</title>
        <meta name="description" content="Login to access your dashboard." />
      </Helmet>
      <div className="d-flex align-items-center   vw-100 vh-100 overflow-hidden account-bg-0 bg-white">
        <Loader />
      </div>
    </div>
  );
};

export default RedirectCRMS;
