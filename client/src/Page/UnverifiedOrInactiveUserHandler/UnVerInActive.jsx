import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";


const UnVerInActive = () => {

  return (
    <section className="mt-5 flex flex-col justify-center items-center text-center ">
      <h1 className="text-6xl font-bold mb-4">Oops!...</h1>
      <h1 className="text-6xl font-bold mb-4">Your are not verified or Your account is not activated yet Kindly contact the Admin</h1>
			
      <Link
        to="/questions"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Go Back
      </Link>
    </section>

  );
};

export default UnVerInActive;
