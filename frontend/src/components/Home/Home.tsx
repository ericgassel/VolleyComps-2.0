import React, {useEffect, useState} from 'react';
import "./Home.css"
import "./hometable.css"
import {Link} from 'react-router-dom'
import { useAppContext, useAppDispatchContext } from '../../context/appContext';
import { getSchedule, updateCurrentTeam } from '../../action/action';
import {  FadeLoader } from 'react-spinners';

const Home=() =>{
  // bring state and action dispatch
  const state = useAppContext();
  const dispatch = useAppDispatchContext();

  // component state responsible for loading
  const [loadingInProgress, setLoading] = useState(false);
  // bring state from storage
  const {api_base_url, schedule} = state;

  let scheduleAPI = `${api_base_url}/data/carleton/schedule`

  useEffect(() => {
    if (!schedule.length) {
      setLoading(true)
      getSchedule(dispatch, scheduleAPI).then(() => setLoading(false));
    }

    }, [schedule]);

  return <div className='Home'>
     <h1>Schedules</h1>

     {loadingInProgress ? (
      <div style={{position: "fixed", top: "30%", left: "55%", transform: "translate(-50%, -50%)"}}>
        <FadeLoader color={"#36d7b7"} />
      </div>

      ) : (

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
                  <td className="ScheduleTableTd teamName">
                    <img className='teamLogo' src={val.logo} height="50" width="50"></img>
                    <Link className="reportLink" to={`/report/${currTeam.id}`} onClick={() => updateCurrentTeam(dispatch, {name:currTeam.team, id: currTeam.id})}>{val.team}</Link>  
                  </td>
                  <td className="ScheduleTableTd">{val.location}</td>
                  <td className="ScheduleTableTd">{val.outcome}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>)}

  </div>;
}

export default Home;
