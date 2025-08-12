import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { OrderStatusOptions } from "../../../components/common/selectoption/selectoption";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchSalesType } from "../../../redux/order";
import { fetchTaxSetup } from "../../../redux/taxSetUp";
import { fetchVendors } from "../../../redux/vendor";
import ManageOrderItemModal from "./ManageOrderItemModal";
import {
  addQuotation,
  fetchQuotationCode,
  fetchquotations,
  updateQuotation,
} from "../../../redux/quotation";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { fetchquoteTemplate } from "../../../redux/quoteTemplate";
import { fetchProducts } from "../../../redux/products";
import { AllActivities } from "./Activities";
import PreviewPdf from "./AttachmentPdf";

const initialItem = [
  {
    parent_id: null,
    item_id: null,
    item_name: "",
    quantity: 1,
    delivered_qty: 0,
    unit_price: 0,
    currency: null,
    rate: 0,
    disc_prcnt: 0,
    disc_amount: 0,
    tax_id: null,
    tax_per: 0.0,
    line_tax: 0,
    total_bef_disc: 0,
    total_amount: 0,
    is_optional: "N",
  },
];

const AddQuotationModal = ({ order, setOrder }) => {
  const dispatch = useDispatch();
  const [itemNumber, setItemNumber] = useState(initialItem);
  const [updatedItems, setUpdatedItems] = useState([])
  const [optionalItem, setOptionalItem] = useState([]);
  const [othersItem, setOthersItem] = useState([]);
  const [termsItems, setTermsItems] = useState("");
  const [prevPdf, setPrevPdf] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [isNewMail, setIsNewMail] = useState(false);
  const [threadId, setThreadId] = useState();
  const [msgId, setMsgId] = useState();

  const { salesTypes } = useSelector((state) => state.orders);
  const { quotationCode, loading } = useSelector((state) => state.quotations);
  const formatNumber = (num) => {
    if (num === 0 || isNaN(num)) {
      return "0";
    }
    const number = parseFloat(num);
    const [integerPart, decimalPart] = number.toString().split(".");
    const formattedInteger = parseInt(integerPart).toLocaleString("en-IN");
    if (decimalPart !== undefined) {
      const fixedDecimal = parseFloat(`0.${decimalPart}`)
        .toFixed(2)
        .split(".")[1];
      return `${formattedInteger}.${fixedDecimal}`;
    }
    return formattedInteger;
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const firstDivRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (order && firstDivRef.current) {
      const timeout = setTimeout(() => {
        setHeight(firstDivRef.current.clientHeight);
      }, 100); // slight delay
  
      return () => clearTimeout(timeout);
    }
  }, [order]);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quotation_code: quotationCode,
      template_master_id: null,
      vendor_id: "",
      cust_ref_no: "",
      cont_person: "",
      address: "",
      currency: null,
      due_date: dayjs(new Date()).format("DD-MM-YYYY"),
      total_bef_tax: 0,
      disc_prcnt: 0,
      tax_total: 0,
      total_amount: 0,
      sales_type: "",
      billto: null,
      shipto: "",
      rounding: "N",
      rounding_amount: 0,
      remarks: "",
      status: "",
      doc_total: 0,
      source_doc_id: "",
      source_doc_type: "",
      apr_by: null,
      apr_date: new Date(),
      auto_approved: "N",
      apr_status: "",
      apr_remark: "",
      attachment1: "",
      attachment2: "",
    },
  });

  React.useEffect(() => {
    if (order) {
      reset({
        quotation_code: order?.quotation_code || quotationCode,
        template_master_id: order?.template_master_id || null,
        vendor_id: order?.vendor_id || "",
        cust_ref_no: order?.cust_ref_no || "",
        cont_person: order?.cont_person || "",
        address: order?.address || "",
        currency: order?.currency || null,
        due_date:
          dayjs(new Date(order?.due_date)) ||
          dayjs(new Date()).format("DD-MM-YYYY"),
        total_bef_tax: order?.total_bef_tax || 0,
        disc_prcnt: order?.disc_prcnt || 0,
        tax_total: order?.tax_total || 0,
        sales_type: order?.sales_type || "",
        billto: order?.billto || "",
        shipto: order?.shipto || "",
        rounding: order?.rounding || "N",
        rounding_amount: order?.rounding_amount || 0,
        remarks: order?.remarks || "",
        status: order?.status || "",
        doc_total: order?.doc_total || 0,
        source_doc_id: order?.source_doc_id || "",
        source_doc_type: order?.source_doc_type || "",
        apr_by: order?.apr_by || null,
        apr_date: order?.apr_date || new Date(),
        auto_approved: order?.auto_approved || "N",
        apr_status: order?.apr_status || "",
        apr_remark: order?.apr_remark || "",
      });
      setItemNumber(
        order?.quotation_items?.map((item) => ({
          id:item?.id || null,
          parent_id: item?.parent_id || null,
          item_id: item?.item_id || null,
          item_name: item?.item_name || "",
          quantity: Number(item?.quantity) || 1,
          delivered_qty: Number(item?.delivered_qty) || 0,
          unit_price: Number(item?.unit_price) || 0,
          currency: Number(item?.currency) || null,
          rate: Number(item?.rate) || 0,
          disc_prcnt: Number(item?.disc_prcnt) || 0,
          disc_amount: Number(item?.disc_amount) || 0,
          tax_id: Number(item?.tax_id) || null,
          tax_per: Number(item?.tax_per) || 0.0,
          line_tax: Number(item?.line_tax) || 0,
          total_bef_disc: Number(item?.total_bef_disc) || 0,
          total_amount: Number(item?.total_amount) || 0,
          is_optional: item?.is_optional || "N",
        }))
      );
      setOptionalItem(
        order?.optional_items ? JSON.parse(order?.optional_items) : ""
      );
      setOthersItem(order?.other_items ? JSON.parse(order?.other_items) : "");
      setTermsItems(JSON.parse(order?.terms));
    } else {
      reset({
        quotation_code: quotationCode,
        vendor_id: "",
        template_master_id: null,
        cust_ref_no: "",
        cont_person: "",
        address: "",
        currency: null,
        due_date: dayjs(new Date()).format("DD-MM-YYYY"),
        total_bef_tax: 0,
        disc_prcnt: 0,
        tax_total: 0,
        sales_type: "",
        billto: null,
        shipto: "",
        rounding: "N",
        rounding_amount: 0,
        remarks: "",
        status: "",
        doc_total: 0,
        source_doc_id: "",
        source_doc_type: "",
        apr_by: null,
        apr_date: new Date(),
        auto_approved: "N",
        apr_status: "",
        apr_remark: "",
      });
    }
  }, [order]);
  useEffect(() => {
    dispatch(fetchSalesType());
    dispatch(fetchquotations());
    dispatch(fetchVendors());
    dispatch(fetchCurrencies({ is_active: "Y" }));
    dispatch(fetchTaxSetup({ is_active: "Y" }));
    dispatch(fetchQuotationCode());
    dispatch(fetchquoteTemplate());
    dispatch(fetchProducts());
  }, [dispatch]);

  const { quoteTemplate, loading: loadingTemp } = useSelector(
    (state) => state.quoteTemplate
  );
  const { vendor, loading: loadingVendor } = useSelector(
    (state) => state.vendor
  );
  const { currencies, loading: loadingCurrency } = useSelector(
    (state) => state.currency
  );
  const { products } = useSelector((state) => state.products);

  const quoteTempList = quoteTemplate?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.template_name,
    crms_template_category: emnt.crms_template_category,
    terms: emnt.terms,
  }));
  const vendorList = vendor?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const CurrencyList = currencies.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const salesTypesOption = salesTypes.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const productList = products?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
    unit_price: emnt.unit_price,
  }));

  useEffect(() => {
    let total_bef_tax = 0;
    let tax_total = 0;
    let disc_prcnt = 0;
    let total_amount = 0;
    itemNumber?.map((i) => {
      total_bef_tax += Number(i?.total_bef_disc) || 0;
      tax_total += Number(i?.line_tax) || 0;
      disc_prcnt += Number(i?.disc_amount) || 0;
      total_amount += Number(i?.total_amount) || 0;
    });

    setValue("total_bef_tax", total_bef_tax);
    setValue("tax_total", tax_total);
    setValue("disc_prcnt", disc_prcnt);
    setValue("total_amount", total_amount);
    setValue("rounding_amount", total_amount);
  }, [itemNumber]);

  useEffect(() => {
    !order && setValue("quotation_code", quotationCode);
  }, [quotationCode, order]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024; // 15MB in bytes
      if (file.size > maxSize) {
        alert("File size exceeds 5 MB. Please select a smaller file.");
        return;
      } else {
        setValue(
          e.target.name === "attachment1" ? "attachment1" : "attachment2",
          file
        );
      }
    }
  };
  const onSubmit = async (data) => {
    if (!itemNumber?.[0]?.item_id) {
      toast.error("Quotation Items is not selected !");
      return;
    }
    const closeButton = document.getElementById("close_add_edit_order");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (
        data[key] !== null &&
        data[key] != "due_date" &&
        data[key] !== undefined
      ) {
        let value = data[key];
        if (key === "due_date") {
          value = dayjs(data.due_date, "DD-MM-YYYY").toISOString();
        }
        if (key === "apr_date" && value instanceof Date) {
          value = dayjs(data.apr_date).toISOString();
        }
        formData.append(key, value);
      }
    });
    // Object.keys(data).forEach((key) => {
    //   if (data[key] !== null) {
    //     formData.append(key, (key=== "due_date" || key === "apr_date") ? data[key] ? data[key]?.toISOString() : "" : data[key]);
    //   }
    // });
    formData.append("orderItemsData", JSON.stringify(itemNumber));
    formData.append("terms", JSON.stringify(termsItems));
    formData.append("optional_items", JSON.stringify(optionalItem));
    formData.append("other_items", JSON.stringify(othersItem));
    formData.append("updated_items", JSON.stringify(updatedItems));
    order && formData.append("id", order?.id);
    try {
      order
        ? await dispatch(updateQuotation(formData))
        : await dispatch(addQuotation(formData)).unwrap();
      // order ? await dispatch(updateOrder({id :order?.id,orderData : { orderData: formData,orderItemsData:JSON.stringify(itemNumber)}}))
      // :  await dispatch(addOrder({orderData: formData,orderItemsData:JSON.stringify(itemNumber)})).unwrap();

      closeButton.click();
      dispatch(fetchQuotationCode());
      reset();
      setMsgId();
      setThreadId();
      setIsNewMail();
      setUpdatedItems([])
      setItemNumber([
        {
          parent_id: null,
          item_id: null,
          item_name: "",
          quantity: 1,
          delivered_qty: 0,
          unit_price: 0,
          currency: null,
          rate: 0,
          disc_prcnt: 0,
          disc_amount: 0,
          tax_id: null,
          tax_per: 0.0,
          line_tax: 0,
          total_bef_disc: 0,
          total_amount: 0,
          is_optional: "N",
        },
      ]);
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_quotation"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setOrder();
        reset();
      setUpdatedItems([])
        setItemNumber([
          {
            parent_id: null,
            item_id: null,
            item_name: "",
            quantity: 1,
            delivered_qty: 0,
            unit_price: 0,
            currency: null,
            rate: 0,
            disc_prcnt: 0,
            disc_amount: 0,
            tax_id: null,
            tax_per: 0.0,
            line_tax: 0,
            total_bef_disc: 0,
            total_amount: 0,
            is_optional: "N",
          },
        ]);
        setOptionalItem([]);
        setMsgId();
        setThreadId();
        setIsNewMail();
        setPrevPdf(false);
        setAttachments([])
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
      className="offcanvas offcanvas-end offcanvas-larger"
      tabIndex={-1}
      id="offcanvas_add_edit_quotation"
    >
      <div className="offcanvas-header d-flex justify-content-between border-bottom">
        <h4>{order ? "Update " : "Add New "} Quotation</h4>
        <div className="d-flex gap-3 align-items-center">
          {!prevPdf ? (
            <button
              type="button"
              // disabled={loading}
              onClick={() => setPrevPdf(true)}
              className="btn  btn-success"
            >
              Send Quotation
            </button>
          ) : (
            <button
              type="button"
              // disabled={loading}
              onClick={() => {
                setAttachments();
                setAttachments([])
                setPrevPdf(false);
              }}
              className="btn btn-primary"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn-close custom-btn-close m-0 border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            id="close_add_edit_order"
          >
            <i className="ti ti-x" />
          </button>
        </div>
      </div>
      <div style={{ position: "relative" }} className="offcanvas-body ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="row">
              <div
                ref={firstDivRef}
                className={`row ${order ? "col-md-6" : "col-md-12"}`}
              >
                {/* Vendor  */}
                <div className=" col-md-6 mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="col-form-label">
                      Customer<span className="text-danger"> *</span>
                    </label>
                  </div>
                  <Controller
                    name="vendor_id"
                    rules={{ required: "Customer is required !" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={vendorList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value || null);
                          setValue("cont_person", selectedDate?.label);
                        }}
                        value={
                          vendorList?.find(
                            (option) => option.value === watch("vendor_id")
                          ) || ""
                        }
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                      />
                    )}
                  />
                  {errors.vendor_id && (
                    <small className="text-danger">
                      {errors.vendor_id.message}
                    </small>
                  )}
                </div>
                {/* Order Code  */}
                <div className=" col-md-6 mb-3">
                  <label className="col-form-label">Quotation Code</label>
                  <input
                    type="text"
                    disabled
                    value={watch("quotation_code") || ""}
                    className="form-control"
                    {...register("quotation_code")}
                  />
                </div>
                {/* Contact Person  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Contact Person<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("cont_person", {
                        required: "Contact Person to is required !",
                      })}
                    />
                    {errors.cont_person && (
                      <small className="text-danger">
                        {errors.cont_person.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Vendor  */}
                <div className=" col-md-6 mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="col-form-label">Quotation Template</label>
                  </div>
                  <Controller
                    name="template_master_id"
                    // rules={{ required: "Customer is required !" }} // Make the field required
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={quoteTempList}
                        placeholder="Choose"
                        className="select2"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value || null);

                          const productCategories =
                            selectedOption?.crms_template_category?.filter(
                              (item) => item?.type === "product"
                            );

                          const items =
                            productCategories?.flatMap((cat) =>
                              cat?.crms_template_items?.map((i) => {
                                const product = productList?.find(
                                  (p) => p.value === i?.item_id
                                );
                                const unit_price = Number(
                                  product?.unit_price || 0
                                );
                                const rate = unit_price * Number(i?.qty);
                                return {
                                  parent_id: null,
                                  item_id: i?.item_id,
                                  item_name: product?.label || "",
                                  quantity: Number(i?.qty) || 1,
                                  delivered_qty: 0,
                                  unit_price: unit_price,
                                  currency: null,
                                  rate: rate || 0,
                                  disc_prcnt: 0,
                                  disc_amount: 0,
                                  tax_id: null,
                                  tax_per: 0.0,
                                  line_tax: 0,
                                  total_bef_disc: rate,
                                  total_amount: rate,
                                  is_optional: "N",
                                };
                              })
                            ) || [];
                          const optionalProductCategories =
                            selectedOption?.crms_template_category?.filter(
                              (item) => item?.type === "optional"
                            );

                          const optinalItems =
                            optionalProductCategories?.flatMap((cat) =>
                              cat?.crms_template_items?.map((i) => {
                                const product = productList?.find(
                                  (p) => p.value === i?.item_id
                                );
                                const unit_price = Number(
                                  product?.unit_price || 0
                                );
                                const rate = unit_price * Number(i?.qty);
                                return {
                                  parent_id: null,
                                  item_id: i?.item_id,
                                  item_name: product?.label || "",
                                  quantity: Number(i?.qty) || 1,
                                  delivered_qty: 0,
                                  unit_price: unit_price,
                                  currency: null,
                                  rate: rate || 0,
                                  disc_prcnt: 0,
                                  disc_amount: 0,
                                  tax_id: null,
                                  tax_per: 0.0,
                                  line_tax: 0,
                                  total_bef_disc: rate,
                                  total_amount: rate,
                                };
                              })
                            ) || [];
                          const OthersCategories =
                            selectedOption?.crms_template_category?.filter(
                              (item) => item?.type === "others"
                            );

                          // const othersItems =
                          //   OthersCategories?.flatMap((cat) =>
                          //     cat?.crms_template_items?.map((i) => {
                          //       const product = productList?.find(
                          //         (p) => p.value === i?.item_id
                          //       );
                          //       const unit_price = Number(
                          //         product?.unit_price || 0
                          //       );
                          //       const rate = unit_price * Number(i?.qty);
                          //       return {
                          //         parent_id: null,
                          //         item_id: i?.item_id,
                          //         item_name: product?.label || "",
                          //         quantity: Number(i?.qty) || 1,
                          //         delivered_qty: 0,
                          //         unit_price: unit_price,
                          //         currency: null,
                          //         rate: rate || 0,
                          //         disc_prcnt: 0,
                          //         disc_amount: 0,
                          //         tax_id: null,
                          //         tax_per: 0.0,
                          //         line_tax: 0,
                          //         total_bef_disc: rate,
                          //         total_amount: rate,
                          //       };
                          //     })
                          //   ) || [];

                          setItemNumber(items);
                          setOptionalItem(optinalItems);
                          setOthersItem(OthersCategories);
                          setTermsItems(selectedOption?.terms);
                          setUpdatedItems([])
                        }}
                        value={
                          quoteTempList?.find(
                            (option) =>
                              option.value === watch("template_master_id")
                          ) || ""
                        }
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                      />
                    )}
                  />
                </div>
                {/* Bill To  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Bill To<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("billto", {
                        required: "Bill to is required !",
                      })}
                    />
                    {errors.billto && (
                      <small className="text-danger">
                        {errors.billto.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Ship To  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Ship To<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("shipto", {
                        required: "Ship to is required !",
                      })}
                    />
                    {errors.shipto && (
                      <small className="text-danger">
                        {errors.shipto.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Sales Type  */}
                <div className="col-md-6">
                  <div className="mb-1">
                    <label className="col-form-label ">Sales Type</label>
                    <Select
                      className="select"
                      options={salesTypesOption}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) => {
                        setValue("sales_type", selectedOption.value);
                      }}
                      value={
                        salesTypesOption?.find(
                          (option) => option.value === watch("sales_type")
                        ) || ""
                      }
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />
                  </div>
                </div>
                {/* Currency */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="currency"
                      rules={{ required: "Currency is required !" }} // Make the field required
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={CurrencyList}
                          placeholder="Choose"
                          className="select2"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption?.value || null)
                          } // Send only value
                          value={
                            watch("currency") &&
                            CurrencyList?.find(
                              (option) => option.value === watch("currency")
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
                    {errors.currency && (
                      <small className="text-danger">
                        {errors.currency.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Due Date  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 icon-form">
                      <span className="form-icon z-1">
                        <i className="ti ti-calendar-check" />
                      </span>
                      <Controller
                        name="due_date"
                        control={control}
                        rules={{ required: "Start date is required !" }} // Make the field required
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            className="form-control"
                            value={
                              field.value
                                ? dayjs(field.value, "DD-MM-YYYY")
                                : null
                            }
                            format="DD-MM-YYYY"
                            onChange={(date, dateString) => {
                              field.onChange(dateString);
                            }}
                          />
                        )}
                      />
                      {errors.due_date && (
                        <small className="text-danger">
                          {errors.due_date.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* Status */}
                <div className="col-md-6">
                  <div className="mb-1">
                    <label className="col-form-label ">Status</label>
                    <Select
                      className="select"
                      options={OrderStatusOptions}
                      placeholder="Choose"
                      classNamePrefix="react-select"
                      onChange={(selectedOption) => {
                        setValue("status", selectedOption.value);
                      }}
                      value={
                        OrderStatusOptions?.find(
                          (option) => option.value === watch("status")
                        ) || ""
                      }
                    />
                  </div>
                </div>

                {/* Order Items  */}
                <ManageOrderItemModal
                  itemNumber={itemNumber}
                  setItemNumber={setItemNumber}
                  productList={productList}
                  termsItems={termsItems}
                  setTermsItems={setTermsItems}
                  optionalItem={optionalItem}
                  setOptionalItem={setOptionalItem}
                  updatedItems ={updatedItems}
                  setUpdatedItems={setUpdatedItems}
                />
                {/* Amount Calculation  */}
                <div className="subtotal-div mb-3">
                  <ul className="mb-3">
                    <li>
                      <h5>Total Before Tax</h5>
                      <input
                        name="total_bef_tax"
                        type="text"
                        value={formatNumber(watch("total_bef_tax"))}
                        disabled
                      />
                    </li>
                    <li>
                      <h5>Total Discount </h5>
                      <input
                        name="disc_prcnt"
                        type="text"
                        value={formatNumber(watch("disc_prcnt"))}
                        disabled
                      />
                    </li>
                    <li>
                      <h5>
                        Rounded
                        <input
                          type="checkbox"
                          className="mx-3"
                          onChange={(e) => {
                            const newValue = e.target.checked ? "Y" : "N";
                            setValue("rounding", newValue);
                            const totalAmount =
                              parseFloat(watch("total_amount")) || 0;
                            const roundedAmount = e.target.checked
                              ? Math.ceil(totalAmount)
                              : totalAmount;
                            setValue("rounding_amount", roundedAmount);
                          }}
                          checked={watch("rounding") === "Y"}
                        />{" "}
                      </h5>

                      <input
                        name="rounding"
                        type="text"
                        value={
                          watch("rounding") === "Y"
                            ? formatNumber(Math.round(watch("rounding_amount")))
                            : formatNumber(watch("rounding_amount"))
                        }
                        disabled
                      />
                    </li>
                    <li>
                      <h5>Total Tax Amount</h5>
                      <input
                        name="tax_total"
                        type="text"
                        value={formatNumber(watch("tax_total"))}
                        disabled
                      />
                    </li>
                    <li>
                      <h5>Total Amount</h5>
                      <input
                        name="total_amount"
                        type="text"
                        value={
                          watch("rounding") === "Y"
                            ? formatNumber(Math.round(watch("rounding_amount")))
                            : formatNumber(watch("total_amount"))
                        }
                        disabled
                      />
                    </li>
                  </ul>
                </div>
                {/* Attachment 1  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">Attachment 1</label>
                    <input
                      type="file"
                      name="attachment1"
                      className="form-control"
                      // value={watch("attachment1") || ""}
                      onChange={handleAvatarChange}
                    />
                    {watch("attachment1")?.size > 5 * 1024 * 1024 && (
                      <small className="text-danger">
                        File size exceeds 5MB. Please select a smaller file
                      </small>
                    )}
                  </div>
                </div>
                {/* Attachment 2  */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">Attachment 2</label>
                    <input
                      type="file"
                      name="attachment2"
                      className="form-control"
                      //  value={watch("attachment2") || ""}
                      onChange={handleAvatarChange}
                      // ref={fileInputRef}
                      // value={selectedFile}
                    />
                    {watch("attachment2")?.size > 5 * 1024 * 1024 && (
                      <small className="text-danger">
                        {watch("attachment2") &&
                          "File size exceeds 5MB. Please select a smaller file."}
                      </small>
                    )}
                    {/* <div className="upload-content border p-1 ">
                   <div className="upload-btn">
                     <input
                       type="file"
                       accept="image/*"
                       onChange={handleAvatarChange}
                     /> */}
                    {/* <span>
             <i className="ti ti-file-broken" />
             Upload File
           </span> */}
                    {/* </div> */}
                    {/* <p>JPG, GIF, or PNG. Max size of 800K</p> */}
                    {/* </div> */}
                  </div>
                </div>
                {/* Address */}
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Address<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("address", {
                        required: "Address is required !",
                      })}
                    />
                    {errors.address && (
                      <small className="text-danger">
                        {errors.address.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Description */}
                <div className="col-md-12 mb-3">
                  <div className="mb-0">
                    <label className="col-form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      {...register("remarks")}
                    />
                  </div>
                </div>
              </div>
              {order && (
                <div
                  style={{ height: height }}
                  className="col-md-6 border  overflow-scroll border-top-0"
                >
                  <div
                    style={{ fontSize: "15px" }}
                    className="fw-bold text-center p-2 pt-0 border-bottom"
                  >
                    Activities
                  </div>
                  <AllActivities
                    isNewMail={isNewMail}
                    setIsNewMail={setIsNewMail}
                    threadId={threadId}
                    setThreadId={setThreadId}
                    msgId={msgId}
                    setMsgId={setMsgId}
                    id={order?.id}
                    vendor={order?.quotation_vendor}
                    quotaiton={order}
                    prevPdf={prevPdf}
                    setPrevPdf={setPrevPdf}
                    attachments={attachments}
                    setAttachments={setAttachments}
                  />
                </div>
              )}
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
              disabled={loading}
              className="btn btn-primary"
            >
              {order
                ? loading
                  ? "Updating ...."
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
                  className="spinner-border ml-2 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
        {prevPdf && (
          <div
            style={{ zIndex: 2 }}
            className="position-absolute w-full top-0 bg-white"
          >
            <PreviewPdf
              setAttachments={setAttachments}
              setPrevPdf={setPrevPdf}
              id={order?.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddQuotationModal;
