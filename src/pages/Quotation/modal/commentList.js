import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchComments, fetchCommentsApp } from "../../../redux/quotation";
import { generateToken } from "../../../utils/publicToken";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ManageActivitiesModal from "./manageActivity";

const DocumentComments = ({ id, code }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setActivity(null);
  };
  const [comments, setComments] = useState([
    {
      id: 2,
      parent_id: null,
      comments:
        "This quotation looks comprehensive, but I think we should review the pricing structure for better competitive positioning.",
      user_name: "Suraj Chaudhary",
      user_id: 8,
      obj_name: "Quotation",
      obj_id: 6,
      created_at: "2025-08-12T10:47:30.950Z",
      likes: 3,
    },
    {
      id: 3,
      parent_id: 2,
      comments:
        "I agree with your assessment. The material costs seem to be 15% higher than our usual estimates.",
      user_name: "Priya Sharma",
      user_id: 12,
      obj_name: "Quotation",
      obj_id: 6,
      created_at: "2025-08-12T11:23:15.120Z",
      likes: 1,
    },
    {
      id: 4,
      parent_id: null,
      comments:
        "The delivery timeline mentioned in section 3 might be too optimistic given the current supply chain constraints.",
      user_name: "Rahul Singh",
      user_id: 15,
      obj_name: "Quotation",
      obj_id: 6,
      created_at: "2025-08-12T12:15:45.330Z",
      likes: 2,
    },
    {
      id: 5,
      parent_id: 4,
      comments:
        "Good point! We should add a buffer of at least 2-3 weeks to be safe.",
      user_name: "Anjali Patel",
      user_id: 9,
      obj_name: "Quotation",
      obj_id: 6,
      created_at: "2025-08-12T12:45:20.450Z",
      likes: 0,
    },
  ]);
  //   const { id } = useParams();

  //   const newId = atob(decodeURIComponent(id));
  const newId = id;

  const [likedComments, setLikedComments] = useState(new Set());
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [token, setToken] = useState();

  const dispatch = useDispatch();
  React.useEffect(() => {
    //   token && dispatch(fetchQuotationpPublicById({ id: newId, token }));
    dispatch(fetchCommentsApp({ id: newId }));
  }, [dispatch]);
  React.useEffect(() => {
    const createToken = async () => {
      const genToken = await generateToken({ id: 1, username: "Anil" });
      console.log("JWT:", genToken);
      setToken(genToken);
    };
    createToken();
  }, []);
  const { appComments: commentDAta } = useSelector((state) => state.quotations);
  console.log("Comment Data  : ", commentDAta);
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user avatar color and initials
  const getUserAvatar = (userId, userName) => {
    const colors = [
      "bg-primary",
      "bg-success",
      "bg-info",
      "bg-warning",
      "bg-danger",
      "bg-secondary",
      "bg-dark",
    ];
    const initials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const colorClass = colors[userId % colors.length];
    return { initials, colorClass };
  };

  // Organize comments
  const organizeComments = (comments) => {
    if (!comments) {
      return;
    }
    const parentComments = comments.filter((c) => c.parent_id === null);
    const replies = comments.filter((c) => c.parent_id !== null);

    return parentComments.map((parent) => ({
      ...parent,
      replies: replies.filter((reply) => reply.parent_id === parent.id),
    }));
  };

  //   const handleLike = (commentId) => {
  //     setLikedComments(prev => {
  //       const newSet = new Set(prev);
  //       if (newSet.has(commentId)) {
  //         newSet.delete(commentId);
  //       } else {
  //         newSet.add(commentId);
  //       }
  //       return newSet;
  //     });

  //     setComments(prev => prev.map(comment =>
  //       comment.id === commentId
  //         ? { ...comment, likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1 }
  //         : comment
  //     ));
  //   };

  const handleReply = (parentId) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Math.max(...comments.map((c) => c.id)) + 1,
      parent_id: parentId,
      comments: replyText,
      user_name: "You",
      user_id: 1,
      obj_name: "Quotation",
      obj_id: 6,
      created_at: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [...prev, newReply]);
    setReplyText("");
    setShowReplyForm(null);
  };

  const organizedComments = organizeComments(commentDAta?.data);
  //   const organizedComments = organizeComments(comments);

  const CommentItem = ({ comment, isReply = false }) => {
    const { initials, colorClass } = getUserAvatar(
      comment.user_id,
      comment.user_name
    );
    const isLiked = likedComments.has(comment.id);

    return (
      <div
        className={`card mb-3 ${isReply ? "ms-4 border-start border-3 border-info" : "shadow-sm"}`}
        style={{
          borderLeft: isReply ? "" : "4px solid #e9ecef",
          transition: "all 0.2s ease",
        }}
      >
        <div className="card-body border ">
          <div className="d-flex">
            {/* User Avatar */}
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 p-2 ${colorClass}`}
              style={{
                width: isReply ? "35px" : "45px",
                height: isReply ? "30px" : "40px",
                fontSize: isReply ? "14px" : "16px",
              }}
            >
              {initials}
            </div>

            <div className="flex-grow-1">
              {/* Comment Header */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-0 fw-bold">{comment.user_name}</h6>
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {formatDate(comment.created_at)}
                  </small>
                </div>

                {/* Dropdown Menu */}
                {/* <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary border-0" type="button" data-bs-toggle="dropdown">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item"><i className="fas fa-edit me-2"></i>Edit</button></li>
                    <li><button className="dropdown-item"><i className="fas fa-trash me-2"></i>Delete</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item"><i className="fas fa-flag me-2"></i>Report</button></li>
                  </ul>
                </div> */}
              </div>

              {/* Comment Content */}
              <p className="text-dark text-capitalize mb-3">
                {comment.comments}
              </p>

              {/* Comment Actions */}
              <div className="d-flex align-items-center">
                {/* <button 
                  className={`btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'} me-3`}
                  onClick={() => handleLike(comment.id)}
                >
                  <i className={`fas fa-heart me-1`}></i>
                  {comment.likes}
                </button> */}

                {!isReply && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-3"
                    onClick={() =>
                      setShowReplyForm(
                        showReplyForm === comment.id ? null : comment.id
                      )
                    }
                  >
                    <i className="fas fa-reply me-1"></i>
                    Reply
                  </button>
                )}

                {/* <button className="btn btn-sm btn-outline-secondary">
                  <i className="fas fa-share me-1"></i>
                  Share
                </button> */}
              </div>

              {/* Reply Form */}
              {showReplyForm === comment.id && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex">
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold me-3"
                      style={{
                        width: "35px",
                        height: "35px",
                        fontSize: "14px",
                      }}
                    >
                      Y
                    </div>
                    <div className="flex-grow-1">
                      <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-secondary me-2"
                          onClick={() => setShowReplyForm(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyText.trim()}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Include Bootstrap CSS */}
      {/* <div dangerouslySetInnerHTML={{ __html: bootstrapStyles }} /> */}

      <div className="container mb-5">
      {/* <div className="header-actions d-flex justify-content-end">
        <Link
          to="#"
          className="btn btn-purple btn-sm fw-medium px-3 mb-1 py-2 shadow-sm"
          data-bs-toggle="modal"
          data-bs-target="#activity_modal"
        >
          <i className="ti ti-plus me-2"></i>Activity
        </Link>
        </div> */}
        {/* Header */}
        <div className="card mb-4 bg-purple-gradient text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <i className="fas fa-comments me-3 fs-2"></i>
              <div>
                <h3 className="card-title mb-1">Document Comments</h3>
                <p className="card-text mb-0 opacity-75">
                  {comments[0]?.obj_name} # {code} • {organizedComments?.length}{" "}
                  Comments
                  {/* • {comments.filter(c => c.parent_id !== null).length} Replies */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Comment */}
        {/* <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h6 className="card-title">
              <i className="fas fa-plus-circle me-2 text-primary"></i>
              Add a Comment
            </h6>
            <div className="d-flex">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold me-3"
                   style={{ width: '45px', height: '45px' }}>
                Y
              </div>
              <div className="flex-grow-1">
                <textarea 
                  className="form-control mb-3" 
                  rows="3" 
                  placeholder="What are your thoughts?"
                />
                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary">
                    <i className="fas fa-paper-plane me-1"></i>
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Comments List */}
        <div className="comments-section">
          {organizedComments?.length > 0 ? (
            organizedComments?.map((comment) => (
              <div key={comment.id}>
                <CommentItem comment={comment} />
                {/* Replies */}
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            ))
          ) : (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-comments fs-1 text-muted mb-3"></i>
                <h5 className="card-title text-muted">No Comments Yet</h5>
                <p className="card-text text-muted">
                  Be the first to share your thoughts on this document.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* <ManageActivitiesModal
          activity={null}
        //   setActivity={setActivity}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode="modal" 
        /> */}
        <ManageActivitiesModal activity={null} onClose={handleCloseModal} />
        {/* Load more button */}
        {/* {organizedComments.length > 0 && (
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary">
              <i className="fas fa-chevron-down me-2"></i>
              Load More Comments
            </button>
          </div>
        )} */}
      </div>
    </>
  );
};

export default DocumentComments;
