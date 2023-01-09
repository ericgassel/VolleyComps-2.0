import React, { useState } from 'react';
import "./table.css"
import {useParams } from "react-router-dom"
import AddModal from './AddModal'

const ManageTeam = () => {

    let {teamName} = useParams()

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
    
      const onSubmitModal = (event: any) => {
        event.preventDefault(event);
        setModalOpen(false);
      };

    const teamData = [
        { name: "St.Olaf", location: "Northfield, MN", score: "3:2" },
        { name: "Crown College", location: "Northfield, MN", score: "3:0" },
        { name: "Concordia", location: "St.Paul, MN", score: "3:1"},
        { name: "Augusburg University", location: "Minneapolis, MN", score: "3:1"},
        { name: "Unniversity of Minnesota", location: "St.Paul, MN", score: "3:1"},
    ]

    const members = [
        {name: "Jackson", backNumber: 6},
        {name: "DaB", backNumber: 5},
        {name: "Perason", backNumber: 4},
        {name: "Toronto", backNumber: 3},
        {name: "Tokyo", backNumber: 2},
    ]

    let targetTeam: any = teamData.find(val => val.name === teamName);

    return <div>
        <h1>{targetTeam.name}</h1>

        <form onSubmit={onSubmitForm}>
          <label>
            School Name:
            <input type="text" name="name" placeholder={targetTeam.name} />
            <br/>
            School Mascot Image:
            <input type="text" name="mascot" />
            <br/>
            Address:
            <input type="text" name="address" placeholder={targetTeam.address}/>
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
            Position:
            <input type="text" name="mascot" />
            <br/>
            Number:
            <input type="text" name="address" />
            <br/>
            Image:
            <input type="text" name="address" />
            <br/>

          </label>
          <input type="submit" value="Submit" />
          </form>


          </AddModal>
        </React.Fragment>

        <div className="Table">
            <table>
                <thead>
                <tr>
                    <th>Team Member</th>
                </tr>
                </thead>
                <tbody>

                {members.map((val, key) => {
                return (
                    <tr key={key}>
                    <td>{val.name}</td>
                    <td>{val.backNumber}</td>
                    </tr>
                )
                })}

                </tbody>
            </table>
        </div>

    </div>


}

export default ManageTeam;