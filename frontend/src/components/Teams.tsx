import React, { useState, useEffect } from 'react'
import {Outlet} from "react-router-dom"
import {Link, useLocation} from 'react-router-dom'

import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { getTeams, updateCurrentTeam } from '../action/action';

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

  let newAPI = `${api_base_url}/data/schools`

  useEffect(() => {
    getTeams(dispatch, newAPI);
    
  }, []);



  return <div className='Teams'>

    <div className="teamsTitle">
      <h1>Teams</h1>
      <div className="options">
        <React.Fragment>
          <h2><button onClick={openModal}>Add Team</button></h2>
          <AddModal open={modalOpen} close={closeModal} header="Add a New Team">
            
          <form onSubmit={onSubmit}>
          <label>
            School Name:
            <input type="text" name="name" />
            <br/>
            School Mascot Image:
            <input type="text" name="mascot" />
            <br/>
            Address:
            <input type="text" name="address" />
            <br/>

          </label>
          <input type="submit" value="Submit" />
          </form>


          </AddModal>
        </React.Fragment>
        <h2><button>Edit Teams</button></h2>
      </div>
    </div>



    <div className="Table">
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
  </div>
}
// from Michael:
//    Please leave the a tag above instead of whatever the Link thing is doing.
//    the Link does not cause page to load which needs to happen for shotEntry page.
export default Teams