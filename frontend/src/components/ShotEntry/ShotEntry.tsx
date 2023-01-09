import React from 'react'
import Square from './square.png'
import './ShotEntry.css';
import {createSvg,addShotToSvg} from './ShotSVG'
import CalendarItem from './CalendarItem'
import {addDates,hideCalendar} from './CalendarItem'

let rotation_current_player: string = "";
let shot_type_current_button: string = "";
let result_current_button: string = "";
let player_order : string[] = []



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
    }
    if (btn_type == "result_type") {
      result_current_button = btn_name;
    }
      
  
  // color selected button
  let input = document.getElementById(btn_name) as HTMLButtonElement;
  input.style.background = "red";
  
}


// INPUT: IDs of buttons to clear formatting
// OUTPUT: N/A
//    - clears the formatting of all buttons with IDs passed in input
const clearAllButtons = (btn_ids: string[]) => {

  
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
    let player = document.getElementById("player" + rotation_current_player) as HTMLButtonElement
    console.log(player.innerHTML);
    addShotToSvg(shot_type_current_button,result_current_button,parseInt(player.innerHTML));
    deleteSelectedPlayer(player.innerHTML);
    //player.innerHTML is the player's number
    player_order.unshift(player.innerHTML);
    playerOptions(player_order);
    clearAllButtons(btn_ids_toClear);
    let player_btns = document.getElementById("playerOptions") as HTMLDivElement;
    player_btns.scrollTop = 0;
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
 
    player.style.background = "red";
    if (rotation_current_player != "" && num != rotation_current_player) {
      let old_selected = document.getElementById("player" + rotation_current_player) as HTMLButtonElement;
      old_selected.style.background = "";
    } 
    rotation_current_player = num;
    
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
        element.type = "rotationButton";
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

// adds the calendar to the page if is on ShotEntry page
window.onload = function() {
  if (window.location.href.includes("ShotEntry")){
    addDates();
  }
  
 }

// INPUT: dateID
// OUTPUT: N/A
//    - creates SVG on the page. Also shows shotEntry content and hides calendar content
export const loadShotEntryContent = (dateID : string) => {
    // -- would plug in players gotten from DB here --
    playerOptions(["12","13","4","9","32","76","43","21","82","7","3","59","42","54","45","99","0"]);
    createSvg(dateID);
    let chartDiv : HTMLDivElement = document.getElementById("chart") as HTMLDivElement;
    chartDiv.className="left";
    let dataDiv : HTMLDivElement = document.getElementById("dataEntry") as HTMLDivElement;
    dataDiv.className="right";
    hideCalendar();
}

const ShotEntry=() =>{
    return <div className='ShotEntry'>
          

            <h1 >Shot Entry</h1>
            <CalendarItem />
                  
                <div id='chart' className='left-hide'></div>

                <div id = "dataEntry" className='right-hide'>

                  <div id='playerOptions'>
              
                   </div>
                 

                    <br/>
                    <table>
                      <tbody>
                    <tr>
                      <td><button id='serve' onClick={() => {btn_func("serve",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Serve</button></td>
                      <td><button id='shot' onClick={() => {btn_func("shot",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Shot</button></td>
                    </tr>
                    </tbody>
                    </table>
                    <br/>
                    <table>
                    <tbody>
                    <tr>
                      <td><button id='kill' onClick={() => {btn_func("kill",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Kill/Ace</button></td>
                      <td><button id='returned' onClick={() => {btn_func("returned",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Returned</button></td>
                      <td><button id='out' onClick={() => {btn_func("out",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Out</button></td>
                    </tr>
                    </tbody>
                    </table>
                    <br/>
                    <table>
                    <tbody>
                    <tr>
                      <td><button id='addShot' onClick={() => {addShot(["serve","shot","kill","returned","out"]);}}>ADD SHOT</button></td>
                      <td><button id='undo' onClick={() => {clearAllButtons(["serve","shot","kill","returned","out"])}}>CLEAR</button></td>
                    </tr>
                    </tbody>
                    </table>
                    <br/>
                    <table>
                    <tbody>
                    <tr>
                      <td>
                        <a href='/Rotations'>
                        <button>Switch to Rotations</button></a>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </div>


        </div>;
  }

export default ShotEntry