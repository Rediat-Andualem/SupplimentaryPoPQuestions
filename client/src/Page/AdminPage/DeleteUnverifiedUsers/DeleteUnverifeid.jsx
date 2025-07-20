import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { axiosInstance } from "../../../Utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { PiSmileySadThin } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';

function DeleteUnconfirmedUsers() {
  const [unconfirmedUsers, setUnconfirmedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const authHeader = useAuthHeader();

  useEffect(() => {
    fetchUnconfirmedUsers();
  }, []);

  const fetchUnconfirmedUsers = async () => {
    try {
      const res = await axiosInstance.get("/Instructor/getAllInstructors", {
        headers: { Authorization: authHeader },
      });

      const filtered = res.data.filter((user) => user.instructorVerification === false);
      setUnconfirmedUsers(filtered);
    } catch (err) {
      console.error("Failed to fetch unconfirmed users:", err);
      toast.error("Error loading unconfirmed users");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axiosInstance.delete("/Instructor/deleteUnConfirmedUser", {
        headers: { Authorization: authHeader },
      });
      toast.success("Successfully deleted unconfirmed users");
      fetchUnconfirmedUsers();
    } catch (err) {
      toast.error("Failed to delete unconfirmed users");
      console.error(err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-3 text-decoration-underline">Unconfirmed Instructors</h4>

      {unconfirmedUsers.length === 0 ? (
        <p>No unconfirmed users found. <PiSmileySadThin /></p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {unconfirmedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.instructorFirstName}</td>
                  <td>{user.instructorLastName}</td>
                  <td>{user.instructorEmail}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end mt-3">
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete All Unconfirmed Users
            </Button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body style={{ backgroundColor: "#f0f0f0" }}>
          <h5>Are you sure you want to delete all unconfirmed users?</h5>
          <div className="d-flex justify-content-end mt-4">
            <Button
              onClick={handleDeleteAll}
              style={{ backgroundColor: "#90ee90", borderColor: "#90ee90", color: "black" }}
              className="me-2"
            >
              Yes
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              style={{ backgroundColor: "#d3d3d3", borderColor: "#d3d3d3", color: "black" }}
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

export default DeleteUnconfirmedUsers;
