import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../../../redux/projects";
import { DatePicker } from "antd";
import Select from "react-select";
import dayjs from "dayjs";
import moment from "moment";

import { arrProjectTiming } from "../../../components/common/selectoption/selectoption";

const AddProjectModal = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      projectTiming: "",
      amount: "",
      startDate: dayjs(),
      dueDate: dayjs(),
      description: "",
      is_active: "Y",
    },
  });

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_offcanvas_add_project");

    const payload = {
      ...data,
      projectTiming: data.projectTiming?.value || null,
      amount: parseFloat(data.amount) || null,
      startDate: data.startDate
        ? dayjs(data.startDate).startOf("day").toISOString()
        : null,
      dueDate: data.dueDate
        ? dayjs(data.dueDate).startOf("day").toISOString()
        : null,
    };

    try {
      await dispatch(addProject(payload)).unwrap();
      closeButton.click();
      reset();
    } catch (err) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_project");
    if (offcanvasElement) {
      const handleModalClose = () => {
        reset();
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, [reset]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_project"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add Project</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_offcanvas_add_project"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label>
                Project Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Project Name "
                className="form-control"
                {...register("name", { required: "Project name is required!" })}
              />
              {errors.name && (
                <small className="text-danger">{errors.name.message}</small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Project Timing <span className="text-danger">*</span>
              </label>
              <Controller
                name="projectTiming"
                control={control}
                rules={{ required: "Project Timing is required!" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={arrProjectTiming}
                    placeholder="Select..."
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.projectTiming && (
                <small className="text-danger">
                  {errors.projectTiming.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Budget <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Budget"
                step="0.01"
                className="form-control"
                {...register("amount", { required: "Budget is required!" })}
              />
              {errors.amount && (
                <small className="text-danger">{errors.amount.message}</small>
              )}
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required!" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="form-control"
                      value={
                        field.value
                          ? dayjs(field.value, [
                              "DD-MM-YYYY",
                              "YYYY-MM-DD",
                              dayjs.ISO_8601,
                            ])
                          : null
                      }
                      format="DD-MM-YYYY"
                      onChange={(date) =>
                        field.onChange(date ? date.toDate() : null)
                      } // ✅ Date object
                    />
                  )}
                />

                {errors.startDate && (
                  <small className="text-danger">
                    {errors.startDate.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Due Date <span className="text-danger">*</span>
                </label>
                <Controller
                  name="dueDate"
                  control={control}
                  rules={{ required: "Due date is required!" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="form-control"
                      value={
                        field.value
                          ? dayjs(field.value, [
                              "DD-MM-YYYY",
                              "YYYY-MM-DD",
                              dayjs.ISO_8601,
                            ])
                          : null
                      }
                      format="DD-MM-YYYY"
                      onChange={(date) =>
                        field.onChange(date ? date.toDate() : null)
                      } // ✅ Date object
                    />
                  )}
                />

                {errors.dueDate && (
                  <small className="text-danger">
                    {errors.dueDate.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Description <span className="text-danger">(max 255 characters)</span>
              </label>
              <textarea
                className="form-control"
                placeholder="Enter Description"
                rows={5}
                {...register("description", {
                  validate: (value) => {
                    const wordCount = value.trim().split(/\s+/).length;
                    return (
                      wordCount <= 200 ||
                      "Description must not exceed 200 words."
                    );
                  },
                })}
              />
              {errors.description && (
                <small className="text-danger">
                  {errors.description.message}
                </small>
              )}
            </div>

            <div className="col-md-12 mb-3">
              <label>Status</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Y"
                    {...register("is_active")}
                    defaultChecked
                  />{" "}
                  Active
                </label>
                <label className="ms-3">
                  <input type="radio" value="N" {...register("is_active")} />{" "}
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className="text-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
