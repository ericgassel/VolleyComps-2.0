import React from 'react';
import TeamsStats from './TeamsStats';
import IndividualStats from './IndividualStats';

const  TeamStatsTab=() =>{
  return <div className='teamStatsTab'>
      {/* <h2>Welcome to TeamStat page</h2> */}
      {/* <img src={require('../demo_graphic.svg').default} alt='mySvgImage' /> */}
      <TeamsStats />

      <IndividualStats />
  </div>;
}

export default TeamStatsTab;
