import React, { useState, useCallback } from 'react';
import './style.css';

export default function ({ onDrop }) {
  const [file, setFile] = useState(null);

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

    if (onDrop) {
      onDrop(uploadedFile);
    }
  }, [ onDrop ]);

  return (
    <div className="wrapper">
      <div className="content">
        <div className="dotted" onDrop={onDropCb} onDragOver={event => event.preventDefault()}>
          <h2>Drop your files here...</h2>
        </div>
        {file && (
          <div className="preview-wrapper">
            <h2 className="heading">Preview</h2>
            <img className="preview" alt="" src={file.preview} />
          </div>
        )}
      </div>
      <div className="footer">
        <div className="progress"></div>
        <div className="footer-internal">
          <div className="slider">
            <label htmlFor="compression">Compression</label>
            <input id="compression" type="range" min="0" max="100" />
          </div>
          <div className="action">
            <button type="button">Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}
