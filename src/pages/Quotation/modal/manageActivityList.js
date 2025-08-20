import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ManageActivityList = ({ id, code }) => {


  const dispatch = useDispatch();


  return (
    <>
      <div className="container mb-5">
      <div className="header-actions d-flex justify-content-end">
        <Link
          to="#"
          className="btn btn-purple btn-sm fw-medium px-3 mb-1 py-2 shadow-sm"
          data-bs-toggle="modal"
          data-bs-target="#activity_modal"
        >
          <i className="ti ti-plus me-2"></i>Activity
        </Link>
        </div>
      
      </div>
    </>
  );
};

export default ManageActivityList;
