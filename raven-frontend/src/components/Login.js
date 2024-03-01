import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(true);
  const { loginWithRedirect, logout} = useAuth0();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // async function handleSubmit(e) {
  //   // e.preventDefault();
  //   if (email !== '' && password !== '') {
  //     setStatus(await dispatch(signin({ email, password }, navigate)));
  //   }
  // }

  console.log("login")

  function isValidEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 1 && !regex.test(email);
  }

  function isValidPassword() {
    return password.length<8 && password.length>0;
  }

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Sign in to us</h1>
        <hr />

        <div className="form-group">
          <label htmlFor='email' style={{fontSize: "16px"}}>Email</label>
          <input
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            type='email'
          />
        </div>
        {isValidEmail() && <div className='validation'>Please enter a valid email address</div>}

        <div className="form-group">
          <label htmlFor='password' style={{fontSize: "16px"}}>Password</label>
          <input
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            type='password'
          />
        </div>
        {isValidPassword() && <div className='validation'>Password must be greater than 8 characters</div>}
        {!status && <div className='validation'>Invalid email or password</div>}

        <button className='btns black-btn btn-large w-100' onClick={loginWithRedirect}>Login</button>
        {/* <button className='btns black-btn btn-large w-100' onClick={logout}>Log out</button> */}
        {/* <span>or</span>

        <button className='btns black-btn btn-large w-100' onClick={() => login()}>
          <FontAwesomeIcon icon={faGoogle} />&nbsp;&nbsp;Sign in with google
        </button> */}

        <span>
          Not registered yet? <Link to='/signup' style={{color: "black"}}><u>Sign up</u></Link>
        </span>
      </div>
    </div>

  );
}

export default Login;
