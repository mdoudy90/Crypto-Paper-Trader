import React, { useState } from 'react';

interface Props {
  loginUser: (ev) => void,
  switchView: (ev) => void
}

export const Login: React.FC<Props> = ({ loginUser, switchView }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <form className='user-form login-form'>
      <h2>LOGIN</h2>
      <input value={username} placeholder={'Username'} onChange={(e) => setUsername(e.target.value)}></input>
      <input value={password} placeholder={'Password'} onChange={(e) => setPassword(e.target.value)}></input>
      <button onClick={(e) => {
        e.preventDefault();
        loginUser({ username, password });
        setUsername('');
        setPassword('');
      }}>Submit</button>
      <p onClick={() => { switchView('signup') }}>Sign up now</p>
    </form>
  );
}