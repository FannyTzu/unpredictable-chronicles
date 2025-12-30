import React from 'react';

interface CombatDisplayProps {
    combatState: {
        remainingEnemies: number;
        enemyType: string;
    };
    endurance: number;
    lastRoll?: number;
    lastKills?: number;
}

function CombatDisplay({combatState, endurance, lastRoll, lastKills}: CombatDisplayProps) {
    return (
        <div>
            <div>🧟‍♂️ Nombres d&apos;ennemis restants : {combatState.remainingEnemies}</div>
            {/* à venir <div> Type : {combatState.enemyType}</div>*/}
            <div> ❤️ Endurance player : {endurance}</div>
            <div>{lastRoll && <p>🎲 Dernier lancer : {lastRoll}, 💀 ennemis tués : {lastKills}</p>}</div>
        </div>
    );
}

export default CombatDisplay;