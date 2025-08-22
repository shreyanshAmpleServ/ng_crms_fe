import { Button } from "antd";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { Margin, usePDF } from "react-to-pdf";
import {
  fetchComments,
  fetchQuotationById,
  fetchQuotationpPublicById,
  sendComments,
  uploadSignature,
} from "../../../redux/quotation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../../components/common/loader";
import { IoSend } from "react-icons/io5";
import { generateToken } from "../../../utils/publicToken";
import PublicDocumentComments from "./QuotationPdfComment";
import DigitalSignature from "./signature";

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
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optionalItem, setOptionalItem] = useState([]);
    const [savedSignature, setSavedSignature] = useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    token && dispatch(fetchQuotationpPublicById({ id: newId, token }));
    dispatch(fetchComments({ id: newId, token: token }));
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

  // Fixed handleSubmit with useCallback to prevent recreation
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!comment.trim() || isSubmitting) return;

      setIsSubmitting(true);
      try {
        await dispatch(
          sendComments({
            id: newId,
            token,
            data: {
              comments: comment,
              obj_name: "Quotation",
              obj_id: newId,
              user_id: order?.quotation_vendor?.id,
              user_name: order?.quotation_vendor?.name,
            },
          })
        );
        setComment("");
      } catch (error) {
        console.error("Error sending comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [comment, isSubmitting, dispatch, newId, token, order?.quotation_vendor]
  );
  const uploadSigns =async(file)=>{
    
    try {
      const formData = new FormData();
      formData.append("customer_sign", file);
      // formData.append("id", newId); 
        await dispatch(
          uploadSignature({
            id: newId,
            token,
            data: formData
          })
        );
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fixed handleCommentChange to prevent defocus
  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="preview-quotation-container">
          <div className="preview-header">
            <div className="header-title">
              <h4>{order ? "Preview" : "Add New "} Quotation</h4>
              <span className="quotation-code">
                #{order?.quotation_code}
              </span>
            </div>
            <div className="header-actions">
              <Button className="download-btn" variant="solid" onClick={toPDF}>
                <i className="ti ti-download" />
                Download
              </Button>
            </div>
          </div>

          <div ref={targetRef} className="preview-content">
            <div className="quotation-body">
              <span className={`status-badge status-${order?.status?.toLowerCase()}`}>
                {order?.status === "L"
                  ? "Closed"
                  : order?.status === "C"
                    ? "Canceled"
                    : order?.status === "P"
                      ? "Pending"
                      : "Open"}
              </span>

              <div className="quotation-header-section">
                <div className="quotation-title">
                  <span className="title-text">Quotation</span>
                  <span className="quotation-number">
                    #{order?.quotation_code}
                  </span>
                </div>
                <div className="quotation-dates">
                  <div className="date-item">
                    <span className="date-label">Due Date:</span>
                    <span className="date-value">
                      {moment(new Date(order?.due_date)).format("DD-MM-YYYY")}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Date:</span>
                    <span className="date-value">
                      {moment(new Date(order?.createdate)).format("DD-MM-YYYY")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="address-section">
                <div className="address-column">
                  <div className="address-block">
                    <label className="address-label">Bill To</label>
                    <div className="address-content">{order?.billto || ""}</div>
                    <div className="address-content">{order?.address || ""}</div>
                  </div>
                </div>

                <div className="address-column">
                  <div className="address-block">
                    <label className="address-label">Ship To</label>
                    <div className="address-content">{order?.shipto || ""}</div>
                    <div className="address-content">{order?.address || ""}</div>
                  </div>
                </div>

                <div className="address-column">
                  <div className="address-block">
                    <label className="address-label">Customer</label>
                    <div className="address-content">
                      {order?.quotation_vendor?.name || ""}
                    </div>
                    <div className="address-content">
                      {`${order?.quotation_vendor?.billing_street || ""},${
                        order?.quotation_vendor?.billing_city || ""
                      }, ${order?.quotation_vendor?.state?.name || ""}, ${
                        order?.quotation_vendor?.country?.name || ""
                      }, ${order?.quotation_vendor?.billing_zipcode || ""}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="items-section">
                <div className="section-header">
                  <h4 className="section-title">Quotation Line Items</h4>
                </div>
                <div className="table-container">
                  <table className="items-table">
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
                          <tr key={index}>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="item-name">
                                {i?.item_name}
                                {i?.is_optional === "Y" && (
                                  <span className="optional-badge">Optional</span>
                                )}
                              </div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">{i?.quantity}</div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">{i?.unit_price}</div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">{formatNumber(i?.rate)}</div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">{i?.disc_prcnt}%</div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">
                                {formatNumber(i?.total_bef_disc)}
                              </div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content">
                                {formatNumber(i?.line_tax)} ({i?.tax_per}%)
                              </div>
                            </td>
                            <td className={i?.is_optional === "Y" ? "optional-item" : ""}>
                              <div className="cell-content total-amount">
                                {formatNumber(i?.total_amount)}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amount Calculation */}
              <div className="calculation-section">
                <ul className="calculation-list">
                  <li className="calculation-item">
                    <span className="calc-label">Total Before Tax</span>
                    <span className="calc-value">
                      {formatNumber(order?.total_bef_tax)}
                    </span>
                  </li>
                  <li className="calculation-item">
                    <span className="calc-label">Total Discount</span>
                    <span className="calc-value">
                      {formatNumber(order?.disc_prcnt)}
                    </span>
                  </li>
                  <li className="calculation-item">
                    <span className="calc-label">
                      Rounded
                      <input
                        type="checkbox"
                        className="rounded-checkbox"
                        checked={order?.rounding === "N" ? false : true}
                        readOnly
                      />
                    </span>
                    <span className="calc-value">
                      {order?.rounding === "Y"
                        ? formatNumber(order?.rounding_amount)
                        : formatNumber(order?.rounding_amount) || 0}
                    </span>
                  </li>
                  <li className="calculation-item">
                    <span className="calc-label">Total Tax Amount</span>
                    <span className="calc-value">
                      {formatNumber(order?.tax_total) || 0}
                    </span>
                  </li>
                  <li className="calculation-item total-row">
                    <span className="calc-label">Total Amount</span>
                    <span className="calc-value">
                      {order?.rounding === "Y"
                        ? formatNumber(order?.rounding_amount)
                        : formatNumber(order?.total_amount)}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Terms & Conditions */}
              {order?.terms && (
                <div className="terms-section">
                  <div className="terms-header">Terms & Conditions</div>
                  <div
                    className="terms-content"
                    dangerouslySetInnerHTML={{
                      __html: order?.terms && JSON.parse(order?.terms),
                    }}
                  />
                </div>
              )}

              {/* Other Items */}
              {order?.other_items &&
                JSON.parse(order?.other_items)?.map((value, index) => (
                  <div key={index} className="other-items-section">
                    <div className="other-items-header">
                      {value?.category_name}
                    </div>
                    {value?.crms_template_items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="other-item">
                        {item?.description}
                      </div>
                    ))}
                  </div>
                ))}

              {/* Comments Section */}
              <div className="comments-section">
                <div className="comments-header">
                  Write the key points you want to modify
                </div>
                <PublicDocumentComments id={newId} order={order} />
                {/* Comment Form */}
                <form onSubmit={handleSubmit} className="comment-form mx-auto">
                  <div className="comment-input-wrapper">
                    <textarea
                      required
                      rows={6}
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Write your reply..."
                      className="comment-textarea"
                      maxLength={500}
                      disabled={isSubmitting}
                    />
                    <div className="textarea-footer">
                      <div className="character-count">
                        {comment.length}/500
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
 <DigitalSignature details={order} savedSignature={savedSignature} setSavedSignature={setSavedSignature} onSave={uploadSigns}/>

                    <button
                      type="submit"
                      className="send-button"
                      disabled={!comment.trim() || isSubmitting}
                    >
                      <span className="button-text">
                        {isSubmitting ? "Sending..." : "Send Comment"}
                      </span>
                      <IoSend className="send-icon" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .preview-quotation-container {
          width: 980px;
          margin: auto;
          height: 100%;
          overflow: auto;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e1e5e9;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-title h4 {
          margin: 0;
          color: #2d3748;
          font-weight: 600;
        }

        .quotation-code {
          color: #0d6efd;
          font-weight: 700;
          font-size: 1.1em;
          background: rgba(13, 110, 253, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .download-btn {
          background: #28a745 !important;
          border-color: #28a745 !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 8px;
          font-weight: 600;
          padding: 0.5rem 1rem;
        }

        .preview-content {
          height: 100%;
          overflow: auto;
          padding: 1.5rem;
        }

        .quotation-body {
          position: relative;
          height: 100%;
          overflow: auto;
        }

        .status-badge {
          position: absolute;
          left: -50px;
          top: 20px;
          padding: 7px 20px;
          color: white;
          font-weight: 600;
          transform: rotate(-45deg);
          width: 11rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .status-badge.status-p {
          background-color: #0d6efd;
        }

        .status-badge.status-c {
          background-color: #dc3545;
        }

        .status-badge.status-o {
          background-color: #28a745;
        }

        .status-badge.status-l {
          background-color: #6c757d;
        }

        .quotation-header-section {
          text-align: right;
          margin-bottom: 2rem;
        }

        .quotation-title {
          margin-bottom: 1rem;
        }

        .title-text {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
        }

        .quotation-number {
          color: #0d6efd;
          font-weight: 700;
          font-size:2rem;
          margin-left: 0.5rem;
        }

        .quotation-dates {
          width: 30%;
          margin-left: auto;
        }

        .date-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .date-label {
          font-weight: 600;
          color: #4a5568;
        }

        .date-value {
          color: #2d3748;
        }

        .address-section {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .address-block {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #0d6efd;
        }

        .address-label {
          font-weight: 600;
          color: #2d3748;
          font-size: 1.1em;
          display: block;
          margin-bottom: 0.5rem;
        }

        .address-content {
          color: #4a5568;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        .items-section {
          margin-bottom: 2rem;
        }

        .section-header {
          margin-bottom: 1rem;
        }

        .section-title {
          font-weight: 700;
          color: #2d3748;
          margin: 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e1e5e9;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          border:1px solid rgba(139, 137, 137, 0.15);
          box-shadow: 0 2px 8px rgba(69, 69, 69, 0.41);
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .items-table th {
          // background: linear-gradient(135deg,rgba(115, 116, 119, 0.71),rgba(118, 75, 162, 0.59));
          background: rgba(115, 116, 119, 0.34);
          color: black;
          padding: 1rem 0.75rem;
          font-weight: 600;
          text-align: left;
          font-size: 0.9rem;
        }

        .items-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e1e5e9;
          vertical-align: middle;
        }

        .items-table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .optional-item {
          background-color: rgba(255, 193, 7, 0.1);
        }

        .item-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: capitalize;
        }

        .optional-badge {
          background: #28a745;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .cell-content {
          color: #2d3748;
        }

        .total-amount {
          font-weight: 700;
          color: #2d3748;
        }

        .calculation-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }

        .calculation-list {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 30%;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }

        .calculation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e1e5e9;
        }

        .calculation-item:last-child {
          border-bottom: none;
        }

        .total-row {
          background: rgba(13, 110, 253, 0.1);
          margin: 0 -1rem;
          padding: 0.75rem 1rem;
          border-radius: 4px;
        }

        .calc-label {
          font-weight: 600;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .calc-value {
          font-weight: 700;
          color: #2d3748;
        }

        .rounded-checkbox {
          margin-left: 0.5rem;
        }

        .terms-section,
        .other-items-section {
          margin-bottom: 1.5rem;
        }

        .terms-header,
        .other-items-header {
          background: #e9ecef;
          color: #2d3748;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-radius: 6px 6px 0 0;
          margin-bottom: 0;
        }

        .terms-content,
        .other-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 0 0 6px 6px;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .comments-section {
          margin-top: 2rem;
        }

        .comments-header {
          background: rgba(255, 193, 7, 0.2);
          color: #2d3748;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .comment-form {
          width: 100%;
          max-width: 800px;
          margin: 1rem 0;
        }

        .comment-input-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .comment-textarea {
          width: 100%;
          min-height: 120px;
          padding: 1rem 1.25rem;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #2d3748;
          background-color: #ffffff;
          resize: vertical;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .comment-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background-color: #fafbfc;
        }

        .comment-textarea::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .comment-textarea:disabled {
          background-color: #f7fafc;
          color: #a0aec0;
          cursor: not-allowed;
        }

        .textarea-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .character-count {
          font-size: 12px;
          color: #718096;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .send-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
          min-width: 150px;
          justify-content: center;
          height:50px;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .send-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .button-text {
          font-weight: 600;
        }

        .send-icon {
          font-size: 16px;
          transition: transform 0.2s ease-in-out;
        }

        .send-button:hover:not(:disabled) .send-icon {
          transform: translateX(2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .preview-quotation-container {
            width: 100%;
            margin: 0;
            border-radius: 0;
          }

          .address-section {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .quotation-dates {
            width: 100%;
          }

          .calculation-list {
            width: 100%;
          }

          .send-button {
            width: 100%;
            padding: 1rem;
            font-size: 16px;
          }

          .form-actions {
            // justify-content: stretch;
          }

          .items-table {
            font-size: 0.85rem;
          }

          .items-table th,
          .items-table td {
            padding: 0.5rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .preview-quotation-container {
            background: #1a1a1a;
            border-color: #404040;
          }

          .preview-header {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-bottom-color: #404040;
          }

          .header-title h4,
          .title-text,
          .date-value,
          .calc-value,
          .cell-content,
          .address-content {
            color: #e2e8f0;
          }

          .address-block,
          .calculation-list,
          .terms-content,
          .other-item {
            background: #2d3748;
          }

          .items-table {
            background: #2d3748;
          }

          .items-table td {
            border-bottom-color: #4a5568;
          }

          .items-table tbody tr:hover {
            background-color: #374151;
          }

          .comment-textarea {
            background-color: #2d3748;
            border-color: #4a5568;
            color: #f7fafc;
          }

          .comment-textarea:focus {
            background-color: #374151;
            border-color: #667eea;
          }

          .comment-textarea::placeholder {
            color: #a0aec0;
          }

          .character-count {
            color: #cbd5e0;
          }

          .terms-header,
          .other-items-header {
            background: #374151;
            color: #e2e8f0;
          }

          .comments-header {
            background: rgba(251, 191, 36, 0.2);
            color: #e2e8f0;
          }
        }
      `}</style>
    </>
  );
};

export default PreviewQuotation;























// import { Button } from "antd";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { Margin, usePDF } from "react-to-pdf";
// import {
//   fetchComments,
//   fetchQuotationById,
//   fetchQuotationpPublicById,
//   sendComments,
// } from "../../../redux/quotation";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import Loader from "../../../components/common/loader";
// import { IoSend } from "react-icons/io5";
// import { generateToken } from "../../../utils/publicToken";
// import PublicDocumentComments from "./QuotationPdfComment";

// const initialItem = [
//   {
//     parent_id: null,
//     item_id: null,
//     item_name: "",
//     quantity: 1,
//     delivered_qty: 0,
//     unit_price: 0,
//     currency: null,
//     rate: 0,
//     disc_prcnt: 0,
//     disc_amount: 0,
//     tax_id: null,
//     tax_per: 0.0,
//     line_tax: 0,
//     total_bef_disc: 0,
//     total_amount: 0,
//   },
// ];

// const PreviewQuotation = ({ setOrder, formatNumber }) => {
//   const { id } = useParams();
//   const newId = atob(decodeURIComponent(id));
//   const [itemNumber, setItemNumber] = useState(initialItem);
//   const [token, setToken] = useState();
//   const [comment,setComment] = useState("")

//   const [optionalItem, setOptionalItem] = useState([]);
//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     token && dispatch(fetchQuotationpPublicById({ id: newId, token }));
//     dispatch(fetchComments({id:newId ,token:token}))
//   }, [dispatch, token]);
//   const {
//     quotationDetail: order,
//     loading,
//     error,
//     success,
//   } = useSelector((state) => state.quotations);
//   function formatNumber(num) {
//     num = Number(num);
//     num = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
//     if (num === 0 || isNaN(num)) {
//       return "0";
//     }
//     const number = parseFloat(num);
//     const [integerPart, decimalPart] = number.toString().split(".");
//     const formattedInteger = parseInt(integerPart).toLocaleString("en-IN");
//     if (decimalPart !== undefined) {
//       const fixedDecimal = parseFloat(`0.${decimalPart}`)
//         .toFixed(2)
//         .split(".")[1];
//       return `${formattedInteger}.${fixedDecimal}`;
//     }
//     return formattedInteger;
//   }

//   React.useEffect(() => {
//     if (order) {
//       setItemNumber(
//         order?.quotation_items?.map((item) => ({
//           parent_id: item?.parent_id || null,
//           item_id: item?.item_id || null,
//           item_name: item?.item_name || "",
//           quantity: Number(item?.quantity) || 1,
//           delivered_qty: Number(item?.delivered_qty) || 0,
//           unit_price: Number(item?.unit_price) || 0,
//           currency: Number(item?.currency) || null,
//           rate: Number(item?.rate) || 0,
//           disc_prcnt: Number(item?.disc_prcnt) || 0,
//           disc_amount: Number(item?.disc_amount) || 0,
//           tax_id: Number(item?.tax_id) || null,
//           tax_per: Number(item?.tax_per) || 0.0,
//           line_tax: Number(item?.line_tax) || 0,
//           total_bef_disc: Number(item?.total_bef_disc) || 0,
//           total_amount: Number(item?.total_amount) || 0,
//           is_optional: item?.is_optional || "N",
//         }))
//       );
//       setOptionalItem(
//         order?.optional_items ? JSON.parse(order?.optional_items) : ""
//       );
//     }
//   }, [order]);

//   React.useEffect(() => {
//     const offcanvasElement = document.getElementById("offcanvas_preview_order");
//     if (offcanvasElement) {
//       const handleModalClose = () => {
//         setOrder();
//         setItemNumber(initialItem);
//       };
//       offcanvasElement.addEventListener(
//         "hidden.bs.offcanvas",
//         handleModalClose
//       );
//       return () => {
//         offcanvasElement.removeEventListener(
//           "hidden.bs.offcanvas",
//           handleModalClose
//         );
//       };
//     }
//   }, []);
//   // const printRef = useRef();
//   useEffect(() => {
//     const createToken = async () => {
//       const genToken = await generateToken({ id: 1, username: "Anil" });
//       console.log("JWT:", genToken);
//       setToken(genToken);
//     };

//     createToken();
//   }, []);

//   // Function to download PDF
//   const { toPDF, targetRef } = usePDF({
//     filename: `${order?.quotation_code}.pdf`,
//     page: { margin: Margin.MEDIUM },
//   });
  
//   const handleSubmit =()=>{
//     dispatch(sendComments({id: newId, token,data: {comments:comment,obj_name:"Quotation",obj_id:newId,user_id:order?.quotation_vendor?.id,user_name:order?.quotation_vendor?.name} }))
//     setComment("")
//   }

//   return (
//     <>
//       {loading ? (
//         <Loader />
//       ) : (
//         <div
//           style={{
//             width: "980px",
//             margin: "auto",
//             height: "100%",
//             overflow: "scroll",
//           }}
//           //   style={{ height: "200vh" }}
//           //   className="offcanvas offcanvas-end offcanvas-large "
//           //   tabIndex={-1}
//           //   id="offcanvas_preview_order"
//           className="border bg-white"
//         >
//           <div className=" border-bottom p-1 offcanvas-header justify-content-between">
//             <div className="d-flex">
//               <h4>{order ? "Preview" : "Add New "} Quotation</h4>
//               <span className="text-primary h5 mx-2 fw-bold">
//                 #{order?.quotation_code}
//               </span>
//             </div>
//             <div className="d-flex align-items-center">
//               <Button className="bg-success" variant="solid" onClick={toPDF}>
//                 <i className="ti ti-download" />
//                 Download
//               </Button>
//               {/* <button
//             type="button"
//             className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//             id="close_add_edit_order"
//           >
//             <i className="ti ti-x" />
//           </button> */}
//             </div>
//           </div>
//           <div
//             ref={targetRef}
//             style={{ height: "100%", overflow: "scroll" }}
//             className=" px-4 pb-5 position-relative offcanvas-body overflow-scroll"
//           >
//             <div
//               className="overflow-scroll"
//               style={{ height: "100%", overflow: "scroll" }}
//             >
//               <div style={{ height: "100%", overflow: "scroll" }}>
//                 <span
//                   style={{
//                     backgroundColor:
//                       order?.status === "P"
//                         ? "blue"
//                         : order?.status === "C"
//                           ? "red"
//                           : order?.status === "O"
//                             ? "green"
//                             : "black",
//                     position: "absolute",
//                     left: "-50px",
//                     padding: "7px",
//                     paddingLeft: "20px",
//                     textAlign: "center",
//                     color: "white",
//                     transform: "rotate(-45deg)",
//                     width: "11rem",
//                     top: "20px",
//                   }}
//                 >
//                   {order?.status === "L"
//                     ? "Closed"
//                     : order?.status === "C"
//                       ? "Canceled"
//                       : order?.status === "P"
//                         ? "Pending"
//                         : "Open"}
//                 </span>
//                 <div className="text-end mb-3">
//                   <div className="fw-bold  h3">
//                     {" "}
//                     <span className="fw-bold h2">Quotation</span>{" "}
//                     <span className="text-primary">
//                       #{order?.quotation_code}
//                     </span>
//                   </div>
//                   <div
//                     className=" text-start"
//                     style={{ width: "30%", marginLeft: "74%" }}
//                   >
//                     <div className="">
//                       {" "}
//                       <span className="fw-semibold h5">Due Date : </span>
//                       <span>
//                         {moment(new Date(order?.due_date)).format("DD-MM-YYYY")}
//                       </span>
//                     </div>
//                     <div className="">
//                       {" "}
//                       <span className="fw-semibold h5"> Date : </span>
//                       <span>
//                         {moment(new Date(order?.createdate)).format(
//                           "DD-MM-YYYY"
//                         )}
//                       </span>
//                     </div>
//                     {/* <div className=""> <span className="fw-semibold h5" >Status : </span><span>{order?.state === "L" ? "Closed" : order?.state === "L" ? "Canceled" : order?.state === "P" ? "Pending" : "Open"}</span></div> */}
//                   </div>
//                 </div>
//                 <div
//                   className="row overflow-auto "
//                   style={{ height: "100%", overflow: "scroll" }}
//                 >
//                   <div className="col-md-4 ">
//                     <div className="text-break">
//                       <label className="h5 "> Bill To </label>
//                       <div> {order?.billto || ""}</div>
//                       <div> {order?.address || ""}</div>
//                     </div>
//                   </div>

//                   <div className="col-md-4 " style={{ paddingLeft: "10%" }}>
//                     <div className="text-break">
//                       <label className=" h5"> Ship To</label>
//                       <div> {order?.shipto || ""}</div>
//                       <div> {order?.address || ""}</div>
//                     </div>
//                   </div>

//                   <div
//                     className="col-md-4 text-start "
//                     style={{ paddingLeft: "7%" }}
//                   >
//                     <div className="text-break">
//                       <label className="h5">Customer</label>
//                       <div> {order?.quotation_vendor?.name || ""}</div>
//                       <div>{` ${order?.quotation_vendor?.billing_street || ""},${order?.quotation_vendor?.billing_city || ""}, ${order?.quotation_vendor?.state?.name || ""}, ${order?.quotation_vendor?.country?.name || ""}, ${order?.quotation_vendor?.billing_zipcode || ""}`}</div>
//                     </div>
//                   </div>
//                   {/* <div className="col-md-4 ">
//             <div className="">
//                 <label className="h5">Contact Person</label> 
//                 <div> { order?.cont_person}</div>
//             </div>
//             </div> */}

//                   {/* Ship To  */}

//                   {/* Sales Type  */}
//                   {/* <div className="d-flex align-items-center justify-content-between">
//                 <label className="col-form-label ">Sales Type</label>
//                 <div> {order?.sales_type || ""}</div>
//             </div> */}
//                   {/* Currency */}
//                   {/* <div className="d-flex align-items-center  justify-content-between">
//                <label className="h5"> Currency  </label>
//                <div> {order?.order_currency?.name || " - "}</div>
//             </div> */}

//                   {/* Reply message    */}

//                   {/* Order Items  */}
//                   <div>
//                     <div className="col-md-12 mt-4 ">
//                       <div className="mb-1 d-flex justify-content-between">
//                         <label className="h4 fw-bold">
//                           Quotaion Line Items
//                         </label>
//                       </div>
//                     </div>
//                     <div className="table-responsive">
//                       <table className="table table-view">
//                         <thead>
//                           <tr>
//                             <th>Item</th>
//                             <th>Qty</th>
//                             <th>Price</th>
//                             <th>Rate</th>
//                             <th>Disc</th>
//                             <th>Aft disc</th>
//                             <th>Tax</th>
//                             <th>Total Amt</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {itemNumber.length &&
//                             itemNumber?.map((i, index) => (
//                               <tr>
//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table text-capitalize input-table-descripition">
//                                     {i?.item_name}
//                                     {i?.is_optional === "Y" && (
//                                       <div className="badge ms-2 badge-soft-success">
//                                         Optional
//                                       </div>
//                                     )}
//                                   </div>
//                                 </td>

//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table">
//                                     {i?.quantity}
//                                   </div>
//                                 </td>

//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table">
//                                     {i?.unit_price}
//                                   </div>
//                                 </td>

//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table">
//                                     {formatNumber(i?.rate)}
//                                   </div>
//                                 </td>
//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table">
//                                     {i?.disc_prcnt}%
//                                   </div>
//                                 </td>
//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table">
//                                     {formatNumber(i?.total_bef_disc)}
//                                   </div>
//                                 </td>
//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                   style={{ width: "auto" }}
//                                 >
//                                   <div className="input-table">
//                                     {formatNumber(i?.line_tax)} ({i?.tax_per}%)
//                                   </div>
//                                 </td>
//                                 <td
//                                   className={`${i?.is_optional === "N" ? "" : "bg-optional"}`}
//                                 >
//                                   <div className="input-table fw-bold">
//                                     {formatNumber(i?.total_amount)}
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                   {/* Amount Calculation  */}
//                   <div className="subtotal-div  d-flex justify-content-end mb-3">
//                     <ul
//                       className="mb-3  "
//                       style={{ width: "30%", lineHeight: ".5" }}
//                     >
//                       <li>
//                         <h5>Total Before Tax</h5>
//                         {formatNumber(order?.total_bef_tax)}
//                       </li>
//                       <li>
//                         <h5>Total Discount </h5>
//                         {formatNumber(order?.disc_prcnt)}
//                       </li>
//                       <li>
//                         <h5>
//                           Rounded
//                           <input
//                             type="checkbox"
//                             className="mx-3"
//                             checked={order?.rounding === "N" ? false : true}
//                           />{" "}
//                         </h5>

//                         {order?.rounding === "Y"
//                           ? formatNumber(order?.rounding_amount)
//                           : formatNumber(order?.rounding_amount) || 0}
//                       </li>
//                       <li>
//                         <h5>Total Tax Amount</h5>
//                         {formatNumber(order?.tax_total) || 0}
//                       </li>
//                       <li>
//                         <h5>Total Amount</h5>
//                         <span className="fw-bold">
//                           {order?.rounding === "Y"
//                             ? formatNumber(order?.rounding_amount)
//                             : formatNumber(order?.total_amount)}
//                         </span>
//                       </li>
//                     </ul>
//                   </div>
//                   {/* Optional Items  */}
//                   {/* {optionalItem?.length > 0 && <div>
//               <div className="col-md-12 mt-2 ">
//                 <div className="mb-1 d-flex justify-content-between">
//                   <label className="h4 fw-bold">Optional Items</label>
//                 </div>
//               </div>
//               <div className="table-responsive">
//                 <table className="table table-view">
//                   <thead>
//                     <tr>
//                       <th>Item</th>
//                       <th>Qty</th>
//                       <th>Price</th>
//                       <th>Rate</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {optionalItem?.length > 0 &&
//                       optionalItem?.map((i, index) => (
//                         <tr>
//                           <td>
//                             <div className="input-table input-table-descripition">
//                               {i?.item_name}
//                             </div>
//                           </td>

//                           <td>
//                             <div className="input-table">{i?.quantity}</div>
//                           </td>

//                           <td>
//                             <div className="input-table">
//                               {formatNumber(i?.unit_price)}
//                             </div>
//                           </td>

//                           <td>
//                             <div className="input-table">
//                               {formatNumber(i?.rate)}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//               </div>} */}

//                   {order?.terms && (
//                     <div>
//                       <div className="bg-gray-100 p-2 mb-2 fw-bold">
//                         Terms & Conditions
//                       </div>
//                       <div
//                         dangerouslySetInnerHTML={{
//                           __html: order?.terms && JSON.parse(order?.terms),
//                         }}
//                       />
//                     </div>
//                   )}
//                   {order?.other_items &&
//                     JSON.parse(order?.other_items)?.map((value) => (
//                       <div>
//                         <div className="bg-gray-100 p-2 mb-2 fw-bold">
//                           {value?.category_name}
//                         </div>
//                         {value?.crms_template_items?.map((item) => (
//                           <div className="mb-2">{item?.description}</div>
//                         ))}
//                       </div>
//                     ))}
//                   <div>
//                     <div className="bg-optional1 text-black p-2 mb-2 fw-bold">
//                       Write the key points you want to modify
//                     </div>
//                     <PublicDocumentComments id={newId} order={order}  />

//                     {/* Reply message    */}
//                     {/* <form onSubmit={handleSubmit}>
//                       <div className="d-flex gap-3">
//                         <textarea
//                         required
//                           style={{ width: "100%" }}
//                           rows={6}
//                           type="text"
//                           value={comment}
//                           onChange={(e)=>setComment(e.target.value)}
//                           placeholder="Reply Comments"
//                           className=" p-2 "
//                         />
//                       </div>
//                       <button
//                       type="submit"
//                         style={{
//                           width: "10%",
//                           height: "40px",
//                           fontSize: "15px",
//                           margin: "auto",
//                         }}
//                         className="bg-purple mt-2 ml-2 text-center p-2 d-flex rounded  justify-content-center"
//                       >
//                         SEND
//                         <IoSend
//                           style={{
//                             fontSize: "17px",
//                             margin: "auto",
//                             marginLeft: "4px",
//                             fontWeight: 600,
//                           }}
//                         />
//                       </button>
//                     </form> */}
//                     <form onSubmit={handleSubmit} className="comment-form">
//   <div className="comment-input-wrapper">
//     <textarea
//       required
//       rows={6}
//       type="text"
//       value={comment}
//       onChange={(e) => setComment(e.target.value)}
//       placeholder="Write your reply..."
//       className="comment-textarea"
//     />
//     <div className="textarea-footer">
//       <div className="character-count">
//         {comment.length}/500
//       </div>
//     </div>
//   </div>
  
//   <div className="form-actions">
//     <button
//       type="submit"
//       className="send-button"
//       disabled={!comment.trim()}
//     >
//       <span className="button-text">Send Comment</span>
//       <IoSend className="send-icon" />
//     </button>
//   </div>
// </form>
// <style jsx>{`.comment-form {
//   width: 100%;
//   max-width: 800px;
//   margin: 0 auto;
// }

// .comment-input-wrapper {
//   position: relative;
//   margin-bottom: 1rem;
// }

// .comment-textarea {
//   width: 100%;
//   min-height: 120px;
//   padding: 1rem 1.25rem;
//   border: 2px solid #e1e5e9;
//   border-radius: 12px;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//   font-size: 14px;
//   line-height: 1.5;
//   color: #2d3748;
//   background-color: #ffffff;
//   resize: vertical;
//   transition: all 0.2s ease-in-out;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
// }

// .comment-textarea:focus {
//   outline: none;
//   border-color: #667eea;
//   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//   background-color: #fafbfc;
// }

// .comment-textarea::placeholder {
//   color: #a0aec0;
//   font-weight: 400;
// }

// .textarea-footer {
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 0.5rem;
// }

// .character-count {
//   font-size: 12px;
//   color: #718096;
//   font-weight: 500;
// }

// .form-actions {
//   display: flex;
//   justify-content: flex-end;
//   gap: 0.75rem;
// }

// .send-button {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.75rem 1.5rem;
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   border: none;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.2s ease-in-out;
//   box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
//   min-width: 130px;
//   justify-content: center;
// }

// .send-button:hover:not(:disabled) {
//   transform: translateY(-1px);
//   box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
//   background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
// }

// .send-button:active:not(:disabled) {
//   transform: translateY(0);
// }

// .send-button:disabled {
//   opacity: 0.5;
//   cursor: not-allowed;
//   transform: none;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
// }

// .button-text {
//   font-weight: 600;
// }

// .send-icon {
//   font-size: 16px;
//   transition: transform 0.2s ease-in-out;
// }

// .send-button:hover:not(:disabled) .send-icon {
//   transform: translateX(2px);
// }

// /* Responsive Design */
// @media (max-width: 768px) {
//   .comment-form {
//     padding: 0 1rem;
//   }
  
//   .send-button {
//     width: 100%;
//     padding: 1rem;
//     font-size: 16px;
//   }
  
//   .form-actions {
//     justify-content: stretch;
//   }
// }

// /* Dark mode support */
// @media (prefers-color-scheme: dark) {
//   .comment-textarea {
//     background-color: #2d3748;
//     border-color: #4a5568;
//     color: #f7fafc;
//   }
  
//   .comment-textarea:focus {
//     background-color: #374151;
//     border-color: #667eea;
//   }
  
//   .comment-textarea::placeholder {
//     color: #a0aec0;
//   }
  
//   .character-count {
//     color: #cbd5e0;
//   }
// }
// `}</style>

//                   </div>
                 
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PreviewQuotation;
