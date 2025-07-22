import { Button } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Margin, usePDF } from "react-to-pdf";
import {
  fetchQuotationById,
  fetchQuotationpPublicById,
} from "../../../redux/quotation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../../components/common/loader";
import { IoSend } from "react-icons/io5";
import { generateToken } from "../../../utils/publicToken";

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
  },
];

const PreviewQuotation = ({ setOrder, formatNumber }) => {
  const { id } = useParams();
  const newId = atob(decodeURIComponent(id));
  const [itemNumber, setItemNumber] = useState(initialItem);
  const [token, setToken] = useState();

  const [optionalItem, setOptionalItem] = useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    token && dispatch(fetchQuotationpPublicById({ id: newId, token }));
  }, [dispatch, token]);
  const {
    quotationDetail: order,
    loading,
    error,
    success,
  } = useSelector((state) => state.quotations);
  function formatNumber(num) {
    num = Number(num);
    num = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
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
  }

  React.useEffect(() => {
    if (order) {
      setItemNumber(
        order?.quotation_items?.map((item) => ({
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
    }
  }, [order]);

  React.useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_preview_order");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setOrder();
        setItemNumber(initialItem);
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
  // const printRef = useRef();
  useEffect(() => {
    const createToken = async () => {
      const genToken = await generateToken({ id: 1, username: "Anil" });
      console.log("JWT:", genToken);
      setToken(genToken);
    };

    createToken();
  }, []);

  // Function to download PDF
  const { toPDF, targetRef } = usePDF({
    filename: `${order?.quotation_code}.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{
            width: "980px",
            margin: "auto",
            height: "100%",
            overflow: "scroll",
          }}
          //   style={{ height: "200vh" }}
          //   className="offcanvas offcanvas-end offcanvas-large "
          //   tabIndex={-1}
          //   id="offcanvas_preview_order"
          className="border bg-white"
        >
          <div className=" border-bottom p-1 offcanvas-header justify-content-between">
            <div className="d-flex">
              <h4>{order ? "Preview" : "Add New "} Quotation</h4>
              <span className="text-primary h5 mx-2 fw-bold">
                #{order?.quotation_code}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <Button className="bg-success" variant="solid" onClick={toPDF}>
                <i className="ti ti-download" />
                Download
              </Button>
              {/* <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            id="close_add_edit_order"
          >
            <i className="ti ti-x" />
          </button> */}
            </div>
          </div>
          <div
            ref={targetRef}
            style={{ height: "100%", overflow: "scroll" }}
            className=" px-4 pb-5 position-relative offcanvas-body overflow-scroll"
          >
            <form
              className="overflow-scroll"
              style={{ height: "100%", overflow: "scroll" }}
            >
              <div style={{ height: "100%", overflow: "scroll" }}>
                <span
                  style={{
                    backgroundColor:
                      order?.status === "P"
                        ? "blue"
                        : order?.status === "C"
                          ? "red"
                          : order?.status === "O"
                            ? "green"
                            : "black",
                    position: "absolute",
                    left: "-50px",
                    padding: "7px",
                    paddingLeft: "20px",
                    textAlign: "center",
                    color: "white",
                    transform: "rotate(-45deg)",
                    width: "11rem",
                    top: "20px",
                  }}
                >
                  {order?.status === "L"
                    ? "Closed"
                    : order?.status === "C"
                      ? "Canceled"
                      : order?.status === "P"
                        ? "Pending"
                        : "Open"}
                </span>
                <div className="text-end mb-3">
                  <div className="fw-bold  h3">
                    {" "}
                    <span className="fw-bold h2">Quotation</span>{" "}
                    <span className="text-primary">
                      #{order?.quotation_code}
                    </span>
                  </div>
                  <div
                    className=" text-start"
                    style={{ width: "30%", marginLeft: "74%" }}
                  >
                    <div className="">
                      {" "}
                      <span className="fw-semibold h5">Due Date : </span>
                      <span>
                        {moment(new Date(order?.due_date)).format("DD-MM-YYYY")}
                      </span>
                    </div>
                    <div className="">
                      {" "}
                      <span className="fw-semibold h5"> Date : </span>
                      <span>
                        {moment(new Date(order?.createdate)).format(
                          "DD-MM-YYYY"
                        )}
                      </span>
                    </div>
                    {/* <div className=""> <span className="fw-semibold h5" >Status : </span><span>{order?.state === "L" ? "Closed" : order?.state === "L" ? "Canceled" : order?.state === "P" ? "Pending" : "Open"}</span></div> */}
                  </div>
                </div>
                <div
                  className="row overflow-auto "
                  style={{ height: "100%", overflow: "scroll" }}
                >
                  <div className="col-md-4 ">
                    <div className="text-break">
                      <label className="h5 "> Bill To </label>
                      <div> {order?.billto || ""}</div>
                      <div> {order?.address || ""}</div>
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingLeft: "10%" }}>
                    <div className="text-break">
                      <label className=" h5"> Ship To</label>
                      <div> {order?.shipto || ""}</div>
                      <div> {order?.address || ""}</div>
                    </div>
                  </div>

                  <div
                    className="col-md-4 text-start "
                    style={{ paddingLeft: "7%" }}
                  >
                    <div className="text-break">
                      <label className="h5">Customer</label>
                      <div> {order?.quotation_vendor?.name || ""}</div>
                      <div>{` ${order?.quotation_vendor?.billing_street || ""},${order?.quotation_vendor?.billing_city || ""}, ${order?.quotation_vendor?.state?.name || ""}, ${order?.quotation_vendor?.country?.name || ""}, ${order?.quotation_vendor?.billing_zipcode || ""}`}</div>
                    </div>
                  </div>
                  {/* <div className="col-md-4 ">
            <div className="">
                <label className="h5">Contact Person</label> 
                <div> { order?.cont_person}</div>
            </div>
            </div> */}

                  {/* Ship To  */}

                  {/* Sales Type  */}
                  {/* <div className="d-flex align-items-center justify-content-between">
                <label className="col-form-label ">Sales Type</label>
                <div> {order?.sales_type || ""}</div>
            </div> */}
                  {/* Currency */}
                  {/* <div className="d-flex align-items-center  justify-content-between">
               <label className="h5"> Currency  </label>
               <div> {order?.order_currency?.name || " - "}</div>
            </div> */}

                  {/* Reply message    */}

                  {/* Order Items  */}
                  <div>
                    <div className="col-md-12 mt-4 ">
                      <div className="mb-1 d-flex justify-content-between">
                        <label className="h4 fw-bold">
                          Quotaion Line Items
                        </label>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-view">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Rate</th>
                            <th>Disc</th>
                            <th>Aft disc</th>
                            <th>Tax</th>
                            <th>Total Amt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemNumber.length &&
                            itemNumber?.map((i, index) => (
                              <tr>
                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table input-table-descripition">
                                    {i?.item_name}
                                    {i?.is_optional === "Y" && (
                                      <div className="badge ms-2 badge-soft-success">
                                        Optional
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table">
                                    {i?.quantity}
                                  </div>
                                </td>

                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table">
                                    {i?.unit_price}
                                  </div>
                                </td>

                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table">
                                    {formatNumber(i?.rate)}
                                  </div>
                                </td>
                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table">
                                    {i?.disc_prcnt}%
                                  </div>
                                </td>
                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table">
                                    {formatNumber(i?.total_bef_disc)}
                                  </div>
                                </td>
                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                  style={{ width: "auto" }}
                                >
                                  <div className="input-table">
                                    {formatNumber(i?.line_tax)} ({i?.tax_per}%)
                                  </div>
                                </td>
                                <td
                                  className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
                                >
                                  <div className="input-table fw-bold">
                                    {formatNumber(i?.total_amount)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Amount Calculation  */}
                  <div className="subtotal-div  d-flex justify-content-end mb-3">
                    <ul
                      className="mb-3  "
                      style={{ width: "30%", lineHeight: ".5" }}
                    >
                      <li>
                        <h5>Total Before Tax</h5>
                        {formatNumber(order?.total_bef_tax)}
                      </li>
                      <li>
                        <h5>Total Discount </h5>
                        {formatNumber(order?.disc_prcnt)}
                      </li>
                      <li>
                        <h5>
                          Rounded
                          <input
                            type="checkbox"
                            className="mx-3"
                            checked={order?.rounding === "N" ? false : true}
                          />{" "}
                        </h5>

                        {order?.rounding === "Y"
                          ? formatNumber(order?.rounding_amount)
                          : formatNumber(order?.rounding_amount) || 0}
                      </li>
                      <li>
                        <h5>Total Tax Amount</h5>
                        {formatNumber(order?.tax_total) || 0}
                      </li>
                      <li>
                        <h5>Total Amount</h5>
                        <span className="fw-bold">
                          {order?.rounding === "Y"
                            ? formatNumber(order?.rounding_amount)
                            : formatNumber(order?.total_amount)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* Optional Items  */}
                  {/* {optionalItem?.length > 0 && <div>
              <div className="col-md-12 mt-2 ">
                <div className="mb-1 d-flex justify-content-between">
                  <label className="h4 fw-bold">Optional Items</label>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-view">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionalItem?.length > 0 &&
                      optionalItem?.map((i, index) => (
                        <tr>
                          <td>
                            <div className="input-table input-table-descripition">
                              {i?.item_name}
                            </div>
                          </td>

                          <td>
                            <div className="input-table">{i?.quantity}</div>
                          </td>

                          <td>
                            <div className="input-table">
                              {formatNumber(i?.unit_price)}
                            </div>
                          </td>

                          <td>
                            <div className="input-table">
                              {formatNumber(i?.rate)}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              </div>} */}

                  {order?.terms && (
                    <div>
                      <div className="bg-gray-100 p-2 mb-2 fw-bold">
                        Terms & Conditions
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: order?.terms && JSON.parse(order?.terms),
                        }}
                      />
                    </div>
                  )}
                  {order?.other_items &&
                    JSON.parse(order?.other_items)?.map((value) => (
                      <div>
                        <div className="bg-gray-100 p-2 mb-2 fw-bold">
                          {value?.category_name}
                        </div>
                        {value?.crms_template_items?.map((item) => (
                          <div className="mb-2">{item?.description}</div>
                        ))}
                      </div>
                    ))}
                  <div>
                    <div className="bg-optional1 text-black p-2 mb-2 fw-bold">
                      Write the key points you want to modify
                    </div>
                    {/* Reply message    */}
                    <div>
                      <div className="d-flex gap-3">
                        <textarea
                          style={{ width: "100%" }}
                          rows={6}
                          type="text"
                          placeholder="Reply Comments"
                          className=" p-2 "
                        />
                      </div>
                      <span
                        style={{
                          width: "10%",
                          height: "40px",
                          fontSize: "15px",
                          margin: "auto",
                        }}
                        className="bg-purple mt-2 ml-2 text-center p-2 d-flex rounded  justify-content-center"
                      >
                        SEND
                        <IoSend
                          style={{
                            fontSize: "17px",
                            margin: "auto",
                            marginLeft: "4px",
                            fontWeight: 600,
                          }}
                        />
                      </span>
                    </div>
                  </div>
                  {/* Attachment 1  */}
                  {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Attachment 1
                  <span className="text-danger">*</span>
                </label>
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
            </div> */}
                  {/* Attachment 2  */}
                  {/* <div className="col-md-6">
             <div className="mb-3">
               <label className="col-form-label">
                 Attachment 2
                 <span className="text-danger">*</span>
               </label>
               <input
                 type="file"
                 name="attachment2"
                 className="form-control"
                //  value={watch("attachment2") || ""}
                 onChange={handleAvatarChange}
               />
               {watch("attachment2")?.size > 5 * 1024 * 1024 && (
                 <small className="text-danger">
                 {watch("attachment2") &&  "File size exceeds 5MB. Please select a smaller file."}
                 </small>
               )}
             </div>
           </div> */}
                  {/* Description */}
                  {/* <div className="col-md-12 mb-3">
                  <div className="mb-0">
                    <label className="col-form-label">
                      Remarks 
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      {...register("remarks")}
                    />
                  </div>
                </div> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewQuotation;
