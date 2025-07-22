import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchProducts } from "../../../redux/products";
import DefaultEditor from "react-simple-wysiwyg";
import ReactQuill from "react-quill";

const ManageOrderItemModal = ({
  itemNumber,
  setItemNumber,
  otherItems,
  setOtherItems,
  termsItems,
  setTermsItems,
}) => {
  const dispatch = useDispatch();
  const { control } = useForm();
  const [activeTab, setActiveTab] = useState("product");

  // // Separate state for Other and Terms
  // const [otherItems, setOtherItems] = useState([{ label: "", descriptions: [""] }]);
  // const [termsItems, setTermsItems] = useState();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products } = useSelector((state) => state.products);
  const productList = products?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
    unit_price: emnt.unit_price,
  }));

  const addNewColumn = () => {
    if (itemNumber?.length) {
      var isEmpty = false;
      itemNumber?.map((value) => {
        if (value?.type == activeTab && !value?.item_id) {
          isEmpty = true;
        }
      });
      if (isEmpty) {
        toast.error("Please fill the empty column first!");
        return;
      }
    }
    setItemNumber((prev) => [
      ...prev,
      {
        parent_id: null,
        item_id: null,
        type: activeTab,
        description: "",
        quantity: 1,
      },
    ]);
  };

  const updateItem = (index, field, value) => {
    setItemNumber((prev) => {
      const updatedItems = [...prev];
      updatedItems[index][field] = value;
      updatedItems[index]["type"] = activeTab;
      return updatedItems;
    });
  };

  const deleteRow = (index) => {
    setItemNumber((prev) => prev.filter((_, i) => i !== index));
  };

  // Other Handlers (same as before)
  const addOtherItem = () => {
    setOtherItems((prev) => [...prev, { label: "", descriptions: [""] }]);
  };

  const updateOtherLabel = (index, value) => {
    const updated = [...otherItems];
    updated[index].label = value;
    setOtherItems(updated);
  };

  const updateOtherDescription = (itemIdx, descIdx, value) => {
    const updated = [...otherItems];
    updated[itemIdx].descriptions[descIdx] = value;
    setOtherItems(updated);
  };

  const addOtherDescriptionField = (itemIdx) => {
    const updated = [...otherItems];
    updated[itemIdx].descriptions.push("");
    setOtherItems(updated);
  };
  const removeOtherItems = (index) => {
    setOtherItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removeOtherDescription = (itemIdx, descIdx) => {
    const updated = [...otherItems];
    updated[itemIdx].descriptions.splice(descIdx, 1);
    setOtherItems(updated);
  };
  const tabMap = {
    "Line Products": "product",
    "Optional Products": "optional",
    "terms & Conditions": "terms & Conditions",
    "Others": "other",
  };
  return (
    <div>
      {/* Tabs */}
      <ul
        style={{ backgroundColor: "#dbdbdb" }}
        className="nav text-white nav-tabs  mb-3"
      >
       {Object.keys(tabMap).map((tab) => (
    <li className="nav-item" key={tab}>
      <button
        type="button"
        style={{
          borderBottom: activeTab === tabMap[tab] ? "2px solid black" : "none",
        }}
        className={`nav-link text-black ${
          activeTab === tabMap[tab] ? "bg-primary text-white !important" : ""
        }`}
        onClick={() => setActiveTab(tabMap[tab])}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    </li>
  ))}
      </ul>

      {/* Product/Optional Tab */}
      {(activeTab === "product" || activeTab === "optional") && (
        <>
          {/* <div className="d-flex justify-content-between mb-2">
            <label className="fw-bold">
              {activeTab === "product" ? "Products" : "Optional Products"}
            </label>
            <Link to="#" className="label-add" onClick={addNewColumn}>
              <i className="ti ti-square-rounded-plus" /> Add New
            </Link>
          </div> */}
          <div className="table-responsive">
            <table className="table table-view">
              <thead>
                <tr>
                  <th className="p-1 px-3">Item</th>
                  <th className="p-1 px-3">Quantity</th>
                  <th className="p-1 px-3">Description</th>
                  <th className="p-1 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {itemNumber.map(
                  (i, index) =>
                    i?.type === activeTab && (
                      <tr key={index}>
                        <td>
                          <Controller
                            name={`item_id_${index}`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={productList}
                                onChange={(option) =>
                                  updateItem(index, "item_id", option?.value)
                                }
                                value={productList?.find(
                                  (option) => option.value === i?.item_id
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            )}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={i.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={i.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger-light"
                            onClick={() => deleteRow(index)}
                          >
                            <i className="ti ti-trash" />
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addNewColumn}
            className="btn btn-success-light"
          >
            + Add Choise
          </button>
        </>
      )}

      {/* Terms Tab */}
      {activeTab === "terms & Conditions" && (
        <div>
          <div className="card p-3 mb-3">
            {/* <div className="mb-2 d-flex"> */}
            {/* <DefaultEditor
  style={{ height: "250px" }} 
  className="summernote"
  value={termsItems}
  onChange={(content) => setTermsItems(content.target.value )}
/> */}
<ReactQuill
  value={termsItems}
  onChange={setTermsItems}
  // onChange={(content) => setTermsItems(content.target.value )}
  style={{ height: "350px", overflow: "scroll" }}
  modules={{
    toolbar: [
      [{ header: [1, 2,3,4,5,6, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['code-block', 'blockquote'],
      [{ 'align': [] }],
      ['table'], // Table option if using custom modules/plugins
    ],
  }}
/>
              {/* <textarea
                className="form-control"
                placeholder={`Description`}
                value={termsItems}
                onChange={(e) => setTermsItems(e.target.value)}
              /> */}
            {/* </div> */}
          </div>
        </div>
      )}

      {/* Other Tab */}
      {activeTab === "other" && (
        <div>
          {otherItems?.map((item, itemIdx) => (
            <div key={itemIdx} className="card position-relative p-3  mb-3 pt-5">
                <div
                      className=" text-danger border rounded-circle d-flex border-danger bg-danger justify-content-between  d-absolute top-0 mt-2"
                      style={{right:4  , position:'absolute'}}
                      onClick={() => removeOtherItems(itemIdx)}
                    >
                      <i className="ti ti-circle-x" style={{fontSize:"24px" , margin:"auto"}} />
                    </div>
              <div className="mb-2 d-flex justify-content-between">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Template Category"
                  value={item.label}
                  onChange={(e) => updateOtherLabel(itemIdx, e.target.value)}
                />
              </div>
              {item.descriptions?.map((desc, descIdx) => (
                <div key={descIdx} className="mb-2  align-items-center d-flex">
                  <textarea
                    className="form-control"
                    placeholder={`Description ${descIdx + 1}`}
                    value={desc}
                    onChange={(e) =>
                      updateOtherDescription(itemIdx, descIdx, e.target.value)
                    }
                  />
                  {item.descriptions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm h-25 btn-outline-danger ms-2"
                      onClick={() => removeOtherDescription(itemIdx, descIdx)}
                    >
                      <i className="ti ti-trash" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => addOtherDescriptionField(itemIdx)}
              >
                + Add Description
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOtherItem}
            className="btn btn-success-light"
          >
            + Add Other Item
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageOrderItemModal;
