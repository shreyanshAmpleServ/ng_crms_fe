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

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-danger text-white',
      normal: 'bg-secondary text-white',
      low: 'bg-info text-white'
    };
    return badges[priority] || badges.normal;
  };

  if (isNewMail == false ) {
    return threadId && (
      <div  className="position-fixed bottom-0 z-50 " style={{ zIndex: 3, width: '400px',right:attachments?.length > 0 ? "37%" : "6%"  }}>
        <div className="card shadow-lg  mb-0 border-0">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <LuReply onClick={()=>setIsNewMail()}  className="me-2" />
              <span className="fw-semibold">Reply</span>
            </div>
            <div className="d-flex justify-content-center">
         
         <button
           type="button"
           className=" btn rounded-circle text-white btn-md bg-green-950"
           disabled={sending}
           onClick={handleSubmit}
         >
           {sending ? (
             <>
               <span className="spinner-border spinner-border-sm w-5 m-0" />
             
             </>
           ) : (
             <>
               <FaPaperPlane className="me-0" />
               {/* Reply */}
             </>
           )}
         </button>
       </div>
            {/* <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={() =>{ setIsNewMail(false);setAttachments([])}}
            ></button> */}
          </div>
          
          <div className="card-body p-3">
            {msgId && (
              <div className="mb-2 d-flex gap-2 items-center">
                <small className="text-muted">Subject:</small>
                <div className="fw-medium">{msgId}</div>
              </div>
            )}
            
            <div className="mb-3 d-flex gap-2 items-center">
              <small className="text-muted">To:</small>
              <div className="fw-medium">{vendor?.email}</div>
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
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIconClick}
              >
                <MdAttachFile className="me-1" />
                Attach Files
              </button>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mb-3">
                <small className="text-muted">Attachments ({attachments.length}):</small>
                {attachments.map((file, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center bg-light p-2 rounded mt-1">
                    <small className='w-75'>{file.filename}</small>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeAttachment(idx)}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-3">
              <textarea
                name="body"
                className="form-control"
                rows="3"
                placeholder="Write your reply..."
                value={form.body}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="alert alert-danger alert-sm p-2 mb-3">
                {error}
              </div>
            )}

          
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onsubmit={handleSubmit} className="bg-white shadow rounded-3 p-4 mx-auto border border-secondary" >
    <h2 className="h5 fw-semibold mb-4">📧 Send New Email</h2>
  
    <div id="errorMessage" className="text-danger mb-3 d-none">
    {error && <p classNameName="text-danger mb-2">{error}</p>}
    </div>
  
    {/* <div className="mb-3">
      <label for="to" className="form-label fw-bold">Mail To</label>
      <input
        type="email"
        name="to"
        id="to"
        className="form-control"
        placeholder="recipient@example.com"
        value={form.to}
        onChange={handleChange}
        required
      />
    </div> */}
  
    <div className="mb-3 d-flex gap-2 align-items-center">
      <label for="subject" className="form-label fw-semibold">Subject: </label>
      <input
        type="text"
        name="subject"
        id="subject"
        className="form-control"
        placeholder="Subject of the email"
        value={form.subject}
          onChange={handleChange}
      />
    </div>
    {/* <div className="mb-3">
  <label className="form-label fw-semibold">Attachments</label>
  <input
    type="file"
    multiple
    className="form-control"
    onChange={(e) => handleFileChange(e)}
  />
</div> */}
    <div className="mb-4"     style={{ height: "400px"}}>
      <label for="body" className="form-label fw-semibold">Message Body</label>
      {/* <textarea
        name="body"
        id="body"
        className="form-control"
        rows="6"
        placeholder="Write your message..."
        value={form.body}
        onChange={handleChange}
      ></textarea> */}
      <ReactQuill
              name="body"
        id="body"
        value={form.body}
        onChange={(value)=> setForm((prev) => ({ ...prev, body: value }))}
        placeholder='Write your message...'
        style={{ height: "300px"}}
        modules={{
          toolbar: [
            [{ header: [1, 2,3,4,5,6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            [{ font: [] }],
            ['link',],
            ['link', 'image', 'video'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['code-block', 'blockquote'],
            ['table'], // Table option if using custom modules/plugins
          ],
        }}
      />
    </div>
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
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIconClick}
              >
                <MdAttachFile className="me-1" />
                Attach Files
              </button>
            </div>
              {/* Attachments List */}
              {attachments.length > 0 && (
              <div className="mb-3">
                <small className="text-muted">Attachments ({attachments.length}):</small>
                {attachments.map((file, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center bg-light p-2  rounded py-1">
                    <small>{idx +1}. {file.filename}</small>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeAttachment(idx)}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
    <button
      type="button"
      id="sendButton"
      className="btn btn-success mt-10"
      disabled={sending}
      onClick={handleSubmit}
    >
       {sending ? 'Sending...' : 'Send Email'}
    </button>
    {/* {attachments.length > 0 && (
  <ol className="mt-2 small">
    {attachments.map((file, idx) => (
      <li key={idx}>{file.filename}</li>
    ))}
  </ol>
)} */}
{/* <PreviewQuotationPDF setAttachments={setAttachments}  /> */}
  </form>
  );
}