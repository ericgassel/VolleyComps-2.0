import React from 'react';
import "./Home.css"
import "./table.css"

const teamData = [
  { name: "St.Olaf", location: "Northfield, MN", score: "3:2" },
  { name: "Crown College", location: "Northfield, MN", score: "3:0" },
  { name: "Concordia", location: "St.Paul, MN", score: "3:1"},
  { name: "Augusburg University", location: "Minneapolis, MN", score: "3:1"},
  { name: "Unniversity of Minnesota", location: "St.Paul, MN", score: "3:1"},
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
              <td>{val.name}</td>
              <td>{val.location}</td>
              <td>{val.score}</td>
            </tr>
          )
        })}

        </tbody>
      </table>
    </div>

  </div>;
}

export default Home;
