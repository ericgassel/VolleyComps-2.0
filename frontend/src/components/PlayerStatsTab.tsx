import React, { useState, useEffect, useMemo, SetStateAction, Dispatch } from 'react';
import { spray_line, player, useAppContext, useAppDispatchContext } from '../context/appContext';
import './TabStyles.css'
import { getRoster, getSprayChart } from '../action/action';
import * as d3 from 'd3';
import Comment from './Comment';
import { useParams } from 'react-router-dom';

const SprayChart = ({spray_chart, selected_player_id}: {spray_chart: spray_line[], selected_player_id: string}) => {
  const x_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 500]);

  const y_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 600]);
  
  const returned_diff = 7;
  let filteredChart;

  if (spray_chart) {
    if (selected_player_id === '0') {
      filteredChart = spray_chart.slice();
    } else {
      filteredChart = spray_chart.filter((line: spray_line) => line.player_id === selected_player_id);
    }
  }

  return (
    <svg className='sprayChartSVG'>
      <g>
        <rect className='sprayChartRect'></rect>
        <line x1={0} x2={500} y1={90} y2={90} stroke="white" strokeWidth={4}></line>
        <circle cx={0} cy={90} r={10} fill="black"></circle>
        <circle cx={500} cy={90} r={10} fill="black"></circle>
        <line x1={0} x2={500} y1={270} y2={270} stroke="white" strokeWidth={4} opacity={0.5}></line>
        {/* <rect className='sprayChartRect' width={500} height={500} x={100}></rect> */}
        {filteredChart ? filteredChart.map((line: any, i: number) => {
          const { start_x, end_x, start_y, end_y, player_id, result } = line;
          const scaled_start_x = x_scale(start_x);
          const scaled_start_y = y_scale(start_y);
          const scaled_end_x = x_scale(end_x);
          const scaled_end_y = y_scale(end_y);
          return (
            <React.Fragment key={i}>
              <line key={i} 
                x1={scaled_start_x} 
                x2={scaled_end_x} 
                y1={scaled_start_y} 
                y2={scaled_end_y} 
                opacity={1} 
                stroke={result === 'out' ? 'red' : '#000'}
                strokeWidth={2}
              >
              </line>
              {result === 'kill' ? (
                <circle cx={scaled_end_x} cy={scaled_end_y} r={5} fill="#fac476" stroke='black' strokeWidth={2}></circle>
              ) : result === 'returned' ? (
                <>
                  <line x1={scaled_end_x-returned_diff}
                    y1={scaled_end_y-returned_diff}
                    x2={scaled_end_x+returned_diff}
                    y2={scaled_end_y+returned_diff}
                    stroke='black' 
                    strokeWidth={2}
                  ></line>
                  <line x1={scaled_end_x-returned_diff}
                    y1={scaled_end_y+returned_diff}
                    x2={scaled_end_x+returned_diff}
                    y2={scaled_end_y-returned_diff}
                    stroke='black' 
                    strokeWidth={2}
                  ></line>
                </>
              ) : (<></>)}
            </React.Fragment>
          )
        }) : (
          <div>Loading...</div>
        )}
        <line x1={0} x2={50} y1={520} y2={520} stroke='black' strokeWidth={2}></line>
        <text x={60} y={525}>Shot / Serve</text>

        <line x1={0} x2={50} y1={540} y2={540} stroke='red' strokeWidth={2}></line>
        <text x={60} y={545}>Out</text>

        <circle cx={10} cy={560} r={7} stroke='black' fill='white' strokeWidth={2}></circle>
        <text x={25} y={565}>Kill</text>

        <line x1={10-returned_diff} x2={10+returned_diff} y1={580-returned_diff} y2={580+returned_diff} stroke='black' strokeWidth={2}></line>
        <line x1={10-returned_diff} x2={10+returned_diff} y1={580+returned_diff} y2={580-returned_diff} stroke='black' strokeWidth={2}></line>
        <text x={25} y={585}>Returned</text>
      </g>
    </svg>
  )
}


