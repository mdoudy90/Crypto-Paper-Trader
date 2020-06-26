import React, { useState } from 'react';

const SignUp = ({ addNewUser }) => {
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  return (
    <form>
      <h3>USER SIGN UP</h3>
      <input value = { firstName } placeholder = { 'First name' } onChange = { (e) => setFirstName(e.target.value) }></input>
      <input value = { lastName } placeholder = { 'Last name' } onChange = { (e) => setLastName(e.target.value) }></input>
      <input value = { email } placeholder = { 'Email' } onChange = { (e) => setEmail(e.target.value) }></input>
      <input value = { username } placeholder = { 'Username' } onChange = { (e) => setUsername(e.target.value) }></input>
      <input value = { password } placeholder = { 'Password' } onChange = { (e) => setPassword(e.target.value) }></input>
      <button onClick = { (e) => {
        e.preventDefault();
        addNewUser({ firstName, lastName, email, username, password });
        setFirstName('');
        setLastName('');
        setEmail('');
        setUsername('');
        setPassword('');
      } }>Submit</button>
    </form>
  );

}

export default SignUp;