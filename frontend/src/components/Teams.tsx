import React, { useState, useEffect } from 'react'
import {Outlet} from "react-router-dom"
import {Link, useLocation} from 'react-router-dom'

import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { addTeam, getTeams, updateCurrentTeam } from '../action/action';

import TavNav from "./TabNav"
import AddModal from './AddModal'

// import "./Teams.css"
import "./teamtable.css"
import ManageTeam from './ManageTeam'


const Teams = () => {

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const onSubmit = (event: any) => {
    event.preventDefault(event);
    setModalOpen(false);
  };

  const state = useAppContext();
  const dispatch = useAppDispatchContext();

  const {api_base_url, teams} = state;


   // Modal for adding school
  const onSubmitTeam = async (e: any) => {
    e.preventDefault()

    let newTeam = e.target[0].value
    let addTeamAPI = `${api_base_url}/newteam`

    await addTeam(dispatch, newTeam, addTeamAPI)

    setModalOpen(false);

  };


  let getTeamsAPI = `${api_base_url}/data/schools`
  useEffect(() => {
    if (!teams.length) {
      getTeams(dispatch, getTeamsAPI);
    }
  }, [teams]);


  return (
    <div className='Teams'>

    <div className="teamsTitle">
      <h1>Teams</h1>
      <div className="TeamModal">
        <React.Fragment>
          <h2><button className='AddTeamButton' onClick={openModal}>Add Team</button></h2>
          
          <AddModal open={modalOpen} close={closeModal} header="Add a New Team">
            
          <form onSubmit={onSubmitTeam}>
          <div className="col-25">
            <label>School Name:</label>
          </div>
          <div className="col-75">
            <input className='schoolName' type="text" name="name" />
          <button className='SubmitTeamButton' type="submit">Submit</button>
          </div>

          </form>


          </AddModal>
        </React.Fragment>
      </div>
    </div>



    <div>
      <table className="TeamsTable">
        <tbody>        
        
        {teams.map((val:any, key:any) => {
          return (
            <tr className='TeamsTableTr' key={key}>
              <td className='TeamsTableTd TeamName'>{val.name}</td>
              <td className='TeamsTableTd'> <Link className='teamManagementLink' to={`/management/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Manage Team</Link></td>
              <td className='TeamsTableTd'><Link className='teamReportLink' to={`/report/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Scout Report</Link></td>
              <td className='TeamsTableTd'><a className='shotEntryLink' href={`/ShotEntry/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Add Report</a></td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>

  </div>)
}
// from Michael:
//    Please leave the a tag above instead of whatever the Link thing is doing.
//    the Link does not cause page to load which needs to happen for shotEntry page.
export default Teams