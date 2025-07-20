import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./popupSection.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { axiosInstance } from "../../utility/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadQuestionAndAnswer() {
  // Separate states for options and selected values
  const [phaseList, setPhaseList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [titleOfTheWeek, setTitleOfTheWeek] = useState("");
  const [additionalRecourseLink, setAdditionalRecourseLink] = useState("");
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const userNameId = auth?.userNameId;

  useEffect(() => {
    getPhaseAndWeek();
  }, []);

  const getPhaseAndWeek = async () => {
    try {
      const getWeek = await axiosInstance.get("/WeekAndPhase/getAllWeek", {
        headers: {
          Authorization: authHeader,
        },
      });

      setWeekList(getWeek?.data?.weeks || []);

      const getPhase = await axiosInstance.get("/WeekAndPhase/getAllPhases", {
        headers: {
          Authorization: authHeader,
        },
      });

      setPhaseList(getPhase?.data?.phases || []);
    } catch (error) {
      console.error("Failed to fetch phase/week:", error);
      toast.error("Failed to load week/phase data.");
    }
  };

const handleQuestionDrop = (acceptedFiles) => {
  const file = acceptedFiles[0];
  if (file && file.size > 10 * 1024 * 1024) {
    toast.warning("Question ZIP file size must be 10MB or less.");
    return;
  }
  setQuestionFile(file);
};

const handleAnswerDrop = (acceptedFiles) => {
  const file = acceptedFiles[0];
  if (file && file.size > 10 * 1024 * 1024) {
    toast.warning("Answer ZIP file size must be 10MB or less.");
    return;
  }
  setAnswerFile(file);
};

  const validate = () => {
    if (!selectedPhase.trim()) {
      toast.warning("Phase is required!");
      return false;
    }
    if (!selectedWeek.trim()) {
      toast.warning("Week is required!");
      return false;
    }
    if (!titleOfTheWeek.trim()) {
      toast.warning("Title of the week is required!");
      return false;
    }
    // if (!additionalRecourseLink.trim()) {
    //   toast.warning("Additional resource link is required!");
    //   return false;
    // }
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
    formData.append("phase", selectedPhase);
    formData.append("week", selectedWeek);
    formData.append("titleOfTheWeek", titleOfTheWeek);
    formData.append("additionalRecourseLink", additionalRecourseLink);
    formData.append("QuestionReferenceLink", questionFile);
    formData.append("AnswerReferenceLink", answerFile);

    let instructorId = auth.instructorId;
    let courseId = auth.instructorAssignedCourse;
    try {
      await axiosInstance.post(
        `/Question/upload-question/${instructorId}/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authHeader,
          },
        }
      );
      toast.success("Upload successful!");

      // Reset form
      setSelectedPhase("");
      setSelectedWeek("");
      setTitleOfTheWeek("");
      setAdditionalRecourseLink("");
      setQuestionFile(null);
      setAnswerFile(null);
    } catch (error) {
      console.log(error?.response?.data?.ErrorMessage);
      toast.error(
        error?.response?.data?.ErrorMessage ||
          "Upload failed. Please try again."
      );
    }
  };

  const {
    getRootProps: getQuestionRootProps,
    getInputProps: getQuestionInputProps,
    isDragActive: isQuestionDragActive,
  } = useDropzone({
    onDrop: handleQuestionDrop,
    accept: { "application/zip": [".zip"] },
  });

  const {
    getRootProps: getAnswerRootProps,
    getInputProps: getAnswerInputProps,
    isDragActive: isAnswerDragActive,
  } = useDropzone({
    onDrop: handleAnswerDrop,
    accept: { "application/zip": [".zip"] },
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        📚 Upload Question and Answer ZIP Files
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Phase Dropdown */}
        <label className={styles.label}>Select Phase:</label>
        <select
          className={styles.input}
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
        >
          <option value="" disabled>
            Select phase
          </option>
          {phaseList.map((SinglePhase) => (
            <option key={SinglePhase.phaseId} value={SinglePhase.phaseId}>
              {SinglePhase.phaseName}
            </option>
          ))}
        </select>

        {/* Week Dropdown */}
        <label className={styles.label}>Select Week:</label>
        <select
          className={styles.input}
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          <option value="" disabled>
            Select week
          </option>
          {weekList.map((singleWeek) => (
            <option key={singleWeek.WeekId} value={singleWeek.WeekId}>
              {singleWeek.WeekName}
            </option>
          ))}
        </select>

        {/* Title of the week */}
        <label className={styles.label}>Title of the Week:</label>
        <input
          className={styles.input}
          type="text"
          value={titleOfTheWeek}
          onChange={(e) => setTitleOfTheWeek(e.target.value)}
          placeholder="Enter title of the week"
        />

        {/* Additional Link */}
        <label className={styles.label}>Additional Resource Link:</label>
        <input
          className={styles.input}
          type="text"
          value={additionalRecourseLink}
          onChange={(e) => setAdditionalRecourseLink(e.target.value)}
          placeholder="Enter resource link (optional)"
        />

        {/* Question ZIP */}
        <label className={styles.label}>Upload Question ZIP:</label>
        <div {...getQuestionRootProps()} className={styles.dropzone}>
          <input {...getQuestionInputProps()} />
          {isQuestionDragActive ? (
            <p>Drop the Question ZIP here...</p>
          ) : (
            <p>
              <FaCloudUploadAlt />{" "}
              {questionFile
                ? questionFile.name
                : "Drag & drop or click to upload Question ZIP...max 10MB"}
            </p>
          )}
        </div>

        {/* Answer ZIP */}
        <label className={styles.label}>Upload Answer ZIP:</label>
        <div {...getAnswerRootProps()} className={styles.dropzone}>
          <input {...getAnswerInputProps()} />
          {isAnswerDragActive ? (
            <p>Drop the Answer ZIP here</p>
          ) : (
            <p>
              <FaCloudUploadAlt />{" "}
              {answerFile
                ? answerFile.name
                : "Drag & drop or click to upload Answer ZIP...max 10MB"}
            </p>
          )}
        </div>

        <button type="submit" className={styles.button}>
          🚀 Upload
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UploadQuestionAndAnswer;
