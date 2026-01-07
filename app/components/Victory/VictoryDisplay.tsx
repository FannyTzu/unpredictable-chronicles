import React from 'react'
import s from './style.module.css';

interface VictoryDisplayProps {
  lastRoll?: number;
}

function VictoryDisplay({ lastRoll }: VictoryDisplayProps) {
  return (
    <div className={s.container}>
      <p>Vous avez éliminé tous vos ennemis !</p>
      <div className={s.combatStats}>
        <p className={s.roll}>🎲 Dernier lancer : <strong>{lastRoll}</strong></p>
      </div>
    </div>
  )
}

export default VictoryDisplay;