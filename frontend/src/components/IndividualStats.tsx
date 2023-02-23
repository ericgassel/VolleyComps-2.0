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
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>#</th>
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>Player</th>
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>SP</th>
              <th rowSpan={1} colSpan={5} className='indivStatsTh'>Attack</th>
              <th rowSpan={1} colSpan={2} className='indivStatsTh'>Set</th>
              <th rowSpan={1} colSpan={3} className='indivStatsTh'>Serve</th>
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>RE</th>
              <th rowSpan={1} colSpan={2} className='indivStatsTh'>Dig</th>
              <th rowSpan={1} colSpan={5} className='indivStatsTh'>Block</th>
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>BHE</th>
              <th rowSpan={2} colSpan={1} className='indivStatsTh'>PTS</th>
            </tr>
            <tr className='headerRow'>
              {tableSecondHeaders.map((title, i) => <th key={i} className='indivStatsTh'>{title}</th>)}
            </tr>
          </thead>
          <tbody>
              {stats.map((row: any) => 
                <tr key={row['Name']}>
                  {tableValues.map((col: any, i: number) => 
                    (i % 2 === 0 ? (
                      <td className='teamStatsCell evenCell' key={i}>{row[col]}</td> ) : ( 
                      <td className='teamStatsCell' key={i}>{row[col]}</td>
                    ))
                  )}
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