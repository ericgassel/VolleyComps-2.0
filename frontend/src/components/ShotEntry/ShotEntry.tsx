import React from 'react'
import Square from './square.png'
import './ShotEntry.css';

let rotation_current_button: string = "";
let shot_type_current_button: string = "";
let result_current_button: string = "";
let selected_players : string[] = []



// INPUT: button name for which user clicks
// OUTPUT: N/A
//    - if button already selected, will deselect the button.
//    - otherwise, selects the button and deselects all other buttons
const btn_func = (btn_name: string, btn_options: string[], btn_type: string) =>{

  let rotations = document.getElementById("editRotations") as HTMLButtonElement;

    // selected a different button
    if (btn_name != btn_options[0] && btn_options[0] != "nothing"){
      let input = document.getElementById(btn_options[0]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }
    if (btn_name != btn_options[1] && btn_options[1] != "nothing"){
      let input = document.getElementById(btn_options[1]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }
    if (btn_name != btn_options[2] && btn_options[2] != "nothing"){
      let input = document.getElementById(btn_options[2]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }
    if (btn_name != btn_options[3] && btn_options[3] != "nothing"){
      let input = document.getElementById(btn_options[3]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }
    if (btn_name != btn_options[4] && btn_options[4] != "nothing"){
      let input = document.getElementById(btn_options[4]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }
    if (btn_name != btn_options[5] && btn_options[5] != "nothing"){
      let input = document.getElementById(btn_options[5]) as HTMLButtonElement;
      input.style.background = rotations.style.background;
    }

    // 
    if (btn_type == "rotation_type"){
      rotation_current_button = btn_name;
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

const applyInputs = () => {
  if (selected_players.length == 6) {
    let in1 = document.getElementById(("player" + selected_players[0]).toString()) as HTMLButtonElement;
    let in2 = document.getElementById(("player" + selected_players[1]).toString()) as HTMLButtonElement;
    let in3 = document.getElementById(("player" + selected_players[2]).toString()) as HTMLButtonElement;
    let in4 = document.getElementById(("player" + selected_players[3]).toString()) as HTMLButtonElement;
    let in5 = document.getElementById(("player" + selected_players[4]).toString()) as HTMLButtonElement;
    let in6 = document.getElementById(("player" + selected_players[5]).toString()) as HTMLButtonElement;
    let btn1 = document.getElementById("btn1") as HTMLButtonElement;
    let btn2 = document.getElementById("btn2") as HTMLButtonElement;
    let btn3 = document.getElementById("btn3") as HTMLButtonElement;
    let btn4 = document.getElementById("btn4") as HTMLButtonElement;
    let btn5 = document.getElementById("btn5") as HTMLButtonElement;
    let btn6 = document.getElementById("btn6") as HTMLButtonElement;
    let done = document.getElementById("done") as HTMLButtonElement;
    btn1.innerHTML = in1.innerHTML;
    btn2.innerHTML = in2.innerHTML;
    btn3.innerHTML = in3.innerHTML;
    btn4.innerHTML = in4.innerHTML;
    btn5.innerHTML = in5.innerHTML;
    btn6.innerHTML = in6.innerHTML;
    in1.style.background = "";
    in2.style.background = "";
    in3.style.background = "";
    in4.style.background = "";
    in5.style.background = "";
    in6.style.background = "";
    selected_players = [];
    let num_players_selected = document.getElementById("numSelectedText") as HTMLTextAreaElement;
    num_players_selected.textContent = "  Number selected: "+ selected_players.length.toString() +"/6";
  } else {
    alert("Please select 6 players");
  }
  
  

}

const makeVisible = () => {
  let in1 = document.getElementById("in1") as HTMLInputElement;
  let in2 = document.getElementById("in2") as HTMLInputElement;
  let in3 = document.getElementById("in3") as HTMLInputElement;
  let in4 = document.getElementById("in4") as HTMLInputElement;
  let in5 = document.getElementById("in5") as HTMLInputElement;
  let in6 = document.getElementById("in6") as HTMLInputElement;
  let done = document.getElementById("done") as HTMLButtonElement;
  if (in1.style.display != ''){
    in1.style.display = '';
    in2.style.display = '';
    in3.style.display = '';
    in4.style.display = '';
    in5.style.display = '';
    in6.style.display = '';
    done.style.display = '';
  } else {
    in1.style.display = 'none';
    in2.style.display = 'none';
    in3.style.display = 'none';
    in4.style.display = 'none';
    in5.style.display = 'none';
    in6.style.display = 'none';
    done.style.display = 'none';
  }

}

// INPUT: IDs of buttons to clear formatting
// OUTPUT: N/A
//    - clears the formatting of all buttons with IDs passed in input
const clearAllButtons = (btn_ids: string[]) => {
  let rotations = document.getElementById("editRotations") as HTMLButtonElement;
  for (let i = 0; i < btn_ids.length ; i++ ){
    let input = document.getElementById(btn_ids[i]) as HTMLButtonElement;
    input.style.background = rotations.style.background;
  }
} 
const deleteSelectedPlayer = (num: string) => {
  for(let i = 0; i<selected_players.length; i++){
    if (selected_players[i] == num){
      selected_players.splice(i,1);
    }
  }
}
const selectPlayer = (num: string) => {
  
  let player = document.getElementById("player" + num) as HTMLButtonElement;
  if (player.style.background == "red"){
    player.style.background = "";
    deleteSelectedPlayer(num);
    
  } else if (selected_players.length <= 6){
    player.style.background = "red";
    selected_players.push(num)
  } else {
    alert("Only can select 6 players at a time")
  }

  let num_players_selected = document.getElementById("numSelectedText") as HTMLTextAreaElement;
  num_players_selected.textContent = "  Number selected: "+ selected_players.length.toString() +"/6";
  
}

// INPUT: list of player numbers that are selectable for shot entry
// OUTPUT: N/A
//    - sets the div element with ID: playerOptions to HTML of buttons to select players
const playerOptions = (player_nums: string[]) => {
  let appended = document.getElementById("playerOptions") as HTMLDivElement;
  
  let k : number = 0;
  while (k < player_nums.length){
    for(let i = k; i < 10+k; i++){
      if (i < player_nums.length){
        let element = document.createElement("button");
        element.id = "player" + (i+1).toString();
        element.type = "rotationButton";
        element.innerHTML=player_nums[i];
        element.onclick = () => selectPlayer((i+1).toString());
        appended.append(element);
      }
      
    }
    k = k+10;
    let line_break = document.createElement("br");
    line_break.innerHTML="</br>";
    appended.append(line_break);
  }
  let setLineup = document.createElement("button");
  setLineup.id = "editRotations";
  setLineup.onclick = applyInputs;
  setLineup.innerHTML = "Select Players";
  setLineup.type = "rotationButton";
  appended.append(setLineup)
  let num_players_selected = document.createElement("text");
  num_players_selected.textContent = "  Number selected: 0/6";
  num_players_selected.id="numSelectedText";
  appended.append(num_players_selected);

  




  /*
  let player_options = document.getElementById("playerOptions") as HTMLDivElement;
  let html = "<table>";
  for(let i = 0; i < 6; i++){
    if (player_nums.length > i){
      html += "<td><button id=player" + (i+1).toString() + " onClick{selectPlayer("+ (i+1).toString() + ")}>"+ player_nums[i].toString() +"</button></td>";
    }
  }
  html += "</table>"
  player_options.innerHTML = html;
  let element = 
  */

}


const ShotEntry=() =>{
    return <div className='ShotEntry'>
            <h1>Shot Entry</h1>
            <div id='playerOptions'>
              
            </div>
            <div id = 'test'></div>
            <table onLoad={() => playerOptions(["12","13","4","9","32","76","43","21","82","7","3","59","42","54","45","99","0"])}>
              <tr>
                <div className='left'>
                  <img src={Square} ></img>
                </div>
                <div className='right'>
                  <table >
                    <table >
                      <td><button id='btn1' onClick={() => {btn_func("btn1",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                      <td><button id='btn2' onClick={() => {btn_func("btn2",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                      <td><button id='btn3' onClick={() => {btn_func("btn3",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                    </table>
                    <table >
                      <td><button id='btn4' onClick={() => {btn_func("btn4",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                      <td><button id='btn5' onClick={() => {btn_func("btn5",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                      <td><button id='btn6' onClick={() => {btn_func("btn6",["btn1","btn2","btn3","btn4","btn5","btn6"],"rotation_type")}}></button></td>
                    </table>
                  </table>

                    <br/>
                    <table>
                    <tr>
                      <td><button id='serve' onClick={() => {btn_func("serve",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Serve</button></td>
                      <td><button id='shot' onClick={() => {btn_func("shot",["serve","shot","nothing","nothing","nothing","nothing"],"shot_type")}}>Shot</button></td>
                    </tr>
                    </table>
                    <br/>
                    <table>
                    <tr>
                      <td><button id='kill' onClick={() => {btn_func("kill",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Kill/Ace</button></td>
                      <td><button id='returned' onClick={() => {btn_func("returned",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Returned</button></td>
                      <td><button id='out' onClick={() => {btn_func("out",["nothing","nothing","kill","returned","out","nothing"],"result_type")}}>Out</button></td>
                    </tr>
                    </table>
                    <br/>
                    <table>
                    <tr>
                      <td><button id='addShot' onClick={() => {clearAllButtons(["serve","shot","kill","returned","out","btn1","btn2","btn3","btn4","btn5","btn6"])}}>ADD SHOT</button></td>
                      <td><button id='undo' onClick={() => {clearAllButtons(["serve","shot","kill","returned","out","btn1","btn2","btn3","btn4","btn5","btn6"])}}>CLEAR</button></td>
                    </tr>
                    </table>
                    <br/>
                    <table>
                    <tr>
                      <td><button>Switch to Rotations</button></td>
                    </tr>
                    </table>
                </div>
                </tr>

            </table>
            


            
        </div>;
  }

export default ShotEntry