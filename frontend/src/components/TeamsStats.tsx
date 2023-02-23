import React, { FC } from 'react'
import { team_stats } from '../context/appContext';

type TeamsStatsTableProps = { teams_stats: team_stats[] }

const TeamsStatsTable: FC<TeamsStatsTableProps> = ({teams_stats}: TeamsStatsTableProps) => {
  const [carleton, opponent] = teams_stats;
  return (
    <table className='teamsStatsTable'>
      <thead>
        <tr className='headerRow'>
          <th>Team Stats</th>
          <th>{carleton.Team}</th>
          <th>{opponent.Team}</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className='teamStatsCell' colSpan={3}>Attack</td></tr> 
        <tr>  
          <td className='teamStatsCell'>Kills</td>
          <td className='teamStatsCell'>{carleton.Kills}</td>
          <td className='teamStatsCell'>{opponent.Kills}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Errors</td>
          <td className='teamStatsCell'>{carleton.Attack_Errors}</td>
          <td className='teamStatsCell'>{opponent.Attack_Errors}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Attempts (Total Attacks)</td>
          <td className='teamStatsCell'>{carleton.Attempts}</td>
          <td className='teamStatsCell'>{opponent.Attempts}</td>
        </tr> 
        <tr>
          <td className='teamStatsCell'>Percent (Attacks Pct)</td>
          <td className='teamStatsCell'>{carleton.Percent}</td>
          <td className='teamStatsCell'>{opponent.Percent}</td>
        </tr> 
        <tr>
          <td className='teamStatsCell'>Kills Per Set</td>
          <td className='teamStatsCell'>{carleton.Kills_Per_Set}</td>
          <td className='teamStatsCell'>{opponent.Kills_Per_Set}</td>
        </tr> 

        <tr>
          <td className='teamStatsCell' colSpan={3}>Set</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Assists</td>
          <td className='teamStatsCell'>{carleton.Set_Assists}</td>
          <td className='teamStatsCell'>{opponent.Set_Assists}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Assists Per Set</td>
          <td className='teamStatsCell'>{carleton.Assists_Per_Set}</td>
          <td className='teamStatsCell'>{opponent.Assists_Per_Set}</td>
        </tr> 

        <tr>          
          <td className='teamStatsCell' colSpan={3}>Serve</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Aces</td>
          <td className='teamStatsCell'>{carleton.Aces}</td>
          <td className='teamStatsCell'>{opponent.Aces}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Errors</td>
          <td className='teamStatsCell'>{carleton.Aces_Errors}</td>
          <td className='teamStatsCell'>{opponent.Aces_Errors}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Aces Per Set</td>
          <td className='teamStatsCell'>{carleton.Aces_Per_Set}</td>
          <td className='teamStatsCell'>{opponent.Aces_Per_Set}</td>
        </tr> 

        <tr>          
          <td className='teamStatsCell' colSpan={3}>Defence</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Digs</td>
          <td className='teamStatsCell'>{carleton.Digs}</td>
          <td className='teamStatsCell'>{opponent.Digs}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Digs Per Set</td>
          <td className='teamStatsCell'>{carleton.Digs_Per_Set}</td>
          <td className='teamStatsCell'>{opponent.Digs_Per_Set}</td>
        </tr> 

        <tr>          
          <td className='teamStatsCell' colSpan={3}>Blocking</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Solo</td>
          <td className='teamStatsCell'>{carleton.Solo}</td>
          <td className='teamStatsCell'>{opponent.Solo}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Assists</td>
          <td className='teamStatsCell'>{carleton.Blocking_Assists}</td>
          <td className='teamStatsCell'>{opponent.Blocking_Assists}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Blocks</td>
          <td className='teamStatsCell'>{carleton.Blocks}</td>
          <td className='teamStatsCell'>{opponent.Blocks}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Blocks Per Set</td>
          <td className='teamStatsCell'>{carleton.Blocks_Per_Set}</td>
          <td className='teamStatsCell'>{opponent.Blocks_Per_Set}</td>
        </tr> 
        <tr>  
          <td className='teamStatsCell'>Errors</td>
          <td className='teamStatsCell'>{carleton.Blocking_Errors}</td>
          <td className='teamStatsCell'>{opponent.Blocking_Errors}</td>
        </tr> 
      </tbody>
    </table>
  )
}

type TeamStatsProps = {
  teams_stats: team_stats[]
}

const TeamsStats:FC<TeamStatsProps> = ({ teams_stats }:TeamStatsProps) => {
  console.log('teams_stats in TeamStats:', teams_stats)
  return (
    <div className='teamsStatsContainer'>
      {teams_stats.length ? (
        <TeamsStatsTable teams_stats={teams_stats} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default TeamsStats