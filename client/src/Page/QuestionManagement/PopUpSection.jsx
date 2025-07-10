// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import styles from './popupSection.module.css';
// import axios from 'axios';
// import { FaCloudUploadAlt } from "react-icons/fa";
// import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
// import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
// import {axiosInstance} from "../../utility/axiosInstance"
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function AdvertPost() {
//   const [advertDescription, setAdvertDescription] = useState('');
//   const [duration, setDuration] = useState('');
//   const [file, setFile] = useState(null);
//   const [errors, setErrors] = useState({});

//   const onDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const auth = useAuthUser();
//   const authHeader = useAuthHeader();
//   const userNameId = auth?.userNameId;

//   const {
//     getRootProps,
//     getInputProps,
//     isDragActive
//   } = useDropzone({ onDrop });

//   const validate = () => {
//     const wordCount = advertDescription.trim().split(/\s+/).length;
//     if (!advertDescription.trim()) {
//       toast.warning(' Description is required!');
//     } else if (wordCount > 120) {
//       toast.warning(' Description should not exceed 120 words!');
//     }
  
//     if (!duration.trim()) {
//       toast.warning(' Duration is required!');
//     } else if (!/^\d+$/.test(duration)) {
//       toast.warning(' Duration must be a number!');
//     } else {
//       const durationNumber = parseInt(duration, 10);
//       if (durationNumber < 1 || durationNumber > 12) {
//         toast.warning(' Duration must be between 1 and 12 months!');
//       }
//     }
  
//     if (!file) {
//       toast.warning(' Please upload a media file!');
//     }

//     return true
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     const formData = new FormData();
//     formData.append('advertDescription', advertDescription);
//     formData.append('duration', duration);
//     formData.append('file', file);
    
//     try {
//       const res = await axiosInstance.post(`/Advert/createAd/${userNameId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization : authHeader
//         }
//       });
//       toast.success('Advert request sent successfully please check your email frequently!');
//     } catch (error) {
//        console.log(error?.response.data.ErrorMessage)
//        error?.response.data.ErrorMessage ?   toast.error(error?.response.data.ErrorMessage) :  toast.error("Something went wrong please try again")
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>📢 Post a New Advertisement</h1>

//       <form onSubmit={handleSubmit} className={styles.form}>
//         <label className={styles.label}>Advertisement Description:</label>
//         <textarea
//           className={styles.textarea}
//           rows={5}
//           value={advertDescription}
//           onChange={(e) => setAdvertDescription(e.target.value)}
//           placeholder="Write your advert (max 120 words)..."
//         />
//         {errors.advertDescription && <p className={styles.error}>{errors.advertDescription}</p>}

//         <label className={styles.label}>Duration (minimum one month):</label>
//         <input
//           className={styles.input}
//           type="text"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//           placeholder="Enter duration in months"
//         />
//         {errors.duration && <p className={styles.error}>{errors.duration}</p>}

//         <label className={styles.label}>Upload Media:</label>
//         <div {...getRootProps()} className={styles.dropzone}>
//           <input {...getInputProps()} />
//           {
//             isDragActive
//               ? <p> Drop the file here...</p>
//               : <p> <FaCloudUploadAlt />  Drag & drop or click here to select your file</p>
//           }
//         </div>
//         {errors.file && <p className={styles.error}>{errors.file}</p>}

//         <button type="submit" className={styles.button}>🚀 Submit</button>
//       </form>
//       <ToastContainer position="top-right" autoClose={3000} />

//     </div>
//   );
// }

// export default AdvertPost;


import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './popupSection.module.css';
import { FaCloudUploadAlt } from "react-icons/fa";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { axiosInstance } from "../../utility/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadQuestionAndAnswer() {
  const [phase, setPhase] = useState('');
  const [week, setWeek] = useState('');
  const [titleOfTheWeek, setTitleOfTheWeek] = useState('');
  const [additionalRecourseLink, setAdditionalRecourseLink] = useState('');
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const userNameId = auth?.userNameId;
  console.log(auth)
  const handleQuestionDrop = (acceptedFiles) => {
    setQuestionFile(acceptedFiles[0]);
  };

  const handleAnswerDrop = (acceptedFiles) => {
    setAnswerFile(acceptedFiles[0]);
  };

  const validate = () => {
    if (!phase.trim()) {
      toast.warning("Phase is required!");
      return false;
    }
    if (!week.trim()) {
      toast.warning("Week is required!");
      return false;
    }
    if (!titleOfTheWeek.trim()) {
      toast.warning("Title of the week is required!");
      return false;
    }
    if (!additionalRecourseLink.trim()) {
      toast.warning("Additional resource link is required!");
      return false;
    }
    if (!questionFile) {
      toast.warning("Please upload the Question ZIP file!");
      return false;
    }
    if (!answerFile) {
      toast.warning("Please upload the Answer ZIP file!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('phase', phase);
    formData.append('week', week);
    formData.append('titleOfTheWeek', titleOfTheWeek);
    formData.append('additionalRecourseLink', additionalRecourseLink);
    formData.append('questionReferenceLink', questionFile);
    formData.append('answerReferenceLink', answerFile);

    try {
      await axiosInstance.post(`/Question/upload-question/${userNameId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authHeader
        }
      });
      toast.success("Upload successful!");
      // Reset form
      setPhase('');
      setWeek('');
      setTitleOfTheWeek('');
      setAdditionalRecourseLink('');
      setQuestionFile(null);
      setAnswerFile(null);
    } catch (error) {
      console.log(error?.response?.data?.ErrorMessage);
      error?.response?.data?.ErrorMessage
        ? toast.error(error.response.data.ErrorMessage)
        : toast.error("Upload failed. Please try again.");
    }
  };

  const {
    getRootProps: getQuestionRootProps,
    getInputProps: getQuestionInputProps,
    isDragActive: isQuestionDragActive
  } = useDropzone({
    onDrop: handleQuestionDrop,
    accept: { 'application/zip': ['.zip'] }
  });

  const {
    getRootProps: getAnswerRootProps,
    getInputProps: getAnswerInputProps,
    isDragActive: isAnswerDragActive
  } = useDropzone({
    onDrop: handleAnswerDrop,
    accept: { 'application/zip': ['.zip'] }
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📚 Upload Question and Answer ZIP Files</h1>
      <form onSubmit={handleSubmit} className={styles.form}>

        <label className={styles.label}>Phase:</label>
        <input
          className={styles.input}
          type="text"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          placeholder="Enter phase"
        />

        <label className={styles.label}>Week:</label>
        <input
          className={styles.input}
          type="text"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          placeholder="Enter week"
        />

        <label className={styles.label}>Title of the Week:</label>
        <input
          className={styles.input}
          type="text"
          value={titleOfTheWeek}
          onChange={(e) => setTitleOfTheWeek(e.target.value)}
          placeholder="Enter title of the week"
        />

        <label className={styles.label}>Additional Resource Link:</label>
        <input
          className={styles.input}
          type="text"
          value={additionalRecourseLink}
          onChange={(e) => setAdditionalRecourseLink(e.target.value)}
          placeholder="Enter resource link"
        />

        <label className={styles.label}>Upload Question ZIP:</label>
        <div {...getQuestionRootProps()} className={styles.dropzone}>
          <input {...getQuestionInputProps()} />
          {isQuestionDragActive ? (
            <p>Drop the Question ZIP here...</p>
          ) : (
            <p><FaCloudUploadAlt /> {questionFile ? questionFile.name : "Drag & drop or click to upload Question ZIP"}</p>
          )}
        </div>

        <label className={styles.label}>Upload Answer ZIP:</label>
        <div {...getAnswerRootProps()} className={styles.dropzone}>
          <input {...getAnswerInputProps()} />
          {isAnswerDragActive ? (
            <p>Drop the Answer ZIP here...</p>
          ) : (
            <p><FaCloudUploadAlt /> {answerFile ? answerFile.name : "Drag & drop or click to upload Answer ZIP"}</p>
          )}
        </div>

        <button type="submit" className={styles.button}>🚀 Upload</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UploadQuestionAndAnswer;

