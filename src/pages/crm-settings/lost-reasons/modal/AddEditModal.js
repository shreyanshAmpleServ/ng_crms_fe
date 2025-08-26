import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addLostReason, updateLostReason } from "../../../../redux/lostReasons"; // Adjust as per your redux actions
import { Link, useNavigate } from "react-router-dom";

const AddEditModal = ({
  mode = "add",
  initialData = null,
  setInitialData,
  sourcePage = null,
}) => {
  const { loading } = useSelector((state) => state.lostReasons);
  const [colorCode, setColorCode] = useState("#000");
  const navigate = useNavigate();
  const handleColorChange = (color) => {
    setColorCode(color);
  };
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
        is_active: initialData.is_active ?? "Y",
        colorCode: initialData.colorCode || "",
        order: initialData.order || "",
      });
    } else {
      reset({
        name: "",
        is_active: "Y",
        colorCode: "",
        order: "",
      });
    }
  }, [mode, initialData, reset]);

  const clearForm = () => {
    reset({
      name: "",
      is_active: "Y",
      colorCode: "",
      order: "",
    });
  };

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_lost_reason_modal"
    );

    if (mode === "add") {
      dispatch(
        addLostReason({
          name: data.name.trim(),
          order: data.order ? Number(data.order) : null,
          is_active: data.is_active,
          colorCode: data.colorCode || "", // ensure from form
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateLostReason({
          id: initialData.id,
          lostReasonData: {
            name: data.name.trim(),
            order: data.order ? Number(data.order) : null,
            is_active: data.is_active,
            colorCode: data.colorCode || "",
          },
        })
      );

      if (sourcePage === "leads-kanban") {
        window.location.reload();
      }
    }

    // clearForm();
    setInitialData(null)

    if (closeButton) closeButton.click();
  };

  // ✅ Modal close hone pe bhi form clear
  useEffect(() => {
    const modalEl = document.getElementById("add_edit_lost_reason_modal");
    const handleModalClose = () => {
      clearForm();
      setInitialData()
    };
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", handleModalClose);
      return () => modalEl.removeEventListener("hidden.bs.modal", handleModalClose);
    }
  }, []);

  console.log("Lead status : ", initialData)

  return (
    <div className="modal fade" id="add_edit_lost_reason_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Lead Status" : "Edit Lead Status"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_lost_reason_modal"
              onClick={() => {
                reset();
              }}
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Lead status */}
              <div className="mb-3">
                <label className="col-form-label">
                  Lead Status <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Lead Status "
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Lead Status is required !",
                    minLength: {
                      value: 3,
                      message: "Lost reason must be at least 3 characters !",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              {/* Lead status order*/}
              <div className="mb-3">
                <label className="col-form-label">
                  Order <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter Order "
                  className={`form-control ${errors.order ? "is-invalid" : ""}`}
                  {...register("order", {
                    required: "Order is required !",
                  })}
                />
                {errors.order && (
                  <small className="text-danger">{errors.order.message}</small>
                )}
              </div>
              {/* color code */}
              <div className="mb-3">
                <label className="col-form-label">Color Code</label>
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={colorCode}
                  {...register("colorCode")}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
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
