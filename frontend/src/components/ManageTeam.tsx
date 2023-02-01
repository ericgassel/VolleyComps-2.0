import React, { useEffect, useState } from 'react';
import "./table.css"
import {useParams } from "react-router-dom"
import AddModal from './AddModal'
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { addMember, getRoster } from '../action/action';

const ManageTeam = () => {

    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    const {api_base_url, roster, currTeamData} = state;

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
      const onSubmitModal = (event: any) => {
        event.preventDefault(event);
        let newMember = [event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value, event.target[4].value]
        addMember(dispatch, newMember, `${api_base_url}/write/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`)

        setModalOpen(false);
      };


      useEffect(() => {
        // 1. Fetch api
        getRoster(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`);
      }, [])

    return <div>
        <h1>{currTeamData.name}</h1>

        <form onSubmit={onSubmitForm}>
          <label>
            School Name:
            <input type="text" name="name" placeholder={currTeamData.name} />
            <br/>
            School Mascot Image:
            <input type="text" name="mascot" />
            <br/>
            {/* Address:
            <input type="text" name="address" placeholder={currTeamData.name.address}/> */}
            <br/>
          </label>
          <input type="submit" value="Submit" />
        </form>

        <React.Fragment>
          <h2><button onClick={openModal}>Manage Member</button></h2>
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

          </label>
          <input type="submit" value="Submit"/>
          </form>


          </AddModal>
        </React.Fragment>

        <div className="Table">
            <table>
                <thead>
                <tr>
                    <th>Team Member</th>
                    <th>Position</th>
                    <th>Number</th>
                </tr>
                </thead>
                <tbody>

                {roster.map((val, key) => {
                return (
                    <tr key={key}>
                    <td>{val.name}</td>
                    <td>{val.position}</td>
                    <td>{val.number}</td>
                    </tr>
                )
                })}

                </tbody>
            </table>
        </div>

    </div>


}

export default ManageTeam;