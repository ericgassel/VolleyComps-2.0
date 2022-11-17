import React from 'react';
// import * as d3 from 'd3';

const  PlayerStatsTab=() =>{

  return (
        <div className='playerStatsTab'>
          <h2>Welcome to PlayerStat page</h2>
          <img src={require('../heatmap_zones.svg').default} alt='mySvgImage' />
        </div>

        );
}

export default PlayerStatsTab;
