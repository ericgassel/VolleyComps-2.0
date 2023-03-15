import React from 'react'
import Square from './square.png'
import './ShotEntry.css';
import {createSvg,addShotToSvg, fullNewLoadSvg, Shot} from './ShotSVG'
import { create, utcDay } from 'd3';
import { time } from 'console';

// interface representing a player
interface Player {
  player_num : number;
  player_id : string;
} 

declare global {
  // variable that represents if it is okay to enable addShot button
  var okay_to_add : boolean;
}

// the player currently selected
let current_player: Player | null = null;

// the shot type that is selected
let shot_type_current_button: string = "";

// the result button that is selected
let result_current_button: string = "";

// the order of which players appear in shot entry
let player_order : Player[] = [];

// color for selecting a player in the rotation
let selection_color : string = "#51558B";



// INPUT: date object
// OUTPUT: date string of D(D)/M(M)/YYYY
//    - () in output means that may or may not return with digit there
//    - for example, could return 1/13/2023, 5/1/2023, or 12/30/2023
const getDateString = (date : Date) : string => {
  return (date.getMonth() + 1).toString() + "/" + (date.getDate()).toString() + "/" + date.getFullYear().toString().substring(2,4);
}

// INPUT: N/A
// OUTPUT: N/A
//    - Disables all fields besides player entry and switching between pages
const disableFields = () : void => {
  disableButton("serve");
  disableButton("shot");
  disableButton("kill");
  disableButton("returned");
  disableButton("out");
  disableButton("addShot");
  disableButton("delete");

}

// INPUT: id of HTML button element
// OUTPUT: N/A
//    - disables button with id passed in as input
export const disableButton = (id : string) : void =>{
  let field : HTMLButtonElement = document.getElementById(id) as HTMLButtonElement;
  field.disabled = true;
}

// INPUT: id of HTML button element
// OUTPUT: N/A
//    - enables button with id passed in as input
export const enableButton = (id : string) : void =>{
  let field : HTMLButtonElement = document.getElementById(id) as HTMLButtonElement;
  field.disabled = false;
}

// INPUT: button name for which user clicks
// OUTPUT: N/A
//    - if button already selected, will deselect the button.
//    - otherwise, selects the button and deselects all other buttons
const btn_func = (btn_name: string, btn_options: string[], btn_type: string) =>{
    // selected a different button
    if (btn_name != btn_options[0] && btn_options[0] != "nothing"){
      let input = document.getElementById(btn_options[0]) as HTMLButtonElement;
      input.style.background = "";
    }
    if (btn_name != btn_options[1] && btn_options[1] != "nothing"){
      let input = document.getElementById(btn_options[1]) as HTMLButtonElement;
      input.style.background ="";
    }
    if (btn_name != btn_options[2] && btn_options[2] != "nothing"){
      let input = document.getElementById(btn_options[2]) as HTMLButtonElement;
      input.style.background = "";
    }
    if (btn_name != btn_options[3] && btn_options[3] != "nothing"){
      let input = document.getElementById(btn_options[3]) as HTMLButtonElement;
      input.style.background ="";
    }
    if (btn_name != btn_options[4] && btn_options[4] != "nothing"){
      let input = document.getElementById(btn_options[4]) as HTMLButtonElement;
      input.style.background = "";
    }
    if (btn_name != btn_options[5] && btn_options[5] != "nothing"){
      let input = document.getElementById(btn_options[5]) as HTMLButtonElement;
      input.style.background = "";
    }


    if (btn_type == "shot_type") {
      shot_type_current_button = btn_name;
      enableButton("kill");
      enableButton("returned");
      enableButton("out");
    }
    if (btn_type == "result_type" ) {
      result_current_button = btn_name;
      // if we have selected a shot on SVG, enable the add shot button.
      if (globalThis.first_click != null && globalThis.second_click != null){
        enableButton("addShot");


      }
      globalThis.okay_to_add = true;
    }
      
  
  // color selected button
  let input = document.getElementById(btn_name) as HTMLButtonElement;
  input.style.background = selection_color;
  
}



// INPUT: IDs of buttons to clear formatting
// OUTPUT: N/A
//    - clears the formatting of all buttons with IDs passed in input
const clearAllButtons = (btn_ids: string[]) => {

  disableFields();
  for (let i = 0; i < btn_ids.length ; i++ ){
    let input = document.getElementById(btn_ids[i]) as HTMLButtonElement;
    input.style.background = "";
  }
  for (let i = 0; i<player_order.length;i++){
    let input = document.getElementById("player" + player_order[i].player_id) as HTMLButtonElement;
    input.style.background = "";
  }
  current_player = null;
  shot_type_current_button = "";
  result_current_button = "";

  createSvg();
} 

