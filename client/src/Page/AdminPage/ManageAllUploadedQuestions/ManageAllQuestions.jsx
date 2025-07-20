import React, { useEffect, useState } from 'react'

import { axiosInstance } from "../../../Utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ManageAllQuestions() {
  const authHeader = useAuthHeader();
  const [QuestionAndAnswer, setQuestionAndAnswer] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const res = await axiosInstance.get("/Course/getAllCourses", {
        headers: { Authorization: authHeader },
      });
      setCourses(res.data.courses);
    } catch (error) {
      toast.error("Error fetching courses");
      console.error(error);
    }
  };

  const getAllQuestions = async () => {
    if (!selectedCourseId) {
      toast.warn("Please select a course first");
      return;
    }

    try {
      const allQandA = await axiosInstance.get(
        `/Question/getAllQ&A/${selectedCourseId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setQuestionAndAnswer(allQandA.data);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch questions");
    }
  };

  const handleDeleteClick = (questionAndAnswerId) => {
    setSelectedDeleteId(questionAndAnswerId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/Question/deleteQandA/${selectedDeleteId}`, {
        headers: {
          Authorization: authHeader,
        },
      });
      toast.success("Question deleted");
      setShowConfirmModal(false);
      getAllQuestions(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete question");
      console.error("Error deleting question:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedDeleteId(null);
  };

  const getFileName = (fullPath) => fullPath?.split("/").pop();

  const getAnswer = async (filename) => {
    try {
      const response = await fetch(`${axiosInstance.defaults.baseURL}/Question/getAnswer/${filename}`, {
        headers: { Authorization: authHeader },
      });

      if (!response.ok) throw new Error("Failed to fetch answer file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Error downloading answer");
    }
  };

  const getQuestions = async (filename) => {
    try {
      const response = await fetch(`${axiosInstance.defaults.baseURL}/Question/getQuestion/${filename}`, {
        headers: { Authorization: authHeader },
      });

      if (!response.ok) throw new Error("Failed to fetch question file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Error downloading question");
    }
  };

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="container my-5">
      <h4 className="mb-3 text-decoration-underline">Manage Questions</h4>

      {/* Course Selection */}
      <Form className="d-flex align-items-center mb-4">
        <Form.Group controlId="courseSelect" className="me-3">
          <Form.Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select Course </option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={getAllQuestions}>
          Get Questions
        </Button>
      </Form>

      {/* Question Table */}
      {QuestionAndAnswer.length === 0 ? (
        <h5 className="text-muted">No Questions found <PiSmileySadThin /></h5>
      ) : (
        <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
          <DataGrid
            rows={QuestionAndAnswer.map((qa, index) => ({
              id: index,
              Phase: qa.phaseName,
              week: qa.weekName,
              titleOfTheWeek: qa.titleOfTheWeek,
              questionReferenceLink: getFileName(qa.questionReferenceLink),
              AnswerReferenceLink: getFileName(qa.AnswerReferenceLink),
              additionalRecourseLink: qa.additionalRecourseLink,
              questionAndAnswerId: qa.questionAndAnswerId,
            }))}
            columns={[
              { field: "Phase", headerName: "Phase", width: 100 },
              { field: "week", headerName: "Week", width: 100 },
              { field: "titleOfTheWeek", headerName: "Title Of The Week", width: 350 },
              {
                field: "questionReferenceLink",
                headerName: "Question",
                renderCell: (params) => (
                  <Button
                    onClick={() => getQuestions(params.row.questionReferenceLink)}
                    variant="primary"
                    size="sm"
                  >
                    Download
                  </Button>
                ),
                width: 120,
              },
              {
                field: "AnswerReferenceLink",
                headerName: "Answer",
                renderCell: (params) => (
                  <Button
                    onClick={() => getAnswer(params.row.AnswerReferenceLink)}
                    variant="info"
                    size="sm"
                  >
                    Download
                  </Button>
                ),
                width: 120,
              },
              {
                field: "additionalRecourseLink",
                headerName: "Reference Link",
                width: 200,
              },
              {
                field: "questionAndAnswerId",
                headerName: "Action",
                renderCell: (params) => (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(params.row.questionAndAnswerId)}
                  >
                    Delete
                  </Button>
                ),
                width: 100,
              },
            ]}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            sx={{ border: 2 }}
          />
        </Paper>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={handleCancelDelete} centered>
        <Modal.Body style={{ backgroundColor: "#add8e6" }}>
          <h5>Are you sure you want to delete this question?</h5>
          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="danger"
              className="me-2"
              onClick={handleConfirmDelete}
            >
              Yes
            </Button>
            <Button
              style={{ backgroundColor: "#d3d3d3", borderColor: "#d3d3d3", color: "black" }}
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default ManageAllQuestions;
