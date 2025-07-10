import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner for the loading effect
import styles from './EmailForPasswrod.module.css';
import { axiosInstance } from '../../Utility/axiosInstance';
import { useState } from 'react';

function EmailForPassword() {
  const [response, setResponse] = useState('');
  const [instructorEmail, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setResponse('');

    try {
      const res = await axiosInstance.post('/Instructor/emailForPassword', instructorEmail);
      setResponse(res?.data?.message);
    } catch (err) {
      setResponse(err?.response?.data?.message);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'instructorEmail':
        setEmail((pre) => ({ ...pre, instructorEmail: e.target.value }));
        break;
      default:
        break;
    }
  };

  return (
    <Form onSubmit={sendEmail} className={`container ${styles.passForm}`}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="email"
          name="instructorEmail"
          placeholder="Enter email"
          onChange={handleChange}
          required
        />
        <Form.Text className={styles.text_muted}>
          Provide the email used upon registration...
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            {' '}Loading...
          </>
        ) : (
          'Submit'
        )}
      </Button>
      <h6 className={styles.h}>{response || ''}</h6>
    </Form>
  );
}

export default EmailForPassword;