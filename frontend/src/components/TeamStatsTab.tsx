import React, { useEffect } from 'react';
import TeamsStats from './TeamsStats';
import IndividualStats from './IndividualStats';
import { useParams } from 'react-router-dom';
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { getTeamStats, getStats } from '../action/action';

const  TeamStatsTab=() => {
  const state = useAppContext();
  const { api_base_url, teams_stats, stats } = state;
  const dispatch = useAppDispatchContext();
  const { teamID } = useParams();

  useEffect(() => {
    getTeamStats(dispatch, `${api_base_url}/data/${teamID}/team_stats`);
    getStats(dispatch, `${api_base_url}/data/${teamID}/ind_data`);
  }, [])

  console.log('teams_stats in TeamStatsTab', teams_stats)

  return (
    <div className='teamStatsTab'>
      {(teams_stats && stats) ? (
        <>
          <TeamsStats teams_stats={teams_stats} />
    
          <IndividualStats stats={stats} />
        </>
      ) : (
        <div className='noAPIContainer'>
          <div>There is no Player Stats to show!</div>
          <a className='shotEntryLink' href={`/management/${teamID}`}>Manage Roster</a>
        </div>
      )}
    </div>
  );
}

export default TeamStatsTab;
