import React, {useEffect} from 'react';
import "./Home.css"
import "./table.css"
import {Link} from 'react-router-dom'
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { getSchedule, getTeams, updateCurrentTeam } from '../action/action';


const Home=() =>{

  const state = useAppContext();
  const dispatch = useAppDispatchContext();

  const {api_base_url, schedule, teams} = state;

  let scheduleAPI = `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/schedule`
  let teamsAPI = `${api_base_url}/data/schools`

  useEffect(() => {
    getSchedule(dispatch, scheduleAPI);
    getTeams(dispatch, teamsAPI);
    }, []);


  return <div className='Home'>
     <h1>Schedules</h1>

     <div className="ScheduleTable">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Location</th>
            <th>Record</th>
          </tr>
        </thead>
        <tbody>

        {schedule.map((val: any, key: any) => {

          let currTeam = teams.find((team: {name:string; id:string}) => team.name === val.team) || {name: "Dummy_school", id: "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM"}

          return (
            <tr key={key}>
              <td>{val.date}</td>
              <td><Link to={`/report/${currTeam.id}`} onClick={() => updateCurrentTeam(dispatch, {name:currTeam.name, id: currTeam.id})}>{val.team}</Link></td>
              <td>{val.location}</td>
              <td>{val.outcome}</td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>

  </div>;
}

export default Home;
