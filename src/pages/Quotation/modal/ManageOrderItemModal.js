import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchTaxSetup } from "../../../redux/taxSetUp";
import DefaultEditor from "react-simple-wysiwyg";
import ReactQuill from "react-quill";

const ManageOrderItemModal = ({ itemNumber, setItemNumber , productList,termsItems,setTermsItems , optionalItem, setOptionalItem}) => {
    const [activeTab, setActiveTab] = useState("product");
  const dispatch = useDispatch();
  const formatNumber = (num) => {
    if (num === 0 || isNaN(num)) {
      return '0';
    }
    const number = parseFloat(num);
    if (Number.isInteger(number)) {
      return number;
    }
    return number.toFixed(2);
  };
  

  const addNewColumn = () => {
    if(!itemNumber[itemNumber?.length-1]?.item_id){
      toast.error("Please Fill the emplty column first !")
      return
    }
    setItemNumber((prev) => [
      ...prev,
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
        total_amount:0,
        is_optional:"N"
      },
    ]);
  };
  const syncProductLine = (index,data) => {
    if(!itemNumber[itemNumber?.length-1]?.item_id){
      toast.error("Please Fill the emplty column first !")
      return
    }

    setItemNumber((prev) => [
      ...prev,
      {
        parent_id: null,
        item_id: data?.item_id || null,
        item_name: data?.item_name || "",
        quantity: data?.quantity || 1,
        delivered_qty: 0,
        unit_price: data?.unit_price ||0 ,
        currency: null,
        rate: data?.rate || 0,
        disc_prcnt: 0,
        disc_amount: 0,
        tax_id: null,
        tax_per: 0.0,
        line_tax: 0,
        total_bef_disc: data?.total_bef_disc || 0,
        total_amount: data?.total_amount || 0,
    is_optional:"Y"
      },
    ]);
    deleteOptionalRow(index)

  };

  const updateItem = (index, field, value) => {
    setItemNumber((prev) => {
      const updatedItems = [...prev];
      updatedItems[index][field] = value;
      return updatedItems;
    });
  };

  const deleteRow = (data,index) => {
     
    setItemNumber((prev) => prev.filter((_, i) => i !== index));
    if(data?.is_optional == "Y")
    {
      setOptionalItem((prev) => [
        ...prev,
        {
          parent_id: data?.parent_id ||  null,
          item_id: data?.item_id,
          item_name: data?.item_name,
          quantity: data?.quantity,
          delivered_qty: data?.delivered_qty || 0,
          unit_price: data?.unit_price,
          currency: data?.currency || null,
          rate: data?.rate,
          disc_prcnt:data?.disc_prcnt || 0,
          disc_amount:data?.disc_amount || 0,
          tax_id: data?.tax_id || null,
          tax_per:data?.tax_per || 0.0,
          line_tax: data?.line_tax || 0 ,
          total_bef_disc: data?.total_bef_disc,
          total_amount:data?.total_amount,
        },
      ])
    }
  };
  const deleteOptionalRow = (index) => {
    setOptionalItem((prev) => prev.filter((_, i) => i !== index));
  };
  const { loading } = useSelector((state) => state.products);

  const { control } = useForm();
  useEffect(() => {
    dispatch(fetchTaxSetup({is_active:"Y"}));
    dispatch(fetchCurrencies({is_active:"Y"}));
  }, [dispatch]);

  const { manufacturers, loading: loadingTax } = useSelector(
    (state) => state.manufacturers
  );
  const { currencies, loading: loadingCurrency } = useSelector(
    (state) => state.currency
  );
  const { taxs, loading: loadingTAx } = useSelector((state) => state.taxs);


  const manufacturerList = manufacturers?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const CurrencyList = currencies.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const TaxList = taxs.map((emnt) => ({
    value: emnt.id,
    label: emnt.name + " (" + emnt.rate + "%)",
    tax:emnt.rate
  }));
  const selectedIds = useMemo(
    () =>
      new Set(
        itemNumber
          ?.map((item) => item.item_id)
          ?.filter((id) => id !== null && id !== undefined)
      ),
    [itemNumber]
  );
  const getFilteredOptions = (currentItemId) =>
    productList?.filter(
      (opt) => !selectedIds?.has(opt.value) || opt.value === currentItemId
    );
  
  
  const tabMap = {
    "Line Products": "product",
    // "Optional Products": "optional",
    "terms & Conditions": "terms & Conditions",
  };
  // console.log("TERms ",termsItems)
  return (<>
    <div>
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
    {activeTab == "product" && <div>
      <div className="col-md-12 ">
        <div className="mb-1 d-flex justify-content-between">
          {/* <label className="col-form-label fw-bold">Quotation items</label> */}
          <div></div>
          <Link
            to="#"
            className="label-add"
            // data-bs-toggle="modal"
            //  data-bs-target="#myOrderItemModal"
            onClick={addNewColumn}
          >
            <i className="ti ti-square-rounded-plus" />
            Add New
          </Link>
        </div>
      </div>
      <div className="table-responsive w-full overflow-x-auto">
        <table  className="table table-view   mb-0">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Rate</th>
              <th>Discount(%)</th>
              <th>Price Aft Disc</th>
              <th>Tax</th>
              <th>Total Tax</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemNumber.length &&
              itemNumber?.map((i, index) => (
                <tr>
                  <td className={`${i?.is_optional === "Y" ? "bg-optional": ""}`}>
                    <div className="input-table input-table-descripition">
                      <Controller
                        name="item_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            // options={productList}
                            options={getFilteredOptions(i?.item_id)}
                            placeholder="Select..."

                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              let rate = selectedOption?.unit_price * i?.quantity || 0 ;
                              let disc_amount = (rate * i.disc_prcnt)/100
                              let total_bef_disc = rate - disc_amount
                              let line_tax = (total_bef_disc * i?.tax_per)/100  || 0 ;
                              updateItem(index, "item_id", selectedOption?.value || null  );
                              updateItem(index, "item_name", selectedOption?.label || null  );
                              updateItem(index, "unit_price",  selectedOption?.unit_price || 0 );
                              updateItem(index, "rate",rate );
                              updateItem(index, "line_tax", line_tax);
                              updateItem(index, "total_bef_disc",total_bef_disc);
                              updateItem(index, "total_amount",total_bef_disc + line_tax);
                              updateItem(index, "disc_amount",disc_amount );
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={   productList?.find( (option) => option.value === i?.item_id ) || "" }
                            // value={i?.item_id}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided,   zIndex: 9999,  }),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                            {i?.is_optional ==="Y" &&   <div className="badge ms-2 badge-soft-success">Optional</div>}

                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                      <input
                        name="quantity"
                        type="number"
                        value={i.quantity}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove leading zeros, but keep a single zero if it's the only value
                          if (/^0\d+/.test(value)) {
                            value = value.replace(/^0+/, "");
                            if (value === "") value = "0";
                          }
                          let rate = i?.unit_price * value || 0
                          let disc_amount = (rate * i.disc_prcnt)/100
                          let total_bef_disc =  rate - disc_amount|| 0
                          let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                          updateItem(  index, "total_amount",total_bef_disc - line_tax );
                          updateItem(  index, "disc_amount",disc_amount );
                          updateItem(index, "quantity", value || 0);
                          updateItem(index, "rate",rate );
                          updateItem( index, "line_tax",  line_tax  );
                          updateItem( index, "total_bef_disc",  total_bef_disc || 0  );
                        }}
                      />
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                      <input
                        name="unit_price"
                        type="number"
                        placeholder="0.0"
                        value={i?.unit_price}
                        disabled
                      />
                    </div>
                  </td>

                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                      <input name="rate" type="text" disabled value={i?.rate} />
                    </div>
                  </td>
                  
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                    <input name="disc_prcnt" type="number" value={i?.disc_prcnt} onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;
                        if (value > 100) value = i.disc_prcnt;
                        e.target.value = value; 

                        let disc_amount = (i.rate * e.target.value)/100
                        let total_bef_disc = i.rate - disc_amount
                        let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                        updateItem(  index, "total_amount",total_bef_disc + line_tax );
                        updateItem(  index, "disc_amount",disc_amount );
                        updateItem( index,"disc_prcnt",e.target.value || 0);
                        updateItem( index,"total_bef_disc",total_bef_disc);
                        updateItem( index,"line_tax",line_tax);

                    }} />
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                      <input name="total_bef_disc"  type="number" value={i?.total_bef_disc} disabled />
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                    <Controller
                        name="tax_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={TaxList}
                            placeholder="Select Tax"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              
                              let line_tax = (i.total_bef_disc * selectedOption?.tax)/100  || 0 ;
                              updateItem(  index, "total_amount",i.total_bef_disc + line_tax );
                              updateItem(index,"tax_id",selectedOption?.value || null );
                              updateItem(index,"line_tax",line_tax);
                              updateItem( index,"tax_per",selectedOption?.tax || 0);
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={ TaxList?.find(  (option) => option.value === i?.tax_id ) || "" }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <div className="input-table">
                      <input name="line_tax" type="text" value={ formatNumber(i?.line_tax)} disabled/>
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`} style={{width:"auto"}}>
                    <div className="input-table">
                      <input width={{width:"auto"}} type="text" value={formatNumber(i?.total_amount)} disabled  />
                    </div>
                  </td>
                  <td className={`${i?.is_optional === "Y"? "bg-optional": ""}`}>
                    <button
                      onClick={() => deleteRow(i,index)}
                      type="button"
                      className="btn btn-danger-light "
                    >
                      <i
                        className="ti ti-trash "
                        style={{ fontSize: "15px" }}
                      />
                    </button>
                    {/* <Link to="#" className="btn btn-success-light">
                        <i className="ti ti-check" />
                      </Link> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>}
    {activeTab == "optional" ? <div>
      <div className="col-md-12 ">
        <div className="mb-1 d-flex justify-content-between">
          {/* <label className="col-form-label fw-bold">Quotation items</label> */}
          <div></div>
          {/* <Link
            to="#"
            className="label-add"
            // data-bs-toggle="modal"
            //  data-bs-target="#myOrderItemModal"
            onClick={addNewColumn}
          >
            <i className="ti ti-square-rounded-plus" />
            Add New
          </Link> */}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-view">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {optionalItem.length > 0 &&
              optionalItem?.map((i, index) => (
                <tr>
                  <td>
                    <div className="input-table input-table-descripition">
                      <Controller
                        name="item_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={productList}
                            placeholder="Select..."

                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              let rate = selectedOption?.unit_price * i?.quantity || 0 ;
                              let disc_amount = (rate * i.disc_prcnt)/100
                              let total_bef_disc = rate - disc_amount
                              let line_tax = (total_bef_disc * i?.tax_per)/100  || 0 ;
                              updateItem(index, "item_id", selectedOption?.value || null  );
                              updateItem(index, "item_name", selectedOption?.label || null  );
                              updateItem(index, "unit_price",  selectedOption?.unit_price || 0 );
                              updateItem(index, "rate",rate );
                              updateItem(index, "line_tax", line_tax);
                              updateItem(index, "total_bef_disc",total_bef_disc);
                              updateItem(index, "total_amount",total_bef_disc + line_tax);
                              updateItem(index, "disc_amount",disc_amount );
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={   productList?.find( (option) => option.value === i?.item_id ) || "" }
                            // value={i?.item_id}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided,   zIndex: 9999,  }),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="quantity"
                        type="number"
                        value={i.quantity}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove leading zeros, but keep a single zero if it's the only value
                          if (/^0\d+/.test(value)) {
                            value = value.replace(/^0+/, "");
                            if (value === "") value = "0";
                          }
                          let rate = i?.unit_price * value || 0
                          let disc_amount = (rate * i.disc_prcnt)/100
                          let total_bef_disc =  rate - disc_amount|| 0
                          let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                          updateItem(  index, "total_amount",total_bef_disc - line_tax );
                          updateItem(  index, "disc_amount",disc_amount );
                          updateItem(index, "quantity", value || 0);
                          updateItem(index, "rate",rate );
                          updateItem( index, "line_tax",  line_tax  );
                          updateItem( index, "total_bef_disc",  total_bef_disc || 0  );
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="unit_price"
                        type="number"
                        placeholder="0.0"
                        value={i?.unit_price}
                        disabled
                      />
                    </div>
                  </td>

                  {/* <td>
                    <div className="input-table">
                      <input name="rate" type="text" disabled value={i?.rate} />
                    </div>
                  </td>
                  
                  <td>
                    <div className="input-table">
                    <input name="disc_prcnt" type="number" value={i?.disc_prcnt} onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;
                        if (value > 100) value = i.disc_prcnt;
                        e.target.value = value; 

                        let disc_amount = (i.rate * e.target.value)/100
                        let total_bef_disc = i.rate - disc_amount
                        let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                        updateItem(  index, "total_amount",total_bef_disc + line_tax );
                        updateItem(  index, "disc_amount",disc_amount );
                        updateItem( index,"disc_prcnt",e.target.value || 0);
                        updateItem( index,"total_bef_disc",total_bef_disc);
                        updateItem( index,"line_tax",line_tax);

                    }} />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="total_bef_disc"  type="number" value={i?.total_bef_disc} disabled />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                    <Controller
                        name="tax_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={TaxList}
                            placeholder="Select Tax"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              
                              let line_tax = (i.total_bef_disc * selectedOption?.tax)/100  || 0 ;
                              updateItem(  index, "total_amount",i.total_bef_disc + line_tax );
                              updateItem(index,"tax_id",selectedOption?.value || null );
                              updateItem(index,"line_tax",line_tax);
                              updateItem( index,"tax_per",selectedOption?.tax || 0);
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={ TaxList?.find(  (option) => option.value === i?.tax_id ) || "" }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="line_tax" type="text" value={ formatNumber(i?.line_tax)} disabled/>
                    </div>
                  </td> */}
                  <td style={{width:"auto"}}>
                    <div className="input-table">
                      <input width={{width:"auto"}} type="text" value={formatNumber(i?.total_amount)} disabled  />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                    <button
                      onClick={() => syncProductLine(index,i)}
                      type="button"
                      className="btn btn-success-light "
                    >
                      <i
                        className="ti ti-plus "
                        style={{ fontSize: "20px",fontWeight:700 }}
                      />
                    </button>
                    <button
                      onClick={() => deleteOptionalRow(index)}
                      type="button"
                      className="btn btn-danger-light "
                    >
                      <i
                        className="ti ti-trash "
                        style={{ fontSize: "15px" }}
                      />
                    </button>
                    </div>
                    {/* <Link to="#" className="btn btn-success-light">
                        <i className="ti ti-check" />
                      </Link> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div> : ""}
    {activeTab == "terms & Conditions" && 
    <div>
           {/* <DefaultEditor
  style={{ height: "350px" ,overflow:"scroll"}} 
  className="summernote"
  value={termsItems}
  onChange={(content) => setTermsItems(content.target.value )}
/> */}
<ReactQuill
  value={termsItems}
  onChange={setTermsItems}
  style={{ height: "350px", overflow: "scroll"}}
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
    </div>}
    </div>
   {optionalItem?.length > 0 &&  <div className="accordion mt-2 mb-2" id="optionalProductAccordion">
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingOptional">
      <button
        className="accordion-button bg-optional1  text-white collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseOptional"
        aria-expanded="false"
        aria-controls="collapseOptional"
      >
      <span className="h5">  Optional Products</span>
      </button>
    </h2>
    <div
      id="collapseOptional"
      className="accordion-collapse collapse show"
      aria-labelledby="headingOptional"
      data-bs-parent="#optionalProductAccordion"
      aria-expanded="true"
      aria-controls="collapseOptional"
    >
      <div className="accordion-body">
        <div className="table-responsive">
          <table className="table table-view">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {optionalItem.length > 0 &&
              optionalItem?.map((i, index) => (
                <tr>
                  <td>
                    <div className="input-table input-table-descripition">
                      <Controller
                        name="item_id"
                        control={control}
                        disabled={true}
                        render={({ field }) => (
                          <input
                          name="item_id"
                          className="w-100"
                          type="text"
                          value={i.item_name}
                          disabled={true}
                          />
                          // <Select
                          //   {...field}
                          //   options={productList}
                          //   placeholder="Select..."

                          //   className="select2"
                          //   classNamePrefix="react-select"
                          //   disabled={true}
                          //   // onChange={(selectedOption) => {
                          //   //   let rate = selectedOption?.unit_price * i?.quantity || 0 ;
                          //   //   let disc_amount = (rate * i.disc_prcnt)/100
                          //   //   let total_bef_disc = rate - disc_amount
                          //   //   let line_tax = (total_bef_disc * i?.tax_per)/100  || 0 ;
                          //   //   updateItem(index, "item_id", selectedOption?.value || null  );
                          //   //   updateItem(index, "item_name", selectedOption?.label || null  );
                          //   //   updateItem(index, "unit_price",  selectedOption?.unit_price || 0 );
                          //   //   updateItem(index, "rate",rate );
                          //   //   updateItem(index, "line_tax", line_tax);
                          //   //   updateItem(index, "total_bef_disc",total_bef_disc);
                          //   //   updateItem(index, "total_amount",total_bef_disc + line_tax);
                          //   //   updateItem(index, "disc_amount",disc_amount );
                          //   //   field.onChange(selectedOption?.value || null);
                          //   // }}
                          //   value={   productList?.find( (option) => option.value === i?.item_id ) || "" }
                          //   // value={i?.item_id}
                          //   styles={{
                          //     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          //     menu: (provided) => ({ ...provided,   zIndex: 9999,  }),
                          //   }}
                          //   menuPortalTarget={document.body}
                          // />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="quantity"
                        type="number"
                        value={i.quantity}
                        disabled={true}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove leading zeros, but keep a single zero if it's the only value
                          if (/^0\d+/.test(value)) {
                            value = value.replace(/^0+/, "");
                            if (value === "") value = "0";
                          }
                          let rate = i?.unit_price * value || 0
                          let disc_amount = (rate * i.disc_prcnt)/100
                          let total_bef_disc =  rate - disc_amount|| 0
                          let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                          updateItem(  index, "total_amount",total_bef_disc - line_tax );
                          updateItem(  index, "disc_amount",disc_amount );
                          updateItem(index, "quantity", value || 0);
                          updateItem(index, "rate",rate );
                          updateItem( index, "line_tax",  line_tax  );
                          updateItem( index, "total_bef_disc",  total_bef_disc || 0  );
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input
                        name="unit_price"
                        type="number"
                        placeholder="0.0"
                        value={i?.unit_price}
                        disabled
                      />
                    </div>
                  </td>

                  {/* <td>
                    <div className="input-table">
                      <input name="rate" type="text" disabled value={i?.rate} />
                    </div>
                  </td>
                  
                  <td>
                    <div className="input-table">
                    <input name="disc_prcnt" type="number" value={i?.disc_prcnt} onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;
                        if (value > 100) value = i.disc_prcnt;
                        e.target.value = value; 

                        let disc_amount = (i.rate * e.target.value)/100
                        let total_bef_disc = i.rate - disc_amount
                        let line_tax = (total_bef_disc * i?.tax_per)/100  || 0;
                        updateItem(  index, "total_amount",total_bef_disc + line_tax );
                        updateItem(  index, "disc_amount",disc_amount );
                        updateItem( index,"disc_prcnt",e.target.value || 0);
                        updateItem( index,"total_bef_disc",total_bef_disc);
                        updateItem( index,"line_tax",line_tax);

                    }} />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="total_bef_disc"  type="number" value={i?.total_bef_disc} disabled />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                    <Controller
                        name="tax_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={TaxList}
                            placeholder="Select Tax"
                            className="select2"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              
                              let line_tax = (i.total_bef_disc * selectedOption?.tax)/100  || 0 ;
                              updateItem(  index, "total_amount",i.total_bef_disc + line_tax );
                              updateItem(index,"tax_id",selectedOption?.value || null );
                              updateItem(index,"line_tax",line_tax);
                              updateItem( index,"tax_per",selectedOption?.tax || 0);
                              field.onChange(selectedOption?.value || null);
                            }}
                            value={ TaxList?.find(  (option) => option.value === i?.tax_id ) || "" }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.body}
                          />
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-table">
                      <input name="line_tax" type="text" value={ formatNumber(i?.line_tax)} disabled/>
                    </div>
                  </td> */}
                  <td style={{width:"auto"}}>
                    <div className="input-table">
                      <input width={{width:"auto"}} type="text" value={formatNumber(i?.total_amount)} disabled  />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                    <button
                      onClick={() => syncProductLine(index,i)}
                      type="button"
                      className="btn btn-success-light "
                    >
                      <i
                        className="ti ti-plus "
                        style={{ fontSize: "20px",fontWeight:700 }}
                      />
                    </button>
                    <button
                      onClick={() => deleteOptionalRow(index)}
                      type="button"
                      className="btn btn-danger-light "
                    >
                      <i
                        className="ti ti-trash "
                        style={{ fontSize: "15px" }}
                      />
                    </button>
                    </div>
                    {/* <Link to="#" className="btn btn-success-light">
                        <i className="ti ti-check" />
                      </Link> */}
                  </td>
                </tr>
              ))}
              {optionalItem?.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No optional products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>}

</>
  );
};

export default ManageOrderItemModal;
