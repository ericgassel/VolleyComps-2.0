import React from 'react';
import BestPlayerStats from './BestPlayerStats';
import GeneralTeamStats from './GeneralTeamStats';

const  TeamStatsTab=() =>{
  return <div className='teamStatsTab'>
      {/* <h2>Welcome to TeamStat page</h2> */}
      {/* <img src={require('../demo_graphic.svg').default} alt='mySvgImage' /> */}
      <BestPlayerStats />

      <GeneralTeamStats />
  </div>;
}

export default TeamStatsTab;
