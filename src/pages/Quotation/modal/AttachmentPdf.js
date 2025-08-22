import { Button } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { fetchQuotationById } from "../../../redux/quotation";
// import { getAllMessage, sendMail } from '../redux/gmailAccess';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaPaperPlane, FaFilePdf, FaEnvelope, FaCalendar, FaTimes, FaDownload } from "react-icons/fa";
import { MdAttachFile, MdSave } from "react-icons/md";
import ReactQuill from 'react-quill';
import toast from 'react-hot-toast';
import { getAllMessage, sendMail } from "../../../redux/gmailAccess";

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

const PreviewPdf = ({ id, setAttachments,setPrevPdf }) => {
  const [itemNumber, setItemNumber] = useState(initialItem);
  const [optionalItem, setOptionalItem] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [pdfAttachment, setPdfAttachment] = useState(null);
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: '',
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchQuotationById(id));
  }, [dispatch, id]);

  const { quotationDetail, loading, success } = useSelector(
    (state) => state.quotations,
  );

  React.useEffect(() => {
    if (quotationDetail) {
      setItemNumber(
        quotationDetail?.quotation_items?.map((item) => ({
          parent_id: item?.parent_id || null,
          item_id: item?.item_id || null,
          item_name: item?.item_name || "",
          is_optional: item?.is_optional || "N",
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
        }))
      );
      setOptionalItem(quotationDetail?.optional_items ? JSON.parse(quotationDetail?.optional_items) : "");
      
      // Pre-fill email subject
      setEmailForm(prev => ({
        ...prev,
        subject: `Quotation ${quotationDetail?.quotation_code} - ${quotationDetail?.quotation_vendor?.name}`,
        to: quotationDetail?.quotation_vendor?.email || '',
        body:`<p style="font-family: Arial, sans-serif; font-size: 14px;">Dear <strong>${quotationDetail?.quotation_vendor?.name || 'Customer'}</strong>,</p>
        <br />

    <p style="font-family: Arial, sans-serif; font-size: 14px;">       Please find attached quotation <strong>${quotationDetail?.quotation_code}</strong> for your review.</p>
        <br />
           <p>You can also <a href="${process.env.REACT_WEB_URL || "https://mowara.dcclogsuite.com"}/crms/quotation-pdf/${btoa(quotationDetail?.id?.toString())}" target="_blank" style="color:#007bff;text-decoration:underline;">click here to view it online</a> and reply to confirm your order.</p> <br />
        
       <p style="font-family: Arial, sans-serif; font-size: 14px;">Best regards,<br/>

      AmpleServ Pvt Ltd.</p>
        `
      }));
    }
  }, [quotationDetail]);

  function formatNumber(num) {
    num = Number(num);
    num = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
    if (num === 0 || isNaN(num)) { return '0'; }
    const number = parseFloat(num);
    const [integerPart, decimalPart] = number.toString().split('.');
    const formattedInteger = parseInt(integerPart).toLocaleString('en-IN');
    if (decimalPart !== undefined) {
      const fixedDecimal = parseFloat(`0.${decimalPart}`).toFixed(2).split('.')[1];
      return `${formattedInteger}.${fixedDecimal}`;
    }
    return formattedInteger;
  }

  const { toPDF, targetRef } = usePDF({
    filename: `${quotationDetail?.quotation_code}.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  useEffect(() => {
    const generatePdfAttachment = async () => {
        try {
          const input = document.getElementById("pdf-preview-container");
          if (!input) {
            console.warn("PDF container not found");
            return;
          }
          const margin = 10; // mm
          const scale = 1.5;
      
          // Render HTML to main canvas
          const canvas = await html2canvas(input, { scale, useCORS: true });
      
          const pdf = new jsPDF("p", "mm", "a4");
          const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
          const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
      
          // Compute scaling between canvas pixels and PDF mm unit
          const pxPerMm = canvas.width / (pdf.internal.pageSize.getWidth());
          const pageHeightPx = pageHeight * pxPerMm;
          let renderedHeight = 0;
      
          while (renderedHeight < canvas.height) {
            // Set up temp canvas to slice current page
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeight);
      
            const ctx = tempCanvas.getContext("2d");
            // Draw the relevant slice from main canvas onto temp canvas
            ctx.drawImage(
              canvas,
              0,
              renderedHeight,
              canvas.width,
              tempCanvas.height,
              0,
              0,
              canvas.width,
              tempCanvas.height
            );
            const imgData = tempCanvas.toDataURL("image/jpeg", 0.75);
      
            // Add to PDF
            pdf.addImage(
              imgData,
              "JPEG",
              margin,
              margin,
              pageWidth,
              (tempCanvas.height / pxPerMm)
            );
            renderedHeight += pageHeightPx;
            if (renderedHeight < canvas.height) pdf.addPage();
          }
      
          // continue with blob and attachment as before …
          const pdfBlob = pdf.output("blob");
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.readAsDataURL(pdfBlob);
          });
      
          const attachment = {
            filename: `${quotationDetail?.quotation_code || "quotation"}.pdf`,
            mimeType: "application/pdf",
            content: base64,
          };
      
          setPdfAttachment(attachment);
          if (setAttachments) {
            setAttachments([attachment]);
          }
        } catch (error) {
          console.error("Failed to generate PDF attachment:", error);
        }
      };
      
    if (quotationDetail) {
      setTimeout(() => {
        generatePdfAttachment();
      }, 500);
    }
  }, [quotationDetail]);
  
//   console.log("PDF size (approx):", (attachments?.[0]?.length * 3) / 4 / 1024, "KB");

  // Email handlers
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      const payload = {
        ...emailForm,
        record_id: id,
        model: "Quotation",
        attachments: pdfAttachment ? [pdfAttachment] : []
      };
console.log("payload")
      await dispatch(sendMail(payload));
      setPrevPdf(false)
      setAttachments([])
    //   toast.success('Email sent successfully!');
      setShowEmailForm(false);
      setEmailForm({
        to: quotationDetail?.quotation_vendor?.email || '',
        
        subject: `Quotation ${quotationDetail?.quotation_code} - ${quotationDetail?.quotation_vendor?.name}`,
        body: '',
      });
      
      dispatch(getAllMessage(id));
    } catch (err) {
      console.error('Mail send failed', err);
      setError('Failed to send email');
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "P": return "#007bff";
      case "C": return "#dc3545";
      case "O": return "#28a745";
      case "L": return "#6c757d";
      default: return "#343a40";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "P": return "Pending";
      case "C": return "Canceled";
      case "O": return "Open";
      case "L": return "Closed";
      default: return "Unknown";
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold text-primary mb-0">
              <FaFilePdf className="me-2" />
              Quotation Preview
            </h2>
            <div className="d-flex gap-2">
              <Button 
                type="primary" 
                icon={<FaDownload />}
                onClick={toPDF}
                className="d-flex align-items-center"
              >
                Download PDF
              </Button>
              <Button 
                type="default" 
                icon={<FaEnvelope />}
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="d-flex align-items-center"
              >
                {showEmailForm ? 'Hide Email Form' : 'Send Email'}
              </Button>
            </div>
          </div>
  {/* Email Form */}
  {showEmailForm && (
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-gradient text-white border-0"
                   style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 rounded-3 p-2 me-3">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Send Quotation Email</h4>
                      <p className="mb-0 opacity-75">Send quotation PDF to customer</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setShowEmailForm(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleEmailSubmit}>
                  {/* Recipient Fields */}
                  <div className="mb-4">
                    <div className="row align-items-center mb-3">
                      <div className="col-1">
                        <label className="form-label fw-bold mb-0">To:</label>
                      </div>
                      <div className="col-9">
                        <input
                          type="email"
                          name="to"
                          className="form-control form-control-lg"
                          placeholder="Enter recipient email"
                          value={emailForm.to}
                          onChange={handleEmailChange}
                          required
                        />
                      </div>
                    </div>

                   
                  </div>

                  {/* Subject */}
                  <div className="row align-items-center mb-4">
                    <div className="col-1">
                      <label className="form-label fw-bold mb-0">Subject:</label>
                    </div>
                    <div className="col-9">
                      <input
                        type="text"
                        name="subject"
                        className="form-control form-control-lg"
                        placeholder="Enter email subject"
                        value={emailForm.subject}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                   
                  </div>

                  {/* Attachment Info */}
                  <div className="mb-4">
                    <div className="alert alert-info d-flex align-items-center">
                      <MdAttachFile className="me-2" size={20} />
                      <span>
                        <strong>Attachment:</strong> {quotationDetail?.quotation_code}.pdf will be automatically attached
                      </span>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="mb-4 " 
                  
                  style={{ height: "400px",}}
                  >
                    <label className="form-label fw-semibold">Message Body</label>
                    <ReactQuill
                                  name="body"
                            id="body"
                            value={emailForm.body}
                            onChange={(value)=> setEmailForm((prev) => ({ ...prev, body: value }))}
                            placeholder='Write your message body...'
                            style={{ height: "300px",marginBottom:"30px"}}
                            modules={{
                              toolbar: [
                                [{ header: [1, 2,3,4,5,6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ script: 'sub' }, { script: 'super' }],
                                [{ indent: '-1' }, { indent: '+1' }],
                                [{ direction: 'rtl' }],
                                // [{ size: ['small', false, 'large', 'huge'] }],
                                [{ font: [] }],
                                ['link',],
                                ['link', 'image', 'video'],
                                [{ color: [] }, { background: [] }],
                                [{ align: [] }],
                                ['clean'],
                                ['code-block', 'blockquote'],
                                ['table'], // Table option if using custom modules/plugins
                              ],
                            }}
                          />
                    {/* <textarea
                      name="body"
                      className="form-control"
                      rows="6"
                      placeholder="Write your message..."
                      value={emailForm.body}
                      onChange={handleEmailChange}
                      style={{ minHeight: '150px' }}
                    /> */}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div>
                      <small className="text-muted">
                        <FaFilePdf className="me-1" />
                        PDF attachment ready
                      </small>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowEmailForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-4"
                        disabled={sending}
                        style={{ 
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          border: 'none'
                        }}
                      >
                        {sending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Send Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* PDF Preview */}
          <div className="card shadow-lg border-0 rounded-4 mb-4 position-relative overflow-none">
            <div ref={targetRef} id="pdf-preview-container"  className="card-body p-5 position-relative overflow-none" style={{overflow:"hidden"}}>
              {/* Status Badge */}
              <div
                className="position-absolute text-white fw-bold text-center"
                style={{
                  backgroundColor: getStatusColor(quotationDetail?.status),
                  left: "-50px",
                  position:"absolute",
                  padding: "10px 20px",
                  transform: "rotate(-45deg)",
                  width: "200px",
                  top: "30px",
                  fontSize: "14px",
                  letterSpacing: "1px"
                }}
              >
                {getStatusText(quotationDetail?.status)}
              </div>

              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-5 py-1">
                  <h1 className="display-6 fw-bold text-primary mb-0">QUOTATION</h1>
                  <p className="text-muted fs-5">#{quotationDetail?.quotation_code}</p>
                </div>
                <div className="text-end">
                  <div className="card bg-light border-0 p-3" style={{ minWidth: '250px' }}>
                    <div className="mb-2">
                      <span className="fw-bold text-dark">Issue Date:</span>
                      <span className="ms-2">{moment(quotationDetail?.createdate).format("DD-MM-YYYY")}</span>
                    </div>
                    <div>
                      <span className="fw-bold text-dark">Due Date:</span>
                      <span className="ms-2">{moment(quotationDetail?.due_date).format("DD-MM-YYYY")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="card h-100 border-0 bg-light shadow">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-3">
                        <i className="fas fa-file-invoice me-2"></i>Bill To
                      </h5>
                      <div className="text-break">
                        <div className="fw-semibold">{quotationDetail?.billto || "Not specified"}</div>
                        <div className="text-muted">{quotationDetail?.address || ""}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-0 bg-light shadow">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-3">
                        <i className="fas fa-shipping-fast me-2"></i>Ship To
                      </h5>
                      <div className="text-break">
                        <div className="fw-semibold">{quotationDetail?.shipto || "Same as Bill To"}</div>
                        <div className="text-muted">{quotationDetail?.address || ""}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-0 bg-dark-gradient shadow">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        <i className="fas fa-user me-2"></i>Customer
                      </h5>
                      <div className="text-break">
                        <div className="fw-semibold">{quotationDetail?.quotation_vendor?.name || ""}</div>
                        <div className="opacity-75">
                          {`${quotationDetail?.quotation_vendor?.billing_street || ""}${quotationDetail?.quotation_vendor?.billing_city ? ', ' + quotationDetail?.quotation_vendor?.billing_city : ""}${quotationDetail?.quotation_vendor?.state?.name ? ', ' + quotationDetail?.quotation_vendor?.state?.name : ""}${quotationDetail?.quotation_vendor?.country?.name ? ', ' + quotationDetail?.quotation_vendor?.country?.name : ""}${quotationDetail?.quotation_vendor?.billing_zipcode ? ', ' + quotationDetail?.quotation_vendor?.billing_zipcode : ""}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-3">
                <h4 className="fw-bold mb-4 text-primary">
                  <i className="fas fa-list me-2"></i>Quotation Items
                </h4>
                <div className="table-responsive">
                  <table className="table table-hover table-view">
                    <thead className="table-primary">
                      <tr>
                        <th className="fw-bold">Item</th>
                        <th className="fw-bold text-center">Qty</th>
                        <th className="fw-bold text-end">Price</th>
                        <th className="fw-bold text-end">Rate</th>
                        <th className="fw-bold text-center">Disc %</th>
                        <th className="fw-bold text-end">After Disc</th>
                        <th className="fw-bold text-end">Tax</th>
                        <th className="fw-bold text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemNumber.length > 0 && itemNumber.map((item, index) => (
                        <tr key={index}   className={`${item?.is_optional === "N" ? "" : "bg-optional"}`}>
                          <td   className={`${item?.is_optional === "N" ? "" : "bg-optional"}`}>
                            <div className="d-flex align-items-center">
                              <span className="text-capitalize">{item?.item_name}</span>
                              {item?.is_optional === "Y" && (
                                <span className="badge bg-success ms-2">Optional</span>
                              )}
                            </div>
                          </td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-center`}>{item?.quantity}</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-end`}>{formatNumber(item?.unit_price)}</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-end`}>{formatNumber(item?.rate)}</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-center`}>{item?.disc_prcnt}%</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-end`}>{formatNumber(item?.total_bef_disc)}</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-end`}>{formatNumber(item?.line_tax)} ({item?.tax_per}%)</td>
                          <td className={`${item?.is_optional === "N" ? "" : "bg-optional"} text-end fw-bold`}>{formatNumber(item?.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Section */}
              <div className="row justify-content-end mb-3">
                <div className="col-md-6">
                  <div className="card border-primary shadow-lg">
                    <div className="card-header border bg-teal shadow-lg text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-calculator me-2"></i>Summary
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Before Tax:</span>
                        <span className="fw-semibold">{formatNumber(quotationDetail?.total_bef_tax)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Discount:</span>
                        <span className="fw-semibold">{formatNumber(quotationDetail?.disc_prcnt)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>
                          Rounded
                          <input
                            type="checkbox"
                            className="ms-2"
                            checked={quotationDetail?.rounding === "Y"}
                            readOnly
                          />
                        </span>
                        <span className="fw-semibold">
                          {quotationDetail?.rounding === "Y"
                            ? formatNumber(quotationDetail?.rounding_amount)
                            : formatNumber(quotationDetail?.rounding_amount) || 0}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Tax Amount:</span>
                        <span className="fw-semibold">{formatNumber(quotationDetail?.tax_total) || 0}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="h5 fw-bold">Total Amount:</span>
                        <span className="h5 fw-bold text-primary">
                          {quotationDetail?.rounding === "Y"
                            ? formatNumber(quotationDetail?.rounding_amount)
                            : formatNumber(quotationDetail?.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              {quotationDetail?.terms && (
                <div className="mb-4">
                  <div className="card">
                    <div className="card-header bg-secondary text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-file-contract me-2"></i>Terms & Conditions
                      </h5>
                    </div>
                    <div className="card-body">
                      <div dangerouslySetInnerHTML={{ __html: JSON.parse(quotationDetail?.terms) }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Other Items */}
              {quotationDetail?.other_items && JSON.parse(quotationDetail?.other_items)?.map((value, index) => (
                <div key={index} className="mb-4">
                  <div className="card">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">{value?.category_name}</h5>
                    </div>
                    <div className="card-body">
                      {value?.crms_template_items?.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-2">{item?.description}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default PreviewPdf;