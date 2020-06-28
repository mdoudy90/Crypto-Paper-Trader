import React from 'react';

const Header = ({ switchView, isLoggedIn, logoutUser }) => {

  return (
    <div className='header-container'>
      <ul>
        <li onClick = { () => switchView('charts') } >CHARTS</li>
        <li onClick = { () => switchView('quotes') } >QUOTES</li>
        <li onClick = { () => switchView('leaderboard') } >LEADERBOARD</li>
        { !isLoggedIn ?
          <li onClick = { () => switchView('login') } >LOGIN</li> :
          <>
            <li onClick = { () => switchView('portfolio') } >PORTFOLIO</li>
            <li onClick = { logoutUser } >LOGOUT</li>
          </>
        }
      </ul>
    </div>
  );
}

export default Header;
