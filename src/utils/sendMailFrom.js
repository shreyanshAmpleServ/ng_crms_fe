import React, { useState } from 'react';
import { getAllMessage, sendMail } from '../redux/gmailAccess';
import { useDispatch } from 'react-redux';
import { LuReply } from "react-icons/lu";
import ReactQuill from 'react-quill';

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
  setIsNewMail
}) {
    const dispatch = useDispatch();
  const [form, setForm] = useState({
    to: vendor?.email || "",
    subject: '',
    body: '',
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
            ...(!isNewMail && {thread_id: threadId || ""} ),
            // ...(inReplyTo && { inReplyTo }),
            reply_to_message_id   : msgId,
            // reply_to_message_id   : "19850a0e98cbc216",
        };
        
        console.log("Fordm jsdfjjlsdkjfj : ",payload)
      await dispatch(sendMail(payload)); // 🔁 Call your actual function
      setForm({ to: vendor?.email, subject: '', body: '' });
      onSuccess();
      setMsgId()
      setThreadId()
      setIsNewMail()
      dispatch(getAllMessage(recordId));

    } catch (err) {
      console.error('Mail send failed', err);
      setError('❌ Failed to send mail');
    } finally {
      setSending(false);
      setMsgId()
      setThreadId()
      setIsNewMail()
    }
  };
  console.log("Thread : ",threadId)
  return (
    <>
  {isNewMail ?  
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
  
    <div className="mb-3">
      <label for="subject" className="form-label fw-semibold">Subject</label>
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
  
    <div className="mb-4">
      <label for="body" className="form-label fw-semibold">Body</label>
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
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
            ['code-block', 'blockquote'],
            [{ 'align': [] }],
            ['table'], // Table option if using custom modules/plugins
          ],
        }}
      />
    </div>
  
    <button
      type="button"
      id="sendButton"
      className="btn btn-success mt-5"
      disabled={sending}
      onClick={handleSubmit}
    >
       {sending ? 'Sending...' : 'Send Email'}
    </button>
  </form>
  :<div style={{top:"10vh"}} className='bg-white position-absolute w-100  shadow rounded-3 p-3 pt-1 mx-auto border border-secondary'>
   {msgId && <div className='d-flex gap-2 h5 fw-medium p-2'>Subject :  {msgId}</div>}
    <div className='d-flex gap-2 h5 fw-medium p-2'><LuReply className='fw-bold' /> {vendor?.email}</div>
    <div className='d-flex gap-2 align-items-center'>
  <textarea
        name="body"
        id="body"
        className="form-control"
        rows="2"
        placeholder="Reply to the email.."
        value={form.body}
        onChange={handleChange}
      ></textarea>
       <button
      type="button"
      id="sendButton"
      className="btn btn-success"
      style={{height:"3rem"}}
      disabled={sending}
      onClick={handleSubmit}
    >
       {sending ? 'Sending...' : 'Reply'}
    </button>
    </div>
      </div>}
      </>
  );
}