const addShot = (btn_ids_toClear: string[]) => {

  if (current_player != null && shot_type_current_button != "" && result_current_button != "") {
    
    addShotToSvg(shot_type_current_button,result_current_button,current_player.player_id);

    let deletedPlayer : Player | null = deleteSelectedPlayer(current_player);
    
    if (deletedPlayer != null){
      player_order.unshift(deletedPlayer);
    }
    
    playerOptions(player_order);
    clearAllButtons(btn_ids_toClear);
    let player_btns = document.getElementById("playerOptions") as HTMLDivElement;
    player_btns.scrollTop = 0;
    disableFields();
  } else if (current_player == null){
    alert("Please select a player.");
  }
  else if (shot_type_current_button == ""){
    alert("Please select a shot type.");
  }
  else if (result_current_button == ""){
    alert("Please select result type.");
  } 
}

// INPUT: player number as a string
// OUTPUT: the deleted player or null if no player was deleted.
const deleteSelectedPlayer = (player: Player) : Player | null => {
  for(let i = 0; i<player_order.length; i++){
    if (player_order[i].player_id == player.player_id){
      return player_order.splice(i,1)[0];
    }
  }
  return null;
}

// INPUT: player
// OUTPUT: N/A
//      - sets the current_player to player. Also enables next level of data entry
const selectPlayer = (player: Player) => {
  
  let playerHTML = document.getElementById("player" + player.player_id) as HTMLButtonElement;
 
  playerHTML.style.background = selection_color;
    if (current_player != null && player != current_player) {
      let old_selected = document.getElementById("player" + current_player.player_id) as HTMLButtonElement;
      old_selected.style.background = "";
    } 
    current_player = player;
    
    enableButton("shot");
    enableButton("serve");
    
  }
  


// INPUT: list of player numbers that are selectable for shot entry
// OUTPUT: N/A
//    - sets the div element with ID: playerOptions to HTML of buttons to select players
const playerOptions = (players: Player[]) => {
  let appended = document.getElementById("playerOptions") as HTMLDivElement;
  appended.innerHTML = "";
  player_order = [];
  let k : number = 0;
  while (k < players.length){
    for(let i = k; i < 4+k; i++){
      if (i < players.length){
        let element = document.createElement("button");
        element.id = "player" + players[i].player_id;
        element.className = "tableButton";
        element.innerHTML=players[i].player_num.toString();
        element.onclick = () => selectPlayer(players[i]);
        appended.append(element);
        player_order.push(players[i])
      }
      
    }
    k = k+4;
    let line_break : HTMLElement= document.createElement("br");
    line_break.innerHTML="</br>";
    appended.append(line_break);
  }

  // ------------ 
  // if there are no players, have button to go add players
  if (players.length == 0){
    let url : string = window.location.href;
    let id : string = url.substring(url.lastIndexOf("/") + 1);
    let noPlayerNotification : HTMLParagraphElement = document.createElement("p");
    noPlayerNotification.innerHTML = "No players added. Click <a href='/management/"+ id +"'>here</a> to add players";
    appended.append(noPlayerNotification);
  }

}

// INPUT: N/A
// OUTPUT: N/A
//    - changes SVG to reflect date selected by date selector
const changeSVG = () => {
  let dateItem : HTMLInputElement = document.getElementById("dateInput") as HTMLInputElement;
  let date : Date = new Date(dateItem.value);
  // for some reason have to increment date by 1.
  date.setDate(date.getDate() + 1);
  fullNewLoadSvg(getDateString(date));
}

// INPUT: N/A
// OUTPUT: the school name for the ID passed in through URL.
async function getSchoolName() {
  let url : string = window.location.href;
  let id : string = url.substring(url.lastIndexOf("/") + 1);
  let name : string = "";
  let response : any = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/schools', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json())
    .then(result => {
      Object.keys(result).forEach(function(key) {
          if(result[key][0] == id){
              name = key;
          }
      });


    });
    return name;
    
  
}

// INPUT: N/A
// OUTPUT: a list of players
//    - calls API and returns list of player numbers
async function getPlayers() : Promise<Player[]>{
  let url : string = window.location.href;
  let id : string = url.substring(url.lastIndexOf("/") + 1);
  let response : any = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/'+ id +'/roster?col=number,player_id', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json());

    let playerList : Player[] = []
    for (let i : number = 0; i < response.length; i++){
      let player : Player = {player_num: response[i].number,player_id: response[i].player_id}
      playerList.push(player);
    }
    
    return playerList;
}

// adds the calendar to the page if is on ShotEntry page
window.addEventListener("load", async (event) => {
  if (window.location.href.includes("ShotEntry")){
    let allHTML : HTMLDivElement = document.getElementById("allHTML") as HTMLDivElement;
    allHTML.style.display = "none";

    let name = await getSchoolName();
    let pageName : HTMLHeadingElement = document.getElementById("pageName") as HTMLHeadingElement;
    pageName.innerHTML = "Shot Entry - " + name;
    // set default value of date element

    let today : Date = new Date();
    let timezoneOffset = new Date().getTimezoneOffset();
    
    today.setTime(today.getTime()-(timezoneOffset/60)*3600*1000);
  
    fullNewLoadSvg(getDateString(today));
    let dateElement : HTMLInputElement = document.getElementById("dateInput") as HTMLInputElement;
    dateElement.valueAsDate = today;


    // get player numbers from data base
    let currentPlayers : Player[]  = await getPlayers();
    playerOptions(currentPlayers);
    disableFields();
    allHTML.style.display = "";
    
  }
}

);

