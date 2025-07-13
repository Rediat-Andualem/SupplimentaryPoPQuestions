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


function ManageQuestions() {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
    const [QuestionAndAnswer, setQuestionAndAnswer] = useState([]);
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

  const deleteQuestion = async (questionAndAnswerId)=>{
        try {
      await axiosInstance.delete(
        `/Question/deleteQandA/${questionAndAnswerId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      getAllQuestions();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  }

//  const getQuestions = async (questionReferenceLink) => {
//   try {
//     const response = await axiosInstance.get (`/Question/getQuestion/${questionReferenceLink}`, {
//       method: "GET",
//        headers: {
//             Authorization: authHeader,
//           },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch question file.");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     // Open file in new tab (if zip, browser will usually download)
//     window.open(url, "_blank");
//   } catch (err) {
//     console.log(err)
//     console.error("Error fetching question file:", err.message);
//   }
// };


// const getAnswer = async (answerReferenceLink) => {
//   try {
//     const response = await axiosInstance.get (`/Question/getAnswer/${answerReferenceLink}`, {
//       method: "GET",
//        headers: {
//             Authorization: authHeader,
//           },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch answer file.");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     // Open or download
//     window.open(url, "_blank");
//   } catch (err) {
//     console.error("Error fetching answer file:", err.message);
//   }
// };

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

console.log(QuestionAndAnswer)

  const paginationModel = { page: 0, pageSize: 10 };
  return (

    <div>
         <div className="text-underline container mx-auto row m-4">
        <h4 className="text-center">PopUp Questions</h4>
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
                      >Download
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

                 { field: "additionalRecourseLink", headerName: "Reference Link", width: 200 },

                {
                  field: "questionAndAnswerId",
                  headerName: "Action",
                  renderCell: (params) => (
               
                     <Button
                        style={{ margin: "5px" }}
                        onClick={() => deleteQuestion(params.row.questionAndAnswerId)}
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
    </div>
  )
}

export default ManageQuestions
