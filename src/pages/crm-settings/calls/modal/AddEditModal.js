import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCallStatus, updateCallStatus } from "../../../../redux/callStatus"; // Adjust as per your redux actions
import { Link } from "react-router-dom";

const AddEditModal = ({ mode = "add", initialData = null,onClose }) => {
  const { loading } = useSelector((state) => state.callStatuses);

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
  
     const clearForm = () => {
      reset({
        name: "",
        description: "",
        is_active: "Y",
      });
      if (onClose) onClose(); // parent ko inform kar do
    };
  
    
  const onSubmit = (data) => {
      if (mode === "add") {
        dispatch(
          addCallStatus({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
        })
        );
      } else if (mode === "edit" && initialData) {
        dispatch(
           updateCallStatus({
          id: initialData.id,
          callStatusData: {
            name: data.name,
            description: data.description,
            is_active: data.is_active,
          },
        })
        );
      }
  
      clearForm();
  
      // Close the modal
      const closeButton = document.getElementById(
        "close_btn_add_edit_call_status_modal"
      );
      if (closeButton) closeButton.click();
    };
  
    // Clear form when modal closes
    useEffect(() => {
      const modalEl = document.getElementById("add_edit_call_status_modal");
      if (modalEl) {
        modalEl.addEventListener("hidden.bs.modal", clearForm);
        return () => modalEl.removeEventListener("hidden.bs.modal", clearForm);
      }
    }, [])

  return (
    <div className="modal fade" id="add_edit_call_status_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Call Status" : "Edit Call Status"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_call_status_modal"
              onClick={() => {
                reset();
              }}
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Call Status Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Name is required !",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters !",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* Call Status Description */}
              <div className="mb-3">
                <label className="col-form-label">
                  Description (max 255 characters)
                </label>
                <textarea
                  type="text"
                  placeholder="Enter Description"
                  rows="4"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  {...register("description", {
                    maxLength: {
                      value: 255,
                      message: "Description must be less than 255 characters !",
                    },
                  })}
                />
                {errors.description && (
                  <small className="text-danger">
                    {errors?.description?.message}
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
                        required: "Status is required !",
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
                {errors.status && (
                  <small className="text-danger">{errors.status.message}</small>
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
                  onClick={() => {
                    reset();
                  }}
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
