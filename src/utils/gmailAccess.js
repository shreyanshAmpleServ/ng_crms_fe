import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckAuth,
  fetchGmailURL,
  getAllMessage,
} from "../redux/gmailAccess";
import DOMPurify from "dompurify";

import { FaReply } from "react-icons/fa6";

export default function GmailSection({
  id,
  setMsgId,
  msgId,
  setThreadId,
  threadId,
  setIsRefresh,
  isRefresh
}) {
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const { gmailUrl, gmailMessage, gmailCheck, loading, error } = useSelector(
    (state) => state.gmailMessage
  );

  // Initial fetch of Gmail URL and auth status
  useEffect(() => {
    dispatch(fetchGmailURL());
    dispatch(fetchCheckAuth());
  }, [dispatch]);

  // Handle Gmail popup connection if not connected
  useEffect(() => {
    if (gmailCheck?.connected == false && gmailUrl?.url) {
      openGmailAuthPopup();
    } else if (gmailCheck?.connected == true) {
      dispatch(getAllMessage(id));
    }
    setIsRefresh(false)
  }, [gmailCheck, gmailUrl,isRefresh]);

  // Gmail Auth Popup Logic
  const openGmailAuthPopup = () => {
    // console.log("UUUUUU");
    popupRef.current = window.open(
      gmailUrl.url,
      "GmailAuth",
      "width=500,height=600"
    );

    const handleMessage = (event) => {
      if (event.data.success) {
        clearInterval(poll);
        window.removeEventListener("message", handleMessage);
        dispatch(fetchCheckAuth());
      }
    };

    window.addEventListener("message", handleMessage);

    const poll = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(poll);
        window.removeEventListener("message", handleMessage);
        dispatch(fetchCheckAuth());
      }
    }, 500);
  };

  //   <img
  //             src={`data:${attachment.mimeType};base64,${attachment.data}`}
  //             alt={attachment.filename}
  //             style={{ maxWidth: '300px', marginBottom: '10px' }}
  //           />
  //   if (loading) return <p >🔄 Checking Gmail status...</p>;

  function toBase64(str) {
    return str.replace(/-/g, "+").replace(/_/g, "/");
  }
  if (loading)
    return <p onClick={openGmailAuthPopup}>🔄 Checking Gmail status...</p>;
  if (error) return <p>❌ Error: {error}</p>;

  console.log("msg Id",threadId)
  return (
    <div>
      {/* <h3>Email Activity</h3> */}
      {gmailCheck?.connected ? (
        // <p>✅ Gmail Connected.</p>
        <></>
      ) : (
        <p onClick={openGmailAuthPopup}>🔌 Connecting to Gmail...</p>
      )}
      <div className="accordion" id="emailAccordion">
        {gmailMessage?.data?.map((item, idx) => (
          <div className="accordion-item" key={item.threadId}>
            <h2 className="accordion-header" id={`heading${idx}`}>
              <button
                className="accordion-button  d-flex align-items-start collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${idx}`}
                aria-expanded="false"
                aria-controls={`collapse${idx}`}
              >
                <span
                  style={{ width: "70%", fontSize: "16px", fontWeight: 700 }}
                >
                  {" "}
                  Subject: {item?.messages?.[0]?.subject}
                </span>{" "}
                <span className="ml-2">({item.messages.length} messages)</span>
              </button>
            </h2>
            <div
              id={`collapse${idx}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${idx}`}
              data-bs-parent="#emailAccordion"
            >
              <div className="accordion-body">
                {item.messages.map((mail) => (
                  <div
                    className="card mb-3 shadow-sm bg-green-100"
                    key={mail.id}
                    style={{ position: "relative" }}
                  >
                    <div
                      onClick={() => {
                        setThreadId(item.threadId);
                     setMsgId(mail?.subject);
                        }
                      }
                      
                      style={{ right: 0 }}
                      className={`position-absolute
                        ${
                         msgId === mail.subject
                          ? "bg-green-300"
                          : "bg-success" 
                      }
                       p-1 py-0.5 rounded-circle m-1`}
                    >
                      <FaReply />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-black">
                        {mail.subject || "No Subject"}
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        From: <strong className="fw-medium">{mail.from}</strong> <br />
                        To: <strong  className="fw-medium">{mail.to}</strong>
                        {mail.cc && (
                          <>
                            <br />
                            CC: <strong>{mail.cc}</strong>
                          </>
                        )}
                        <br />
                        <small>{new Date(mail.date).toLocaleString()}</small>
                      </h6>
                      <div
  className="card-text mt-3"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(mail.body || `<p>${mail.snippet}</p>`),
  }}
/>
                      {mail.attachments?.length > 0 && (
                        <div className="mt-3">
                          <h6>📎 Attachments:</h6>
                          {mail.attachments.map((attachment, i) => (
                            <div key={i} className="mb-2">
                              {attachment.mimeType.startsWith("image/") ? (
                                <img
                                  src={`${toBase64(attachment.data)}`}
                                  alt={attachment.filename}
                                  style={{
                                    maxWidth: "300px",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  }}
                                />
                              ) : (
                                <a
                                  href={`${toBase64(attachment.data)}`}
                                  download={attachment.filename}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Download {attachment.filename}
                                </a>
                              )}
                              {/* <p>{attachment.filename}</p> */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

{
  /* <div onClick={()=>setThreadId(mail?.threadId)} style={{right:0}} className={`position-absolute ${threadId == mail.threadId ? "bg-green-300" :  "bg-success"} p-1 py-0.5 rounded-circle m-1 `} > <FaReply/></div>
            <div className="card-body">
              <h5 className="card-title">{mail.subject || "No Subject"}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                From: <strong>{mail.from}</strong> <br />
                To: <strong>{mail.to}</strong>
                {mail.cc && (
                  <>
                    <br />
                    CC: <strong>{mail.cc}</strong>
                  </>
                )}
                <br />
                <small>{new Date(mail.date).toLocaleString()}</small>
              </h6>
              <p className="card-text mt-3">{mail.body || mail.snippet}</p>
              
              {mail.attachments && mail.attachments.length > 0 && (
                <div className="mt-3">
                  <h6>📎 Attachments:</h6>
                  {mail.attachments.map((attachment, i) => (
                    <div key={i} className="mb-2">
                      {attachment.data.length > 100
  ? console.log('Image data looks okay.')
  : console.warn('Attachment base64 data looks too short')
}
                      {attachment.mimeType.startsWith("image/") ? (
                        <img
                          src={`data:${attachment.mimeType};base64,${toBase64(attachment.data)}`}
                          alt={attachment.filename}
                          style={{
                            maxWidth: "300px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      ) : (
                        <a
                          href={`data:${attachment.mimeType};base64,${toBase64(attachment.data)}`}
                          download={attachment.filename}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Download {attachment.filename}
                        </a>
                      )}
                      <p>{attachment.filename}</p>
                    </div>
                  ))}
                </div>
              )}
            </div> */
}
// export default function Base64ImageTest() {
//     const base64Data = "iVBORw0KGgoAAAANSUhEUgAAEFQAAAnYCAYAAABOd0V6AAAAC..."; // your full base64 string here
//     const mimeType = "image/png";

//     const imageSrc = `data:${mimeType};base64,${base64Data}`;

//     return (
//       <div style={{ padding: 20 }}>
//         <h4>🧪 Testing Base64 Image</h4>
//         <img
//           src={imageSrc}
//           alt="Test"
//           style={{ maxWidth: '500px', border: '1px solid #ccc', borderRadius: '8px' }}
//           onError={(e) => {
//             e.target.style.display = 'none';
//             console.error('Image failed to load');
//           }}
//         />
//         <p>If the image does not appear, the data may be invalid or too large.</p>
//       </div>
//     );
//   }
