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
import {  FadeLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


const Teams = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingInProgress, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    let lowerCase = e.target.value
    setSearchInput(lowerCase);
  };

  const state = useAppContext();
  const dispatch = useAppDispatchContext();

  const {api_base_url, teams} = state;


   // Modal for adding school
  const onSubmitTeam = async (e: any) => {
    setLoading(true)
    // console.log(loadingInProgress)
    e.preventDefault()

    let newTeam = e.target[0].value
    let addTeamAPI = `${api_base_url}/newteam`
    setModalOpen(false);
    addTeam(dispatch, newTeam, addTeamAPI).then(() => setLoading(false))
  };



  let getTeamsAPI = `${api_base_url}/data/schools`
  useEffect(() => {
    if (!teams.length) {
      setLoading(true)
      getTeams(dispatch, getTeamsAPI).then(() => setLoading(false));
    }
  }, [teams]);

  let selectedTeams = teams;

  if (searchInput.length > 0) {
    selectedTeams = teams.filter((team: any) => {
      return team.name.toLowerCase().includes(searchInput.toLowerCase())
    })
  }

  // console.log(teams)

  return (
    <div className='Teams'>

    <div className="teamsTitle">
      <h1>Teams</h1>

      <i className="fa-duotone fa-user"></i>

      <div className="over_table">
      <input
        className='search-container fontAwesome'
        type="search"
        placeholder="Search Team"
        onChange={handleSearch}
        value={searchInput} />

      <FontAwesomeIcon className='icon' icon={faMagnifyingGlass} bounce size='lg' />

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
    </div>


    {loadingInProgress ? (

    <div style={{position: "fixed", top: "30%", left: "55%", transform: "translate(-50%, -50%)"}}>
      <FadeLoader color={"#36d7b7"} />
    </div>
        ) : (
    <div>
      <table className="TeamsTable">
        {/* <thead className="ScheduleTableHead">
          <tr>
            <th className="ScheduleTableTh">School</th>
            <th className="ScheduleTableTh">Manage Roster</th>
            <th className="ScheduleTableTh">View Report</th>
            <th className="ScheduleTableTh">Edit Report</th>
          </tr>
        </thead> */}


        <tbody>        
        
        {selectedTeams.map((val:any, key:any) => {
          return (
            <tr className='TeamsTableTr' key={key}>
              <td className='TeamsTableTd TeamName'>{val.name}</td>
              <td className='TeamsTableTd'> <Link className='teamManagementLink' to={`/management/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Manage Roster</Link></td>
              <td className='TeamsTableTd'><Link className='teamReportLink' to={`/report/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>View Scouting Report</Link></td>
              <td className='TeamsTableTd'><a className='shotEntryLink' href={`/ShotEntry/${val.id}`} onClick={() => updateCurrentTeam(dispatch, {name:val.name, id: val.id})}>Edit Scouting Report</a></td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>)}

  </div>)
}
// from Michael:
//    Please leave the a tag above instead of whatever the Link thing is doing.
//    the Link does not cause page to load which needs to happen for shotEntry page.
export default Teams