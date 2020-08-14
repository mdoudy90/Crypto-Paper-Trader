import React, { useState } from 'react';

const Login = ({ loginUser, switchView }) => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  return (
    <form className='user-form login-form'>
      <h2>LOGIN</h2>
      <input value = { username } placeholder = { 'Username' } onChange = { (e) => setUsername(e.target.value) }></input>
      <input value = { password } placeholder = { 'Password' } onChange = { (e) => setPassword(e.target.value) }></input>
      <button onClick = { (e) => {
        e.preventDefault();
        loginUser({ username, password });
        setUsername('');
        setPassword('');
      } }>Submit</button>
      <p onClick = { () => { switchView('signup') } }>Sign up now</p>
    </form>
  );

}

export default Login;