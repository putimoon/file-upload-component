import React, { useRef, useState } from "react";
import "./FileUpload.css";
import { FaCheckCircle, FaFileAlt, FaUpload } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const fileRef = useRef(null);
  const openFileHandler = () => {
    fileRef.current.click();
  };
  const fileChangeHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const clearFileUpload = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };
  const uploadHandler = async () => {
    if (uploadStatus === "done") {
      clearFileUpload();
      return;
    }

    try {
      setUploadStatus("upload");
      const form = new FormData();
      form.append("file", selectedFile);
      const response = await axios.post("http://localhost:8000/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded * 100) / progress.total);
          setProgress(percent);
        },
      });

      if (response.status === 200) {
        setUploadStatus("done");
      }
      return response.data;
    } catch (error) {
      setUploadStatus("done");
    }
  };
  return (
    <div className="fileComponentDiv">
      <input
        onChange={fileChangeHandler}
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
      />
      {selectedFile ? (
        <div>
          <div className="fileInfo">
            <div className="fileIcon">
              <FaFileAlt />
            </div>
            <div>
              <div>{selectedFile.name}</div>
              <div>uploaded percent: {progress}</div>
            </div>
            <button onClick={clearFileUpload} className="uploadIcon">
              {uploadStatus === "done" ? (
                <FaCheckCircle />
              ) : (
                <IoIosCloseCircle />
              )}
            </button>
          </div>
          <button className="uploadButton" onClick={uploadHandler}>
            {uploadStatus === "done" ? "done" : "upload"}
          </button>
        </div>
      ) : (
        <div className="uploadSelect">
          <button className="uploadIcon" onClick={openFileHandler}>
            <FaUpload />
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
