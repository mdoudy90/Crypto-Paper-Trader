import React, { useState, useEffect } from 'react';
import { calculatePortfolioValues } from '../helpers/calculatePortfolioValues'

interface User {
  username: string,
  cash: number,
  buyingPower: number,
  positions: { [key: string]: number } | undefined | null
}

interface Props {
  users: User[] | undefined | null
}

export const Leaderboard: React.FC<Props> = ({ users }) => {
  const [board, setBoard] = useState<any[]>([]);

  useEffect(() => {
    if (users.length) {
      calculatePortfolioValues(users)
        .then((newBoard) => {
          setBoard(newBoard)
        });
    }
  }, [users]);

  return (
    <div className='leaderboard-container'>
      <h4>TOP PERFORMERS</h4>
      <table>
        <thead>
          <tr>
            <th>USER</th>
            <th>PORTFOLIO VALUE</th>
            <th>POSITIONS</th>
          </tr>
        </thead>
        <tbody>
          {board.map((user, i) => {
            return (
              <tr key={i}>
                <td>{user.username}</td>
                <td>{user.portfolioValue ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.portfolioValue) : 'N/A'}</td>
                <td>
                  {Object.entries(user.positions).map((position, j) => {
                    return <div key={j}>{`${position[0]}: ${position[1]['qty']} - ${Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(position[1]['value'])}`}</div>
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}