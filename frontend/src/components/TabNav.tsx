import React from 'react';
import { Link, useLocation } from 'react-router-dom'

const TabNav = () => {
  const location = useLocation()

  return <div className='tab-nav'>
    <Link to="/report/St.Olaf/playerStatsTab" className={location.pathname==='/report/St.Olaf/playerStatsTab'?'tab_active':''}>Player Stats</Link>
    <Link to="/report/St.Olaf/teamStatsTab" className={location.pathname==='/report/St.Olaf/teamStatsTab'?'tab_active':''}>Team Stats</Link>
    <Link to="/report/St.Olaf/rotationsTab" className={location.pathname==='/report/St.Olaf/rotationsTab'?'tab_active':''}>Rotations</Link>
    <Link to="/report/St.Olaf/playsTab" className={location.pathname==='/report/St.Olaf/playsTab'?'tab_active':''}>Plays</Link>
  </div>;
}

export default TabNav;
