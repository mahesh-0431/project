import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Registerpage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    // Add some basic validation here if necessary
    if (!email || !username || !password || !password2) {
      console.error("All fields are required");
      return;
    }
    registerUser(email, username, password, password2);
  };

  return (
    <div className="container">
      <h1 className="text-center">Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="User name" onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Confirm Password" onChange={e => setPassword2(e.target.value)} />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
      <div className="d-flex justify-content-center mt-3">
        <span className="me-2">Do you have an Account Already?</span>
        <Link to='/login' className="text-decoration-none">Login</Link>
      </div>
    </div>
  );
}

export default Registerpage;
