import React, { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createLead, updateLead } from "../../../redux/leads";

import { fetchCompanies } from "../../../redux/companies";
import { fetchIndustries } from "../../../redux/industry";
import { fetchLostReasons } from "../../../redux/lostReasons";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchSources } from "../../../redux/source";
import { fetchCountries } from "../../../redux/country";
import { fetchMappedStates } from "../../../redux/mappedState";
import { fetchCurrencies } from "../../../redux/currency";
import "./style.css";
import AddEditModal from "../../crm-settings/sources/modal/AddEditModal";
import AddEditModalIndustry from "../../crm-settings/industries/modal/AddEditModal";
import AddEditModalCurrency from "../../crm-settings/currency/modal/AddEditModal";
import AddEditModalStatus from "../../crm-settings/lost-reasons/modal/AddEditModal";
import { CiImageOn } from "react-icons/ci";

const AddLeadModal = ({ setSelectedLead, selectedLead }) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lead_owner: null,
      lead_owner_name: "",
      company_icon: null, // This will handle the image (Bytes)
      company_id: "",
      first_name: "",
      last_name: "",
      title: "",
      email: "",
      phone: "",
      fax: "",
      mobile: "",
      website: "",
      lead_source: null,
      lead_status: null,
      industry: null,
      no_of_employees: null,
      annual_revenue: null,
      revenue_currency: "",
      rating: "",
      tags: "",
      email_opt_out: "N", // Default to 'N' as per schema
      secondary_email: "",
      facebook_ac: "",
      skype_id: "",
      twitter_ac: "",
      linked_in_ac: "",
      whatsapp_ac: "",
      instagram_ac: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      description: "",
      is_active: "Y", // Default to 'Y' as per schema
      is_contact: false,
    },
  });

  React.useEffect(() => {
    if (selectedLead) {
      reset({
        lead_owner: selectedLead?.lead_owner || null,
        lead_owner_name: selectedLead?.lead_owner_name || "",
        company_icon: null,
        company_id: selectedLead?.company_id || "",
        first_name: selectedLead?.first_name || "",
        last_name: selectedLead?.last_name || "",
        title: selectedLead?.title || "",
        email: selectedLead?.email || "",
        phone: selectedLead?.phone || "",
        fax: selectedLead?.fax || "",
        mobile: selectedLead?.mobile || "",
        website: selectedLead?.website || "",
        lead_source: selectedLead?.crms_m_sources?.id || null,
        lead_status: selectedLead?.crms_m_lost_reasons?.id || null,
        industry: selectedLead?.crms_m_industries?.id || null,
        no_of_employees: selectedLead?.no_of_employees || null,
        annual_revenue: selectedLead?.annual_revenue || null,
        revenue_currency: selectedLead?.revenue_currency || "",
        rating: selectedLead?.rating || "",
        tags: selectedLead?.tags || "",
        jobTitle: selectedLead?.jobTitle || "",
        email_opt_out: selectedLead?.email_opt_out || "N",
        secondary_email: selectedLead?.secondary_email || "",
        facebook_ac: selectedLead?.facebook_ac || "",
        skype_id: selectedLead?.skype_id || "",
        twitter_ac: selectedLead?.twitter_ac || "",
        linked_in_ac: selectedLead?.linked_in_ac || "",
        whatsapp_ac: selectedLead?.whatsapp_ac || "",
        instagram_ac: selectedLead?.instagram_ac || "",
        street: selectedLead?.street || "",
        city: selectedLead?.city || "",
        state: selectedLead?.state || "",
        zipcode: selectedLead?.zipcode || "",
        country: selectedLead?.country || "",
        description: selectedLead?.description || "",
        is_active: selectedLead?.is_active || "Y",
        is_contact: selectedLead?.is_contact || false,
      });
    } else {
      reset({
        lead_owner: null,
        lead_owner_name: "",
        company_icon: null,
        company_id: "",
        first_name: "",
        last_name: "",
        title: "",
        email: "",
        jobTitle: "",
        phone: "",
        fax: "",
        mobile: "",
        website: "",
        lead_source: null,
        lead_status: null,
        industry: null,
        no_of_employees: null,
        annual_revenue: null,
        revenue_currency: "",
        rating: "",
        tags: "",
        jobTitle: "",
        email_opt_out: "N",
        secondary_email: "",
        facebook_ac: "",
        skype_id: "",
        twitter_ac: "",
        linked_in_ac: "",
        whatsapp_ac: "",
        instagram_ac: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        description: "",
        is_active: "Y",
        is_contact: false,
      });
    }
  }, [selectedLead]);

  const dispatch = useDispatch();

  const [selectedLogo, setSelectedLogo] = useState(null);
  const { lostReasons } = useSelector((state) => state.lostReasons);
  const { sources } = useSelector((state) => state.sources);
  const { industries } = useSelector((state) => state.industries);
  const { users } = useSelector((state) => state.users);
  const { companies } = useSelector((state) => state.companies);
  const { currencies } = useSelector((state) => state.currency);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
    }
  };
  React.useEffect(() => {
    dispatch(fetchLostReasons({ is_active: "Y" }));
    dispatch(fetchIndustries({ is_active: "Y" }));
    dispatch(fetchSources({ is_active: "Y" }));
    dispatch(fetchUsers());
    dispatch(fetchCompanies());
    dispatch(fetchCountries({ is_active: "Y" }));
    dispatch(fetchCurrencies({ is_active: "Y" }));
  }, [dispatch]);

  const country_id = watch("country");
  React.useEffect(() => {
    country_id &&
      dispatch(fetchMappedStates({ country_code: country_id, is_active: "Y" }));
  }, [dispatch, country_id]);

  const { countries } = useSelector((state) => state.countries);
  const { mappedStates, loading: loadingState } = useSelector(
    (state) => state.mappedStates
  );

  const currencyLists =
    currencies?.data
      ?.map((i) =>
        i?.is_active === "Y"
          ? { label: `${i?.code} - ${i?.name}`, value: i?.code }
          : null
      )
      .filter(Boolean) || [];

  const countryList = countries?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.code + emnt.name,
  }));
  const stateList = mappedStates?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const lostReasonsList = lostReasons?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const sourceList = sources?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const industriesList = industries?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const usersList = users?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));

  //   { value: "Choose", label: "Choose" },
  //   { value: "India", label: "India" },
  //   { value: "USA", label: "USA" },
  //   { value: "France", label: "France" },
  //   { value: "UAE", label: "UAE" },
  // ];

  // Initialize React Hook Form

  const { loading } = useSelector((state) => state.leads);
  // Submit Handler
  const onSubmit = async (data) => {
    const closeButton = document.getElementById("offcanvas_add_lead_close");
    const formData = new FormData();

    // Append all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "is_contact") {
        if (!selectedLead) {
          formData.append("is_contact", data[key] ? "Y" : "N");
        }
      } else {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    });
    if (selectedLogo) {
      formData.append("company_icon", selectedLogo);
    }
    // if (selectedLead) {
    //   formData.append("id", selectedLead.id);
    // }
    try {
      selectedLead
        ? await dispatch(
            updateLead({ id: selectedLead.id, leadData: formData })
          ).unwrap()
        : await dispatch(createLead(formData)).unwrap();
      closeButton.click();
    } catch (error) {
      closeButton.click();
    } finally {
      setSelectedLogo(null);
      setSelectedLead();
      reset();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_lead");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelectedLogo(null);
        setSelectedLead();
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
      id="offcanvas_add_lead"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {selectedLead ? "Update" : "Add New"} Leads
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="offcanvas_add_lead_close"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("entityType", { value: "lead-company" })}
          />
          <div className="accordion" id="main_accordion">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-user-plus fs-20" />
                  </span>
                  Basic Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="basic"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    {/* <div className="col-md-12">
                      <div className="mb-3">
                        <div className="profile-upload">
                          <div className="profile-upload-img">
                            <span>
                              <i className="ti ti-photo" />
                            </span>
                            {selectedLogo ? (
                              <img
                                src={URL.createObjectURL(selectedLogo)}
                                alt="Company Logo"
                                className="preview"
                              />
                            ) : selectedLead ? (
                              <img
                                src={selectedLead?.company_icon}
                                alt="Company Logo"
                                className="preview w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            )}
                            <button
                              type="button"
                              className={`profile-remove `}
                              style={{
                                position: "absolute",
                                display: selectedLogo ? "block" : "none",
                                border: "none",
                                top: "-10px",
                                right: "-13px",
                              }}
                              onClick={() => setSelectedLogo(null)}
                            >
                              <i className="ti ti-x" />
                            </button>
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload File
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
                    </div> */}

