
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../Utility/axiosInstance";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import 'react-toastify/dist/ReactToastify.css';

function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);

  const authHeader = useAuthHeader();

  useEffect(() => {
    getAllInstructors();
  }, []);

  const getAllInstructors = async () => {
    try {
      const res = await axiosInstance.get("/Instructor/getAllInstructors", {
        headers: { Authorization: authHeader },
      });
      setInstructors(res.data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const handleVerify = async (id) => {
    try {
      await axiosInstance.post(
        "/Instructor/verifyInstructor",
        { instructorId: id },
        { headers: { Authorization: authHeader } }
      );
      toast.success("Verified successfully");
      getAllInstructors();
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await axiosInstance.post(
        "/Instructor/actdeacInstructor",
        { instructorId: id },
        { headers: { Authorization: authHeader } }
      );
      toast.success("Status updated");
      getAllInstructors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id, role) => {
    if (role === "1") {
      toast.warn("Admin cannot be deleted");
      return;
    }
    setInstructorToDelete({ id, role });
    setShowDeleteModal(true);
  };

  const confirmDeleteInstructor = async () => {
    try {
      await axiosInstance.delete(`/Instructor/deleteInstructor/${instructorToDelete.id}`, {
        headers: { Authorization: authHeader },
      });
      toast.success("Instructor deleted");
      getAllInstructors();
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setShowDeleteModal(false);
      setInstructorToDelete(null);
    }
  };

  const handleOpenRoleModal = (instructor) => {
    setSelectedInstructor(instructor);
    setNewRole(instructor.instructorRole);
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    try {
      await axiosInstance.put(
        "/Instructor/updateInstructorRole",
        {
          instructorId: selectedInstructor.instructorId,
          role: newRole,
        },
        { headers: { Authorization: authHeader } }
      );
      toast.success("Role updated");
      setShowRoleModal(false);
      getAllInstructors();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const columns = [
    { field: "instructorFirstName", headerName: "First Name", width: 130 },
    { field: "instructorLastName", headerName: "Last Name", width: 130 },
    { field: "instructorEmail", headerName: "Email", width: 200 },
    {
      field: "instructorVerification",
      headerName: "Verified",
      width: 100,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "instructorActiveStatus",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (params.value ? "Active" : "Inactive"),
    },
    {
      field: "instructorRole",
      headerName: "Role",
      width: 80,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 400,
      renderCell: (params) => {
        const inst = params.row;
        return (
          <>
            <Button size="sm" onClick={() => handleVerify(inst.instructorId)} variant="success" className="me-1">
              Verify
            </Button>
            <Button size="sm" onClick={() => handleToggleActive(inst.instructorId)} variant="warning" className="me-1">
              {inst.instructorActiveStatus ? "Deactivate" : "Activate"}
            </Button>
            <Button size="sm" onClick={() => handleOpenRoleModal(inst)} variant="info" className="me-1">
              Change Role
            </Button>
            <Button size="sm" onClick={() => handleDelete(inst.instructorId, inst.instructorRole)} variant="danger">
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="container mt-4">
      <h4 className="m-3 text-decoration-underline">Manage Instructors</h4>
      <DataGrid
        rows={instructors.map((item, index) => ({ ...item, id: index }))}
        columns={columns}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10]}
      />

      {/* Role Update Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Instructor Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="roleSelect">
            <Form.Label>Select New Role</Form.Label>
            <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="0">Instructor</option>
              <option value="1">Admin</option>
              <option value="2">Super Admin</option>
              {/* Add more roles if needed */}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateRole}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body style={{ backgroundColor: "#f0f0f0" }}>
          <h5>Are you sure you want to delete this instructor?</h5>
          <div className="d-flex justify-content-end mt-4">
            <Button
              onClick={confirmDeleteInstructor}
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

export default ManageInstructors;
