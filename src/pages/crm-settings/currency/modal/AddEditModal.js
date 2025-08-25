import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCurrency,
  fetchCurrencies,
  updateCurrency,
} from "../../../../redux/currency"; // Adjust as per your redux actions
import { Link } from "react-router-dom";

const AddEditModal = ({ mode = "add",setInitialData, initialData = null,onClose }) => {
  const { loading } = useSelector((state) => state.currency || {});
  const {
    register,
    setValue,
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
        code: initialData.code || "",
        is_active: initialData.is_active || "Y",
        is_default: initialData.is_default || "N",
      });
    } else {
      reset({
        name: "",
        code: "",
        is_active: "Y",
        is_default: "N",
      });
    }
  }, [mode, initialData, reset]);

  const clearForm = () => {
       reset({
         name: "",
        code: "",
        is_active: "Y",
        is_default: "N",
       });
       if (onClose) onClose(); // parent ko inform kar do
     };
  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_btn_currency_modal");

    if (mode === "add") {
      dispatch(
        addCurrency({
          name: data.name,
          code: data.code,
          is_active: data.is_active,
          is_default: data.is_default,
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateCurrency({
          id: initialData.id,
          currencyData: {
            name: data.name,
            code: data.code,
            is_active: data.is_active,
            is_default: data?.is_default || "N",
          },
        })
      );
    }
    dispatch(fetchCurrencies());
    setInitialData()
   reset(); // Clear the form
       if (closeButton) closeButton.click();
     };
      // Clear form when modal closes
          useEffect(() => {
            const modalEl = document.getElementById("add_edit_currency_modal");
            const handleModalClose = () => {
              clearForm();
              setInitialData()
            };
            if (modalEl) {
              modalEl.addEventListener("hidden.bs.modal", handleModalClose);
              return () => modalEl.removeEventListener("hidden.bs.modal", handleModalClose);
            }
          }, [])

  return (
    <div className="modal fade" id="add_edit_currency_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Currency" : "Edit Currency"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_currency_modal"
              onClick={() => {
                reset();
              }}
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Currency Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Currency Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Currency Name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Currency name is required !",
                    minLength: {
                      value: 3,
                      message: "Currency name must be at least 3 characters !",
                    },
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (trimmed.length === 0)
                        return "Currency name cannot be empty or spaces only !";
                      if (trimmed.length < 3)
                        return "Must be at least 3 characters !";
                      return true;
                    },
                  })}
                  onBlur={(e) => setValue("name", e.target.value.trim())}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* Currency Code */}
              <div className="mb-3">
                <label className="col-form-label">
                  Currency Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Currency Code "
                  className={`form-control ${errors.code ? "is-invalid" : ""}`}
                  {...register("code", {
                    required: "Currency code is required !",
                    minLength: {
                      value: 2,
                      message: "Currency code must be at least 2 characters !",
                    },
                    maxLength: {
                      value: 5,
                      message: "Currency code cannot exceed 5 characters !",
                    },
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (trimmed.length === 0)
                        return "Currency code cannot be empty or spaces only !";
                      if (trimmed.length < 2)
                        return "Must be at least 2 characters !";
                      return true;
                    },
                  })}
                  onBlur={(e) => setValue("code", e.target.value.trim())}
                />
                {errors.code && (
                  <small className="text-danger">{errors.code.message}</small>
                )}
              </div>

              {/* Status */}
              <div className="d-flex align-items-center mb-0">
                {/* Status */}
                <div className="me-4">
                  <label className="col-form-label">Status</label>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
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
                </div>

                {/* Default */}
                <div>
                  <label className="col-form-label">Default</label>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <input
                        type="radio"
                        className="status-radio"
                        id="yes_default"
                        value="Y"
                        {...register("is_default")}
                      />
                      <label htmlFor="yes_default">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        className="status-radio"
                        id="no_default"
                        value="N"
                        defaultChecked
                        {...register("is_default")}
                      />
                      <label htmlFor="no_default">No</label>
                    </div>
                  </div>
                </div>
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
