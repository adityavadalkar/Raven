import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const InitState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function Signup() {
  const nagivate = useNavigate();
  const dispatch = useDispatch();
  const [sForm, setsForm] = useState(InitState);

  const handleChange = (e) =>
    setsForm({
      ...sForm,
      [e.target.name]: e.target.value,
    });

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isValidPassword(password) {
    return sForm.password !== sForm.confirmPassword && sForm.confirmPassword.length>3;
  }

  function validateInput(e) {
    // input validations
    e.preventDefault();
    if (
      sForm.name !== '' &&
      sForm.password !== '' &&
      sForm.confirmPassword !== '' &&
      sForm.email !== '' &&
      sForm.password === sForm.confirmPassword &&
      sForm.password.length >= 4
    ) {
    }
  }

  function signinGuest(){
    // To do guest login
  }

  return (
      <div className='login-form-container'>
        <div className='login-form'>
          <h1 className=''>Create your account</h1>
          <div>
            <label className="form-label" htmlFor='name' style={{fontSize: "16px"}}>Name</label>
            <input
              id='name'
              onChange={handleChange}
              name='name'
              className="form-control"
              placeholder='Enter user name'
              type='text'
              style={{width: "100%", padding: "10px", border: "1px solid #ccc"}}
              required
            />
            {(sForm.name.length>=1 && sForm.name.length<=3) && <div className='validation'>Please enter a valid user name.</div>}
          </div>

          <div>
            <label className="form-label" htmlFor='email' style={{fontSize: "16px"}}>Email</label>
            <input
              id='email'
              name='email'
              className="form-control"
              onChange={handleChange}
              placeholder='Enter your email'
              type='email'
              required
            />
            {sForm.email.length > 5 && !isValidEmail(sForm.email)  && <div className="validation" data-testid='email-validation'>
              Please enter a valid email address.
            </div>}
          </div>

          <div>
            <label htmlFor="password" className="form-label" style={{fontSize: "16px"}}>Password</label>
            <input
              id="password"
              name='password'
              className="form-control"
              onChange={handleChange}
              placeholder='Enter your password'
              type='password'
              required
            />
            {(sForm.password.length>0 && sForm.password.length<8) && <div className="validation" data-testid='pass-validation'>
              Please enter a password greater than 8 characters.
            </div>}
          </div>

          <div>
            <label className="form-label" htmlFor='confirm-password' style={{fontSize: "16px"}}>Confirm Password</label>
            <input
              id='confirm-password'
              name='confirmPassword'
              className="form-control"
              onChange={handleChange}
              placeholder='Retype your password'
              type='password'
              required
            />
            {/* {console.log(sForm.password == sForm.confirmPassword)} */}
            {isValidPassword() &&<div className="validation" data-testid='confirmpass-validation'>
              Please confirm your password.
            </div>}
          </div>

          <div>
            <div>
              Already Signed Up? <Link to='/login' style={{color: "black"}}><u>Log in</u></Link>
            </div>
          </div>

          <button className='btns black-btn btn-large w-100 mt-2' onClick={validateInput}>Register &nbsp;<FontAwesomeIcon icon={faFileLines} /></button>

          <button className='btns black-btn btn-large w-100 mt-2' onClick={signinGuest}>Sign in as Guest &nbsp;<FontAwesomeIcon icon={faRightToBracket} /></button>

          {/* <span>or</span>

          <button className='btns black-btn btn-large w-100' onClick={() => login()}>
            <FontAwesomeIcon icon={faGoogle} />&nbsp;&nbsp;Sign up with google
          </button> */}
        </div>
      </div>

  );
}

export default Signup;
