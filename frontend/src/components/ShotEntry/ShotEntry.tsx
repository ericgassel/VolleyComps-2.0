import React from 'react'
import Square from './square.png'
import './ShotEntry.css';
import {createSvg,addShotToSvg} from './ShotSVG'
import { create, utcDay } from 'd3';
import { time } from 'console';


let rotation_current_player: string = "";
let shot_type_current_button: string = "";
let result_current_button: string = "";
let player_order : string[] = [];

// TODO:
// add calendar item at the top of the page instead of calendar as seperate page thing.
// defaults to the current date

// also might want to add notes during shot entry
//  - ability to go to the scouting report from shot entry?

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
const disableButton = (id : string) : void =>{
  let field : HTMLButtonElement = document.getElementById(id) as HTMLButtonElement;
  field.disabled = true;
}

// INPUT: id of HTML button element
// OUTPUT: N/A
//    - enables button with id passed in as input
const enableButton = (id : string) : void =>{
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
    if (btn_type == "result_type") {
      result_current_button = btn_name;
      enableButton("addShot");
    }
      
  
  // color selected button
  let input = document.getElementById(btn_name) as HTMLButtonElement;
  input.style.background = "#277ACC";
  
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
  for (let i = 1; i<player_order.length;i++){
    let input = document.getElementById("player" + i.toString()) as HTMLButtonElement;
    input.style.background = "";
  }
  rotation_current_player = "";
  shot_type_current_button = "";
  result_current_button = "";
} 

const addShot = (btn_ids_toClear: string[]) => {

  if (rotation_current_player != "" && shot_type_current_button != "" && result_current_button != "") {
    let player = document.getElementById("player" + rotation_current_player) as HTMLButtonElement;
    

    addShotToSvg(shot_type_current_button,result_current_button,parseInt(player.innerHTML));

    deleteSelectedPlayer(player.innerHTML);
    //player.innerHTML is the player's number
    player_order.unshift(player.innerHTML);
    playerOptions(player_order);
    clearAllButtons(btn_ids_toClear);
    let player_btns = document.getElementById("playerOptions") as HTMLDivElement;
    player_btns.scrollTop = 0;
    disableFields();
  } else if (rotation_current_player == ""){
    alert("Please select a player.");
  }
  else if (shot_type_current_button == ""){
    alert("Please select a shot type.");
  }
  else if (result_current_button == ""){
    alert("Please select result type.");
  }
}
const deleteSelectedPlayer = (num: string) => {
  for(let i = 0; i<player_order.length; i++){
    if (player_order[i] == num){
      player_order.splice(i,1);
    }
  }
}
const selectPlayer = (num: string) => {
  
  let player = document.getElementById("player" + num) as HTMLButtonElement;
 
    player.style.background = "#277ACC";
    if (rotation_current_player != "" && num != rotation_current_player) {
      let old_selected = document.getElementById("player" + rotation_current_player) as HTMLButtonElement;
      old_selected.style.background = "";
    } 
    rotation_current_player = num;

    enableButton("shot");
    enableButton("serve");
    
  }
  


// INPUT: list of player numbers that are selectable for shot entry
// OUTPUT: N/A
//    - sets the div element with ID: playerOptions to HTML of buttons to select players
const playerOptions = (player_nums: string[]) => {
  let appended = document.getElementById("playerOptions") as HTMLDivElement;
  appended.innerHTML = "";
  player_order = [];
  let k : number = 0;
  while (k < player_nums.length){
    for(let i = k; i < 4+k; i++){
      if (i < player_nums.length){
        let element = document.createElement("button");
        element.id = "player" + (i+1).toString();
        element.className = "tableButton";
        element.innerHTML=player_nums[i];
        element.onclick = () => selectPlayer((i+1).toString());
        appended.append(element);
        player_order.push(player_nums[i])
      }
      
    }
    k = k+4;
    let line_break : HTMLElement= document.createElement("br");
    line_break.innerHTML="</br>";
    appended.append(line_break);
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
  createSvg(getDateString(date));
}



// INPUT: N/A
// OUTPUT: a list of player number numbers
//    - calls API and returns list of player numbers
async function getPlayerNumbers() : Promise<string[]>{
  let response : any = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?col=number', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json());

    let numbers : string[] = []
    for (let i : number = 0; i < response.length; i++){
      numbers.push(response[i].number.toString())
    }
    
    return numbers;
}

// adds the calendar to the page if is on ShotEntry page
window.addEventListener("load", async (event) => {
  if (window.location.href.includes("ShotEntry")){
    // set default value of date element

    let today : Date = new Date();
    let timezoneOffset = new Date().getTimezoneOffset();
    
    today.setTime(today.getTime()-(timezoneOffset/60)*3600*1000);
  
    createSvg(getDateString(today));
    let dateElement : HTMLInputElement = document.getElementById("dateInput") as HTMLInputElement;
    dateElement.valueAsDate = today;


    // get player numbers from data base
    let playerNumbers : string[]  = await getPlayerNumbers();
    playerOptions(playerNumbers);
    disableFields();
    
  }
});

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
  return "/report/" + id + "/playerStatsTab";
}

const ShotEntry=() =>{
    return <div className='ShotEntry'>
          
          
            <h1 >Shot Entry</h1>
            
            
           
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
                        <td><button id='addShot' className='tableButton' onClick={() => {addShot(["serve","shot","kill","returned","out"]);}}>ADD SHOT</button></td>
                        <td><button id='delete' className='tableButton'>Delete</button></td>
                        <td><button id='undo' className='tableButton' onClick={() => {clearAllButtons(["serve","shot","kill","returned","out"])}}>CLEAR</button></td>
                        
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