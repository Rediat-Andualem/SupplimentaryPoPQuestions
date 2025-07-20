import React from "react";
import ReusableForm from "../../Components/ReusableForm/ReusableForm";
import ManageInstructors from "./ManageInstructors/ManageInstructors";
import DeleteUnconfirmedUsers from "./DeleteUnverifiedUsers/DeleteUnverifeid";
import ManageAllQuestions from "./ManageAllUploadedQuestions/ManageAllQuestions";
function AdminManagement() {
  let handleCourseSubmit = () => {
    console.log("enter course name");
  };

  return (
    <div className="container">
  <div className="d-flex flex-column flex-md-row justify-content-between">
  <div className="mb-3 mb-md-0">
      <ReusableForm
        title="Add Course"
        placeholder="Enter course name"
        fetchUrl={`/Course/getAllCourses`}
        createUrl={`/Course/createCourse`}
        deleteUrlBase={`/Course/deleteCourse/`}
        nameKey="courseName"
      />
    </div>
  <div className="mb-3 mb-md-0">
      <ReusableForm
        title="Add Phase"
        placeholder="Enter phase name"
        fetchUrl={`/WeekAndPhase/getAllPhases`}
        createUrl={`/WeekAndPhase/createPhase`}
        deleteUrlBase={`/WeekAndPhase/deletePhase/`}
        nameKey="phaseName"
      />
    </div>
  <div className="mb-3 mb-md-0">
      <ReusableForm
        title="Add Week"
        placeholder="Enter week name"
        fetchUrl={`/WeekAndPhase/getAllWeek`}
        createUrl={`/WeekAndPhase/createWeek`}
        deleteUrlBase={`/WeekAndPhase/deleteWeek/`}
        nameKey="WeekName"
      />
    </div>
  </div>
  <hr />
  <ManageInstructors/>
  <hr />
  <DeleteUnconfirmedUsers/>
  <hr />
  <ManageAllQuestions/>
</div>

  );
}

export default AdminManagement;
