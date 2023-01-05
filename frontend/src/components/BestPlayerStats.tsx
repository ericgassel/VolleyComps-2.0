import React from 'react'

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

const BestStatsTable = ({ title, playersData }: {title: string, playersData: (string | number)[][]}) => {
  return (
    <table className='bestPlayerStatsTable'>
        <tr className='headerRow'>
          {title}
        </tr>
        {playersData.map((player, i) => 
          <tr key={i}>
            <td className='teamStatsCell'>{player[0]}</td>
            <td className='teamStatsCell'>{player[1]}</td>
          </tr>
        )}
      </table>
  )
}

const BestPlayerStats = () => {
  return (
    <div className='bestPlayersContainer'>
      <BestStatsTable title={'Kills'} playersData={KillsData} />
      <BestStatsTable title={'Assists'} playersData={AssistsData} />
      <BestStatsTable title={'Service Aces'} playersData={ServiceAcesData} />
      <BestStatsTable title={'Digs'} playersData={DigsData} />
      <BestStatsTable title={'Blocks'} playersData={BlocksData} />
    </div>
  )
}

export default BestPlayerStats