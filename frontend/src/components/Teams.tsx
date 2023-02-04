import React, { useState, useEffect } from 'react'
import {Outlet} from "react-router-dom"
import {Link, useLocation} from 'react-router-dom'

import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { addTeam, getTeams, updateCurrentTeam } from '../action/action';

import TavNav from "./TabNav"
import AddModal from './AddModal'

import "./Teams.css"
import "./table.css"
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
    let addTeamAPI = `${api_base_url}/newteam/${newTeam}`

    await addTeam(dispatch, newTeam, addTeamAPI)

    setModalOpen(false);

  };


  let getTeamsAPI = `${api_base_url}/data/schools`
  useEffect(() => {
    if (!teams.length) {
      getTeams(dispatch, getTeamsAPI);
    }
  }, [teams]);

  console.log(teams)


  return (
    <div className='Teams'>

    <div className="teamsTitle">
      <h1>Teams</h1>
      <div className="options">
        <React.Fragment>
          <h2><button onClick={openModal}>Add Team</button></h2>
          <AddModal open={modalOpen} close={closeModal} header="Add a New Team">
            
          <form onSubmit={onSubmitTeam}>
          <label>

            School Name:
            <input type="text" name="name" />
            <br/>

          </label>
          <button type="submit">Submit</button>
          </form>


          </AddModal>
        </React.Fragment>
      </div>
    </div>



    <div className="TeamsTable">
      <table>
        <tbody>        
        
        {teams.map((val:any, key:any) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td> <Link to={`/management/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Manage Team</Link></td>
              <td><Link to={`/report/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Scout Report</Link></td>
              <td><a href={`/ShotEntry/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Add Report</a></td>
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