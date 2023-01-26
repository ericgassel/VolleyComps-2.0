import React from 'react'

/**
 * Option 1: https://react-pdf-viewer.dev/
 * Option 2: https://github.com/wojtekmaj/react-pdf
 * 
 * I checked Bethel Univ's stats page and it seems like they are getting their stats from the same source.
 * If we can get all the schools' stats pdf from the same source, we could embed the pdf viewer instead.
 */

// Temporary mock data
const tableTitles = ['#', 'Player', 'K', 'E', 'TA', 'PCT', 'AST', 'SA', 'SE', 'RE', 'DIG', 'BS', 'BA', 'BE', 'TB', 'BHE'];
const mockData = [5, 'Dani Friedges', 36, 12, 89, 0.270,	35,	17,	6, 2,	37,	1, 12, 4,	7, 0];

const GeneralTeamStats = () => {
  return (
    <div className='teamStatsContainer'>
      <table className='teamStatsTable'>
        <thead>
          <tr className='headerRow'>
            {tableTitles.map((title, i) => <th key={i}>{title}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {mockData.map((data, i) => <td className='teamStatsCell' key={i}>{data}</td>)}
          </tr>
          <tr>
            {mockData.map((data, i) => <td className='teamStatsCell' key={i}>{data}</td>)}
          </tr>
          <tr>
            {mockData.map((data, i) => <td className='teamStatsCell' key={i}>{data}</td>)}
          </tr>
          <tr>
            {mockData.map((data, i) => <td className='teamStatsCell' key={i}>{data}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default GeneralTeamStats