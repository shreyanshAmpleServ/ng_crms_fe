import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";

import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { deleteProject } from "../../redux/projects"; // <-- change this
import EditProjectModal from "./modal/EditProjectModal"; // <-- updated import
import DeleteAlert from "./alert/DeleteAlert";

const ProjectsGrid = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedProject) {
      dispatch(deleteProject(selectedProject.id));
      navigate(`/crms/projects`);
      setShowDeleteModal(false);
    }
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleItems((prev) => prev + 3);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="row p-3">
        {data.slice(0, visibleItems).map((project, index) => (
          <div className="col-xxl-3 col-xl-4 col-md-6" key={project.id || index}>
            <div className="card border" style={{ height: "250px" }}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div>
                      <h6>
                        <Link
                          to={`/projects/${project?.id}`}
                          className="fw-large h5"
                        >
                          {project.name || "N/A"}
                        </Link>
                      </h6>
                      <p className="text-default">
                        {project.projectTiming || "N/A"}
                      </p>
                    </div>
                  </div>

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
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit_project"
                        onClick={() => setSelectedProject(project)}
                      >
                        <i className="ti ti-edit text-blue" /> Edit
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => handleDeleteProject(project)}
                      >
                        <i className="ti ti-trash text-danger" /> Delete
                      </Link>
                      <Link
                        className="dropdown-item"
                        to={`/projects/${project?.id}`}
                      >
                        <i className="ti ti-eye text-blue-light" /> Preview
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="d-block">
                  <div className="d-flex flex-column mb-3">
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <span className="col-md-6 text-dark">Project Timing</span>
                      <span>{project.projectTiming || "No Timing"}</span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <span className="col-md-6 text-dark">Budget</span>
                      <span>{project.amount || "No amount"}</span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <span className="col-md-6 text-dark">Due date</span>
                      <span>{moment(project.dueDate).format("ll") || "No due date"}</span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center mb-2">
                      <span className="col-md-6 text-dark">Start date</span>
                      <span>{moment(project.startDate).format("ll") || "No start date"}</span>
                    </p>
                    <p className="text-default d-inline-flex align-items-center">
                      <span className="col-md-6 text-dark">Created by</span>
                      <span>{moment(project.createdDate).format("ll") || "No start date"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleItems < data.length && (
        <div className="load-btn text-center pb-4">
          <button onClick={handleLoadMore} className="btn btn-primary">
            {loading ? (
              <>
                Loading... <i className="ti ti-loader" />
              </>
            ) : (
              "Load More Projects"
            )}
          </button>
        </div>
      )}

      <EditProjectModal project={selectedProject} />
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedProject={selectedProject}
        onDelete={deleteData}
      />
    </>
  );
};

export default ProjectsGrid;
