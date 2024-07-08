import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { AlertCircle, Sword, Home, ShieldAlert, Dumbbell, Trophy } from 'lucide-react';

const gladiatorTypes = {
  Murmillo: {
    baseHealth: 120,
    baseStrength: 80,
    baseAgility: 60,
    specialAbility: "Shield Wall",
    description: "Heavy armor, large shield, short sword. Excels in defense.",
    abilityDescription: "Greatly reduces damage taken for one turn."
  },
  Retiarius: {
    baseHealth: 90,
    baseStrength: 70,
    baseAgility: 90,
    specialAbility: "Net Throw",
    description: "Net and trident, lightly armored. High agility and unique weapons.",
    abilityDescription: "Attempts to entangle the opponent, potentially stunning them for a turn."
  },
  Thraex: {
    baseHealth: 100,
    baseStrength: 75,
    baseAgility: 75,
    specialAbility: "Parry and Strike",
    description: "Curved short sword, small shield. Balanced fighter.",
    abilityDescription: "Attempts to parry the next attack and counter with a powerful strike."
  },
  Dimachaerus: {
    baseHealth: 95,
    baseStrength: 85,
    baseAgility: 80,
    specialAbility: "Dual Wield Fury",
    description: "Dual-wielding swords, medium armor. Offensive powerhouse.",
    abilityDescription: "Launches a flurry of attacks, potentially hitting multiple times."
  }
};

