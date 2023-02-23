import React, { useEffect, useState } from 'react';
import "./manageteamtable.css"
import AddModal from './AddModal'
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { addMember, deleteMember, getRoster, getTeams, updateCurrentTeam } from '../action/action';
import { useParams } from 'react-router-dom';
import {  FadeLoader } from 'react-spinners';

const ManageTeam = () => {

    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    const [loadingInProgress, setLoading] = useState(false);

    const {api_base_url, roster, currTeamData, teams, isCurrTeamFilled, fetchedRoster} = state;

    const getCurrentTeamFromURL = () => {
      let {teamID} = useParams()
      let currTeam = teams.find((team: {name:string; id:string}) => team.id === teamID)
      return currTeam;
    }
    let {teamID} = useParams()

    let currTeam = isCurrTeamFilled ? currTeamData : getCurrentTeamFromURL()

    const onSubmitForm = (event: any) => {
      event.preventDefault(event);
    };

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
      setModalOpen(true);
    };
    const closeModal = () => {
      setModalOpen(false);
    };
  
    // Modal for adding member
    const onSubmitModal = async (event: any) => {
      event.preventDefault()
      setLoading(true)
      let newMember = [event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value, event.target[4].value, event.target[5].value]
      setModalOpen(false);
      addMember(dispatch, newMember, `${api_base_url}/write/${currTeam.id}/roster`).then(() => setLoading(false));

    };
    
    const deleteMemberButton = async (memberID: string) => {
      setLoading(true)
      let deleteMemberAPI = `${api_base_url}/delete/${currTeam.id}/roster`
      deleteMember(dispatch, memberID, deleteMemberAPI).then(() => setLoading(false));
    }

    useEffect(() => {
      if (!teams.length) {
        let getTeamsAPI = `${api_base_url}/data/schools`
        setLoading(true)
        getTeams(dispatch, getTeamsAPI).then(() => setLoading(false));
      }

      // 1. Fetch api
      if (!roster.length && fetchedRoster === false) {
        setLoading(true)
        getRoster(dispatch, `${api_base_url}/data/${teamID}/roster`).then(() => setLoading(false));
      }
    }, [roster, teams])

    return (
        <div className="managementTitle">
        <h1>{currTeam ? currTeam.name : ""}</h1>
        <div className="MemberModal">
        <React.Fragment>
          <h2><button className='AddMemberButton' onClick={openModal}>Add Member</button></h2>
          <AddModal open={modalOpen} close={closeModal} header="Add a New Member">
            
          <form onSubmit={onSubmitModal}>

          <div className="question">
            <label>Name:</label>
          </div>
          <div className="answer">
            <input className='textbox' type="text" name="name" />
          </div>
          <div className="question">
            <label>Number:</label>
          </div>
          <div className="answer">
            <input className='textbox' type="text" name="number" />
          </div>
          <div className="question">
            <label>Height:</label>  
          </div>
          <div className="answer">
            <input className='textbox' type="text" name="height" />
          </div>

          <div className="question">
            <label>Position:</label>
          </div>
          <div className="answer">
            <input className='textbox' type="text" name="position" />
          </div>

          <div className="question">
            <label>Class:</label>
          </div>
          <div className="answer">
            <input className='textbox' type="text" name="class" />
          </div>

          <div className="question">
            <label>Notes:</label>
          </div>

          <div className="answer notes">
            <textarea className='textbox' name="notes" />
          </div>
          <br/>

          <button className='SubmitMemberButton' type="submit">Submit</button>
          </form>


          </AddModal>
        </React.Fragment>
        </div>

        {loadingInProgress ? (

        <div style={{position: "fixed", top: "30%", left: "55%", transform: "translate(-50%, -50%)"}}>
          <FadeLoader color={"#36d7b7"} />
        </div>
            ) : (

        <div>
            <table className="ManageTeamTable">
                <thead className="ManageTeamTableHead">
                  <tr>
                      <th className='ManageTeamTableTh'>Team Member</th>
                      <th className='ManageTeamTableTh'>Height</th>
                      <th className='ManageTeamTableTh'>Position</th>
                      <th className='ManageTeamTableTh'>Class</th>
                      <th className='ManageTeamTableTh'>Number</th>
                      <th className='ManageTeamTableTh_delete'></th>
                  </tr>
                </thead>
                <tbody>

                {roster.map((val: any, key) => {
                return (
                    <tr className='ManageTeamsTableTr' key={key}>
                      <td className='ManageTeamsTableTd'>{val.name}</td>
                      <td className='ManageTeamsTableTd'>{val.position}</td>
                      <td className='ManageTeamsTableTd'>{val.height}</td>
                      <td className='ManageTeamsTableTd'>{val.class}</td>
                      <td className='ManageTeamsTableTd'>{val.number}</td>
                      <td className='ManageTeamsTableTd_delete'><button className='DeleteMemberButton' onClick={() => deleteMemberButton(val.player_id)}>delete</button></td>
                    </tr>
                )
                })}
                </tbody>
            </table>
        </div>)}



    </div>)


}

export default ManageTeam;