// INTPUT: N/A
// OUTPUT: returns url path to get to rotations page
const getRotationsURL = () : string => {
  let url : string = window.location.href;
  let id : string = url.substring(url.lastIndexOf("/") + 1);
  return "/Rotations/" + id;
}

// INPUT: N/A
// OUTPUT: returns string of URL to get to scouting report
const getScountingReportURL = () : string => {
  let url : string = window.location.href;
  let id : string = url.substring(url.lastIndexOf("/") + 1);
  return "/report/" + id + "/sprayChartTab";
}

// INPUT: N/A
// OUTPUT: deletes the selected shot from the database and SVG
async function deleteShot() : Promise<void> {
  // ------------------
  // get sheets id
  let url : string = window.location.href;
  let id : string = url.substring(url.lastIndexOf("/") + 1);
  // -------------------
  // delete shot from svg
  let newDataGraph : Shot[] = [];
  let oldShots : Shot[] = [];
  for(let i : number = 0; i<globalThis.data_graph.length;i++){
    if (!globalThis.data_graph[i].clicked){
      newDataGraph.push(globalThis.data_graph[i]);
    } else {
      oldShots.push(globalThis.data_graph[i]);
    }
  }
  globalThis.data_graph = newDataGraph;
  createSvg();
  disableButton("delete");

  // --------------------
  // delete shot from database
  for(let i : number = 0; i<oldShots.length;i++){
    let data : {[key: string] : {[key: string] : string}} = {};
    let toDelete : {[key: string] : string} = {}
    toDelete.player_id = oldShots[i].player_id;
    toDelete.date = oldShots[i].date;
    toDelete.result = oldShots[i].result;
    toDelete.type = oldShots[i].shot_type;
    data.todelete = toDelete;
    console.log(JSON.stringify(data));
    // send delete request to API
    await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/delete/'+ id+'/spray_chart', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
  }
  
  
}



const ShotEntry=() =>{
    return <div className='ShotEntry' id="allHTML">
          
          
            <h1 id="pageName">Shot Entry</h1>
            
            
           
                <div id='chart' className='left'></div>
                

                <div id = "dataEntry" className='right'>
                  <p id='dateOfShots'>Date of Shot:</p>
                <input type="date" id='dateInput' onChange={changeSVG}></input>
                  <br/>
                  <p>Shot Info:</p>
                  <div id='playerOptions'>
              
                   </div>
                 

                    <br/>
                    <table className='shotEntryTable'>
                        <tbody>
                      <tr>
                        <td><button id='serve' className='tableButton' onClick={() => {btn_func("serve",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Serve</button></td>
                        <td><button id='shot' className='tableButton' onClick={() => {btn_func("shot",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Shot</button></td>
                      </tr>
                      </tbody>
                    </table>
                      <br/>
                      <table className='shotEntryTable'>
                      <tbody>
                      <tr>
                        <td><button id='kill' className='tableButton' onClick={() => {btn_func("kill",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Kill/Ace</button></td>
                        <td><button id='returned' className='tableButton' onClick={() => {btn_func("returned",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Returned</button></td>
                        <td><button id='out' className='tableButton' onClick={() => {btn_func("out",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Out</button></td>
                      </tr>
                      </tbody>
                    </table>
                    <br/>

                    <table className='shotEntryTable'>
                      <tbody>
                        
                      <tr>
                        <td>
                          
                          <button id='addShot' className='tableButton' onClick={() => {addShot(["serve","shot","kill","returned","out"]);}} data-tooltip="Select player, shot options, and spots on court.">ADD SHOT</button>
                          
                          </td>
                        <td><button id='delete' className='tableButton' onClick={deleteShot} data-tooltip="Select a shot to delete.">Delete</button></td>
                        <td><button id='undo' className='tableButton' onClick={() => {clearAllButtons(["serve","shot","kill","returned","out"])}}>Reset</button></td>
                        
                      </tr>
                      </tbody>
                    </table>
                    
                    <br/>
                    <table className='shotEntryTable'>
                      <tbody>
                      <tr>
                        <td>
                          <a href={getRotationsURL()}>
                          <button className='switchButton'>Switch to Rotations</button></a>
                          <a href={getScountingReportURL()}>
                          <button className='switchButton'>Scouting Report</button></a>
                          </td>
                      </tr> 
                      </tbody>
                    </table>
                </div>


        </div>;
  }

export default ShotEntry