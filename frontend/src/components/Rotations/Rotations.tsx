import React from 'react'
import Square from './square.png'
import './Rotations.css';

// represents the 6 players that are currently selected as part of the rotation
let current_players_on_rotation : string[] = [];

//represents the current selected player in the rotation
let current_selected_player : string = "";

// represents the 6 colors that can draw for the rotation
let colors : string[]= ["red","orange","grey","maroon","blue","violet"];

// represents the number of colors already used for the rotation
let num_used_in_rotation : number = 0;

// the rotation that the user selects
let current_rotation_selected: string = "";

// all rotations that exist for scouting report
let all_existing_rotations : string[][] = [["8","24","12","92","36","88"],["1","2","3","4","5","6"],["99","88","77","66","55","44"]];

// all players on the team
let all_players : string[] = ["12","13","4","9","32","76","43","21","82","7","3","59","42","54","45","99","0"];

// selected player to add to a rotation
let add_rotation_player_selected : string= "";

// color that is used when only one player is selected for adding new rotation.
let success_color : string =  "#FFC300";

// color that is used when more than one player is selected for adding new rotation.
let too_many_color : string = "#C70039";

// INPUT: list of players that are part of the current rotation
// OUTPUT: N/A
//      - sets the current rotation to those 6 players and establishes their onClick function to buttonClickCurrentRotation
const currentRotationButtons = (players: string[]) => {
    let appended : HTMLDivElement= document.getElementById("currentRotation") as HTMLDivElement;
    appended.innerHTML = "";
    current_players_on_rotation = [];
    num_used_in_rotation = 0;
    for(let i : number = 0; i < 3; i++){
        let element : HTMLButtonElement = document.createElement("button");
        element.id = "player" + players[i].toString();
        element.type = "rotationButton";
        element.innerHTML=players[i];
        element.onclick = () => buttonClickCurrentRotation(players[i].toString());
        appended.append(element);
        current_players_on_rotation.push(players[i]);
    }
    let lineBreak : HTMLElement = document.createElement("br");
    lineBreak.innerHTML="</br>";
    appended.append(lineBreak);
    for(let i : number = 3; i < 6; i++){
        let element : HTMLButtonElement= document.createElement("button");
        element.id = "player" + players[i].toString();
        element.type = "rotationButton";
        element.innerHTML=players[i];
        element.onclick = () => buttonClickCurrentRotation(players[i].toString());
        appended.append(element); 
        current_players_on_rotation.push(players[i]);
    }
    
}
// INPUT: selected player number from roster of all existing players
// OUPTU: N/A
//      - changes the color of the corresponding button when adding a new rotation.
//      - sets add_rotation_player_selected to the currently selected player.
const selectPlayer = (selectedPlayerNum : string) => {
    let selectedPlayer : HTMLButtonElement = document.getElementById("player" + selectedPlayerNum) as HTMLButtonElement;
    selectedPlayer.style.background =  "red";
    add_rotation_player_selected = selectedPlayerNum;
    for (let i : number = 0; i<all_players.length; i++){
        let otherPlayer : HTMLButtonElement = document.getElementById("player" + all_players[i]) as HTMLButtonElement;
        if (otherPlayer != selectedPlayer && otherPlayer.style.background == "red") {
            otherPlayer.style.background = "";
        }
    }
}

// INPUT: N/A
// OUTPUT: N/A
//         - sets all spots in the player selection area when adding/editing rotation players to different color
//              if they are already selected.
const fillAddRotationWithCurrentlySelectedColors = () => {
    // --------------------
    // remove find which players and buttons are currently used
    let existingPlayers : string[] = [];
    let existingRotationButtons : string[] = [];
    for (let i : number = 0; i < 6; i++){
        let spot : HTMLButtonElement = document.getElementById("ele" + i.toString()) as HTMLButtonElement;
        if (spot.innerHTML != ""){
            existingPlayers.push(spot.innerHTML);
            existingRotationButtons.push(i.toString());
        }
    }
    // ------------------
    // clear coloring for all buttons
    for(let i : number = 0; i<all_players.length; i++){
        let player : HTMLButtonElement = document.getElementById("player" + all_players[i]) as HTMLButtonElement;
        player.style.background = "";
    }
    for (let i : number = 0; i<6; i++){
        let rotationButton : HTMLButtonElement = document.getElementById("ele" + i.toString()) as HTMLButtonElement;
        rotationButton.style.background = "";
    }
    // ------------------
    // color the used buttons appropriately 
    for (let i : number = 0; i<existingPlayers.length; i++){
        let count : number = 0;
        for (let k = 0; k<existingPlayers.length; k++){
            if(existingPlayers[i] == existingPlayers[k]){
                count += 1;
            }
        }
        let player : HTMLButtonElement = document.getElementById("player" + existingPlayers[i]) as HTMLButtonElement;
        let rotationButton : HTMLButtonElement = document.getElementById("ele" + existingRotationButtons[i]) as HTMLButtonElement;
        if (count > 1){
            // same player used more than once in the rotation
            player.style.background = too_many_color;
            rotationButton.style.background = too_many_color;
        } else if (count == 1){
            // player only used once
            player.style.background = success_color;
            rotationButton.style.background = success_color;
        } 
    }
}
// INTPUT: spot in add rotation selection area
// OUTPUT: N/A
//      - sets the number for spot in the rotation that is the player number that is selected
const selectSpotInRotation = (spotInRotation : string) => {
    let rotationSpot : HTMLButtonElement = document.getElementById("ele" + spotInRotation) as HTMLButtonElement;
    rotationSpot.innerHTML = add_rotation_player_selected;
    add_rotation_player_selected = "";
    // set selected players in the rotation to have different color, indicating that they are selected.
    fillAddRotationWithCurrentlySelectedColors();
   
}