const GladiatorSchool = () => {
  const [activeTab, setActiveTab] = useState('gladiators');
  const [gladiators, setGladiators] = useState([]);
  const [schoolResources, setSchoolResources] = useState({ gold: 1000, food: 500, reputation: 50 });
  const [combatState, setCombatState] = useState({ inProgress: false, playerGladiator: null, enemyGladiator: null, log: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      setSchoolResources(prev => ({
        ...prev,
        gold: prev.gold + 10,
        food: Math.max(0, prev.food - 5),
      }));
    }, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const addGladiator = (type) => {
    const baseStats = gladiatorTypes[type];
    const newGladiator = {
      id: gladiators.length + 1,
      name: `${type} ${gladiators.length + 1}`,
      type: type,
      health: baseStats.baseHealth,
      strength: baseStats.baseStrength,
      agility: baseStats.baseAgility,
      specialAbility: baseStats.specialAbility,
      experience: 0,
      level: 1,
    };
    setGladiators([...gladiators, newGladiator]);
    setSchoolResources({ ...schoolResources, gold: schoolResources.gold - 100 });
  };

  const trainGladiator = (gladiator) => {
    const updatedGladiators = gladiators.map(g => {
      if (g.id === gladiator.id) {
        const expGain = Math.floor(Math.random() * 20) + 10;
        const newExp = g.experience + expGain;
        const newLevel = Math.floor(newExp / 100) + 1;
        const baseStats = gladiatorTypes[g.type];
        return {
          ...g,
          health: baseStats.baseHealth + (newLevel - 1) * 10,
          strength: baseStats.baseStrength + (newLevel - 1) * 5,
          agility: baseStats.baseAgility + (newLevel - 1) * 5,
          experience: newExp % 100,
          level: newLevel,
        };
      }
      return g;
    });
    setGladiators(updatedGladiators);
    setSchoolResources({ ...schoolResources, food: schoolResources.food - 10 });
  };

  const startCombat = (gladiator) => {
    const enemyType = Object.keys(gladiatorTypes)[Math.floor(Math.random() * Object.keys(gladiatorTypes).length)];
    const enemyBaseStats = gladiatorTypes[enemyType];
    const enemy = {
      name: `Enemy ${enemyType}`,
      type: enemyType,
      health: enemyBaseStats.baseHealth,
      strength: enemyBaseStats.baseStrength,
      agility: enemyBaseStats.baseAgility,
      specialAbility: enemyBaseStats.specialAbility,
    };
    setCombatState({
      inProgress: true,
      playerGladiator: { ...gladiator, currentHealth: gladiator.health },
      enemyGladiator: { ...enemy, currentHealth: enemy.health },
      log: ['Combat started!'],
    });
  };

  const performCombatAction = (action) => {
    const { playerGladiator, enemyGladiator, log } = combatState;
    let newLog = [...log];
    let playerDamage = Math.max(0, playerGladiator.strength - enemyGladiator.agility / 2);
    let enemyDamage = Math.max(0, enemyGladiator.strength - playerGladiator.agility / 2);

    if (action === 'special') {
      newLog.push(`${playerGladiator.name} uses ${playerGladiator.specialAbility}!`);
      switch (playerGladiator.type) {
        case 'Murmillo':
          enemyDamage = Math.floor(enemyDamage / 2);
          newLog.push("Shield Wall activated! Damage reduction increased for this turn.");
          break;
        case 'Retiarius':
          if (Math.random() < 0.5) {
            enemyDamage = 0;
            newLog.push("Net Throw successful! Enemy is entangled and can't attack this turn.");
          } else {
            newLog.push("Net Throw missed!");
          }
          break;
        case 'Thraex':
          if (Math.random() < 0.5) {
            enemyDamage = 0;
            playerDamage *= 2;
            newLog.push("Parry and Strike successful! Counter-attack deals double damage.");
          } else {
            newLog.push("Parry and Strike failed!");
          }
          break;
        case 'Dimachaerus':
          const hits = Math.floor(Math.random() * 3) + 2;
          playerDamage *= hits / 2;
          newLog.push(`Dual Wield Fury unleashed! ${hits} hits for increased damage!`);
          break;
      }
    }

    const updatedPlayerGladiator = { 
      ...playerGladiator, 
      currentHealth: Math.max(0, playerGladiator.currentHealth - enemyDamage) 
    };
    const updatedEnemyGladiator = { 
      ...enemyGladiator, 
      currentHealth: Math.max(0, enemyGladiator.currentHealth - playerDamage)
    };

    newLog.push(`${playerGladiator.name} deals ${playerDamage.toFixed(1)} damage!`);
    newLog.push(`Enemy deals ${enemyDamage.toFixed(1)} damage!`);

    if (updatedPlayerGladiator.currentHealth === 0 || updatedEnemyGladiator.currentHealth === 0) {
      const winner = updatedPlayerGladiator.currentHealth > 0 ? updatedPlayerGladiator.name : 'Enemy';
      newLog.push(`Combat ended! ${winner} wins!`);
      setCombatState({ ...combatState, inProgress: false, log: newLog });
      if (winner === playerGladiator.name) {
        setSchoolResources({ 
          ...schoolResources, 
          gold: schoolResources.gold + 200, 
          reputation: schoolResources.reputation + 5 
        });
        const updatedGladiators = gladiators.map(g => 
          g.id === playerGladiator.id ? { ...g, experience: g.experience + 50 } : g
        );
        setGladiators(updatedGladiators);
      }
    } else {
      setCombatState({ 
        ...combatState, 
        playerGladiator: updatedPlayerGladiator, 
        enemyGladiator: updatedEnemyGladiator, 
        log: newLog 
      });
    }
  };

  const upgradeSchool = () => {
    setSchoolResources({
      gold: schoolResources.gold - 200,
      food: schoolResources.food + 100,
      reputation: schoolResources.reputation + 10,
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gladiator School: Rise to Power</h1>
      <div className="flex mb-4">
        <Button onClick={() => setActiveTab('gladiators')} className="mr-2">
          <AlertCircle className="mr-2 h-4 w-4" /> Gladiators
        </Button>
        <Button onClick={() => setActiveTab('combat')} className="mr-2">
          <Sword className="mr-2 h-4 w-4" /> Combat
        </Button>
        <Button onClick={() => setActiveTab('school')}>
          <Home className="mr-2 h-4 w-4" /> School
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="flex justify-between items-center">
          <div>Gold: {schoolResources.gold}</div>
          <div>Food: {schoolResources.food}</div>
          <div>Reputation: {schoolResources.reputation}</div>
        </CardContent>
      </Card>

      {activeTab === 'gladiators' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Gladiator Management</h2>
          <div className="mb-4">
            {Object.keys(gladiatorTypes).map(type => (
              <Button 
                key={type} 
                onClick={() => addGladiator(type)} 
                disabled={schoolResources.gold < 100}
                className="mr-2 mb-2"
              >
                Recruit {type} (100 Gold)
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gladiators.map((gladiator) => (
              <Card key={gladiator.id}>
                <CardHeader>
                  <CardTitle>{gladiator.name} - {gladiator.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Level: {gladiator.level}</p>
                  <p>Health: {gladiator.health}</p>
                  <p>Strength: {gladiator.strength}</p>
                  <p>Agility: {gladiator.agility}</p>
                  <p>Special Ability: {gladiator.specialAbility}</p>
                  <p>Ability: {gladiatorTypes[gladiator.type].abilityDescription}</p>
                  <p>Experience: {gladiator.experience}/100</p>
                  <Progress value={gladiator.experience} className="mt-2" />
                  <Button 
                    onClick={() => trainGladiator(gladiator)} 
                    disabled={schoolResources.food < 10} 
                    className="mt-2 mr-2"
                  >
                    <Dumbbell className="mr-2 h-4 w-4" /> Train (10 Food)
                  </Button>
                  <Button onClick={() => startCombat(gladiator)} className="mt-2">
                    <Sword className="mr-2 h-4 w-4" /> Fight
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'combat' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Combat Arena</h2>
          {combatState.inProgress ? (
            <div>
              <div className="flex justify-between mb-4">
                <Card className="w-[45%]">
                  <CardHeader>
                    <CardTitle>{combatState.playerGladiator.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Health: {combatState.playerGladiator.currentHealth.toFixed(1)}/{combatState.playerGladiator.health}</p>
                    <Progress value={(combatState.playerGladiator.currentHealth / combatState.playerGladiator.health) * 100} className="mt-2" />
                  </CardContent>
                </Card>
                <Card className="w-[45%]">
                  <CardHeader>
                    <CardTitle>{combatState.enemyGladiator.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Health: {combatState.enemyGladiator.currentHealth.toFixed(1)}/{combatState.enemyGladiator.health}</p>
                    <Progress value={(combatState.enemyGladiator.currentHealth / combatState.enemyGladiator.health) * 100} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
              <div className="mb-4">
                <Button onClick={() => performCombatAction('attack')} className="mr-2">
                  <Sword className="mr-2 h-4 w-4" /> Attack
                </Button>
                <Button onClick={() => performCombatAction('special')}>
                  <ShieldAlert className="mr-2 h-4 w-4" /> Use Special Ability
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Combat Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {combatState.log.slice(-5).map((entry, index) => (
                    <p key={index}>{entry}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p>Select a gladiator and click 'Fight' to start a battle.</p>
          )}
        </div>
      )}

{activeTab === 'school' && (
  <div>
    <h2 className="text-xl font-semibold mb-2">School Management</h2>
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>School Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Gladiators: {gladiators.length}</p>
        <p>Highest Level Gladiator: {Math.max(...gladiators.map(g => g.level), 0)}</p>
        <p>Total Victories: {gladiators.reduce((sum, g) => sum + Math.floor(g.experience / 100), 0)}</p>
      </CardContent>
    </Card>
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>School Upgrades</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={upgradeSchool} 
          disabled={schoolResources.gold < 200}
          className="mb-2"
        >
          <Trophy className="mr-2 h-4 w-4" /> Upgrade School (200 Gold)
        </Button>
        <p>Upgrading your school increases food production and reputation.</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Resource Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gold income: 10 per 10 seconds</p>
        <p>Food consumption: 5 per 10 seconds</p>
        <p>Tip: Balance recruiting, training, and upgrading to grow your school!</p>
      </CardContent>
    </Card>
  </div>
)}
    </div>
  );
};

export default GladiatorSchool;
