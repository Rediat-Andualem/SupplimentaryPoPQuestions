import React, { useEffect, useState } from 'react'
import './ManageQuestions.css';
import { axiosInstance } from "../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";
import dayjs from "dayjs";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';




function ManageQuestions() {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [QuestionAndAnswer, setQuestionAndAnswer] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    getAllQuestions();
  }, []);

  const getAllQuestions = async () => {
    let courseId = auth.instructorAssignedCourse;
    try {
      let allQandA = await axiosInstance.get(
        `/Question/getAllQ&A/${courseId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setQuestionAndAnswer(allQandA?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteClick = (questionAndAnswerId) => {
    setSelectedDeleteId(questionAndAnswerId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(
        `/Question/deleteQandA/${selectedDeleteId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setShowConfirmModal(false);
      setSelectedDeleteId(null);
      getAllQuestions();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedDeleteId(null);
  };

  const getAnswer = async (answerReferenceLink) => {
    try {
      const response = await fetch(`${axiosInstance.defaults.baseURL}/Question/getAnswer/${answerReferenceLink}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch answer file.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", answerReferenceLink);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download answer error:", error.message);
    }
  };

  const getQuestions = async (questionReferenceLink) => {
    try {
      const response = await fetch(`${axiosInstance.defaults.baseURL}/Question/getQuestion/${questionReferenceLink}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch question file.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", questionReferenceLink);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download question error:", error.message);
    }
  };

  const getFileName = (fullPath) => {
    return fullPath?.split("/").pop();
  };

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div>
      <div className="text-underline container mx-auto row m-4">
        <h4 className="text-center">PopUp Questions </h4>
        <hr />

        {!QuestionAndAnswer || QuestionAndAnswer.length === 0 ? (
          <h4>
            No Question Uploaded so far <PiSmileySadThin />{" "}
          </h4>
        ) : (
          <Paper sx={{ height: "90%", width: "1000%", margin: "2%" }}>
            <DataGrid
              rows={QuestionAndAnswer?.map((singleQandA, index) => {
                return {
                  id: index,
                  Phase: singleQandA.phaseName,
                  week: singleQandA.weekName,
                  titleOfTheWeek: singleQandA.titleOfTheWeek,
                  questionReferenceLink: getFileName(singleQandA.questionReferenceLink),
                  AnswerReferenceLink: getFileName(singleQandA.AnswerReferenceLink),
                  additionalRecourseLink: singleQandA.additionalRecourseLink,
                  questionAndAnswerId: singleQandA.questionAndAnswerId,
                };
              })}
              columns={[
                {
                  field: "Phase",
                  headerName: "Phase",
                  width: 85,
                },
                {
                  field: "week",
                  headerName: "week",
                  width: 85,
                },
                { field: "titleOfTheWeek", headerName: "Title Of The Week", width: 500 },
                {
                  field: "questionReferenceLink",
                  headerName: "Question",
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() => getQuestions(params.row.questionReferenceLink)}
                      variant="primary"
                    >
                      Download
                    </Button>
                  ),
                  width: 115,
                },
                {
                  field: "AnswerReferenceLink",
                  headerName: "Answer",
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() => getAnswer(params.row.AnswerReferenceLink)}
                      variant="info"
                    >
                      Download
                    </Button>
                  ),
                  width: 115,
                },
                {
                  field: "additionalRecourseLink",
                  headerName: "Reference Link",
                  width: 200
                },
                {
                  field: "questionAndAnswerId",
                  headerName: "Action",
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() => handleDeleteClick(params.row.questionAndAnswerId)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  ),
                  width: 115,
                },
              ]}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              sx={{ border: 2 }}
            />
          </Paper>
        )}
      </div>

      {/* Confirmation Modal */}
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

export default ManageQuestions;
