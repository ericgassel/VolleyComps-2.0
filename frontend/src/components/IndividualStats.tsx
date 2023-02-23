import React, { FC } from 'react';

/**
 * Option 1: https://react-pdf-viewer.dev/
 * Option 2: https://github.com/wojtekmaj/react-pdf
 * 
 * I checked Bethel Univ's stats page and it seems like they are getting their stats from the same source.
 * If we can get all the schools' stats pdf from the same source, we could embed the pdf viewer instead.
 */

const tableSecondHeaders = ['K','K/S','E','TA','PCT','A','A/S','SA','SE','SA/S','DIG','DIG/S','BS','BA','BLK','BLK/S','BE'];
const tableValues = ['Number', 'Name', 'SP', 'K','K/S','E','TA','PCT','A','A/S','SA','SE','SA/S', 'RE', 'DIG','D/S','BS','BA','TB','B/S','BE', 'BHE', 'PTS'];

type IndividualStatsProps = { stats: any };

const IndividualStats:FC<IndividualStatsProps> = ({ stats }:IndividualStatsProps) => {
  return (
    <div className='teamStatsContainer'>
      {stats ? (
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
              {stats.map((row: any) => 
                <tr key={row['Name']}>
                  {tableValues.map((col: any, i: any) => <td className='teamStatsCell' key={i}>{row[col]}</td>)}
                </tr>)}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default IndividualStats