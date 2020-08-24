import React, { useState } from 'react';

interface Props {
  addNewUser: (ev) => void
}

export const SignUp: React.FC<Props> = ({ addNewUser }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    addNewUser({ firstName, lastName, email, username, password });
  }

  return (
    <form className='user-form signup-form'>
      <h2>SIGN UP</h2>
      <input value={firstName} placeholder={'First name'} onChange={(e) => setFirstName(e.target.value)}></input>
      <input value={lastName} placeholder={'Last name'} onChange={(e) => setLastName(e.target.value)}></input>
      <input value={email} placeholder={'Email'} onChange={(e) => setEmail(e.target.value)}></input>
      <input value={username} placeholder={'Username'} onChange={(e) => setUsername(e.target.value)}></input>
      <input value={password} placeholder={'Password'} onChange={(e) => setPassword(e.target.value)}></input>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}