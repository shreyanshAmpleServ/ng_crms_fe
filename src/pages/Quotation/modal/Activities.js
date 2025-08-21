import { useState } from "react";
import GmailSection from "../../../utils/gmailAccess";
import SendMailForm from "../../../utils/sendMailFrom";
import { IoMdRefresh } from "react-icons/io";
import PreviewPdf from "./AttachmentPdf";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
import DocAttachments from "../../../components/common/DocmentActivity";
import QuotationAuditLog from "./AuditLog";
import DocumentComments from "./commentList";
import ManageActivityList from "./manageActivityList";
import { IoPerson } from "react-icons/io5";

export const AllActivities = ({
  id,
  vendor,
  setPrevPdf,
  PreviewPdf,
  isNewMail,
  setIsNewMail,
  threadId,
  setThreadId,
  attachments,
  setAttachments,
  msgId,
  setMsgId,
  quotation,
}) => {
  const [activeTab, setActiveTab] = useState("Email Message");
  const [activeSubTab, setActiveSubTab] = useState("comments");
  const [isRefresh, setIsRefresh] = useState(false);

  const tabMap = {
    "Email Message": "Email Message",
    "Audit logs": "Logs Note",
    "Activities": "Activities",
    "Doc": "Doc",
  };

  const handleRefresh = () => {
    setIsRefresh(true);
    setThreadId();
    setMsgId();
  };

  return (
    <>
      <div className="activities-container">
        {/* Main Tabs */}
        <div className="main-tabs-wrapper">
          <div className="main-tabs">
            {Object.keys(tabMap).map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`main-tab-button ${
                  activeTab === tabMap[tab] ? "active" : ""
                }`}
                onClick={() => setActiveTab(tabMap[tab])}
              >
                <span className="tab-text">{tabMap[tab]}</span>
                {activeTab === tabMap[tab] && <div className="tab-indicator" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content-wrapper">
          {activeTab === "Email Message" && (
            <div className="email-tab-content">
              <div className="email-controls">
                <div className="control-buttons">
                  <button
                    type="button"
                    className="control-btn refresh-btn"
                    onClick={handleRefresh}
                    title="Refresh"
                  >
                    <IoMdRefresh />
                  </button>
                  {/* <button
                    type="button"
                    className="control-btn person-btn"
                    onClick={handleRefresh}
                    title="Person"
                  >
                    <IoPerson />
                  </button> */}
                  <button
                    type="button"
                    className={`control-btn toggle-btn ${isNewMail ? "reply-mode" : "new-mode"}`}
                    onClick={() => setIsNewMail(!isNewMail)}
                  >
                    {isNewMail ? "Reply" : "New"}
                  </button>
                </div>
              </div>

              {isNewMail && (
                <div className="mail-form-wrapper animate-slide-down">
                  <SendMailForm
                    attachments={attachments}
                    setAttachments={setAttachments}
                    vendor={vendor}
                    recordId={id}
                    isNewMail={isNewMail}
                    setIsRefresh={setIsRefresh}
                    isRefresh={isRefresh}
                    threadId={threadId}
                    setThreadId={setThreadId}
                    setIsNewMail={setIsNewMail}
                    setMsgId={setMsgId}
                    msgId={msgId}
                  />
                </div>
              )}

              <div className="gmail-section-wrapper">
                <GmailSection
                  id={id}
                  setIsNewMail={setIsNewMail}
                  setThreadId={setThreadId}
                  setIsRefresh={setIsRefresh}
                  isRefresh={isRefresh}
                  threadId={threadId}
                  setMsgId={setMsgId}
                  msgId={msgId}
                />
              </div>

              {(isNewMail === false) && (
                <div className="sticky-mail-form">
                  <SendMailForm
                    attachments={attachments}
                    setAttachments={setAttachments}
                    vendor={vendor}
                    recordId={id}
                    isNewMail={isNewMail}
                    setIsRefresh={setIsRefresh}
                    isRefresh={isRefresh}
                    threadId={threadId}
                    setThreadId={setThreadId}
                    setIsNewMail={setIsNewMail}
                    setMsgId={setMsgId}
                    msgId={msgId}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "Logs Note" && (
            <div className="tab-content-panel animate-fade-in">
              <QuotationAuditLog id={id} />
            </div>
          )}

          {activeTab === "Activities" && (
            <div className="activities-tab-content animate-fade-in">
              <div className="sub-tabs-container">
                <div className="sub-tabs">
                  <button
                    type="button"
                    className={`sub-tab-button ${
                      activeSubTab === "comments" ? "active" : ""
                    }`}
                    onClick={() => setActiveSubTab("comments")}
                  >
                    <span>Comments</span>
                  </button>
                  <button
                    type="button"
                    className={`sub-tab-button ${
                      activeSubTab === "activity" ? "active" : ""
                    }`}
                    onClick={() => setActiveSubTab("activity")}
                  >
                    <span>Activity</span>
                  </button>
                </div>

                <div className="sub-tab-content">
                  {activeSubTab === "comments" && (
                    <div className="animate-slide-in">
                      <DocumentComments id={id} code={quotation?.quotation_code} />
                    </div>
                  )}
                  {activeSubTab === "activity" && (
                    <div className="animate-slide-in">
                      <ManageActivityList id={id} code={quotation?.quotation_code} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Doc" && (
            <div className="tab-content-panel animate-fade-in">
              <DocAttachments
                type={"Quotation"}
                type_id={id}
                type_name={quotation?.quotation_code}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .activities-container {
          width: 100%;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .main-tabs-wrapper {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #dee2e6;
          padding: 0 16px;
        }

        .main-tabs {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .main-tabs::-webkit-scrollbar {
          display: none;
        }

        .main-tab-button {
          position: relative;
          background: none;
          border: none;
          padding: 16px 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          white-space: nowrap;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: -1px;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-tab-button:hover {
          color: #495057;
          background: rgba(255, 255, 255, 0.6);
          transform: translateY(-1px);
        }

        .main-tab-button.active {
          color: #0d6efd;
          background: #fff;
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        }

        .tab-indicator {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #0d6efd, #0056b3);
          border-radius: 2px 2px 0 0;
          animation: slideIn 0.3s ease-out;
        }

        .tab-content-wrapper {
          padding: 20px;
          min-height: 400px;
        }

        .email-controls {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        .control-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .refresh-btn,
        .person-btn {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          color: #6c757d;
        }

        .refresh-btn:hover,
        .person-btn:hover {
          background: #e9ecef;
          color: #495057;
          transform: scale(1.05);
        }

        .toggle-btn {
          height: 40px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 20px;
        }

        .toggle-btn.new-mode {
          background: linear-gradient(135deg, #0d6efd, #0056b3);
          color: white;
        }

        .toggle-btn.reply-mode {
          background: linear-gradient(135deg, #198754, #146c43);
          color: white;
        }

        .toggle-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .mail-form-wrapper {
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
        }

        .gmail-section-wrapper {
          margin-bottom: 20px;
        }

        .sticky-mail-form {
          position: sticky;
          bottom: 0;
          background: #fff;
          border-top: 1px solid #e9ecef;
          margin: 0 -20px -20px -20px;
          padding: 20px;
          border-radius: 0 0 12px 12px;
        }

        .tab-content-panel {
          background: #fff;
          border-radius: 8px;
        }

        .sub-tabs-container {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
        }

        .sub-tabs {
          display: flex;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-bottom: 1px solid #dee2e6;
        }

        .sub-tab-button {
          flex: 1;
          padding: 16px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          position: relative;
          transition: all 0.3s ease;
        }

        .sub-tab-button:hover {
          background: rgba(255, 255, 255, 0.7);
          color: #495057;
        }

        .sub-tab-button.active {
          background: #fff;
          color: #0d6efd;
          font-weight: 600;
        }

        .sub-tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #0d6efd, #0056b3);
          border-radius: 2px 2px 0 0;
        }

        .sub-tab-content {
          padding: 20px;
        }

        /* Animations */
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 40px;
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slideInLeft 0.3s ease-out;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .activities-container {
            border-radius: 8px;
            box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
          }

          .main-tabs-wrapper {
            padding: 0 12px;
          }

          .main-tab-button {
            padding: 12px 16px;
            font-size: 13px;
            min-height: 48px;
          }

          .tab-content-wrapper {
            padding: 16px;
          }

          .control-buttons {
            gap: 6px;
          }

          .refresh-btn,
          .person-btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .toggle-btn {
            height: 36px;
            padding: 0 14px;
            font-size: 13px;
          }

          .sub-tab-button {
            padding: 14px 16px;
            font-size: 13px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .activities-container {
            background: #1a1a1a;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          }

          .main-tabs-wrapper {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-bottom-color: #404040;
          }

          .main-tab-button {
            color: #b0b0b0;
          }

          .main-tab-button:hover {
            color: #e0e0e0;
            background: rgba(255, 255, 255, 0.1);
          }

          .main-tab-button.active {
            background: #1a1a1a;
            color: #4da3ff;
          }

          .sub-tabs-container {
            background: #1a1a1a;
            border-color: #404040;
          }

          .sub-tabs {
            background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
            border-bottom-color: #404040;
          }
        }
      `}</style>
    </>
  );
};