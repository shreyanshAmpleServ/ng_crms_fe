import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addMeetingType,
  updateMeetingType,
} from "../../../../redux/meetingType";

const AddEditModal = ({ mode = "add",setInitialData, initialData = null, onClose }) => {
  const { loading } = useSelector((state) => state.meetingTypes); // ✅ Adjust to your slice

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        name: "",
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  // Clear form
  const clearForm = () => {
    reset({
      name: "",
      description: "",
      is_active: "Y",
    });
    if (onClose) onClose();
  };

  // Handle submit
  const onSubmit = (data) => {
    if (mode === "add") {
      dispatch(addMeetingType(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateMeetingType({
          id: initialData.id,
          meetingTypeData: data,
        })
      );
    }
    setInitialData()

    clearForm();

    // Close modal
    const closeButton = document.getElementById(
      "close_btn_add_edit_meeting_type_modal"
    );
    if (closeButton) closeButton.click();
  };

  // Auto clear form when modal closes
  useEffect(() => {
    const modalEl = document.getElementById("add_edit_meeting_type_modal");
    const handleModalClose = () => {
      clearForm();
      setInitialData()
    };
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", handleModalClose);
      return () =>
        modalEl.removeEventListener("hidden.bs.modal", handleModalClose);
    }
  }, []);

  return (
    <div
      className="modal fade"
      id="add_edit_meeting_type_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add Meeting Type"
                : "Edit Meeting Type"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_meeting_type_modal"
              onClick={clearForm}
            >
              <i className="ti ti-x" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Meeting Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Meeting Type"
                  className={`form-control ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  {...register("name", {
                    required: "Meeting Type is required!",
                    minLength: {
                      value: 3,
                      message:
                        "Meeting Type must be at least 3 characters!",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors.name.message}
                  </small>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
              <label className="col-form-label">Description  <span className="text-danger">(max 255 characters)</span></label>
                <textarea
                  placeholder="Enter Description"
                  rows="4"
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  {...register("description", {
                    maxLength: {
                      value: 255,
                      message:
                        "Description must be less than 255 characters!",
                    },
                  })}
                />
                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}
              </div>

              {/* Status */}
              <div className="mb-0">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active", {
                        required: "Status is required!",
                      })}
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="status-radio"
                      id="inactive"
                      value="N"
                      {...register("is_active")}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
                {errors.is_active && (
                  <small className="text-danger">
                    {errors.is_active.message}
                  </small>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={clearForm}
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
