import React from 'react';

const ArenaView = ({ playerGladiator, enemyGladiator }) => {
  const arenaSize = 200;
  const gladiatorSize = 20;

  const getGladiatorColor = (type) => {
    switch(type) {
      case 'Murmillo': return '#ff0000';
      case 'Retiarius': return '#00ff00';
      case 'Thraex': return '#0000ff';
      case 'Dimachaerus': return '#ffff00';
      default: return '#888888';
    }
  };

  return (
    <svg width={arenaSize} height={arenaSize} viewBox={`0 0 ${arenaSize} ${arenaSize}`}>
      {/* Arena background */}
      <rect width={arenaSize} height={arenaSize} fill="#f0d9b5" />
      
      {/* Player Gladiator */}
      <circle 
        cx={arenaSize * 0.25} 
        cy={arenaSize / 2} 
        r={gladiatorSize / 2} 
        fill={getGladiatorColor(playerGladiator.type)} 
      />
      
      {/* Enemy Gladiator */}
      <circle 
        cx={arenaSize * 0.75} 
        cy={arenaSize / 2} 
        r={gladiatorSize / 2} 
        fill={getGladiatorColor(enemyGladiator.type)} 
      />

      {/* Simple weapons */}
      <line 
        x1={arenaSize * 0.25 + gladiatorSize / 2} 
        y1={arenaSize / 2} 
        x2={arenaSize * 0.25 + gladiatorSize * 1.5} 
        y2={arenaSize / 2} 
        stroke="black" 
        strokeWidth="2" 
      />
      <line 
        x1={arenaSize * 0.75 - gladiatorSize / 2} 
        y1={arenaSize / 2} 
        x2={arenaSize * 0.75 - gladiatorSize * 1.5} 
        y2={arenaSize / 2} 
        stroke="black" 
        strokeWidth="2" 
      />
    </svg>
  );
};

export default ArenaView;