const PlayerStatsTab = () => {
  const state = useAppContext();
  const { roster, spray_chart, api_base_url } = state;
  const dispatch = useAppDispatchContext();
  const { teamID  }= useParams();

  const [selectedPlayer, setSelectedPlayer]: [player | undefined, Dispatch<SetStateAction<player | undefined>>] = useState();

  const notes: string | undefined = useMemo(() => {
    return selectedPlayer ? selectedPlayer.notes : ''
  }, [selectedPlayer]);

  const [isEditing, setIsEditing] = useState(false);


  const handleSelectedPlayer = (e: React.MouseEvent) => {
    const { id } = e.currentTarget;
    if (id === '0') {
      setSelectedPlayer(AllPlayer);
    } else {
      const newSelectedPlayer = roster.find((player: any) => player.player_id === id);
      setSelectedPlayer(newSelectedPlayer);
    }
    setIsEditing(false);
  }

  useEffect(() => {
    // 1. Fetch api
    getRoster(dispatch, `${api_base_url}/data/${teamID}/roster`);
      // 2. Load svg
    getSprayChart(dispatch, `${api_base_url}/data/${teamID}/spray_chart`);
  
    // 3. Clean up function: clean localStorage
    return () => {
      localStorage.removeItem('selectedPlayer');
    }
  }, [])

  useEffect(() => {
    // Setting up local states: selectedPlayer and notes
    // If there was previously selected player, set it as selectedPlayer
    const previousPlayer = localStorage.getItem('selectedPlayer');
    if (previousPlayer) {
      setSelectedPlayer(JSON.parse(previousPlayer));
    } 
    // else if (roster[0]) {
    //   setSelectedPlayer(roster[0]);
    // } 
    else {
      setSelectedPlayer(AllPlayer);
    }
  }, [roster])

  // console.log('spray____chart:', spray_chart)

  const AllPlayer = {
    player_id: '0',
    class: '',
    height: '',
    name: 'All',
    number: '',
    position: '',
  }

  // console.log('selectedPlayer:', selectedPlayer)

  return (
    (roster && selectedPlayer ? (
      <div className='playerStatsTab'>

        <div className='playersInfoContainer'>
          <div className='selectedPlayerContainer'>
            <div className='selectedPlayerImgContainer'>
              {/* <img className='selectedPlayerImg' src={'https://images.sidearmdev.com/resize?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fathletics.bethel.edu%2fimages%2f2022%2f8%2f24%2fDani_Friedges.jpg&width=300&type=jpeg'} /> */}
              {/* <img className='selectedPlayerImg' src={selectedPlayer.Image} /> */}
            </div>

            <div className='selectedPlayerInfoContainer'>
              {selectedPlayer ? selectedPlayer.player_id === AllPlayer.player_id ? (
                  <p className='selectedPlayerInfoText'>All Spray lines on the chart</p>
              ) : (
                <>
                  <p className='selectedPlayerInfoText'>Name: {selectedPlayer.name}</p>
                  <p className='selectedPlayerInfoText'>Position: {selectedPlayer.position}</p>
                  <p className='selectedPlayerInfoText'>Number: {selectedPlayer.number}</p>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>

          <h2 className='rosterHeader'>Team Roster</h2>
          <div className='teamRosterContainer'>
            <ul className='teamRosterList'>
              <li className={selectedPlayer.player_id === AllPlayer.player_id ? 'selected playerName' : 'playerName'}
                id={AllPlayer.player_id}
                onClick={handleSelectedPlayer}
                style={{ justifyContent: 'center' }}
              >
                <p>{AllPlayer.name}</p>
              </li>
              {roster.map((player: any) => 
                <li className={selectedPlayer.player_id === player.player_id ? 'selected playerName' : 'playerName'} 
                  key={player.player_id} 
                  id={player.player_id}
                  onClick={handleSelectedPlayer}
                >
                  <p className='rosterNumber'>{player.number}</p>
                  <p>{player.name}</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className='playerChartContainer'>
          <div className='chartContents'>
            <div className='chartSVGContainer'>
              <h2>Spray Chart</h2>

              <SprayChart spray_chart={spray_chart} selected_player_id={selectedPlayer.player_id} />
            </div>

            <div className='chartCommentContainer'>
              <h2 className='commentTitle'>Comment</h2>
              {selectedPlayer.player_id !== AllPlayer.player_id ? (
                <Comment
                  teamID={teamID}
                  notes={notes} 
                  selectedPlayer={selectedPlayer} 
                  setSelectedPlayer={setSelectedPlayer} 
                  isEditing={isEditing} 
                  setIsEditing={setIsEditing} 
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

      </div>
      ) : (        
      <div className='noAPIContainer'>
        <h2>There is no Player to show!</h2>
        <a className='shotEntryLink' href={`/management/${teamID}`}>Manage Roster</a>
      </div>
      )
    )
  );
}

export default PlayerStatsTab;