const addNewRotation = () => {
    let count : number = 0;
    let rotation : string[] = [];
    for(let i : number = 0; i < 6; i++){
        let rotationItem : HTMLButtonElement = document.getElementById("ele" + i.toString()) as HTMLButtonElement;
        let itemWithSuccessColor : HTMLButtonElement = document.createElement("button");
        itemWithSuccessColor.style.background = success_color;
        if(rotationItem.style.background == itemWithSuccessColor.style.background){
            count += 1;
            rotation.push(rotationItem.innerHTML);
        }
    }

    
    if(count == 6){
        all_existing_rotations.push(rotation);
        allRotationButtons(all_existing_rotations);
        currentRotationButtons(all_existing_rotations[all_existing_rotations.length - 1]);
    } else {
        alert("Invalid rotation selected.");
    }
    
}

const cancelRotationEdit = () => {
    }
// INPUT: N/A
// OUTPUT: N/A
//      - creates space to add a new rotation.
const addNewRotationButtonSelected = ()=>{
    // -----------------
    // change button actions and text for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Add";
    editOrCancelButton.innerHTML = "Cancel";
    addButton.onclick = addNewRotation;
    editOrCancelButton.onclick = () => allRotationButtons(all_existing_rotations);
    // ----------------
    // change paragraph html element with id "SelectRotationText" 
    let rotationText : HTMLParagraphElement = document.getElementById("SelectRotationText") as HTMLParagraphElement;
    rotationText.innerHTML = "Select Players";
    // ----------------
    // change div element with id "allRotations" to have buttons for all possible players possible players
    let divElement : HTMLDivElement = document.getElementById("allRotations") as HTMLDivElement;
    divElement.innerHTML = "";
    let k : number = 0;
    while (k < all_players.length){
        for(let i : number = k; i < 4+k; i++){
        if (i < all_players.length){
            let element = document.createElement("button");
            // id is player[*player number*]
            element.id = "player" + all_players[i];
            element.type = "rotationButton";
            element.innerHTML=all_players[i];
            element.onclick = () => selectPlayer(all_players[i].toString());
            divElement.append(element);
        }}
        k = k+4;
        let lineBreak : HTMLBRElement = document.createElement("br");
        lineBreak.innerHTML="</br>";
        divElement.append(lineBreak);
    }
    // ----------------
    // change div element with id "rotationToAdd" to have buttons that represent the rotation that will be added
    let addDivRotation : HTMLDivElement = document.getElementById("rotationToAdd") as HTMLDivElement;
    let lineBreak : HTMLElement = document.createElement("br");
    lineBreak.innerHTML="</br>";
    addDivRotation.append(lineBreak);
    for(let i : number = 0; i < 3; i++){
        let element : HTMLButtonElement = document.createElement("button");
        element.id = "ele" + i.toString();
        element.type = "rotationButton";
        element.innerHTML="";
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element);
        
    }
    
    addDivRotation.append(lineBreak);
    for(let i : number = 3; i < 6; i++){
        let element : HTMLButtonElement= document.createElement("button");
        element.id = "ele" + i.toString();
        element.type = "rotationButton";
        element.innerHTML="";
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element); 
      
    }

} 

const editASelectedRotation = (current_rotation : string) => {

}

const selectRotation = (selectedRotation : number) => {
    currentRotationButtons(all_existing_rotations[selectedRotation])
    
}

