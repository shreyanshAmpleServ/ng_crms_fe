import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCompany } from "../../../redux/companies/";

const AddCompanyModal = () => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.companies);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      registrationNumber: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      industryType: "",
      annualRevenue: null,
      employeeCount: "",
      businessType: "",
      primaryContactName: "",
      primaryContactRole: "",
      primaryContactEmail: "",
      primaryContactPhone: "",
      secondaryContactName: "",
      secondaryContactRole: "",
      secondaryContactEmail: "",
      secondaryContactPhone: "",
      entityType: null,
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert complex data to strings if needed
        formData.append(
          key,
          typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]
        );
      }
    });

    if (selectedLogo) {
      formData.append("logo", selectedLogo);
    }

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      await dispatch(addCompany(formData)).unwrap();
      closeButton.click();
      setSelectedLogo(null);
      reset();
    } catch (error) {
      closeButton.click();
      reset();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_company");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelectedLogo(null);
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
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_company"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add New Company</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("entityType", { value: "company" })}
          />
          <div className="accordion" id="company_accordion">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#company_basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-building fs-20" />
                  </span>
                  Basic Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="company_basic"
                data-bs-parent="#company_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <div className="profile-upload">
                          <div className="profile-upload-img">
                            <span>
                              <i className="ti ti-photo" />
                            </span>
                            {selectedLogo && (
                              <img
                                src={URL.createObjectURL(selectedLogo)}
                                alt="Company Logo"
                                className="preview"
                              />
                            )}
                            <button
                              type="button"
                              className="profile-remove"
                              onClick={() => setSelectedLogo(null)}
                            >
                              <i className="ti ti-x" />
                            </button>
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload Logo
                              <input
                                type="file"
                                className="input-img"
                                accept="image/*"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p>JPG, GIF or PNG. Max size of 800K</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name", {
                            required: "Company name is required !",
                          })}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("registrationNumber")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          {...register("email", {
                            required: "Email is required !",
                          })}
                        />
                        {errors.email && (
                          <small className="text-danger">
                            {errors.email.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("phone", {
                            required: "Phone number is required !",
                            minLength: {
                              value: 9,
                              message: "Phone must be at least 9 digits",
                            },
                            maxLength: {
                              value: 12,
                              message: "Phone must be at most 12 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Phone must contain only numbers",
                            },
                          })}
                        />
                        {errors.phone && (
                          <small className="text-danger">
                            {errors.phone.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("website")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Industry Type <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("industryType", {
                            required: "Industry type is required !",
                          })}
                        />
                        {errors.industryType && (
                          <small className="text-danger">
                            {errors.industryType.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Annual Revenue</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("annualRevenue")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Employee Count</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("employeeCount")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Business Type <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("businessType", {
                            required: "Business type is required !",
                          })}
                        />
                        {errors.businessType && (
                          <small className="text-danger">
                            {errors.businessType.message}
                          </small>
                        )}
                      </div>
                    </div>
                    {/* Contact Fields */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Primary Contact Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("primaryContactName", {
                            required: "Primary contact name is required !",
                          })}
                        />
                        {errors.primaryContactName && (
                          <small className="text-danger">
                            {errors.primaryContactName.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Primary Contact Role
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("primaryContactRole", {
                            required: "Primary contact role is required !",
                          })}
                        />
                        {errors.primaryContactRole && (
                          <small className="text-danger">
                            {errors.primaryContactRole.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Primary Contact Email{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          {...register("primaryContactEmail", {
                            required: "Primary contact email is required !",
                          })}
                        />
                        {errors.primaryContactEmail && (
                          <small className="text-danger">
                            {errors.primaryContactEmail.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Primary Contact Phone
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("primaryContactPhone", {
                            required: "Primary contact phone is required !",
                            minLength: {
                              value: 9,
                              message: "Phone must be at least 9 digits",
                            },
                            maxLength: {
                              value: 12,
                              message: "Phone must be at most 12 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Phone must contain only numbers",
                            },
                          })}
                        />
                        {errors.primaryContactPhone && (
                          <small className="text-danger">
                            {errors.primaryContactPhone.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Address</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          {...register("address")}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
              {loading && (
                <div
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                  className="spinner-border ml-2 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
