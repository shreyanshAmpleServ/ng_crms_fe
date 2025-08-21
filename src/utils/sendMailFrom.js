import React, { useRef, useState } from 'react';
import { getAllMessage, sendMail } from '../redux/gmailAccess';
import { useDispatch } from 'react-redux';
import { LuReply } from "react-icons/lu";
import { FaPaperPlane, FaCalendar, FaClock, FaTimes, FaPlus, FaFileAlt } from "react-icons/fa";
import { MdPriorityHigh, MdAttachFile, MdSave, MdScheduleSend } from "react-icons/md";
import ReactQuill from 'react-quill';
import { GrAttachment } from "react-icons/gr";
import toast from 'react-hot-toast';
import PreviewQuotationPDF from '../pages/Quotation/modal/AttachmentPdf';

export default function SendMailForm({
  recordId,
  model = "Quotation",
  threadId = null,
  inReplyTo = null,
  onSuccess = () => {},
  isNewMail,
  setMsgId,
  setThreadId,
  msgId,
  vendor,
  setIsNewMail,
  attachments,
  setAttachments
}) {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  
  const [form, setForm] = useState({
    to: vendor?.email || "",
    subject: '',
    body: '',
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: ''
  });

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
  
    const readAsBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            filename: file.name,
            mimeType: file.type,
            content: reader.result.split(',')[1],
            size: (file.size / 1024).toFixed(1) + ' KB'
          });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
    const base64Files = await Promise.all(files.map(readAsBase64));
    setAttachments([...attachments, ...base64Files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    
    try {
      const payload = {
        ...form,
        record_id: recordId,
        model,
        ...(!isNewMail && {thread_id: threadId || ""}),
        attachments,
        ...(isScheduled && { scheduleData })
      };
      
      await dispatch(sendMail(payload));
      
      // Reset form
      setForm({ 
        to: vendor?.email || "", 
        subject: '', 
        body: '', 
      });
      setAttachments([]);
      setIsScheduled(false);
      setScheduleData({ date: '', time: '' });
      
      onSuccess();
      setMsgId();
      setThreadId();
      setIsNewMail();
      dispatch(getAllMessage(recordId));
      
      toast.success(isScheduled ? 'Email scheduled successfully!' : 'Email sent successfully!');
      
    } catch (err) {
      console.error('Mail send failed', err);
      setError('Failed to send mail');
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };


  // Reply Mode UI
  if (isNewMail === false) {
    return threadId && (
      <div className="position-fixed bottom-0" style={{ 
        zIndex: 1050, 
        width: '420px',
        right: attachments?.length > 0 ? "calc(37% - 10px)" : "20px",
        transition: 'right 0.3s ease'
      }}>
        <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="card-header p-2 bg-gray-50 text-black" style={{
            background: 'linear-gradient(135deg,rgba(60, 203, 93, 0.2) 0%,rgba(92, 237, 193, 0.05) 100%)'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <LuReply 
                  onClick={() => setIsNewMail()} 
                  className="me-2 cursor-pointer"
                  style={{ cursor: 'pointer', fontSize: '18px' }}
                />
                <span className="fw-semibold h4 ">Reply</span>
              </div>
              <button
                type="button"
                className="btn btn-sm  bg-green-950 rounded-circle p-2 border-0"
                style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={sending}
                onClick={handleSubmit}
              >
                {sending ? (
                  <div className="spinner-border spinner-border-sm" style={{ width: '16px', height: '16px' }} />
                ) : (
                  <FaPaperPlane size={14} />
                )}
              </button>
            </div>
          </div>
          
          {/* Body */}
          <div className="card-body p-3" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Subject Display */}
            {msgId && (
              <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}>
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2 fw-medium">Subject:</small>
                  <div className="fw-medium text-dark">{msgId}</div>
                </div>
              </div>
            )}
            
            {/* Recipient Display */}
            <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}>
              <div className="d-flex align-items-center">
                <small className="text-muted me-2 fw-medium">To:</small>
                <div className="fw-medium text-dark">{vendor?.email}</div>
              </div>
            </div>

            {/* Attachment Button */}
            <div className="mb-3">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={handleIconClick}
                style={{ borderRadius: '20px' }}
              >
                <MdAttachFile className="me-2" size={16} />
                Attach Files
              </button>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <small className="text-muted fw-medium">Attachments ({attachments.length})</small>
                </div>
                <div className="border rounded p-2" style={{ backgroundColor: 'white', maxHeight: '120px', overflowY: 'auto' }}>
                  {attachments.map((file, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center py-1">
                      <div className="d-flex align-items-center flex-grow-1">
                        <FaFileAlt className="text-muted me-2" size={12} />
                        <small className="text-truncate" title={file.filename}>
                          {file.filename}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-2 rounded-circle p-1"
                        style={{ width: '24px', height: '24px' }}
                        onClick={() => removeAttachment(idx)}
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Body */}
            <div className="mb-3">
              <textarea
                name="body"
                className="form-control border-0 shadow-sm"
                rows="4"
                placeholder="Write your reply..."
                value={form.body}
                onChange={handleChange}
                style={{ 
                  resize: 'vertical',
                  minHeight: '80px',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger alert-sm p-2 mb-0 border-0" style={{ borderRadius: '6px' }}>
                <small>{error}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // New Mail Mode UI
  return (
    <div className="container-fluid p-2">
      <div className="card border-0 shadow-lg rounded-lg overflow-hidden mx-auto" >
        {/* Header */}
        <div className="card-header bg-gray-50 border-0 py-3" style={{
          // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h2 className="h5 fw-semibold mb-0 d-flex align-items-center">
            <FaPaperPlane className="me-2" />
            Send New Email
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="card-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Error Message */}
          {error && (
            <div className="alert alert-danger border-0 mb-4" style={{ borderRadius: '8px' }}>
              <div className="d-flex align-items-center">
                <MdPriorityHigh className="me-2" />
                {error}
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="mb-4">
            <label htmlFor="subject" className="form-label fw-semibold text-dark mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="form-control border-0 shadow-sm py-2"
              placeholder="Enter email subject..."
              value={form.subject}
              onChange={handleChange}
              style={{ borderRadius: '8px' }}
            />
          </div>
         
          {/* Message Body */}
          <div className="mb-4">
            <label htmlFor="body" className="form-label fw-semibold text-dark mb-2">
              Message Body
            </label>
            <div style={{ height: "420px" }} className="rounded-lg overflow-hidden shadow-sm">
              <ReactQuill
                name="body"
                id="body"
                value={form.body}
                onChange={(value) => setForm((prev) => ({ ...prev, body: value }))}
                placeholder="Write your message..."
                style={{ 
                  height: "350px",
                  backgroundColor: 'white'
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ direction: 'rtl' }],
                    [{ font: [] }],
                    ['link', 'image', 'video'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ['clean'],
                    ['code-block', 'blockquote'],
                  ],
                }}
              />
            </div>
          </div>

          {/* Attachment Section */}
          <div className="mb-4">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={handleIconClick}
              style={{ borderRadius: '20px' }}
            >
              <MdAttachFile className="me-2" size={18} />
              Attach Files
            </button>
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <GrAttachment className="me-2 text-muted" />
                <span className="fw-medium text-muted">
                  Attachments ({attachments.length})
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                {attachments.map((file, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center py-2 px-2 mb-2 rounded" 
                       style={{ backgroundColor: '#f1f3f4' }}>
                    <div className="d-flex align-items-center flex-grow-1">
                      <span className="badge bg-primary me-2" style={{ minWidth: '24px' }}>
                        {idx + 1}
                      </span>
                      <FaFileAlt className="text-muted me-2" />
                      <small className="text-truncate fw-medium" title={file.filename}>
                        {file.filename}
                      </small>
                      <small className="text-muted ms-2">({file.size})</small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-circle ms-2"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => removeAttachment(idx)}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Button */}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-lg px-4 py-2 d-flex align-items-center shadow"
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              disabled={sending}
              onClick={handleSubmit}
            >
              {sending ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane className="me-2" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// export default function SendMailForm({
//   recordId,
//   model = "Quotation",
//   threadId = null,
//   inReplyTo = null,
//   onSuccess = () => {},
//   isNewMail,
//   setMsgId,
//   setThreadId,
//   msgId,
//   vendor,
//   setIsNewMail,
//   attachments,
//   setAttachments
// }) {
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();
  
//   const [form, setForm] = useState({
//     to: vendor?.email || "",
//     subject: '',
//     body: '',
//   });

//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState('');
//   const [isScheduled, setIsScheduled] = useState(false);
//   const [scheduleData, setScheduleData] = useState({
//     date: '',
//     time: ''
//   });

//   const handleIconClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleScheduleChange = (e) => {
//     const { name, value } = e.target;
//     setScheduleData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
  
//     const readAsBase64 = (file) =>
//       new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () =>
//           resolve({
//             filename: file.name,
//             mimeType: file.type,
//             content: reader.result.split(',')[1],
//             size: (file.size / 1024).toFixed(1) + ' KB'
//           });
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//       });
  
//     const base64Files = await Promise.all(files.map(readAsBase64));
//     setAttachments([...attachments, ...base64Files]);
//   };

//   const removeAttachment = (index) => {
//     setAttachments(attachments.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSending(true);
    
//     try {
//       const payload = {
//         ...form,
//         record_id: recordId,
//         model,
//         ...(!isNewMail && {thread_id: threadId || ""}),
//         attachments,
//         ...(isScheduled && { scheduleData })
//       };
      
//       await dispatch(sendMail(payload));
      
//       // Reset form
//       setForm({ 
//         to: vendor?.email || "", 
//         subject: '', 
//         body: '', 
//       });
//       setAttachments([]);
//       setIsScheduled(false);
//       setScheduleData({ date: '', time: '' });
      
//       onSuccess();
//       setMsgId();
//       setThreadId();
//       setIsNewMail();
//       dispatch(getAllMessage(recordId));
      
//       toast.success(isScheduled ? 'Email scheduled successfully!' : 'Email sent successfully!');
      
//     } catch (err) {
//       console.error('Mail send failed', err);
//       setError('Failed to send mail');
//       toast.error('Failed to send email');
//     } finally {
//       setSending(false);
//     }
//   };

//   const getPriorityBadge = (priority) => {
//     const badges = {
//       high: 'bg-danger text-white',
//       normal: 'bg-secondary text-white',
//       low: 'bg-info text-white'
//     };
//     return badges[priority] || badges.normal;
//   };

//   if (isNewMail == false ) {
//     return threadId && (
//       <div  className="position-fixed bottom-0 z-50 " style={{ zIndex: 3, width: '400px',right:attachments?.length > 0 ? "37%" : "6%"  }}>
//         <div className="card shadow-lg  mb-0 border-0">
//           <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//             <div className="d-flex align-items-center">
//               <LuReply onClick={()=>setIsNewMail()}  className="me-2" />
//               <span className="fw-semibold">Reply</span>
//             </div>
//             <div className="d-flex justify-content-center">
         
//          <button
//            type="button"
//            className=" btn rounded-circle text-white btn-md bg-green-950"
//            disabled={sending}
//            onClick={handleSubmit}
//          >
//            {sending ? (
//              <>
//                <span className="spinner-border spinner-border-sm w-5 m-0" />
             
//              </>
//            ) : (
//              <>
//                <FaPaperPlane className="me-0" />
//                {/* Reply */}
//              </>
//            )}
//          </button>
//        </div>
//             {/* <button 
//               type="button" 
//               className="btn-close btn-close-white"
//               onClick={() =>{ setIsNewMail(false);setAttachments([])}}
//             ></button> */}
//           </div>
          
//           <div className="card-body p-3">
//             {msgId && (
//               <div className="mb-2 d-flex gap-2 items-center">
//                 <small className="text-muted">Subject:</small>
//                 <div className="fw-medium">{msgId}</div>
//               </div>
//             )}
            
//             <div className="mb-3 d-flex gap-2 items-center">
//               <small className="text-muted">To:</small>
//               <div className="fw-medium">{vendor?.email}</div>
//             </div>

//             {/* Attachment Button */}
//             <div className="mb-3">
//               <input
//                 type="file"
//                 multiple
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleFileChange}
//               />
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={handleIconClick}
//               >
//                 <MdAttachFile className="me-1" />
//                 Attach Files
//               </button>
//             </div>

//             {/* Attachments List */}
//             {attachments.length > 0 && (
//               <div className="mb-3">
//                 <small className="text-muted">Attachments ({attachments.length}):</small>
//                 {attachments.map((file, idx) => (
//                   <div key={idx} className="d-flex justify-content-between align-items-center bg-light p-2 rounded mt-1">
//                     <small className='w-75'>{file.filename}</small>
//                     <button
//                       type="button"
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => removeAttachment(idx)}
//                     >
//                       <FaTimes size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="mb-3">
//               <textarea
//                 name="body"
//                 className="form-control"
//                 rows="3"
//                 placeholder="Write your reply..."
//                 value={form.body}
//                 onChange={handleChange}
//               />
//             </div>

//             {error && (
//               <div className="alert alert-danger alert-sm p-2 mb-3">
//                 {error}
//               </div>
//             )}

          
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onsubmit={handleSubmit} className="bg-white shadow rounded-3 p-4 mx-auto border border-secondary" >
//     <h2 className="h5 fw-semibold mb-4">📧 Send New Email</h2>
    
  
//     <div id="errorMessage" className="text-danger mb-3 d-none">
//     {error && <p classNameName="text-danger mb-2">{error}</p>}
//     </div>
  
//     {/* <div className="mb-3">
//       <label for="to" className="form-label fw-bold">Mail To</label>
//       <input
//         type="email"
//         name="to"
//         id="to"
//         className="form-control"
//         placeholder="recipient@example.com"
//         value={form.to}
//         onChange={handleChange}
//         required
//       />
//     </div> */}
  
//     <div className="mb-3 d-flex gap-2 align-items-center">
//       <label for="subject" className="form-label fw-semibold">Subject: </label>
//       <input
//         type="text"
//         name="subject"
//         id="subject"
//         className="form-control"
//         placeholder="Subject of the email"
//         value={form.subject}
//           onChange={handleChange}
//       />
//     </div>
   
//     <div className="mb-4"     style={{ height: "400px"}}>
//       <label for="body" className="form-label fw-semibold">Message Body</label>
   
//       <ReactQuill
//               name="body"
//         id="body"
//         value={form.body}
//         onChange={(value)=> setForm((prev) => ({ ...prev, body: value }))}
//         placeholder='Write your message...'
//         style={{ height: "300px"}}
//         modules={{
//           toolbar: [
//             [{ header: [1, 2,3,4,5,6, false] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             [{ script: 'sub' }, { script: 'super' }],
//             [{ indent: '-1' }, { indent: '+1' }],
//             [{ direction: 'rtl' }],
//             // [{ size: ['small', false, 'large', 'huge'] }],
//             [{ font: [] }],
//             ['link',],
//             ['link', 'image', 'video'],
//             [{ color: [] }, { background: [] }],
//             [{ align: [] }],
//             ['clean'],
//             ['code-block', 'blockquote'],
//             ['table'], // Table option if using custom modules/plugins
//           ],
//         }}
//       />
//     </div>
//     <div className="mb-3">
//               <input
//                 type="file"
//                 multiple
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleFileChange}
//               />
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={handleIconClick}
//               >
//                 <MdAttachFile className="me-1" />
//                 Attach Files
//               </button>
//             </div>
//               {/* Attachments List */}
//               {attachments.length > 0 && (
//               <div className="mb-3">
//                 <small className="text-muted">Attachments ({attachments.length}):</small>
//                 {attachments.map((file, idx) => (
//                   <div key={idx} className="d-flex justify-content-between align-items-center bg-light p-2  rounded py-1">
//                     <small>{idx +1}. {file.filename}</small>
//                     <button
//                       type="button"
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => removeAttachment(idx)}
//                     >
//                       <FaTimes size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//     <button
//       type="button"
//       id="sendButton"
//       className="btn btn-success mt-10"
//       disabled={sending}
//       onClick={handleSubmit}
//     >
//        {sending ? 'Sending...' : 'Send Email'}
//     </button>
//     {/* {attachments.length > 0 && (
//   <ol className="mt-2 small">
//     {attachments.map((file, idx) => (
//       <li key={idx}>{file.filename}</li>
//     ))}
//   </ol>
// )} */}
// {/* <PreviewQuotationPDF setAttachments={setAttachments}  /> */}
//   </form>
//   );
// }