<div className="col-md-12">
  <div className="mb-3">
    <div className="profile-upload">
      <div className="profile-upload-img" style={{ position: "relative" }}>
        {selectedLogo ? (
          <>
            <img
              src={URL.createObjectURL(selectedLogo)}
              className="preview w-100 h-100 object-fit-cover"
            />
            <button
              type="button"
              className="profile-remove"
              style={{
                position: "absolute",
                top: "-10px",
                right: "-13px",
                border: "none",
                background: "white",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "2px 5px",
              }}
              onClick={() => setSelectedLogo(null)}
            >
              <i className="ti ti-x" />
            </button>
          </>
        ) : selectedLead && selectedLead.company_icon ? (
          <img
            src={selectedLead.company_icon}
            className="preview w-100 h-100 object-fit-cover"
          />
        ) : (
          <span
            className="flex items-center justify-center w-full h-full text-gray-400"
            style={{ fontSize: "3rem" }}
          >
            <CiImageOn />
          </span>
        )}
      </div>

      <div className="profile-upload-content">
        <label className="profile-upload-btn">
          <i className="ti ti-file-broken" /> Upload File
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
                          First Name <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          placeholder="Enter First Name"
                          className="form-control"
                          {...register("first_name", {
                            required: "First  Name is required !",
                          })}
                        />
                        {errors.first_name && (
                          <small className="text-danger">
                            {errors.first_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter Last Name"
                          className="form-control"
                          {...register(
                            "last_name"
                            //    {
                            //   required: "Last name is required !",
                            // }
                          )}
                        />
                        {errors.last_name && (
                          <small className="text-danger">
                            {errors.last_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">
                            Companies <span className="text-danger">*</span>
                          </label>
                          <div>
                            <Link
                              to="#"
                              className="link-purple"
                              data-bs-toggle="modal"
                              data-bs-target="#modal_add_company"
                            >
                              <i className="ti ti-plus me-1" />
                              Add
                            </Link>
                          </div>
                        </div>
                        <Controller
                          name="company_id"
                          control={control}
                          rules={{ required: "Company is required !" }} // Validation rule
                          render={({ field }) => {
                            const selectedCompany = companies?.data?.find(
                              (company) => company.id === field.value
                            );
                            return (
                              <Select
                                {...field}
                                className="select"
                                options={companies?.data?.map((i) => ({
                                  label: i?.name,
                                  value: i?.id,
                                }))}
                                classNamePrefix="react-select"
                                value={
                                  selectedCompany
                                    ? {
                                        label: selectedCompany.name,
                                        value: selectedCompany.id,
                                      }
                                    : null
                                } // Ensure correct default value
                                onChange={(selectedOption) =>
                                  field.onChange(selectedOption.value)
                                } // Store only value
                              />
                            );
                          }}
                        />
                        {errors.company_id && (
                          <small className="text-danger">
                            {errors.company_id.message}
                          </small>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("company_id", {
                            required: "Company name is required !",
                          })}
                        />
                        {errors.company_id && (
                          <small className="text-danger">
                            {errors.company_id.message}
                          </small>
                        )}
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Title"
                          className="form-control"
                          {...register("title", {
                            required: "Title is required !",
                          })}
                        />
                        {errors.title && (
                          <small className="text-danger">
                            {errors.title.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Job Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Job Title"
                          className="form-control"
                          {...register("jobTitle", {
                            required: "Job Title is required !",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <div className="status-toggle small-toggle-btn d-flex align-items-center">
                            <span className="me-2 label-text">
                              Email Opt Out
                            </span>
                            <Controller
                              name="email_opt_out"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type="checkbox"
                                    id="emailOptOut" // Add the ID here
                                    className="check"
                                    {...field}
                                    checked={field.value}
                                  />
                                  <label
                                    htmlFor="emailOptOut" // Ensure this matches the input ID
                                    className="checktoggle"
                                  >
                                    Email Opt-Out
                                  </label>
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <input
                          type="email"
                          placeholder="Enter Email"
                          className="form-control"
                          {...register("email", {
                            required: "Email is required !",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
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
                          Secondary Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Secondary Email"
                          {...register("secondary_email", {
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email format",
                            },
                          })}
                        />
                        {errors.secondary_email && (
                          <small className="text-danger">
                            {errors.secondary_email.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Mobile <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Enter Mobile"
                          className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                          {...register("mobile", {
                            required: "Mobile Number is required!",
                            minLength: {
                              value: 9,
                              message: "Mobile must be at least 9 digits!",
                            },
                            maxLength: {
                              value: 12,
                              message: "Mobile must be at most 12 digits!",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Mobile must contain only numbers!",
                            },
                          })}
                        />

                        {errors.mobile && (
                          <small className="text-danger">
                            {errors.mobile.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Phone&nbsp;<span className="text-danger">*</span>
                        </label>

                        <input
                          type="number"
                          placeholder="Enter Phone"
                          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // only digits
                          }}
                          {...register("phone", {
                            required: "Phone Number is required!",
                            minLength: {
                              value: 9,
                              message: "Phone must be at least 9 digits!",
                            },
                            maxLength: {
                              value: 12,
                              message: "Phone must be at most 12 digits!",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Phone must contain only numbers!",
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
                        <label className="col-form-label">Fax</label>

                        <input
                          placeholder="Enter Fax"
                          type="text"
                          className="form-control"
                          {...register("fax")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Website</label>

                        <input
                          placeholder="Enter Website"
                          type="text"
                          className="form-control"
                          {...register("website")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">
                          Source <span className="text-danger">*</span>
                          </label>
                          <div>
                            <Link
                              to="#"
                              className="link-purple"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_source_modal"
                            >
                              <i className="ti ti-plus me-1" />
                              Add
                            </Link>
                          </div>
                        </div>
                        <Controller
                          name="lead_source"
                          rules={{ required: "Source is required !" }} // Make the field required
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={sourceList}
                              placeholder="Select"
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={sourceList?.find(
                                (option) =>
                                  option.value === watch("lead_source")
                              )}
                            />
                          )}
                        />
                        {errors.lead_source && (
                          <small className="text-danger">
                            {errors.lead_source.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                       <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">
                          Industry <span className="text-danger">*</span>
                          </label>
                          <div>
                            <Link
                              to="#"
                              className="link-purple"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_industry_modal"
                            >
                              <i className="ti ti-plus me-1" />
                              Add
                            </Link>
                          </div>
                        </div>
                        <Controller
                          name="industry"
                          rules={{ required: "Industry is required !" }} // Make the field required
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={industriesList}
                              placeholder="Select"
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={industriesList?.find(
                                (option) => option.value === watch("industry")
                              )}
                            />
                          )}
                        />
                        {errors.industry && (
                          <small className="text-danger">
                            {errors.industry.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">
                          Lead status <span className="text-danger">*</span>
                          </label>
                          <div>
                            <Link
                              to="#"
                              className="link-purple"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_lost_reason_modal"
                            >
                              <i className="ti ti-plus me-1" />
                              Add
                            </Link>
                          </div>
                        </div>
                        <Controller
                          name="lead_status"
                          rules={{ required: "Lead status is required !" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={lostReasonsList}
                              placeholder="Select"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={lostReasonsList?.find(
                                (option) =>
                                  option.value === watch("lead_status")
                              )}
                            />
                          )}
                        />
                        {errors.lead_status && (
                          <small className="text-danger">
                            {errors.lead_status.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Owner <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="lead_owner"
                          rules={{ required: "Owner is required !" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={usersList}
                              placeholder="Select"
                              className="select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                                setValue(
                                  "lead_owner_name",
                                  selectedOption?.label
                                );
                              }} // Send only value
                              value={usersList?.find(
                                (option) => option.value === watch("lead_owner")
                              )}
                            />
                          )}
                        />

                        {errors.lead_owner && (
                          <small className="text-danger">
                            {errors.lead_owner.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Tags </label>
                        <input
                          type="text"
                          placeholder="Enter Tags"
                          className="form-control"
                          {...register("tags")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          No of Employees&nbsp;
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number" // use "text" to avoid browser-specific issues with type="number"
                          placeholder="Enter Employees"
                          className={`form-control ${errors.Employees ? "is-invalid" : ""}`}
                          {...register("no_of_employees", {
                            required: " Employees  is required!",
                          })}
                        />
                        {errors.no_of_employees && (
                          <small className="text-danger">
                            {errors.no_of_employees.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Annual Revenue&nbsp;
                          <span className="text-danger gap-2">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Enter Annual Revenue"
                          step="0.01"
                          className="form-control"
                          {...register("annual_revenue", {
                            required: "Annual Revenue is required !",
                          })}
                        />
                        {errors.annual_revenue && (
                          <small className="text-danger">
                            {errors.annual_revenue.message}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("revenue_currency", {
                            required: "Currency is required !",
                          })}
                        />
                        {errors.revenue_currency && (
                          <small className="text-danger">
                            {errors.revenue_currency.message}
                          </small>
                        )}
                      </div>
                    </div> */}

                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="col-form-label">
                          Currency <span className="text-danger">*</span>
                          </label>
                          <div>
                            <Link
                              to="#"
                              className="link-purple"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_currency_modal"
                            >
                              <i className="ti ti-plus me-1" />
                              Add
                            </Link>
                          </div>
                        </div>
                        <Controller
                          name="revenue_currency"
                          rules={{ required: "Currency is required !" }} // Validation rule
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={currencyLists}
                              placeholder="Select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption.value)
                              }
                              value={currencyLists?.find(
                                (option) => option.value === field.value
                              )}
                            />
                          )}
                        />

                        {errors.revenue_currency && (
                          <small className="text-danger">
                            {errors.revenue_currency.message}
                          </small>
                        )}
                      </div>
                      {/* <div className="mb-3">
                        <label className="col-form-label">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("currency", {
                            required: "Currency is required !",
                          })}
                        />
                        {errors.currency && (
                          <small className="text-danger">
                            {errors.currency.message}
                          </small>
                        )}
                      </div> */}
                    </div>

                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">Description  <span className="text-danger">(max 255 characters)</span></label>
                        <textarea
                          className="form-control"
                          placeholder="Enter Description"
                          rows={5}
                          {...register("description", {
                            validate: (value) => {
                              const wordCount = value.trim().split(/\s+/).length;
                              return wordCount <= 200 || "Description must not exceed 200 words.";
                            }})}
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Basic Info */}
            {/* /Address Info */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#address"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-map-pin-cog fs-20" />
                  </span>
                  Address Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="address"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Street Address{" "}
                        </label>
                        <input
                          placeholder="Enter Street"
                          type="text"
                          className="form-control"
                          {...register("street", {
                            // required: "Street address is required !",
                          })}
                        />
                        {/* {errors.street && (
                          <small className="text-danger">
                            {errors.street.message}
                          </small>
                        )} */}
                      </div>
                    </div>
                    {/* Billing Country */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Country</label>
                        <Controller
                          name="country"
                          control={control}
                          // rules={{ required: "Country is required !" }} // Validation rule
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={countryList}
                              placeholder="Select"
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                                setValue("state", null);
                              }} // Send only value
                              value={
                                watch("country") &&
                                countryList?.find(
                                  (option) => option.value === watch("country")
                                )
                              }
                              styles={{
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Ensure this value is higher than the icon's z-index
                                }),
                              }}
                            />
                          )}
                        />
                        {/* {errors.country && (
                          <small className="text-danger">
                            {errors.country.message}
                          </small>
                        )} */}
                      </div>
                    </div>

                    {/* Billing State */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">State</label>
                        <Controller
                          name="state"
                          control={control}
                          //  rules={{ required: "State is required !" }} // Validation rule
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={loadingState}
                              options={stateList}
                              placeholder="Select..."
                              className="select2"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              }
                              value={
                                watch("state") &&
                                stateList?.find(
                                  (option) => option.value === watch("state")
                                )
                              }
                              styles={{
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Ensure this value is higher than the icon's z-index
                                }),
                              }}
                            />
                          )}
                        />
                        {/* {errors.state && (
                          <small className="text-danger">
                            {errors.state.message}
                          </small>
                        )} */}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">City </label>
                        <input
                          type="text"
                          placeholder="Enter City"
                          className="form-control"
                          {...register("city", {
                            // required: "City is required !",
                          })}
                        />
                        {/* {errors.city && (
                          <small className="text-danger">
                            {errors.city.message}
                          </small>
                        )} */}
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          State / Province{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("state", {
                            required: "State is required !",
                          })}
                        />
                        {errors.state && (
                          <small className="text-danger">
                            {errors.state.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Country</label>
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "Country is required !" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="select"
                              classNamePrefix="react-select"
                              options={countries}
                              placeholder="Select..."

                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={countries?.find(
                                (option) => option.value === field.value,
                              )}
                            />
                          )}
                        />
                        {errors.country && (
                          <small className="text-danger">
                            {errors.country.message}
                          </small>
                        )}
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="mb-0">
                        <label className="col-form-label">Zipcode </label>
                        <input
                          type="text"
                          placeholder="Enter zipcode"
                          className="form-control"
                          {...register("zipcode", {
                            // required: "Zipcode is required !",
                          })}
                        />
                        {/* {errors.zipcode && (
                          <small className="text-danger">
                            {errors.zipcode.message}
                          </small>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Address Info */}
            {/* Social Profile */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#social"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-social fs-20" />
                  </span>
                  Social Profile
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="social"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Facebook</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("facebook_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Skype </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("skype_id")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Linkedin </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("linked_in_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("twitter_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Whatsapp</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("whatsapp_ac")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-0">
                        <label className="col-form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("instagram_ac")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
            !selectedLead &&  <div className="col-md-6 my-3 d-flex align-items-center">
            <div className="status-toggle small-toggle-btn d-flex align-items-center">
              <span className="me-2 label-text">Is Contact?</span>
              <Controller
                name="is_contact"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="checkbox"
                      id="isContact" // Add the ID here
                      className="check"
                      {...field}
                      checked={field.value}
                    />
                    <label
                      htmlFor="isContact" // Ensure this matches the input ID
                      className="checktoggle"
                    >
                      Is Contact?
                    </label>
                  </>
                )}
              />
            </div>
          </div>
            }
           
            {/* /Social Profile */} {/* Access */}
            {/* <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#access-info"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-accessible fs-20" />
                  </span>
                  Access
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="access-info"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Status</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="active"
                              value="Y"
                              defaultChecked
                              {...register("is_active")}
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
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* /Access */}
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
              {selectedLead
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                  className="spinner-border ml-3 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <AddEditModal mode="add" initialData={null} />
      <AddEditModalIndustry  mode="add" initialData={null}/>
      <AddEditModalCurrency  mode="add" initialData={null}/>
      <AddEditModalStatus  mode="add" initialData={null}/>
    </div>
  );
};
export default memo(AddLeadModal);
