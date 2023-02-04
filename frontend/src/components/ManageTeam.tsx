import React, { useEffect, useState } from 'react';
import "./table.css"
import AddModal from './AddModal'
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { addMember, deleteMember, getRoster } from '../action/action';
import { useParams } from 'react-router-dom';

const ManageTeam = () => {

    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    const {api_base_url, roster, currTeamData, teams} = state;

    const getCurrentTeamFromURL = () => {
      let {teamID} = useParams()
      let currTeam = teams.find((team: {name:string; id:string}) => team.id === teamID) || {name: "Cool School", id: "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM"}
      return currTeam;
    }

    let currTeam = currTeamData.id ? currTeamData : getCurrentTeamFromURL()

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
      let newMember = [event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value, event.target[4].value, event.target[5].value]
      await addMember(dispatch, newMember, `${api_base_url}/write/${currTeam.id}/roster`)

      setModalOpen(false);
    };
    
    const deleteMemberButton = async (memberID: string) => {
      let deleteMemberAPI = `${api_base_url}/delete/${currTeam.id}/roster?player_id=${memberID}`
      await deleteMember(dispatch, memberID, deleteMemberAPI);
    }

    useEffect(() => {
      // 1. Fetch api
      if (!roster.length) {
        getRoster(dispatch, `${api_base_url}/data/${currTeam.id}/roster`);
      }
    }, [roster])

    return (
        <div>
        <h1>{currTeam.name || currTeam.name}</h1>

        {/* <form onSubmit={onSubmitForm}>
          <label>
            School Name:
            <input type="text" name="name" placeholder={currTeamData.name} />
            <br/>
            <br/>
          </label>
          <input type="submit" value="Submit" />
        </form> */}

        <React.Fragment>
          <h2><button onClick={openModal}>Add Member</button></h2>
          <AddModal open={modalOpen} close={closeModal} header="Add a New Member">
            
          <form onSubmit={onSubmitModal}>
          <label>
            Name:
            <input type="text" name="name" />
            <br/>
            Number:
            <input type="text" name="number" />
            <br/>
            Height:
            <input type="text" name="height" />
            <br/>
            Position:
            <input type="text" name="position" />
            <br/>
            Class:
            <input type="text" name="class" />
            <br/>
            Notes:
            <input type="text" name="notes" />
            <br/>

          </label>
          <button type="submit">Submit</button>
          </form>


          </AddModal>
        </React.Fragment>

        <div className="ManageTeamTable">
            <table>
                <thead>
                <tr>
                    <th>Team Member</th>
                    <th>Position</th>
                    <th>Height</th>
                    <th>Year</th>
                    <th>Number</th>
                </tr>
                </thead>
                <tbody>

                {roster.map((val: any, key) => {
                return (
                    <tr key={key}>
                    <td>{val.name}</td>
                    <td>{val.position}</td>
                    <td>{val.height}</td>
                    <td>{val.year}</td>
                    <td>{val.number}</td>
                    <td><button onClick={() => deleteMemberButton(val.player_id)}>delete</button></td>
                    </tr>
                )
                })}

                </tbody>
            </table>
        </div>

    </div>)


}

export default ManageTeam;