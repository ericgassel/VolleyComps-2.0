import React from 'react'

// Temporary mock data
const tableTitles = ['K', 'E', 'TA', 'PCT', 'AST', 'SA', 'SE', 'RE', 'DIG', 'BS', 'BA', 'BE', 'TB', 'BHE'];
const mockData = [36, 12, 89, 0.270,	35,	17,	6, 2,	37,	1, 12, 4,	7, 0];

const GeneralTeamStats = () => {
  return (
    <div className='teamStatsContainer'>
      <table className='teamStatsTable'>
        <tr className='headerRow'>
          {tableTitles.map((title, i) => <th key={i}>{title}</th>)}
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
        <tr>
          {mockData.map((data, i) => <td className='teamStatsCell' key={i}>{data}</td>)}
        </tr>
      </table>
    </div>
  )
}

export default GeneralTeamStats