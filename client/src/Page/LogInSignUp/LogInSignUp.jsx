import { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../Utility/axiosInstance";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { jwtDecode } from "jwt-decode";


function LogInSignUp({ errorStatus }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(null);
  const [allCourses, setAllCourses] = useState([]);

  const navigate = useNavigate();
  const signIn = useSignIn();

  const [signupData, setSignupData] = useState({
    instructorFirstName: "",
    instructorLastName: "",
    instructorEmail: "",
    instructorAssignedCourse: "",
    instructorPassword: "",
  });

  const [loginData, setLoginData] = useState({
    instructorEmail: "",
    instructorPassword: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/Course/getAllCourses");
      setAllCourses(response?.data.courses);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    if (
      errorStatus === "SIGN IN TO YOUR ACCOUNT" ||
      errorStatus === "CREATE A NEW ACCOUNT"
    ) {
      setError(false);
    }
  }, [errorStatus]);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedSignupData = {
      ...signupData,
      instructorFirstName: signupData.instructorFirstName.trim(),
      instructorLastName: signupData.instructorLastName.trim(),
      instructorEmail: signupData.instructorEmail.trim(),
      instructorAssignedCourse: signupData.instructorAssignedCourse.trim(),
      instructorPassword: signupData.instructorPassword.trim(),
    };

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !nameRegex.test(trimmedSignupData.instructorFirstName) ||
      trimmedSignupData.instructorFirstName.length > 15
    ) {
      setError("First name should contain only letters and not exceed 15 characters.");
      return;
    }

    if (
      !nameRegex.test(trimmedSignupData.instructorLastName) ||
      trimmedSignupData.instructorLastName.length > 15
    ) {
      setError("Last name should contain only letters and not exceed 15 characters.");
      return;
    }

    if (!emailRegex.test(trimmedSignupData.instructorEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedSignupData.instructorPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!trimmedSignupData.instructorAssignedCourse) {
      setError("Please select a course.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/Instructor/createInstructorProfile", trimmedSignupData);

      setSignupData({
        instructorFirstName: "",
        instructorLastName: "",
        instructorEmail: "",
        instructorAssignedCourse: "",  
        instructorPassword: "",
      });

      const token = res.headers["authorization"]?.split(" ")[1];
      const decodedToken = jwtDecode(token);

      if (token) {
        if (
         
          signIn({
            auth: {
              token,
              type: "Bearer",
              expiresIn: 4320,
            },
            userState: {
              userId: decodedToken.instructorId,
              instructorEmail: decodedToken.instructorEmail,
              instructorFirstName: decodedToken.instructorFirstName,
              role: decodedToken.instructorRole,
              instructorAssignedCourse : decodedToken.instructorAssignedCourse,
              instructorVerification: decodedToken.instructorVerification,
              instructorActiveStatus : decodedToken.instructorActiveStatus,
              authStatus :true
            },
          })
        ) {
          navigate("/home");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.errors || "Signup failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedLoginData = {
      instructorEmail: loginData.instructorEmail.trim(),
      instructorPassword: loginData.instructorPassword,
    };

    try {
      const res = await axiosInstance.post("/Instructor/instructorLogin", trimmedLoginData);
      const token = res.headers["authorization"]?.split(" ")[1];
      const decodedToken = jwtDecode(token);
      if (token) {
        if (
          signIn({
            auth: {
              token,
              type: "Bearer",
              expiresIn: 4320,
            },
            userState: {
              userId: decodedToken.instructorId,
              instructorEmail: decodedToken.instructorEmail,
              instructorFirstName: decodedToken.instructorFirstName,
               role: decodedToken.instructorRole,
               instructorAssignedCourse : decodedToken.instructorAssignedCourse,
              instructorVerification: decodedToken.instructorVerification,
              instructorActiveStatus : decodedToken.instructorActiveStatus,
              authStatus :true
            },
          })
        ) {
          console.log("Reached")
          navigate("/home");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSignUp">
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          {/* Login Section */}
          <div className="carousel-item active">
            <div className="login">
              <h5>Login to your account</h5>
              <div>
                Don’t have an account?{" "}
                <span
                  className="spn-signupIn"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Create a new account
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <form onSubmit={handleLogin}>
                <div className="form-input">
                  <input
                    type="email"
                    name="instructorEmail"
                    placeholder="Email address"
                    value={loginData.instructorEmail}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="form-input password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="instructorPassword"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <div className="btn-login">
                  <button disabled={loading} type="submit">
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <Link to="/emailforpassword" className="spn-signupIn">
                    Forgot password?
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Signup Section */}
          <div className="carousel-item">
            <div className="register">
              <h5>Join the network</h5>
              <div>
                Already have an account?{" "}
                <span
                  className="spn-signupIn"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Sign In
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <form onSubmit={handleSignup}>
                <div className="row">
                  <div className="form-input col-md-6">
                    <input
                      name="instructorFirstName"
                      type="text"
                      placeholder="First Name"
                      value={signupData.instructorFirstName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-input col-md-6">
                    <input
                      name="instructorLastName"
                      type="text"
                      placeholder="Last Name"
                      value={signupData.instructorLastName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-input">
                  <select
                    name="instructorAssignedCourse"
                    value={signupData.instructorAssignedCourse}
                    onChange={handleSignupChange}
                    className="form-select"
                    required
                  >
                    <option value="" disabled>
                      Select your Course
                    </option>
                    {allCourses?.map((SingleCourse) => (
                      <option key={SingleCourse.courseId} value={SingleCourse.courseId}>
                        {SingleCourse.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-input">
                  <input
                    name="instructorEmail"
                    type="email"
                    placeholder="Email address"
                    value={signupData.instructorEmail}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="form-input password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="instructorPassword"
                    placeholder="Password"
                    value={signupData.instructorPassword}
                    onChange={handleSignupChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>

                <div className="btn-login">
                  <button disabled={loading} type="submit">
                    {loading ? "Signing up..." : "Create account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInSignUp;


