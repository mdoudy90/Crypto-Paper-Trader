import React, { useState } from 'react';

const Login = ({ loginUser }) => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  return (
    <form>
      <h3>USER LOGIN</h3>
      <input value = { username } placeholder = { 'Username' } onChange = { (e) => setUsername(e.target.value) }></input>
      <input value = { password } placeholder = { 'Password' } onChange = { (e) => setPassword(e.target.value) }></input>
      <button onClick = { (e) => {
        e.preventDefault();
        loginUser({ username, password });
        setUsername('');
        setPassword('');
      } }>Submit</button>
    </form>
  );

}

export default Login;