import React from 'react';
import { Link, useLocation } from 'react-router-dom'

const TabNav = () => {
  const location = useLocation()
  const teamID = 0;
  // console.log('location:', location)
  return <div className='tab-nav'>
    <Link to={`/report/${teamID}/playerStatsTab`} className={location.pathname===`/report/${teamID}/playerStatsTab` ?'tab_active':''}>Player Stats</Link>
    <Link to={`/report/${teamID}/teamStatsTab`} className={location.pathname===`/report/${teamID}/teamStatsTab` ?'tab_active':''}>Team Stats</Link>
    <Link to={`/report/${teamID}/rotationsTab`} className={location.pathname===`/report/${teamID}/rotationsTab` ?'tab_active':''}>Rotations</Link>
    {/* <Link to={`/report/${teamID}/playsTab`} className={location.pathname===`/report/${teamID}/playsTab` ?'tab_active':''}>Plays</Link> */}
  </div>;
}

export default TabNav;
