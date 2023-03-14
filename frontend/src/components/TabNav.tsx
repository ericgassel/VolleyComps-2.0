import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom'

const TabNav = () => {
  const location = useLocation();
  const { teamID } = useParams();
  
  return <div className='tab-nav'>
    <div>
      <Link to={`/report/${teamID}/sprayChartTab`} className={location.pathname===`/report/${teamID}/sprayChartTab` ?'tab_active':''}>Spray Chart</Link>
      <Link to={`/report/${teamID}/teamStatsTab`} className={location.pathname===`/report/${teamID}/teamStatsTab` ?'tab_active':''}>Team Stats</Link>
      <Link to={`/report/${teamID}/rotationsTab`} className={location.pathname===`/report/${teamID}/rotationsTab` ?'tab_active':''}>Rotations</Link>
    </div>


    {location.pathname === `/report/${teamID}/sprayChartTab` && <a href={`/ShotEntry/${teamID}`} className='tab-to-add-text'>Shot Entry</a>}
    {location.pathname === `/report/${teamID}/rotationsTab` && <a href={`/Rotations/${teamID}`} className='tab-to-add-text'>Rotations</a>}
  </div>;
}

export default TabNav;
