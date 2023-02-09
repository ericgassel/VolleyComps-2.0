import React, { useEffect } from 'react'
import { getTeamStats } from '../action/action';
import { useAppContext, useAppDispatchContext } from '../context/appContext';

const KillsData = [
  ['Cotter, Kirstin',	368],
  ['Friedges, Dani',	258],
  ['Solberg, Grace',	201],
  ['Wilhite, Hannah',	136],
  ['Rossing, Emily',	128],
];

const AssistsData = [
  ['Wilhite, Hannah',	927],
  ['Friedges, Dani',	72],
  ['Sealock, Kelsie',	64],
  ['Wimmer, Mina',	38],
  ['Cotter, Kirstin',	13],
];

const ServiceAcesData = [
  ['Wilhite, Hannah',	31],
  ['Wimmer, Mina',	27],
  ['Friedges, Dani',	26],
  ['Cotter, Kirstin',	18],
  ['Sealock, Kelsie',	11],
];

const DigsData = [
  ['Sealock, Kelsie',	521],
  ['Friedges, Dani',	338],
  ['Wilhite, Hannah',	210],
  ['Cotter, Kirstin',	209],
  ['Wimmer, Mina',	198],
];

const BlocksData = [
  ['Rossing, Emily',	74.0],
  ['Drury, Abigail',	72.0],
  ['Cotter, Kirstin',	59.0],
  ['Wilhite, Hannah',	41.0],
  ['Friedges, Dani',	36.0],
];

const BestStatsTable = ({ team_stats } : any) => {
  return (
    <table className='bestPlayerStatsTable'>
      <thead>
        <tr className='headerRow'>
          <th>Team Stats</th>
          <th>Carleton</th>
          <th>OPP</th>
        </tr>
      </thead>
      <tbody>
        <tr className='teamStatsCell'>Attack</tr>
        <tr className='teamStatsCell'>Kills</tr>
        <tr className='teamStatsCell'>Errors</tr>
        <tr className='teamStatsCell'>Attempts (Total Attacks)</tr>
        <tr className='teamStatsCell'>Percent (Attacks Pct)</tr>
        <tr className='teamStatsCell'>Kills_Per_Set</tr>

	
        <tr className='teamStatsCell'>Set</tr>
        <tr className='teamStatsCell'>Assists</tr>
        <tr className='teamStatsCell'>Assists_Per_Set</tr>

	
        <tr className='teamStatsCell'>Serve</tr>
        <tr className='teamStatsCell'>Aces</tr>
        <tr className='teamStatsCell'>Errors</tr>
        <tr className='teamStatsCell'>Aces_Per_Set</tr>

	
        <tr className='teamStatsCell'>Defence</tr>
        <tr className='teamStatsCell'>Digs</tr>
        <tr className='teamStatsCell'>Digs_Per_Set</tr>

	  
        <tr className='teamStatsCell'>Blocking</tr>
        <tr className='teamStatsCell'>Solo</tr>
        <tr className='teamStatsCell'>Assists</tr>
        <tr className='teamStatsCell'>Blocks</tr>
        <tr className='teamStatsCell'>Blocks_Per_Set</tr>
        <tr className='teamStatsCell'>Errors</tr>


        {/* {playersData.map((player, i) => 
          <tr key={i}>
            <td className='teamStatsCell'>{player[0]}</td>
            <td className='teamStatsCell'>{player[1]}</td>
          </tr>
        )} */}
      </tbody>
    </table>
  )
}

const BestPlayerStats = () => {
  const state = useAppContext();
  const { api_base_url, team_stats } = state;
  const dispatch = useAppDispatchContext();

  useEffect(() => {
    getTeamStats(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/team_stats`);
  }, [])

  console.log('team_stats:', team_stats)

  return (
    <div className='bestPlayersContainer'>
      {team_stats ? (
        <BestStatsTable team_stats={team_stats} />
      ) : (
        <div>Loading...</div>
      )}
      {/* <BestStatsTable title={'Kills'} playersData={KillsData} />
      <BestStatsTable title={'Assists'} playersData={AssistsData} />
      <BestStatsTable title={'Service Aces'} playersData={ServiceAcesData} />
      <BestStatsTable title={'Digs'} playersData={DigsData} />
      <BestStatsTable title={'Blocks'} playersData={BlocksData} /> */}
    </div>
  )
}

export default BestPlayerStats