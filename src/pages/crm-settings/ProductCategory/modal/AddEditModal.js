import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addProductCategory,
  updateProductCategory,
} from "../../../../redux/productCategory";

const AddEditModal = ({ mode = "add", initialData = null, onClose }) => {
  const { loading } = useSelector((state) => state.productCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        name: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  // Clear form helper
  const clearForm = () => {
    reset({
      name: "",
      is_active: "Y",
    });
    if (onClose) onClose();
  };

  // Submit handler
  const onSubmit = (data) => {
    if (mode === "add") {
      dispatch(addProductCategory(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateProductCategory({
          id: initialData.id,
          categoryData: data,
        })
      );
    }

    clearForm();

    // Close modal
    const closeButton = document.getElementById(
      "close_btn_add_edit_product_category_modal"
    );
    if (closeButton) closeButton.click();
  };

  // Auto clear when modal closes
  useEffect(() => {
    const modalEl = document.getElementById("add_edit_product_category_modal");
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", clearForm);
      return () => modalEl.removeEventListener("hidden.bs.modal", clearForm);
    }
  }, []);

  return (
    <div
      className="modal fade"
      id="add_edit_product_category_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add Product Category"
                : "Edit Product Category"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_product_category_modal"
              onClick={clearForm}
            >
              <i className="ti ti-x" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Category Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className={`form-control ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  {...register("name", {
                    required: "Category name is required!",
                    minLength: {
                      value: 3,
                      message:
                        "Category name must be at least 3 characters!",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors.name.message}
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
