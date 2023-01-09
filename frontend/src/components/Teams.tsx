import React, { useState } from 'react'
import {Outlet} from "react-router-dom"
import {Link, useLocation} from 'react-router-dom'

import TavNav from "./TabNav"
import AddModal from './AddModal'

import "./Teams.css"
import "./table.css"
import ManageTeam from './ManageTeam'

const teamData = [
  { name: "St.Olaf", location: "Northfield, MN", score: "3:2" },
  { name: "Crown College", location: "Northfield, MN", score: "3:0" },
  { name: "Concordia", location: "St.Paul, MN", score: "3:1"},
  { name: "Augusburg University", location: "Minneapolis, MN", score: "3:1"},
  { name: "Unniversity of Minnesota", location: "St.Paul, MN", score: "3:1"},
]

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

  const location = useLocation()

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

        {teamData.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td> <Link to={`/management/${val.name}`}>Manage Team</Link></td>
              <td><button>Scout Report</button></td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>


    {/** Tab navigation  */}
    {/* <TavNav /> */}
    {/** Tab inner content */}
    {/* <Outlet /> */}
  </div>
}

export default Teams