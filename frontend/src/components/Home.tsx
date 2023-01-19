import React from 'react';
import "./Home.css"
import "./table.css"
import {Link} from 'react-router-dom'

const teamData = [
  { id: 1,  name: "St.Olaf", location: "Northfield, MN", score: "3:2" },
  { id: 2, name: "Crown College", location: "Northfield, MN", score: "3:0" },
  { id: 3, name: "Concordia", location: "St.Paul, MN", score: "3:1"},
  { id: 4, name: "Augusburg University", location: "Minneapolis, MN", score: "3:1"},
  { id: 5, name: "Unniversity of Minnesota", location: "St.Paul, MN", score: "3:1"},
]

const Home=() =>{
  return <div className='Home'>
     <h1>Schedules</h1>

     <div className="Table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Record</th>
          </tr>
        </thead>
        <tbody>

        {teamData.map((val, key) => {
          return (
            <tr key={key}>
              <td><Link to={`/management/${val.id}`}>{val.name}</Link></td>
              <td><Link to={`/management/${val.id}`}>{val.location}</Link></td>
              <td><Link to={`/management/${val.id}`}>{val.score}</Link></td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>

  </div>;
}

export default Home;
