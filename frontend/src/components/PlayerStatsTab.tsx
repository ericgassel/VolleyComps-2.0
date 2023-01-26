import React, { useState, useEffect, useMemo } from 'react';
import { spray_line, useAppContext, useAppDispatchContext } from '../context/appContext';
import './TabStyles.css'
import { getRoster, getSprayChart } from '../action/action';
import * as d3 from 'd3';

const SprayChart = (spray_chart: any) => {
  // console.log('spray_charts:', spray_chart.spray_chart);

  return (
    <svg className='sprayChartSVG' width={500} height={500}>
      <g>
        {/* <rect className='sprayChartRect' width={500} height={500} x={x_scale(0)} y={y_scale(0)}></rect> */}
        <rect className='sprayChartRect' width={500} height={500}></rect>

          {spray_chart.spray_chart ? spray_chart.spray_chart.map((line: any, i: number) => {
            // console.log('line:', line);
            const { start_x, end_x, start_y, end_y } = line;
            return (
              <line key={i} x1={Number(start_x)} x2={Number(end_x)} y1={Number(start_y)} y2={Number(end_y)} opacity={1} stroke={'#000'}></line>
              )}
            ) : (
              <div>Loading...</div>
            )}
        

          {/* <line x1={250} x2={150} y1={0} y2={480} opacity={1} stroke={'#000'}></line> */}
      </g>
    </svg>
  )
}


const PlayerStatsTab = () => {
  const state = useAppContext();
  const { roster, spray_chart, api_base_url } = state;
  const dispatch = useAppDispatchContext();

  const [selectedPlayer, setSelectedPlayer]: any = useState();

  const notes = useMemo(() => {
    return selectedPlayer ? selectedPlayer.notes : ''
  }, [selectedPlayer]);

  const handleSelectedPlayer = (e: React.MouseEvent) => {
    const { id } = e.currentTarget;
    const newSelectedPlayer = roster.find((player: any) => player.player_id === id);
    setSelectedPlayer(newSelectedPlayer);
  }

  useEffect(() => {
    // 1. Fetch api
      getRoster(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`);
      getSprayChart(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/spray_chart`);
    // 2. Load svg
  
    // 3. Clean up function: exit load
    return () => {
      
    }
  }, [])

  useEffect(() => {
    // Setting up local states: selectedPlayer and notes
    if (roster[0]) {
      setSelectedPlayer(roster[0]);
    }
  }, [roster])

  // console.log('spray____chart:', spray_chart)

  return (
    (roster && selectedPlayer ? (
      <div className='playerStatsTab'>

      <div className='playersInfoContainer'>
        <div className='selectedPlayerContainer'>
          <div className='selectedPlayerImgContainer'>
            <img className='selectedPlayerImg' src={'https://images.sidearmdev.com/resize?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fathletics.bethel.edu%2fimages%2f2022%2f8%2f24%2fDani_Friedges.jpg&width=300&type=jpeg'} />
          </div>

          <div className='selectedPlayerInfoContainer'>
            <p className='selectedPlayerInfoText'>Name: {selectedPlayer.name}</p>
            <p className='selectedPlayerInfoText'>Position: {selectedPlayer.position}</p>
            <p className='selectedPlayerInfoText'>Number: {selectedPlayer.number}</p>
          </div>
        </div>

        <div className='teamRosterContainer'>
          <h2>Team Roster</h2>
          <ul className='teamRosterList'>
            {roster.map((player: any, i: Number) => 
              <li className='playerName' 
                  key={player.player_id} 
                  id={player.player_id}
                  style={{ fontWeight : selectedPlayer.player_id === player.player_id ? 'bold' : 'normal' }} 
                  onClick={handleSelectedPlayer}>{player.name}</li>
            )}
          </ul>
        </div>
      </div>

      <div className='playerChartContainer'>
        <h2>Spray Chart - dropdown: Heat Map, Visualizations</h2>
        <div className='chartSVGContainer'>
          {/* <img src={require('../heatmap_zones.svg').default} alt='mySvgImage' /> */}
          <SprayChart spray_chart={spray_chart} />
        </div>
        <div className='chartCommentContainer'>
          <div className='commentTitle'>Comment</div>
          <div className='commentContents'>
            {/* {notes && notes.map((note: String, i: React.Key) => <li key={i}>{note}</li>)} */}
            {notes ? notes.split('\n').map((note: string, i: number) => <div key={i}>- {note}</div>) : <></>}
          </div>
        </div>
      </div>

      </div>
      ) : (<div>Loading...</div>)
    )
  );
}

export default PlayerStatsTab;
