import React, { memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import { addAttachment, updateAttachment } from "../../../../redux/attachment";

const AddFiles = ({ data, setData, type, type_id, type_name }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      related_entity_type: type,
      related_entity_id: type_id,
      related_entity_name: type_name,
      filename: "",
      description: "",
      file_type: "",
      file: "",
    },
  });

  React.useEffect(() => {
    if (data) {
      setSelectedFile(data?.file);
      reset({
        related_entity_type: data?.related_entity_type || type,
        related_entity_id: data?.related_entity_id || type_id,
        related_entity_name: data?.related_entity_name || type_name,
        filename: data?.filename || "",
        description: data?.description || "",
        file_type: data?.file_type || "",
        file: data?.file || "",
      });
    } else {
      reset({
        related_entity_type: type,
        related_entity_id: type_id,
        related_entity_name: type_name,
        filename: "",
        description: "",
        file_type: "",
        file: "",
      });
    }
  }, [data]);

  const { loading } = useSelector((state) => state?.attachments);

  const onSubmit = async (datas) => {
    console.log("Submitted Data :", datas);
    const closeButton = document.getElementById("offcanvas_add_files_close");
    const formData = new FormData();
    
    Object.keys(datas).forEach((key) => {
      if (datas[key] !== null && key !== "file") {
        formData.append(key, datas[key]);
      }
    });

    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    if (data?.id) {
      formData.append("id", Number(data?.id));
    }
    
    try {
      await dispatch(
        data ? updateAttachment(formData) : addAttachment(formData)
      ).unwrap();
      reset();
      closeButton.click();
      setData(null);
    } catch (error) {
      closeButton.click();
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("new_file");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setData(null);
        resetFileInput();
        reset();
      };
      offcanvasElement.addEventListener("hidden.bs.modal", handleModalClose);
      return () => {
        offcanvasElement.removeEventListener("hidden.bs.modal", handleModalClose);
      };
    }
  }, []);

  const handleFileSelect = (file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      
      if (file.size > maxSize) {
        alert("File size exceeds 5 MB. Please select a smaller file.");
        return;
      }
      
      setSelectedFile(file);
      // Auto-fill filename if empty
      if (!watch("filename")) {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        reset({ ...watch(), filename: nameWithoutExtension });
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const colors = {
      pdf: '#dc2626',
      doc: '#2563eb',
      docx: '#2563eb',
      xls: '#16a34a',
      xlsx: '#16a34a',
      jpg: '#7c3aed',
      jpeg: '#7c3aed',
      png: '#7c3aed',
      gif: '#7c3aed'
    };
    return colors[extension] || '#6b7280';
  };

  const isFileSizeValid = selectedFile ? selectedFile.size <= 5 * 1024 * 1024 : true;

  return (
    <div
      className="modal custom-modal fade custom-modal-two modal-padding"
      id="new_file"
      role="dialog"
      style={{ zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
        <div 
          className="modal-content" 
          style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Enhanced Modal Header */}
          <div 
            className="modal-header"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '24px'
            }}
          >
            <div className="d-flex align-items-center w-100">
              <div 
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px'
                }}
              >
                <Upload size={20} color="#2563eb" />
              </div>
              <div className="flex-grow-1">
                <h5 className="modal-title mb-1" style={{ color: '#1f2937', fontWeight: '600' }}>
                  {data ? 'Update File' : 'Upload New File'}
                </h5>
                <p className="mb-0" style={{ color: '#6b7280', fontSize: '14px' }}>
                  Add documents and attachments to {type_name}
                </p>
              </div>
              <button
                type="button"
                id="offcanvas_add_files_close"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                <X size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </button>
            </div>
          </div>

          <div className="modal-body" style={{ padding: '32px' }}>
            <div onSubmit={handleSubmit(onSubmit)}>
              {/* Document Info Section */}
              <div 
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <h6 className="d-flex align-items-center mb-3" style={{ color: '#374151', fontWeight: '500' }}>
                  <File size={16} className="me-2" />
                  Document Information
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: '#374151', fontWeight: '500' }}>
                      Document Type <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Contract, Invoice, Report"
                      className="form-control"
                      style={{
                        border: errors.file_type ? '2px solid #fca5a5' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '12px',
                        fontSize: '14px'
                      }}
                      {...register("file_type", {
                        required: "Document Type is required!",
                      })}
                    />
                    {errors.file_type && (
                      <div className="d-flex align-items-center mt-1">
                        <AlertCircle size={16} color="#dc2626" className="me-1" />
                        <small style={{ color: '#dc2626' }}>
                          {errors.file_type.message}
                        </small>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: '#374151', fontWeight: '500' }}>
                      Document Title <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter descriptive title"
                      className="form-control"
                      style={{
                        border: errors.filename ? '2px solid #fca5a5' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '12px',
                        fontSize: '14px'
                      }}
                      {...register("filename", {
                        required: "Document Title is required!",
                      })}
                    />
                    {errors.filename && (
                      <div className="d-flex align-items-center mt-1">
                        <AlertCircle size={16} color="#dc2626" className="me-1" />
                        <small style={{ color: '#dc2626' }}>
                          {errors.filename.message}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced File Upload Section */}
              <div className="mb-4">
                <label className="form-label mb-3" style={{ color: '#374151', fontWeight: '500' }}>
                  Upload Attachment {!data && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
                
                <div 
                  style={{
                    border: dragActive 
                      ? '2px dashed #60a5fa' 
                      : selectedFile 
                        ? isFileSizeValid 
                          ? '2px dashed #34d399' 
                          : '2px dashed #f87171'
                        : '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: dragActive 
                      ? '#eff6ff' 
                      : selectedFile 
                        ? isFileSizeValid 
                          ? '#f0fdf4' 
                          : '#fef2f2'
                        : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !selectedFile && fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div>
                      <div className="d-flex align-items-center justify-content-center mb-3">
                        <File size={48} color={getFileIcon(selectedFile.name)} />
                      </div>
                      <div>
                        <p className="mb-1" style={{ fontWeight: '500', color: '#1f2937' }}>
                          {selectedFile.name}
                        </p>
                        <p className="mb-2" style={{ color: '#6b7280', fontSize: '14px' }}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                        {isFileSizeValid ? (
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            <CheckCircle size={16} color="#059669" className="me-1" />
                            <span style={{ color: '#059669', fontSize: '14px' }}>Ready to upload</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            <AlertCircle size={16} color="#dc2626" className="me-1" />
                            <span style={{ color: '#dc2626', fontSize: '14px' }}>File too large (max 5MB)</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetFileInput();
                        }}
                        className="btn btn-outline-secondary btn-sm"
                        style={{
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        <X size={14} className="me-1" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} color="#9ca3af" className="mb-3" />
                      <div>
                        <p className="mb-2" style={{ color: '#6b7280' }}>
                          <strong>Drag and drop</strong> your file here, or{" "}
                          <span
                            style={{ 
                              color: '#2563eb', 
                              fontWeight: '500',
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            browse
                          </span>
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                          Supports all file types • Maximum 5MB
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                    ref={fileInputRef}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-4">
                <label className="form-label" style={{ color: '#374151', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Add any additional notes or description for this file..."
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  {...register("description")}
                />
              </div>

              {/* Action Buttons */}
              <div 
                className="d-flex justify-content-end gap-3 pt-4"
                style={{ borderTop: '1px solid #e5e7eb' }}
              >
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-light"
                  style={{
                    padding: '12px 24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`btn d-flex align-items-center ${
                    loading || !isFileSizeValid
                      ? 'btn-secondary' 
                      : 'btn-primary'
                  }`}
                  type={loading ? "button" : "submit"}
                  disabled={loading || !isFileSizeValid}
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: '500',
                    border: 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <div 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status"
                        style={{ width: '16px', height: '16px' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      {data ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="me-2" />
                      {data ? "Update File" : "Upload File"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AddFiles);