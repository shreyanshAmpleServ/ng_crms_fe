import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { deleteVenor } from "../../redux/vendor";
import DeleteAlert from "./alert/DeleteAlert";
import AddVendorModal from "./modal/AddVendorModal";

const UsersGrid = ({ data }) => {
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null); // For modal context
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation
  const [visibleItems, setVisibleItems] = useState(3); // Default number of users visible
  const [loading, setLoading] = useState(false); // State for Load More button

  // Handles showing the delete modal for a user
  const handleDeleteUser = (user) => {
    setSelectedUser(user); // Set the user to delete
    setShowDeleteModal(true); // Show confirmation modal
  };

  // Confirm and delete the user
  const deleteData = () => {
    if (selectedUser) {
      dispatch(deleteVenor(selectedUser.id)); // Call delete action with user ID
      setShowDeleteModal(false); // Close modal
    }
  };

  // Load more users dynamically
  const handleLoadMore = () => {
    setLoading(true); // Show loading state
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3); // Load 3 more users
      setLoading(false); // Hide loading state
    }, 1000); // Simulated loading delay
  };

  return (
    <>
      <div className="row p-2">
        {data.slice(0, visibleItems).map((user, index) => (
          <div className="col-xxl-4 col-xl-4 col-md-6" key={user.id || index}>
            <div className="card border" style={{ height: "250px" }}>
              <div className="card-body">
                {/* User Details Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    {/* User Avatar */}
                    <Link
                      to={`/users/${user?.id}`}
                      className="avatar avatar-md flex-shrink-0 me-2"
                    >
                      {user?.profile_img ? (
                        <img
                          src={user?.profile_img}
                          alt="User Avatar"
                          className="preview"
                        />
                      ) : (
                        <ImageWithBasePath
                          src="assets/img/profiles/default-avatar.jpg"
                          alt="Default Avatar"
                        />
                      )}
                    </Link>
                    {/* User Info */}
                    <div>
                      <h6>
                        <Link to={`/crms/vendor/${user?.id}`} className="fw-medium">
                          {user.name || "N/A"}
                        </Link>
                      </h6>
                      {/* <p className="text-default">{user.role || "N/A"}</p> */}
                      <div className="d-flex align-items-center">
                      {/* <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span> */}
<p>
  {[
    user?.billing_street,
    user?.billing_city,
    user?.state?.name,
    user?.country?.name,
    user?.billing_zipcode ? `( ${user.billing_zipcode} )` : null,
  ]
    .filter(Boolean) // remove null/undefined/empty
    .join(" ")}
</p>
                    </div>
                    </div>
                  </div>
                  {/* Actions Dropdown */}
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      {/* Edit Action */}
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="offcanvas"
                       data-bs-target="#offcanvas_add_vendor"
                        onClick={() => setSelectedUser(user)}
                      >
                        <i className="ti ti-edit text-blue" /> Edit
                      </Link>
                      {/* Delete Action */}
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <i className="ti ti-trash text-danger" /> Delete
                      </Link>
                    </div>
                  </div>
                </div>

                {/* User Additional Details */}
                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-mail text-dark me-1" />
                      {user.email || "No Email"}
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <i className="ti ti-phone text-dark me-1" />
                      {user.phone || "No Phone"}
                    </p>
                   <p>
  <i className="ti ti-map-pin text-dark me-1" />
  {[
    user?.billing_street,
    user?.billing_city,
    user?.state?.name,
    user?.country?.name,
    user?.billing_zipcode ? `( ${user.billing_zipcode} )` : null,
  ]
    .filter(Boolean) // removes null/undefined/empty
    .join(" ")}
</p>


                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {visibleItems < data.length && (
        <div className="load-btn text-center pb-4">
          <button onClick={handleLoadMore} className="btn btn-primary">
            {loading ? (
              <>
                Loading... <i className="ti ti-loader" />
              </>
            ) : (
              "Load More Users"
            )}
          </button>
        </div>
      )}
      {/* Modals */}
      <AddVendorModal vendor={selectedUser} setVendor={setSelectedUser} />

      {/* <EditUserModal user={selectedUser} /> Edit user modal */}
            <DeleteAlert
        label="Vendor"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
         setVendor={selectedUser}
      />

      {/* Delete confirmation modal */}
    </>
  );
};

export default UsersGrid;
