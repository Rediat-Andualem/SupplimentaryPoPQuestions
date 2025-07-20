
import React from "react";
import styles from "./Header.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/evangadi.png';

function Header() {
  const signOut = useSignOut();
  const auth = useAuthUser();
  const navigate = useNavigate();
console.log(auth)
  const forHome = () => {
    if (auth) {
      navigate("/home");
    } else {
      navigate('/signupLogIn');
    }
  };

  const forAdmin = () => {
    if (auth?.role === '1') {
      navigate('/forAdmin');
    } else {
      navigate('/signupLogIn');
    }
  };

  const logout = () => {
    if (auth) {
      signOut();
      navigate("/signupLogIn");
    }
  };

  return (
    <Navbar expand="lg" className={` ${styles.forTheNavbar} `}>
      <Container fluid>
        <Navbar.Brand className={`${styles.forTextColor} m-2`} as={Link} to="/postqanda">
          <img className={styles.logo} src={logo} alt="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            {/* Intentionally empty to push items to the right */}
          </Nav>

          {/* <Nav.Link onClick={forHome} className={`${styles.forTextColor} ${styles.underline}`}>
            <h5>Home</h5>
          </Nav.Link> */}
          <Nav.Link as={Link} to='/postqanda' className={`${styles.forTextColor} ${styles.underline}`}>
            <h5>Upload questions</h5>
          </Nav.Link>
          <Nav.Link as={Link} to='/manageQuestions' className={`${styles.forTextColor} ${styles.underline}`}>
            <h5>Manage uploaded questions</h5>
          </Nav.Link>

          {auth?.role === "2" && (
            <Nav.Link as={Link} to='/forAdmin' className={`${styles.forTextColor} ${styles.underline}`}>
              <h5>Admin page</h5>
            </Nav.Link>
          )}

          <Nav.Link
            href='https://www.evangadi.com/empower'
            className={`${styles.forTextColor} ${styles.underline}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h5>How It Work</h5>
          </Nav.Link>

          <h5 className="p-3">{auth ? `Welcome ${auth.instructorFirstName}` : ""}</h5>

          {auth && (
            <Button onClick={logout} className={styles.forButton} variant="outline-success">
              LogOut
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
