import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteAlert from "../../../pages/call/alert/DeleteAlert";
import { deleteAttachment, fetchAttachment } from "../../../redux/attachment";
import ImageWithDatabase from "../ImageFromDatabase";
import AddFile from "./Modal/AddFile";
import NoDataFound from "../NotFound/NotFount";

const DocAttachments = ({ type, type_id, type_name = "Unknown" }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [data, setData] = useState();
  const [viewMode, setViewMode] = useState('list'); // grid or list
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAttachment({ filteredType: type, related_entity_id: type_id }));
  }, [dispatch]);

  const { attachments } = useSelector((state) => state?.attachments);

  const deleteData = () => {
    if (selectedAttachment) {
      dispatch(deleteAttachment(selectedAttachment));
      setShowDeleteModal(false);
      setSelectedAttachment(null);
    }
  };

  const getFileTypeStyle = (fileType) => {
    const styles = {
      "Proposal": { bg: "bg-gradient-danger", text: "text-white", icon: "ti-file-certificate" },
      "Quote": { bg: "bg-gradient-warning", text: "text-white", icon: "ti-file-invoice" },
      "Contract": { bg: "bg-gradient-info", text: "text-white", icon: "ti-file-description" },
      "Invoice": { bg: "bg-gradient-success", text: "text-white", icon: "ti-receipt" },
      "Document": { bg: "bg-gradient-primary", text: "text-white", icon: "ti-file-text" },
      "default": { bg: "bg-gradient-secondary", text: "text-white", icon: "ti-file" }
    };
    return styles[fileType] || styles.default;
  };

  const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toLowerCase() || 'file';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const GridView = () => (
    <div className="row g-4">
      {attachments.data.map((item, index) => {
        const fileStyle = getFileTypeStyle(item?.file_type);
        // const extension = getFileExtension(item?.filename);
        
        return (
          <div key={item.id || index} className="col-xl-4 col-lg-6 col-md-6">
            <div className="file-card h-100 border-0 shadow-sm position-relative overflow-hidden">
              <div className="file-card-header p-0 position-relative">
                <div className={`file-type-banner ${fileStyle.bg} p-3 text-center position-relative`}>
                  <div className="file-type-overlay"></div>
                  <div className="position-relative z-1">
                    <div className="file-icon-large mb-2">
                      <i className={`ti ${fileStyle.icon} display-4 ${fileStyle.text}`}></i>
                    </div>
                    {/* <span className={`badge bg-white bg-opacity-20 ${fileStyle.text} px-3 py-1 rounded-pill`}>
                      .{extension}
                    </span> */}
                  </div>
                </div>
                
                <div className="file-actions position-absolute top-0 end-0 p-2">
                  <div className="dropdown">
                    <button className="btn btn-light btn-sm rounded-circle shadow-sm" 
                            data-bs-toggle="dropdown" style={{width: '32px', height: '32px'}}>
                      <i className="ti ti-dots-vertical fs-12"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 p-2">
                      <Link onClick={() => setData(item)} 
                            className="dropdown-item rounded-2 py-2" 
                            data-bs-toggle="modal" data-bs-target="#new_file" to="#">
                        <i className="ti ti-edit text-primary me-2"></i>Edit
                      </Link>
                      <Link target="_blank" className="dropdown-item rounded-2 py-2" to={item?.file}>
                        <i className="ti ti-download text-success me-2"></i>Download
                      </Link>
                      <Link target="_blank" className="dropdown-item rounded-2 py-2" to={item?.file}>
                        <i className="ti ti-eye text-info me-2"></i>Preview
                      </Link>
                      <hr className="my-2"/>
                      <Link onClick={() => {setSelectedAttachment(item?.id); setShowDeleteModal(true);}} 
                            className="dropdown-item rounded-2 py-2 text-danger" to="#">
                        <i className="ti ti-trash me-2"></i>Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-2 text-truncate" title={item?.filename}>
                  {item?.filename || 'Untitled'}
                </h5>
                
                {item?.description && (
                  <p className="card-text text-muted small mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="file-meta mb-3">
                  <div className="d-flex justify-content-between text-muted small">
                    {item?.file_size && <span><i className="ti ti-file-size me-1"></i>{formatFileSize(item.file_size)}</span>}
                    {item?.created_at && <span><i className="ti ti-clock me-1"></i>{formatDate(item.created_at)}</span>}
                  </div>
                </div>

                <div className="file-author d-flex align-items-center">
                  <div className="avatar-wrapper me-2">
                    <div className="avatar avatar-sm rounded-circle overflow-hidden border-2 border-light shadow-sm">
                      <ImageWithDatabase
                        src={item?.created_user?.profile_img}
                        alt={item?.created_user?.full_name}
                        className="w-100 h-100 object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <p className="mb-0 fw-medium small text-truncate">
                      {item?.created_user?.full_name || 'Unknown'}
                    </p>
                    {item?.created_user?.crms_d_user_role?.[0]?.crms_m_role?.role_name && (
                      <span className="text-muted fs-11 text-truncate d-block">
                        {item.created_user.crms_d_user_role[0].crms_m_role.role_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ListView = () => (
    <div className="list-view">
      {attachments.data.map((item, index) => {
        const fileStyle = getFileTypeStyle(item?.file_type);
        
        return (
          <div key={item.id || index} className="file-list-item border rounded-3 mb-3 p-4 bg-light-gradient shadow-sm">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className={`file-icon-circle ${fileStyle.bg} rounded-circle d-flex align-items-center justify-content-center`}
                     style={{width: '50px', height: '50px'}}>
                  <i className={`ti ${fileStyle.icon} fs-4 ${fileStyle.text}`}></i>
                </div>
              </div>
              
              <div className="col">
                <div className="row align-items-center">
                  <div className="col-lg-5">
                    <h6 className="mb-1 fw-bold text-truncate">{item?.filename || 'Untitled'}</h6>
                    {item?.description && (
                      <p className="text-muted small mb-0 line-clamp-1">{item.description}</p>
                    )}
                    <div className="mt-1">
                      <span className={`badge ${fileStyle.bg} ${fileStyle.text} rounded-pill px-2 py-1 small`}>
                        {item?.file_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-lg-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm me-2">
                        <ImageWithDatabase
                          src={item?.created_user?.profile_img}
                          alt={item?.created_user?.full_name}
                          className="rounded-circle"
                        />
                      </div>
                      <div>
                        <p className="mb-0 small fw-medium">{item?.created_user?.full_name}</p>
                        <span className="text-muted fs-11">
                          {item?.created_user?.crms_d_user_role?.[0]?.crms_m_role?.role_name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-2 text-muted small">
                    {item?.file_size && <div>{formatFileSize(item.file_size)}</div>}
                    {item?.created_at && <div>{formatDate(item.created_at)}</div>}
                  </div>
                  
                  <div className="col-lg-2 text-end">
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown">
                        <i className="ti ti-dots-vertical"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                        <Link onClick={() => setData(item)} className="dropdown-item" 
                              data-bs-toggle="modal" data-bs-target="#new_file" to="#">
                          <i className="ti ti-edit text-primary me-2"></i>Edit
                        </Link>
                        <Link target="_blank" className="dropdown-item" to={item?.file}>
                          <i className="ti ti-download text-success me-2"></i>Download
                        </Link>
                        <Link target="_blank" className="dropdown-item" to={item?.file}>
                          <i className="ti ti-eye text-info me-2"></i>Preview
                        </Link>
                        <hr className="my-1"/>
                        <Link onClick={() => {setSelectedAttachment(item?.id); setShowDeleteModal(true);}} 
                              className="dropdown-item text-danger" to="#">
                          <i className="ti ti-trash me-2"></i>Delete
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="files-container px-3">
        {/* Modern Header */}
        <div className="files-header bg-purple-gradient text-white rounded p-4 mb-4 text-white position-relative overflow-hidden">
          <div className="header-pattern position-absolute top-0 start-0 w-100 h-100 opacity-10"></div>
          <div className="position-relative z-1">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center mb-2">
                  <div className="header-icon me-3">
                    <i className="ti ti-folder-open display-6"></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold text-white">Files & Documents</h3>
                    <p className="mb-0 opacity-90">
                      {attachments?.data?.length || 0} files attached to {type_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div className="header-actions d-flex align-items-center justify-content-lg-end gap-2">
                  {/* <div className="view-toggle btn-group" role="group">
                    <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-light' : 'btn-outline-light'}`} 
                            onClick={() => setViewMode('grid')}>
                      <i className="ti ti-grid-dots"></i>
                    </button>
                    <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-light' : 'btn-outline-light'}`} 
                            onClick={() => setViewMode('list')}>
                      <i className="ti ti-list"></i>
                    </button>
                  </div> */}
                  <Link to="#" className="btn btn-light btn-sm fw-medium px-3 py-2 shadow-sm"
                        data-bs-toggle="modal" data-bs-target="#new_file">
                    <i className="ti ti-plus me-2"></i>Add File
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files Content */}
        <div className="files-content">
          {attachments?.data?.length ? (
            <>
              {viewMode === 'grid' ? <GridView /> : <ListView />}
              
              {/* Stats Footer */}
              {/* <div className="files-stats mt-5 p-4 bg-light rounded-3">
                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-3 mb-md-0">
                    <div className="stat-item">
                      <div className="stat-icon text-primary mb-2">
                        <i className="ti ti-files display-6"></i>
                      </div>
                      <h4 className="mb-1 fw-bold text-dark">{attachments.data.length}</h4>
                      <p className="mb-0 text-muted small">Total Files</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3 mb-md-0">
                    <div className="stat-item">
                      <div className="stat-icon text-success mb-2">
                        <i className="ti ti-category display-6"></i>
                      </div>
                      <h4 className="mb-1 fw-bold text-dark">
                        {[...new Set(attachments.data.map(item => item.file_type))].length}
                      </h4>
                      <p className="mb-0 text-muted small">File Types</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <div className="stat-icon text-info mb-2">
                        <i className="ti ti-database display-6"></i>
                      </div>
                      <h4 className="mb-1 fw-bold text-dark">
                        {formatFileSize(attachments.data.reduce((acc, item) => acc + (item.file_size || 0), 0))}
                      </h4>
                      <p className="mb-0 text-muted small">Total Size</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <div className="stat-icon text-warning mb-2">
                        <i className="ti ti-calendar display-6"></i>
                      </div>
                      <h4 className="mb-1 fw-bold text-dark">
                        {formatDate(Math.max(...attachments.data.map(item => new Date(item.created_at || 0))))}
                      </h4>
                      <p className="mb-0 text-muted small">Last Updated</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </>
          ) : (
            <div className="empty-state text-center pt-0">
              {/* <div className="empty-icon mb-4">
                <i className="ti ti-folder-x display-1 text-muted"></i>
              </div> */}
              <NoDataFound />
            </div>
          )}
        </div>
      </div>

      <AddFile data={data} setData={setData} type={type} type_id={type_id} type_name={type_name} />
      <DeleteAlert
        label={"Attachment"}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />

      <style jsx>{`
        .files-container {
          padding: 0;
        }
        
        .files-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }
        
        .header-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        
        .file-card {
          background: white;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.08);
        }
        
        .file-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .file-type-banner {
          height: 140px;
          position: relative;
          background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-purple) 100%);
        }
        
        .file-type-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        }
        
        .file-actions {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .file-card:hover .file-actions {
          opacity: 1;
        }
        
        .file-list-item {
          transition: all 0.2s ease;
          border: 1px solid rgba(0,0,0,0.08);
        }
        
        .file-list-item:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border-color: rgba(102, 126, 234, 0.3);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .avatar {
          width: 32px;
          height: 32px;
        }
        
        .avatar-sm {
          width: 28px;
          height: 28px;
        }
        
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bg-gradient-danger { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .bg-gradient-warning { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
        .bg-gradient-info { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .bg-gradient-success { background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); }
        .bg-gradient-secondary { background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
        
        .stat-item {
          padding: 1rem;
          transition: transform 0.2s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-2px);
        }
        
        .min-width-0 {
          min-width: 0;
        }
        
        .view-toggle .btn {
          border-radius: 8px;
        }
        
        .empty-state {
          padding: 4rem 2rem;
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 8px;
        }
        
        .dropdown-item {
          border-radius: 8px;
          padding: 8px 12px;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: rgba(102, 126, 234, 0.1);
          transform: translateX(2px);
        }
      `}</style>
    </>
  );
};

export default DocAttachments;