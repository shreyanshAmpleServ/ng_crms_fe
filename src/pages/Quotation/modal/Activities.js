import { useState } from "react";
import GmailSection from "../../../utils/gmailAccess";
import SendMailForm from "../../../utils/sendMailFrom";
import { IoMdRefresh } from "react-icons/io";
import { Link } from "react-router-dom";
import PreviewPdf from "./AttachmentPdf";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
import DocAttachments from "../../../components/common/DocmentActivity";
import QuotationAuditLog from "./AuditLog";
import DocumentComments from "./commentList";

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
  // const [isNewMail,setIsNewMail] = useState(false)
  // const [threadId,setThreadId] = useState()
  const [isRefresh, setIsRefresh] = useState(false);

  const tabMap = {
    // "Replies": "Replies",
    "Email Message": "Email Message",
    "Audit logs": "Logs Note",
    "Activities": "Activities",
    "Doc": "Doc",
  };
  return (
    <>
      <div style={{ position: "relative" }} className="row w-100  gap-2">
        <ul
          style={{ backgroundColor: "#dbdbdb" }}
          className="nav text-white nav-tabs  mb-3"
        >
          {Object.keys(tabMap).map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                type="button"
                className={`nav-link text-black  ${
                  activeTab === tabMap[tab]
                    ? "bg-primary text-white !important"
                    : ""
                } `}
                onClick={() => setActiveTab(tabMap[tab])}
              >
                {tabMap[tab]}
              </button>
            </li>
          ))}

          {/* <button
            type="button"
            className={`nav-link text-black  ${
              activeTab === tabMap[tab]
                ? "bg-primary text-white !important"
                : ""
            } `}
            //   onClick={() => setActiveTab(tabMap[tab])}
          >
            Email Message
          </button>
          <button
            type="button"
            className={`nav-link bg-primary  text-black  ${
              activeTab === tabMap[tab]
                ? "bg-primary text-white !important"
                : ""
            } `}
            //   onClick={() => setActiveTab(tabMap[tab])}
          >
            Activities
          </button>
          <button
            type="button"
            className={`nav-link text-black  ${
              activeTab === tabMap[tab]
                ? "bg-primary text-white !important"
                : ""
            } `}
            //   onClick={() => setActiveTab(tabMap[tab])}
          >
            Doc
          </button> */}
        </ul>
        {activeTab === "Email Message" && <div>
          <div className="d-flex justify-content-end">
            <div className="d-flex gap-2">
              <button
                type="button"
                id="sendButton"
                className="btn btn-light m-0 d-flex justify-content-center "
                style={{ height: "2.3rem", width: "3rem" }}
                onClick={() => {
                  setIsRefresh(true);
                  setThreadId();
                  setMsgId();
                }}
              >
                <IoMdRefresh className="h4" />
              </button>
              <button
                type="button"
                id="sendButton"
                className="btn btn-purple m-0 d-flex justify-content-center "
                style={{ height: "2.3rem", width: "4rem" }}
                // disabled={isNewMail}
                onClick={() => setIsNewMail(!isNewMail)}
              >
                {isNewMail ? "Reply" : "New"}
              </button>
            </div>
          </div>
          {isNewMail && (
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
          )}
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

          <div className="position-sticky bottom-0 w-100  ">
            {isNewMail === false && (
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
            )}
          </div>
        </div>}
        {activeTab === "Logs Note" && <QuotationAuditLog id={id}/> }
        {activeTab === "Activities" && <DocumentComments id={id}/> }
        {activeTab === "Doc" &&  <div>
          <DocAttachments type={"Quotation"} type_id={id} type_name={quotation?.quotation_code}/>
          </div>}
      </div>
    </>
  );
};
