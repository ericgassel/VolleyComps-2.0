import React, { useEffect } from 'react';
import { getStats } from '../action/action';
import { useAppContext, useAppDispatchContext } from '../context/appContext';

/**
 * Option 1: https://react-pdf-viewer.dev/
 * Option 2: https://github.com/wojtekmaj/react-pdf
 * 
 * I checked Bethel Univ's stats page and it seems like they are getting their stats from the same source.
 * If we can get all the schools' stats pdf from the same source, we could embed the pdf viewer instead.
 */

// Temporary mock data
const tableSecondHeaders = ['K','K/S','E','TA','PCT','A','A/S','SA','SE','SA/S','DIG','DIG/S','BS','BA','BLK','BLK/S','BE'];
const tableValues = ['Number', 'Name', 'SP', 'K','K/S','E','TA','PCT','A','A/S','SA','SE','SA/S', 'RE', 'DIG','D/S','BS','BA','TB','B/S','BE', 'BHE', 'PTS'];
const mockData = [5, 'Dani Friedges', 36, 12, 89, 0.270,	35,	17,	6, 2,	37,	1, 12, 4,	7, 0];

const GeneralTeamStats = () => {
  const state = useAppContext();
  const { stats, api_base_url } = state;
  const dispatch = useAppDispatchContext();

  useEffect(() => {
    getStats(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`);
  }, [])
  
  console.log('stats:', stats);

  return (
    <div className='teamStatsContainer'>
      <table className='teamStatsTable'>
        <thead>
          <tr className='headerRow'>
            <th rowSpan={2} colSpan={1} style={{ verticalAlign: 'middle' }}>#</th>
            <th rowSpan={2} colSpan={1} style={{ verticalAlign: 'middle' }}>Player</th>
            <th rowSpan={2} colSpan={1}>SP</th>
            <th rowSpan={1} colSpan={5}>Attack</th>
            <th rowSpan={1} colSpan={2}>Set</th>
            <th rowSpan={1} colSpan={3}>Serve</th>
            <th rowSpan={2} colSpan={1}>RE</th>
            <th rowSpan={1} colSpan={2}>Dig</th>
            <th rowSpan={1} colSpan={5}>Block</th>
            <th rowSpan={2} colSpan={1}>BHE</th>
            <th rowSpan={2} colSpan={1}>PTS</th>
          </tr>
          <tr className='headerRow'>
            {tableSecondHeaders.map((title, i) => <th key={i}>{title}</th>)}
          </tr>
        </thead>
        <tbody>
          {stats ? (
            stats.map((row: any) => 
              <tr key={row['Name']}>{tableValues.map((col: any, i: any) => 
                <td className='teamStatsCell' key={i}>{row[col]}</td>)}
              </tr>)) : (
              <div>Loading...</div>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default GeneralTeamStats