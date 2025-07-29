import { useState } from "react";
import GmailSection from "../../../utils/gmailAccess";
import SendMailForm from "../../../utils/sendMailFrom";
import { IoMdRefresh } from "react-icons/io";
import { Link } from "react-router-dom";

export const AllActivities = ({id,vendor,isNewMail,setIsNewMail,
  threadId,setThreadId,
  msgId,setMsgId}) => {
        const [activeTab, setActiveTab] = useState("Replies");
        // const [isNewMail,setIsNewMail] = useState(false)
        // const [threadId,setThreadId] = useState()
        const [isRefresh,setIsRefresh ]= useState(false)
    
  const tabMap = {
    // "Replies": "Replies",
    "Email Message": "Email Message",
    "Logs Note": "Logs Note",
    "Activities": "Activities",
    "Doc": "Doc",
  };
  return (
    <>
      <div style={{position:"relative"}} className="row w-100  gap-2">
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
        <div className="d-flex justify-content-end">
      <div className="d-flex gap-2"> 
        <button
         type="button"
         id="sendButton"
         className="btn btn-light m-0 d-flex justify-content-center "
         style={{height:"2.3rem" ,width:'3rem'}} 
         onClick={()=>setIsRefresh(true)}
         >
        <IoMdRefresh className="h4" />
        </button>
         <button
      type="button"
      id="sendButton"
      className="btn btn-purple m-0 d-flex justify-content-center "
      style={{height:"2.3rem" ,width:'4rem'}}
      // disabled={isNewMail}
      onClick={()=>setIsNewMail(!isNewMail)}
    >
      {isNewMail ? "Reply" :  "New"}
    </button>
    </div>
    </div>
  {isNewMail &&   <SendMailForm vendor={vendor} recordId={id} isNewMail={isNewMail} setIsRefresh={setIsRefresh} isRefresh={isRefresh} threadId={threadId} setThreadId={setThreadId} setIsNewMail={setIsNewMail} setMsgId={setMsgId} msgId={msgId} />
}
        <GmailSection id={id} setThreadId={setThreadId} setIsRefresh={setIsRefresh} isRefresh={isRefresh} threadId={threadId} setMsgId={setMsgId} msgId={msgId} />
     
      <div  className="position-sticky bottom-0 w-100  ">
       {!isNewMail && <SendMailForm vendor={vendor} recordId={id} isNewMail={isNewMail} setIsRefresh={setIsRefresh} isRefresh={isRefresh} threadId={threadId} setThreadId={setThreadId} setIsNewMail={setIsNewMail} setMsgId={setMsgId} msgId={msgId} />
}
      </div>
      </div>
    </>
  );
};
