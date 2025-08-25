import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ManageOrderItemModal from "./ManageOrderItemModal";
import { updateQuotation } from "../../../redux/quotation";
import { addQuoteTemplate, updateQuoteTemplate } from "../../../redux/quoteTemplate";

const initialItem = [
  {
    parent_id: null,
    item_id: null,
    type:"product",
    description: "",
    quantity: 1,
  },
  {
    parent_id: null,
    item_id: null,
    type:"optional",
    description: "",
    quantity: 1,
  },
];

const AddQuotationModal = ({ order, setOrder }) => {
  const dispatch = useDispatch();
  const [itemNumber, setItemNumber] = useState(initialItem);
  const [otherItems, setOtherItems] = useState([{ label: "", descriptions: [""] }]);
  const [termsItems, setTermsItems] = useState();


const loading = false
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
      template_name: "",
      remarks: "",
    },
  });

  React.useEffect(() => {
    if (order) {
      reset({
        template_name: order?.template_name || "",
      });
      setTermsItems(order?.terms)
      setOtherItems(
        order?.crms_template_category
          ?.filter(
            item => item?.category_name !== "product" && item?.category_name !== "optional"
          )
          ?.map(item => ({
            label: item.category_name,
            template_master_id:item?.template_master_id,
            parent_id: item?.crms_template_items?.[0]?.parent_id || null,
            descriptions: item?.crms_template_items?.map(i =>i?.description)
          }))
      );
      setItemNumber(
        order?.crms_template_category
          ?.filter(item => item?.category_name === "product" || item?.category_name === "optional")
          ?.flatMap(item =>
            item?.crms_template_items?.map(i => ({
              parent_id: i?.parent_id || null,
              item_id: i?.item_id || null,
              type: item?.category_name || "",
              description: i?.description || "",
              quantity: Number(i?.qty) || 1,
            }))
          )
      );
    } else {
      reset({
        template_name: "",
      });
    }
  }, [order]);
 
  console.log("itemNumber ", itemNumber)

  const onSubmit = async (data) => {
    // if (itemNumber?.length) {
    //   var isEmpty = false;
    //   itemNumber?.map((value)=>{
    //       if(!value?.item_id){
    //         isEmpty= true
    //       }
    //     })
    //    if(isEmpty) {
    //     toast.error("Product items is not selected !");
    //    return;
    //   }
     
    // }
    // const productAndOptionalItems = itemNumber?.filter(
    //   (value) => value?.type === "product" || value?.type === "optional"
    // );
    const isEmpty = itemNumber.some((value) => !value?.item_id);
    if (isEmpty) {
      toast.error("Product or Optional item is not selected!");
      return;
    }
    const finalData = {
      template_name: data.template_name,
      remarks: data.remarks,
      data : [
        {
          items:itemNumber?.filter((value)=>value?.type=="product" && value?.item_id),
          type:"product"
        },
        {
          items:itemNumber?.filter((value)=>value?.type=="optional" && value?.item_id),
          type:"optional"
        },
        ...otherItems?.map((value)=>({
          category_name:value.label,
          type:"others",
          items:value?.descriptions?.map((val)=>({qty:null,description:val,item_id:null}))
        }))
        // {
        //   items:otherItems,
        // }
      ],
      // product:itemNumber?.filter((value)=>value?.type=="product" && value?.item_id),
      // optional:itemNumber?.filter((value)=>value?.type=="optional" && value?.item_id),
      // other:otherItems,
      terms:termsItems
    }
    console.log("Final Data 1: ",finalData)
    const closeButton = document.getElementById("close_add_edit_order");
    // const formData = new FormData();
    // Object.keys(data).forEach((key) => {
    //   if (data[key] !== null && data[key] !== undefined) {
    //     let value = data[key];
    //     if (
    //       (key === "due_date" || key === "apr_date") &&
    //       value instanceof Date
    //     ) {
    //       value = value.toISOString();
    //     }
    //     formData.append(key, value);
    //   }
    // });

    // formData.append("orderItemsData", JSON.stringify(itemNumber));
    // order && formData.append("id", order?.id);

    
    try {
      order
        ? await dispatch(updateQuoteTemplate({id:order?.id,data:finalData}))
        : await dispatch(addQuoteTemplate(finalData)).unwrap();
      // order ? await dispatch(updateOrder({id :order?.id,orderData : { orderData: formData,orderItemsData:JSON.stringify(itemNumber)}}))
      // :  await dispatch(addOrder({orderData: formData,orderItemsData:JSON.stringify(itemNumber)})).unwrap();

      closeButton.click();
      reset();
      setOtherItems([{ label: "", descriptions: [""] }])
      setTermsItems()
      setItemNumber([
        {
          parent_id: null,
          item_id: null,
          type:"product",
          description: "",
          quantity: 1,
        },
        {
          parent_id: null,
          item_id: null,
          type:"optional",
          description: "",
          quantity: 1,
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
        setOtherItems([{ label: "", descriptions: [""] }])
        setTermsItems()
        setItemNumber([
          {
            parent_id: null,
            item_id: null,
            type:"product",
            description: "",
            quantity: 1,
          },
          {
            parent_id: null,
            item_id: null,
            type:"optional",
            description: "",
            quantity: 1,
          },
        ]);
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
  console.log("items DAta 23: ",otherItems )
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_edit_quotation"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{order ? "Update " : "Add New "} Quotation Template</h4>
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
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="row">
              
            
              {/* Contact Person  */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Template Name<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter  Template Name"
                    className="form-control"
                    {...register("template_name", {
                      required: "Template Name to is required !",
                    })}
                  />
                  {errors.template_name && (
                    <small className="text-danger">
                      {errors.template_name.message}
                    </small>
                  )}
                </div>
              </div>
             
              {/* Order Items  */}
              <ManageOrderItemModal
                itemNumber={itemNumber}
                setItemNumber={setItemNumber}
                otherItems={otherItems}
                setOtherItems={setOtherItems}
                termsItems={termsItems}
                setTermsItems={setTermsItems}
              />
             
              
              
              {/* Description */}
              {/* <div className="col-md-12 mb-3">
                <div className="mb-0">
                  <label className="col-form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    {...register("remarks")}
                  />
                </div>
              </div> */}
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
      </div>
    </div>
  );
};

export default AddQuotationModal;
