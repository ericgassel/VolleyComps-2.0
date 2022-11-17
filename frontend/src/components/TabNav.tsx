import React from 'react';
import {Link, useLocation} from 'react-router-dom'

const  TabNav=() =>{

  const location = useLocation()

  return <div className='tab-nav'>
          <Link to="/teams/playerStatsTab" className={location.pathname==='/teams/playerStatsTab'?'tab_active':''}>Player Stats</Link>
         <Link to="/teams/teamStatsTab" className={location.pathname==='/teams/teamStatsTab'?'tab_active':''}>Team Stats</Link>
         <Link to="/teams/rotationsTab " className={location.pathname==='/teams/rotationsTab'?'tab_active':''}>Rotations</Link>
         <Link to="/teams/playsTab " className={location.pathname==='/teams/playsTab'?'tab_active':''}>Plays</Link>
  </div>;
}

export default TabNav;