// INPUT: all rotation numbers that were added
// OUTPUT: N/A
//      - sets div delement with id "allRotations" to have all the possible added rotations.
//      - also sets default button names for buttons with id "AddButton" and "EditOrCancelButton"
const allRotationButtons = (allRotations : string[][]) => {
    let allRotationNums : string[] = []
    for (let i : number = 1; i<allRotations.length + 1; i++){
        allRotationNums.push(i.toString());
    }
    // ----------------
    // set defaults for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Add Rotation";
    editOrCancelButton.innerHTML = "Edit Rotation";
    addButton.onclick = addNewRotationButtonSelected;
    editOrCancelButton.onclick = () => editASelectedRotation(current_rotation_selected);
    // -----------------
    // set default for paragraph html element with id "SelectRotationText" and default for div html element with id "rotationToAdd"
    let rotationText : HTMLParagraphElement = document.getElementById("SelectRotationText") as HTMLParagraphElement;
    rotationText.innerHTML = "Select Rotation";
    let rotationToAdd : HTMLDivElement = document.getElementById("rotationToAdd") as HTMLDivElement;
    rotationToAdd.innerHTML = "";
    // -----------------
    // set div element with id "allRotations" to have all possible added rotations.
    let appended : HTMLDivElement= document.getElementById("allRotations") as HTMLDivElement;
    appended.innerHTML = "";
    let k : number = 0;
    while (k < allRotationNums.length){
        for(let i : number = k; i < 3+k; i++){
            if (i < allRotationNums.length){
                let element = document.createElement("button");
                element.id = "rotation" + (i+1).toString();
                element.type = "rotationButton";
                element.innerHTML=allRotationNums[i];
                element.onclick = () => selectRotation(parseInt(allRotationNums[i])-1);
                appended.append(element);
                
            }
         }
        k = k+3;
        let lineBreak : HTMLElement = document.createElement("br");
        lineBreak.innerHTML="</br>";
        appended.append(lineBreak);
  }
}

// INPUT: the player number of the current selected player
// OUTPUT: N/A
//      - Sets the boarder around the player button. Also sets the background color of selected player if player does not have any
//          already added rotational movements.
const buttonClickCurrentRotation = (number : string) => {
   
    let button : HTMLButtonElement = document.getElementById("player"+ number) as HTMLButtonElement;
    current_selected_player = number;
    if (button.style.background == ""){
        button.style.background = colors[num_used_in_rotation];
    }
    
    button.style.border = "solid";
    button.style.borderColor = "blue";
    button.style.borderWidth = "5px";
    for(let i : number = 0; i<current_players_on_rotation.length;i++){
        if (current_players_on_rotation[i] != number){
            let non_selected_player : HTMLButtonElement = document.getElementById("player"+ current_players_on_rotation[i]) as HTMLButtonElement;
            if (num_used_in_rotation < 6) {
                if (non_selected_player.style.background == colors[num_used_in_rotation]){
                    non_selected_player.style.background = "";
                }
            }
           
            non_selected_player.style.border = "none";
            non_selected_player.style.borderColor = "blue";
            non_selected_player.style.borderWidth = "5px";
        }
    }

}

// INPUT: N/A
// OUTPUT: N/A
//      - adds the drawn route to routes and sets new color for future players.
const addRoute = () => {
    let current_button : HTMLButtonElement = document.getElementById("player"+current_selected_player) as HTMLButtonElement;
    // remove the button border
    current_button.style.border = "none";
    //add route to some list of routes for the rotation
    //
    // ------- TODO --------
    //
    // only move to next color if player has not had previous rotation drawn and color assigned.
    if (current_button.style.background == colors[num_used_in_rotation]){
        num_used_in_rotation += 1;
    }

}

// INPUT: list of all players.
// OUTPUT: N/A
//      - Sets div section with id "allRotations" to set of buttons for which to choose 6 players for the rotation.

function Rotations() {
  return (
    <div onLoad={() => {currentRotationButtons(all_existing_rotations[0]); allRotationButtons(all_existing_rotations);}} >
        <h1>Rotations</h1>
        <div className='left'>
            <img src={Square} ></img>
        </div>
        <div className='right' >
            <table >
                
                <tr className='spaceUnder'>
                    <th >
                        <button id="AddButton"></button><br/>
                        <button id="EditOrCancelButton"></button>
                    </th>
                    <th className='padding'>
                        <p id="SelectRotationText"></p>
                        <div id = "allRotations"></div>
                        <div id="rotationToAdd" className='padding-small'></div>
                    </th>
                </tr>
                <tr>
                    <th >
                        
                        <button onClick={addRoute}>Add Route</button><br/>
                        <button >Delete Route</button>
                    </th>
                    
                    <th >
                        <div id="currentRotation"></div>
                    </th>
                </tr>
            </table>
        </div>
    </div>
  )
}

export default Rotations