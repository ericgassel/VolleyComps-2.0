import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom'

const TabNav = () => {
  const location = useLocation()
  // const teamID = 0;
  const { teamID } = useParams();
  console.log('teamID:', teamID)
  return <div className='tab-nav'>
    <Link to={`/report/${teamID}/playerStatsTab`} className={location.pathname===`/report/${teamID}/playerStatsTab` ?'tab_active':''}>Player Stats</Link>
    <Link to={`/report/${teamID}/teamStatsTab`} className={location.pathname===`/report/${teamID}/teamStatsTab` ?'tab_active':''}>Team Stats</Link>
    <Link to={`/report/${teamID}/rotationsTab`} className={location.pathname===`/report/${teamID}/rotationsTab` ?'tab_active':''}>Rotations</Link>
  </div>;
}

export default TabNav;
