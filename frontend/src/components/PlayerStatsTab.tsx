import React from 'react';
import './TabStyles.css'
// import * as d3 from 'd3';

const  PlayerStatsTab = () =>{
  const teamRoster = ['Mickey Mouse', 'Donald Duck', 'The Rock', 'Superman', 'Batman']; // replace it with fetched team roster
  const selectedPlayer = {
    Position: 'OH1',
    Number: 21,
    Name: 'Frieges'
  };

  return (
        <div className='playerStatsTab'>

          <div className='playerChartContainer'>
            <h2>Spray Chart - dropdown: Heat Map, Visualizations</h2>
            <div className='chartSVGContainer'>
              <img src={require('../heatmap_zones.svg').default} alt='mySvgImage' />
            </div>
            <div className='chartCommentContainer'>
              <div>Comments</div>
            </div>
          </div>

          <div className='playersInfoContainer'>
            <div className='selectedPlayerContainer'>
              <div className='selectedPlayerImgContainer'>
                <img className='selectedPlayerImg' src={'https://images.sidearmdev.com/resize?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fathletics.bethel.edu%2fimages%2f2022%2f8%2f24%2fDani_Friedges.jpg&width=300&type=jpeg'} />
              </div>

              <div className='selectedPlayerInfoContainer'>
                <p>Position: {selectedPlayer.Position}</p>
                <p>Number: {selectedPlayer.Number}</p>
                <p>Name: {selectedPlayer.Name}</p>
              </div>
            </div>

            <div className='teamRosterContainer'>
              <h2>Team Roster</h2>
              <ul className='teamRosterList'>
                {teamRoster.map((team, i) => <li key={team}>{team}</li>)}
              </ul>
            </div>
          </div>

        </div>

        );
}

export default PlayerStatsTab;
