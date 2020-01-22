import React, { useState, useCallback, useRef, useEffect } from 'react';
import './style.css';

export default function ({ onDrop, onUpload }) {
  const canvasRef = useRef(null);
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(null);
  const [compression, setCompression] = useState(50);
  const [progress, setProgress] = useState(0);

  const onDropCb = useCallback((event) => {
    event.preventDefault();
    event.persist();

    let uploadedFile;

    if (event.dataTransfer.items) {
      // loop and get first file
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          uploadedFile = event.dataTransfer.items[i].getAsFile();
          uploadedFile.preview = URL.createObjectURL(uploadedFile);
          break;
        }
      }
    } else {
      uploadedFile = event.dataTransfer.files[0];
      uploadedFile.preview = URL.createObjectURL(uploadedFile);
    }

    setFile(uploadedFile);
    setUpload(uploadedFile);

    if (onDrop) {
      onDrop(uploadedFile);
    }
  }, [onDrop]);

  useEffect(() => {
    drawCanvas();
  })

  const drawCanvas = useCallback((cb) => {
    let ctx = canvasRef.current.getContext('2d');
    let reader = new FileReader();

    reader.onloadend = () => {
      let img = new Image();
      img.src = reader.result;
      img.onload = () => {
        // Set canvas size equal to image size
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
        if (cb) {
          cb();
        }
      };
    };
    if (upload) {
      reader.readAsDataURL(upload);
    }
  }, [upload])

  const onCompressionChange = useCallback(event => {
    event.persist();
    setCompression(event.target.value);

    drawCanvas(() => {
      canvasRef.current.toBlob(blob => {
        blob.preview = URL.createObjectURL(blob);
        setFile(blob);
      }, 'image/jpeg', event.target.value / 100)
    })
  }, [drawCanvas]);

  const onUploadCb = useCallback(() => {
    setProgress(100)
    if (onUpload) {
      onUpload(file);
    }
  }, [file, onUpload])

  return (
    <div className="wrapper">
      <div className="dotted" onDrop={onDropCb} onDragOver={event => event.preventDefault()}>
        <h2>Drop your files here...</h2>
      </div>
      <div className="content">
        {upload && (
          <div className="preview-wrapper">
            <h2 className="heading">Original</h2>
            <img className="preview" alt="" src={upload.preview} />
          </div>
        )}
        {file && (
          <div className="preview-wrapper">
            <h2 className="heading">Preview</h2>
            <img className="preview" alt="" src={file.preview} />
          </div>
        )}
      </div>
      <div className="footer">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <div className="footer-internal">
          <div className="slider">
            <label htmlFor="compression">Compression ({compression}%)</label>
            <input id="compression" type="range" min="0" max="100" onChange={onCompressionChange} />
          </div>
          <div className="action">
            <button type="button" onClick={onUploadCb}>Upload</button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}
