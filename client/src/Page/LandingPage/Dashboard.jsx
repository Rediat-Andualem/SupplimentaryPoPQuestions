import React, { useState } from "react";
import "./DashBoard.css";
import LogInSignUp from "../LogInSignUp/LogInSignUp";
import groupImage from "../../assets/groupWork.jpg";
import './Dashboard'
// import aspirePic from "../../images/aspire 2.jpg"
function Dashboard() {
  const [buttonText, setbuttonText] = useState(true);
  const [hideError, setHideError] = useState();

  let textChanger = () => {
    buttonText ? setbuttonText(false) : setbuttonText(true);
    buttonText
      ? setHideError("CREATE A NEW ACCOUNT")
      : setHideError("SIGN IN TO YOUR ACCOUNT");
  };
  return (
    <div className="mainSection">
      <div className="container px-md-5">
        <div className="d-flex">
          <div className="col-12 col-md-6 shadow auth mx-md-4 ">
            {/* <p className="text-danger">{state.alert}</p> */}
            <div className="">
              <LogInSignUp errorStatus={hideError} />
            </div>
          </div>
          <div className="d-none d-md-block col-12 col-md-6 explained">
            <h1 className="text-gradient animate__bounce">
              Welcome To Evangadi! 
            </h1>

         
            <h4 className="text-gradient">Supplementary Courses PoPUp  management Portal!</h4>
            <ul>
             <li>Ensure all your information is correct.</li>
<li>An approval email will be sent to your registered email address after sign-up.</li>
            </ul>
          
           {/* <img className="groupImage"  src={groupImage} alt="" /> */}
        
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
