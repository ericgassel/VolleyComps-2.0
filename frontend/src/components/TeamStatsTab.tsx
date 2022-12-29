import React from 'react';
import GeneralTeamStats from './GeneralTeamStats';

const  TeamStatsTab=() =>{
  return <div className='teamStatsTab'>
      {/* <h2>Welcome to TeamStat page</h2> */}
      {/* <img src={require('../demo_graphic.svg').default} alt='mySvgImage' /> */}
      <div className='bestPlayersContainer'></div>

      <GeneralTeamStats />
  </div>;
}

export default TeamStatsTab;
