import React, { useRef, useState, useCallback, useEffect } from 'react';
import { uploadSignature } from '../../../redux/quotation';
import moment from 'moment';

// Mock SignatureCanvas component for demo purposes
const SignatureCanvas = React.forwardRef(({ penColor, backgroundColor, canvasProps, onBegin, onEnd, velocityFilterWeight, minWidth, maxWidth, throttle, disabled }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  React.useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPaths([]);
      setCurrentPath([]);
    },
    isEmpty: () => paths.length === 0 && currentPath.length === 0,
    getTrimmedCanvas: () => canvasRef.current,
    toData: () => paths,
    fromData: (data) => {
      setPaths(data);
      redraw();
    }
  }));

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all paths
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    [...paths, currentPath].forEach(path => {
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    redraw();
  }, [paths, currentPath, penColor, backgroundColor]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentPath([pos]);
    onBegin && onBegin();
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || disabled) return;
    const pos = getMousePos(e);
    setCurrentPath(prev => [...prev, pos]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setPaths(prev => [...prev, currentPath]);
    setCurrentPath([]);
    onEnd && onEnd();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...canvasProps}
      style={{
        ...canvasProps.style,
        background: backgroundColor,
        border: '2px solid #e9ecef',
        borderRadius: '8px'
      }}
    />
  );
});

