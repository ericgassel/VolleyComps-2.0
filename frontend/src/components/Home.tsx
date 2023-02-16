import React, {useEffect} from 'react';
import "./Home.css"
import "./hometable.css"
import {Link} from 'react-router-dom'
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { getSchedule, getTeams, updateCurrentTeam } from '../action/action';


const Home=() =>{

  const state = useAppContext();
  const dispatch = useAppDispatchContext();

  const {api_base_url, schedule} = state;

  let scheduleAPI = `${api_base_url}/data/carleton/schedule`

  useEffect(() => {
    if (!schedule.length) {
      getSchedule(dispatch, scheduleAPI);
    }

    // if (!teams.length) {
    //   let getTeamsAPI = `${api_base_url}/data/schools`
    //   getTeams(dispatch, getTeamsAPI);
    // }
    }, [schedule]);

  // console.log(schedule)


  return <div className='Home'>
     <h1>Schedules</h1>

     <div>
      <table className="ScheduleTable">
        <thead className="ScheduleTableHead">
          <tr>
            <th className="ScheduleTableTh">Date</th>
            <th className="ScheduleTableTh">Name</th>
            <th className="ScheduleTableTh">Location</th>
            <th className="ScheduleTableTh">Record</th>
          </tr>
        </thead>
        <tbody>

        {schedule.map((val: any, key: any) => {

          let currTeam = val || {team: "Dummy_school", id: "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM"}

          return (
            <tr className="ScheduleTableTr" key={key}>
              <td className="ScheduleTableTd">{val.date}</td>
              <td className="ScheduleTableTd"><Link className="reportLink" to={`/report/${currTeam.id}`} onClick={() => updateCurrentTeam(dispatch, {name:currTeam.team, id: currTeam.id})}>{val.team}</Link></td>
              <td className="ScheduleTableTd">{val.location}</td>
              <td className="ScheduleTableTd">{val.outcome}</td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>

  </div>;
}

export default Home;
