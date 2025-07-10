import { Button } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Margin, usePDF } from "react-to-pdf";

const initialItem = [{
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
    total_amount:0
  }]

const PreviewPurchaseOrder = ({order,setOrder , formatNumber}) => {
  const [itemNumber, setItemNumber] = useState(initialItem);

React.useEffect(() => {
    if (order) {
      
setItemNumber(order?.invoice_items?.map((item)=>({
    parent_id:item?.parent_id || null,
    item_id:item?.item_id || null,
    item_name:item?.item_name || "",
    quantity:Number(item?.quantity) || 1,
    delivered_qty:Number(item?.delivered_qty) || 0,
    unit_price:Number(item?.unit_price) || 0,
    currency:Number(item?.currency) || null,
    rate:Number(item?.rate) || 0,
    disc_prcnt:Number(item?.disc_prcnt) || 0,
    disc_amount:Number(item?.disc_amount) || 0,
    tax_id:Number(item?.tax_id) || null,
    tax_per:Number(item?.tax_per) || 0.0,
    line_tax:Number(item?.line_tax) || 0,
    total_bef_disc:Number(item?.total_bef_disc) || 0,
    total_amount:Number(item?.total_amount) ||0
})))
    } 
  }, [order]);
  

  React.useEffect(() => {
        const offcanvasElement = document.getElementById("offcanvas_preview_sales_invoice");
        if (offcanvasElement) {
          const handleModalClose = () => {
            setOrder();
            setItemNumber(initialItem)
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



  // Function to download PDF
  const { toPDF, targetRef } = usePDF({
    filename: `${order?.order_code}.pdf`,
    page: { margin: Margin.MEDIUM },
  })

  return (
    <div
    
    className="offcanvas offcanvas-end offcanvas-large "
    tabIndex={-1}
    id="offcanvas_preview_sales_invoice"
  >
    <div   className=" border-bottom offcanvas-header justify-content-between">
      <div className="d-flex">
      <h4>Preview sales invoice</h4>
      <span className="text-primary h5 mx-2 fw-bold">#{order?.order_code}</span>
      </div>
      <div className="d-flex align-items-center" >
      <Button className="bg-success" variant="solid" onClick={toPDF}><i  className="ti ti-download" />Download</Button>
      <button
        type="button"
        className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
          id="close_add_edit_order"
      >
        <i className="ti ti-x" />
      </button>
      </div>
    </div>
    <div ref={targetRef} style={{minHeight:"100vh"}}  className="position-relative offcanvas-body">
    <form>
        <div>
        <span
  // className={`position-absolute text-white text-center px-2 py-1 -rotate-45 top-7 start-0 translate-middle bg-${
  //   order?.status === "P"
  //     ? "warning"
  //     : order?.status === "C"
  //     ? "danger"
  //     : order?.status === "O"
  //     ? "success"
  //     : "secondary"
  // }`}
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
    width: "10rem",
    top: "20px",
  }}
>
  {order?.status === "L" ? "Closed" : order?.status === "C" ? "Canceled" : order?.status === "P" ? "Pending" : "Open"}
</span>

          <div className="text-end mb-3" >
          <div className="fw-bold  h1">Sales Invoice</div>
         
          <div className=" text-start" style={{width:"27%",marginLeft:"73%"}}>
          <div className=""> <span className="fw-semibold h5" >Code : </span>  <span className="text-primary h4">#{order?.order_code}</span>  </div>
          <div className=""> <span className="fw-semibold h5" >Due Date : </span><span>{moment(new Date(order?.due_date)).format("DD-MM-YYYY")}</span></div>
          <div className=""> <span className="fw-semibold h5" >Order Date : </span><span>{moment(new Date(order?.createdate)).format("DD-MM-YYYY")}</span></div>
          {/* <div className=""> <span className="fw-semibold h5" >Status : </span><span>{order?.status === "L" ? "Closed" : order?.status === "L" ? "Canceled" : order?.status === "P" ? "Pending" : "Open"}</span></div> */}
          
          </div></div>
          <div className="row">
            <div className="col-md-4 ">
            <div className="text-break">
                <label className="h5 ">   Bill To </label>
                <div> {order?.billto  || ""}</div>
                <div> {order?.address  || ""}</div>
            </div>
            </div>

            <div className="col-md-4 " style={{paddingLeft:"10%"}}>
            <div className="text-break">
                <label className=" h5"> Ship To</label>
                <div> {order?.shipto || ""}</div>
                <div> {order?.address || ""}</div>
            </div>
            </div>

            <div className="col-md-4 text-start " style={{paddingLeft:"7%"}}>
            <div className="text-break">
                <label className="h5">Customer</label> 
                <div> {order?.invoice_vendor?.name  || ""}</div>
                <div>{` ${order?.invoice_vendor?.billing_street  || ""},${order?.invoice_vendor?.billing_city || ""}, ${order?.invoice_vendor?.state?.name  || ""}, ${order?.invoice_vendor?.country?.name || ""}, ${order?.invoice_vendor?.billing_zipcode || ""}`}</div>
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
            
              
                 {/* Order Items  */}
                 <div>
      <div className="col-md-12 mt-3 ">
        <div className="mb-1 d-flex justify-content-between">
          <label className="h4 fw-bold">Order items</label>
          
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
                  <td>
                    <div className="input-table input-table-descripition">
                     {i?.item_name}
                    </div>
                  </td>
                  
                  <td>
                    <div className="input-table">
                     {i?.quantity}
                    </div>
                  </td>

                  <td>
                    <div className="input-table">
                    {i?.unit_price}
                    </div>
                  </td>
                  
                  <td>
                    <div className="input-table">
                  {formatNumber(i?.rate)}
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                    {i?.disc_prcnt}%
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                    {formatNumber(i?.total_bef_disc)}
                    </div>
                  </td>
                  <td style={{width:"auto"}}>
                    <div className="input-table">
                    {formatNumber(i?.line_tax)} ({i?.tax_per}%)
                    </div>
                  </td>
                  <td>
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
              <ul className="mb-3  " style={{width:"30%" ,lineHeight:".5"}}>
                <li>
                  <h5>Total Befor Tax</h5>
                 {formatNumber(order?.total_bef_tax)}
                </li>
                <li>
                  <h5>Total Discount </h5>
               {formatNumber(order?.disc_prcnt)}
                </li>
                <li>
                  <h5>Rounded  
                  <input
                   type="checkbox"
                   className="mx-3"
                  
                   checked={order?.rounding === "N" ? false : true}
                 /> </h5>

             {formatNumber(order?.rounding_amount) || 0}
                </li>
                <li>
                  <h5>Total tax amount</h5>
                  {formatNumber(order?.tax_total) || 0}
                </li>
                <li>
                  <h5 >Total Amount</h5>
                <span className="fw-bold">{order?.rounding === "Y" ? formatNumber(order?.rounding_amount) :formatNumber(order?.total_amount)}</span>
                </li>
              </ul>
           
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
  );
};

export default PreviewPurchaseOrder;