const DigitalSignature = ({
  width = 600,
  height = 300,
  details,
  penColor = '#000000',
  backgroundColor = '#ffffff',
  onSave,
  onClear = () => {},
  disabled = false,
  showTitle = true,
  title = "Digital Signature",
  buttonText = "Add Signature",
  showSignatureButton = true,
  initiallyOpen = false,
  savedSignature, setSavedSignature,
}) => {
    console.log("Singnature : ",savedSignature)
  const sigCanvas = useRef({});
  const [isEmpty, setIsEmpty] = useState(true);
  const [strokeColor, setStrokeColor] = useState(penColor);
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [isModalOpen, setIsModalOpen] = useState(initiallyOpen);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle modal visibility
  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  // Clear the signature pad
  const clear = useCallback(() => {
    sigCanvas.current.clear();
    setIsEmpty(true);
    onClear();
  }, [onClear]);

  // Save the signature as image
  const save = useCallback(async () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
  
      const canvas = sigCanvas.current.getTrimmedCanvas();
  
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `signature-${Date.now()}.png`, { type: "image/png" });
  
          // Store the file (instead of base64 string)
          setSavedSignature(file);
  
          // Close modal
          setIsModalOpen(false);
  
          // Callback with file
          onSave(file);
        }
      }, "image/png");

    } catch (error) {
      console.error('Error saving signature:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onSave]);

  // Handle signature begin
  const handleBegin = useCallback(() => {
    setIsEmpty(false);
  }, []);

  // Handle signature end
  const handleEnd = useCallback(() => {
    setIsEmpty(sigCanvas.current.isEmpty());
  }, []);

  // Download signature as image
  const downloadSignature = useCallback(() => {
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    
    const canvas = sigCanvas.current.getTrimmedCanvas();
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `signature-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, []);

  // Undo last stroke
  const undo = useCallback(() => {
    const data = sigCanvas.current.toData();
    if (data && data.length > 0) {
      data.pop();
      sigCanvas.current.fromData(data);
      setIsEmpty(data.length === 0);
    }
  }, []);

  // Edit existing signature
  const editSignature = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Remove saved signature
  const removeSignature = useCallback(() => {
    setSavedSignature(null);
    clear();
  }, [clear]);

  return (
    <>
      <style>
        {`
          .signature-trigger-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          
          .signature-trigger-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }
          
          .signature-preview-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            border: 2px dashed #e9ecef;
            transition: all 0.3s ease;
          }
          
          .signature-preview-card:hover {
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            transform: translateY(-2px);
          }
          
          .signature-preview-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          
          .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          }
          
          .modal-header {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: none;
            border-radius: 20px 20px 0 0;
            padding: 24px 30px;
          }
          
          .signature-canvas-container {
            position: relative;
            display: inline-block;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .signature-canvas {
            display: block;
            cursor: crosshair;
            transition: all 0.2s ease;
          }
          
          .signature-canvas:hover {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
          }
          
          .color-picker {
            width: 50px;
            height: 40px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .color-picker:hover {
            border-color: #667eea;
            transform: scale(1.05);
          }
          
          .btn-action {
            border-radius: 10px;
            padding: 10px 20px;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 2px solid transparent;
          }
          
          .btn-action:hover:not(:disabled) {
            transform: translateY(-1px);
          }
          
          .btn-primary-custom {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-color: #28a745;
            color: white;
          }
          
          .btn-primary-custom:hover:not(:disabled) {
            background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          }
          
          .btn-danger-custom {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
            border-color: #dc3545;
            color: white;
          }
          
          .btn-danger-custom:hover:not(:disabled) {
            background: linear-gradient(135deg, #fd7e14 0%, #dc3545 100%);
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
          }
          
          .signature-status {
            background: #f8f9fa;
            border-radius: 20px;
            padding: 12px 20px;
            margin-top: 20px;
            text-align: center;
          }
          
          .status-success {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724;
          }
          
          .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="signature-container">
        {/* Trigger Button */}
        {showSignatureButton && (
          <div className="mb-4">
            {!details?.customer_sign ? (
              <button
                type="button"
                className="btn signature-trigger-btn text-white"
                onClick={toggleModal}
                disabled={disabled}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline'}}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
                {buttonText}
              </button>
            ) : (
        <button
                type="button"
                className="btn signature-trigger-btn text-white"
                onClick={toggleModal}
                disabled={disabled}
              >
                {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline'}}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg> */}
                <i style={{fontSize:"20px"}} className="ti ti-signature"></i>    
                            View Signature
              </button>
            )}
          </div>
        )}

        {/* Bootstrap Modal */}
        {isModalOpen && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{maxWidth:"600px",}}>
        <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{title}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={toggleModal}
                    disabled={isLoading}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                { ( !details?.customer_sign) ? <>
                  {/* Signature Canvas */}
                  <div className="text-center mb-4">
                    <div className="signature-canvas-container">
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor={strokeColor}
                        backgroundColor={bgColor}
                        canvasProps={{
                          width: Math.min(width, 550),
                          height: Math.min(height, 250),
                          className: 'signature-canvas'
                        }}
                        onBegin={handleBegin}
                        onEnd={handleEnd}
                        velocityFilterWeight={0.7}
                        minWidth={1}
                        maxWidth={3}
                        throttle={16}
                        disabled={disabled || isLoading}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row g-2 mb-3">
                    <div className="col-6 col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100 btn-action"
                        onClick={clear}
                        disabled={disabled || isEmpty || isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        Clear
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-warning w-100 btn-action"
                        onClick={undo}
                        disabled={disabled || isEmpty || isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <polyline points="3,3 3,8 8,8" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        Undo
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-info w-100 btn-action"
                        onClick={downloadSignature}
                        disabled={disabled || isEmpty || isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Download
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        type="button"
                        className="btn btn-primary-custom w-100 btn-action"
                        onClick={save}
                        disabled={disabled || isEmpty || isLoading}
                      >
                        {isLoading ? (
                          <div className="loading-spinner me-2"></div>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>
                          </svg>
                        )}
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  </>
                   :    <div className="signature-preview-card fade-in" style={{maxWidth: '600px'}}>
                   <div className="d-flex flex-column align-items-center">
                     <div className="mb-3">
                       {/* <img 
                         src={savedSignature} 
                         alt="Digital Signature" 
                         className="signature-preview-image"
                         style={{maxHeight: '100px'}}
                       /> */}
                       {details?.customer_sign && (
  <img
    src={details?.customer_sign}
    alt="Digital Signature"
    className="signature-preview-image"
    style={{maxHeight: '100px'}}
  />
)}
                     </div>
                     {/* <div className="d-flex gap-2">
                       <button
                         type="button"
                         className="btn btn-outline-primary btn-sm btn-action"
                         onClick={editSignature}
                         disabled={disabled}
                       >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" fill="none"/>
                           <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                         </svg>
                         Edit
                       </button>
                       <button
                         type="button"
                         className="btn btn-outline-danger btn-sm btn-action"
                         onClick={removeSignature}
                         disabled={disabled}
                       >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                           <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" fill="none"/>
                           <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" stroke="currentColor" strokeWidth="2" fill="none"/>
                         </svg>
                         Remove
                       </button>
                     </div> */}
                   </div>
                 </div>}

                  {/* Status */}
                  <div className={`signature-status ${!isEmpty ? 'status-success' : ''}`}>
                    {isEmpty ? (
                      <span className="text-muted">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline'}}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                       {!details?.customer_sign ?  "Please sign in the area above " : 
                       "Uploaded at :"+ moment(details?.customer_sign_date).calendar()}
                      </span>
                    ) : (
                      <span className="fw-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-2" style={{display: 'inline'}}>
                          <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        Signature captured successfully!
                      </span>
                    )}
                  </div>
                </div>

              </div>
               
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DigitalSignature;