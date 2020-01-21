import React, { useState } from 'react';
import './style.css';

export default function () {
  const [files, setFiles] = useState([]);

  const onDrop = (event) => {
    event.preventDefault();
    event.persist();

    let acceptedFiles = [];

    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          let file = event.dataTransfer.items[i].getAsFile();
          file.preview = URL.createObjectURL(file);
          acceptedFiles.push(file);
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        let file = event.dataTransfer.files[i];
        file.preview = URL.createObjectURL(file);
        acceptedFiles.push(file);
      }
    }
    setFiles(acceptedFiles);
  };

  return (
    <div className="wrapper">
      <div className="dotted" onDrop={onDrop} onDragOver={event => event.preventDefault()}>
        <h2>Drop your files here...</h2>
      </div>
      <div className="thumbnail-container">
        {files.map((file, index) => (
          <div key={index} className="thumbnail-wrapper">
            <img className="image" alt="" src={file.preview} />
          </div>
        ))}
      </div>
    </div>
  );
}
