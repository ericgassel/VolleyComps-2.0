import React from 'react'
import Square from './square.png'
import './Rotations.css';

// represents the 6 players that are currently selected as part of the rotation
let current_players_on_rotation : string[] = [];

//represents the current selected player in the rotation (by jersey number)
let current_selected_player : string = "";

// represents the 6 colors that can draw for the rotation
let colors : string[]= ["red","orange","grey","maroon","blue","violet"];

// represents the colors not used by rotation yet
let colors_available : string[] = ["blue","blue","blue","blue","blue","blue"];

// the rotation that the user selects
let current_rotation_selected: number = 0;

// all rotations that exist for scouting report
let all_existing_rotations : string[][] = [["8","24","12","92","36","88"],["1","2","3","4","5","6"],["99","88","77","66","55","44"]];

// all colors/movements assigned to given player in all_existing_rotations
let all_existing_rotation_movements : string[][] = [["","","","","",""],["","","","","",""],["","","","","",""]];

// all players on the team
let all_players : string[] = ["44","24","12","66","36","88","1","2","3","4","5","99","6","77","92","8","55"];

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
    colors_available = [];
    for (let i : number = 0; i < colors.length; i++) {
        if (all_existing_rotation_movements[current_rotation_selected].indexOf(colors[i]) == -1){
            colors_available.push(colors[i]);
        }
    }
    for(let i : number = 0; i < 3; i++){
        let element : HTMLButtonElement = document.createElement("button");
        element.id = "player" + players[i].toString();
        element.type = "rotationButton";
        element.innerHTML=players[i];
        element.style.background = all_existing_rotation_movements[current_rotation_selected][i]
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
        element.style.background = all_existing_rotation_movements[current_rotation_selected][i]
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

// INPUT: N/A
// OUTPUT: N/A
//      - adds new rotation to the list of rotations if a valid rotation is selected.
//      - used after pressing buttons "Add Rotation" -> "Add"
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
        allRotationButtonsUpper(all_existing_rotations);
        currentRotationButtons(all_existing_rotations[all_existing_rotations.length - 1]);
    } else {
        alert("Invalid rotation selected.");
    }
    
}

// INPUT: N/A
// OUTPUT: N/A
//      - generates HTML to add a new rotation.
//      - changes buttons to reflect actions appropriate for adding rotation
const addNewRotationButtonSelected = ()=>{
    // -----------------
    // change button actions and text for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Add";
    editOrCancelButton.innerHTML = "Cancel";
    addButton.onclick = addNewRotation;
    editOrCancelButton.onclick = () => allRotationButtonsUpper(all_existing_rotations);
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

const editRotationConfirm = () => {
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
        all_existing_rotations[current_rotation_selected] = rotation;
        allRotationButtonsUpper(all_existing_rotations);
        currentRotationButtons(all_existing_rotations[current_rotation_selected]);
    } else {
        alert("Invalid rotation selected.");
    }
    
}

// INPUT: index of where rotation is in all_existing_rotations
// OUTPUT: N/A
//      - generates HTML to edit rotation
//      - changes buttons to reflect actions appropriate for editing rotation 
const editASelectedRotation = (current_rotation : number) => {
    let rotation : string[] = all_existing_rotations[current_rotation];
    // -----------------
    // change button actions and text for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Done";
    editOrCancelButton.innerHTML = "Cancel";
    addButton.onclick = editRotationConfirm;
    editOrCancelButton.onclick = () => allRotationButtonsUpper(all_existing_rotations);
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
        element.innerHTML=rotation[i].toString();
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element);
        
    }
    
    addDivRotation.append(lineBreak);
    for(let i : number = 3; i < 6; i++){
        let element : HTMLButtonElement= document.createElement("button");
        element.id = "ele" + i.toString();
        element.type = "rotationButton";
        element.innerHTML=rotation[i].toString();
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element); 
      
    }
    fillAddRotationWithCurrentlySelectedColors();
}

// INPUT: index of where rotation is in all_existing_rotations
// OUTPUT: N/A
//      - sets the current rotation buttons to represent the existing rotation
const selectRotation = (selectedRotation : number) => {
    current_selected_player = "";
    // --------------------
    // clear button formatting
    for (let i : number = 0; i < all_existing_rotations.length; i++){
        let button : HTMLButtonElement = document.getElementById("rotation" + i.toString()) as HTMLButtonElement;
        button.style.background = "";
    }
    // --------------------
    // set selected button to have red background
    let rotationButton : HTMLButtonElement = document.getElementById("rotation" + selectedRotation.toString()) as HTMLButtonElement;
    rotationButton.style.background = "red";
    // --------------------
    // change current_rotation_selected and update HTML
    current_rotation_selected = selectedRotation;
    currentRotationButtons(all_existing_rotations[selectedRotation])
    
}

