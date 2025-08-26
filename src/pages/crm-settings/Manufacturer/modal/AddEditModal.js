import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addManufacturer,
  updateManufacturer,
} from "../../../../redux/manufacturer";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.manufacturers);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Reset form with appropriate data based on mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        is_active: initialData.is_active ?? "Y",
      });
    } else {
      reset({
        name: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  // Clear form handler
  const clearForm = () => {
    reset({
      name: "",
      is_active: "Y",
    });
  };

  // Handle form submit
  const onSubmit = (data) => {
     const closeButton = document.getElementById(
      "close_btn_add_edit_lost_reason_modal"
    );
    if (mode === "add") {
      dispatch(addManufacturer(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateManufacturer({
          id: initialData.id,
          manufacturerData: data,
        })
      );
    }

    clearForm();

    if (closeButton) closeButton.click();
  };

  // Attach modal close listener to clear form
  useEffect(() => {
    const modalEl = document.getElementById("add_edit_manufacturer_modal");
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", clearForm);
      return () =>
        modalEl.removeEventListener("hidden.bs.modal", clearForm);
    }
  }, []);

  return (
    <div className="modal fade" id="add_edit_manufacturer_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Manufacturer" : "Edit Manufacturer"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
           id="close_btn_add_edit_lost_reason_modal"

            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Manufacturer Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Manufacturer Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter  Manufacturer Name "
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Manufacturer Name is required !",
                    minLength: {
                      value: 3,
                      message:
                        "Manufacturer Name must be at least 3 characters !",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
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