// INPUT: all rotation numbers that were added
// OUTPUT: N/A
//      - sets div delement with id "allRotations" to have all the possible added rotations.
//      - also sets default button names for buttons with id "AddButton" and "EditOrCancelButton"
const allRotationButtonsUpper = (allRotations : string[][]) => {
    
    let allRotationNums : number[] = []
    for (let i : number = 0; i<allRotations.length; i++){
        allRotationNums.push(i);
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
                element.id = "rotation" + i.toString();
                element.type = "rotationButton";
                element.innerHTML=(allRotationNums[i] + 1).toString();
                // allRotationNums[i] is a number 1 to X where X is the number of rotations that exist
                element.onclick = () => selectRotation(allRotationNums[i]);
                appended.append(element);
                
            }
         }
        k = k+3;
        let lineBreak : HTMLElement = document.createElement("br");
        lineBreak.innerHTML="</br>";
        appended.append(lineBreak);
  }
  selectRotation(current_rotation_selected);
}

// INPUT: the player number of the current selected player
// OUTPUT: N/A
//      - Sets the boarder around the player button. Also sets the background color of selected player if player does not have any
//          already added rotational movements.
const buttonClickCurrentRotation = (number : string) => {
   
    let button : HTMLButtonElement = document.getElementById("player"+ number) as HTMLButtonElement;
    current_selected_player = number;
    if (button.style.background == ""){
        button.style.background = colors_available[0];
    }
    
    button.style.border = "solid";
    button.style.borderColor = "blue";
    button.style.borderWidth = "5px";
    for(let i : number = 0; i<current_players_on_rotation.length;i++){
        if (current_players_on_rotation[i] != number){
            let non_selected_player : HTMLButtonElement = document.getElementById("player"+ current_players_on_rotation[i]) as HTMLButtonElement;
            if (colors_available.length > 0) {
                if (non_selected_player.style.background == colors_available[0]){
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
    if (current_selected_player != "") {
        let current_button : HTMLButtonElement = document.getElementById("player"+current_selected_player) as HTMLButtonElement;
        
        // remove the button border
        current_button.style.border = "none";
        // ------------------
        // find index in rotation that is the spot of the player
        let rotation : string[] = all_existing_rotations[current_rotation_selected];
        let index : number = 0;
        let stop : boolean = false;
        for(let i : number = 0; i < rotation.length; i++){
            if(rotation[i] == current_selected_player){
                stop = true;
            }
            if (!stop){
                index += 1;
            }
        }
        all_existing_rotation_movements[current_rotation_selected][index] = current_button.style.backgroundColor;
        //add route to some list of routes for the rotation
        //
        // ------- TODO --------
        //
        // only move to next color if player has not had previous rotation drawn and color assigned.
        if (current_button.style.background == colors_available[0]){
            colors_available.shift();
        } 
    } else {
        alert("Please select a player.");
    }
    



}
// INTPUT: N/A
// OUTPUT: N/A
//      - deletes the drawn route from routes
const deleteRoute = () => {
    if (current_selected_player != "") {
        let current_button : HTMLButtonElement = document.getElementById("player"+current_selected_player) as HTMLButtonElement;
        current_button.style.background = "";
        // ------------------
        // find index in rotation that is the spot of the player
        let rotation : string[] = all_existing_rotations[current_rotation_selected];
        let index : number = 0;
        let stop : boolean = false;
        for(let i : number = 0; i < rotation.length; i++){
            if(rotation[i] == current_selected_player){
                stop = true;
            }
            if (!stop){
                index += 1;
            }
        }
        all_existing_rotation_movements[current_rotation_selected][index] = "";
        colors_available = [];
        for (let i : number = 0; i < colors.length; i++) {
            if (all_existing_rotation_movements[current_rotation_selected].indexOf(colors[i]) == -1){
                colors_available.push(colors[i]);
            }
        }

    } else {
        alert("Please select a player.");
    }
}
// HTML backbone
function Rotations() {
  return (
    <div onLoad={() => {currentRotationButtons(all_existing_rotations[0]); allRotationButtonsUpper(all_existing_rotations);}} >
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
                        <button onClick={deleteRoute}>Delete Route</button>
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