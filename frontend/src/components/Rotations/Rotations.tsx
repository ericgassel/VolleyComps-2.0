import React from 'react'
import Square from './square.png'
import './Rotations.css';
import {createRotSvg,addRotationToSVG, deletePlayerRotation, newSelection, sendAndReset} from './RotationsSVG'
import { StringLiteral } from 'typescript';


declare global {
    var current_color: string;
    var current_selected_player : string;
    var able_to_add_rotation : boolean;
}

// interface representing a player object
export interface Player {
    player_num : number;
    player_id : string;
  } 

// interface representing a note object
export interface Notes {
    additional_notes : string;
    blocking_scheme : string;
    serve_primary : string;
    serve_secondary : string;
    serve_tertiary : string;
    transition_primary : string;
    transition_secondary : string;
    transition_tertiary : string;
}

// interface representing a rotation object
export interface Rotation{
    rotation_id : string;
    rotation_number : number;
    players_in_rotation : Player[];
    movement_colors : string[];
    notes : Notes;
    colors_available : string[];
    

}

export interface Point{
    x : number;
    y : number;
    color : string;
    player_id : string;
}


// represents the 6 players that are currently selected as part of the rotation
let current_players_on_rotation : Player[] = [];

//represents the current selected player in the rotation (by jersey number)
globalThis.current_selected_player = "";

// represents the current selected color in the rotation
globalThis.current_color = "";

// represents the 6 colors that can draw for the rotation
let colors : string[] = ["#5b535b","#ae3927","#923b9b","#009ec1","#009a6f","#f6b928"];

// represents the colors not used by rotation yet
let colors_available : string[] = ["#5b535b","#ae3927","#923b9b","#009ec1","#009a6f","#f6b928"];
//                                ["#5b535b","#ae3927","#923b9b","#009ec1","#009a6f","f6b928"]
// the rotation that the user selects --> is the index of rotation in all_existing_rotations.
let current_rotation_selected: number = 0;

// all rotations that exist for scouting report
let rotation1 : Rotation = {
    rotation_id : "abc",
    rotation_number : 1,
    players_in_rotation : [{player_num:8,player_id:"abc123"},{player_num:24,player_id:"abc123"},{player_num:12,player_id:"abc123"},{player_num:92,player_id:"abc123"},{player_num:36,player_id:"abc123"},{player_num:88,player_id:"abc123"}],
    movement_colors : ["","","","","",""],
    notes : {additional_notes : "string",
        blocking_scheme : "string",
        serve_primary : "string",
        serve_secondary : "string",
        serve_tertiary : "string",
        transition_primary : "string",
        transition_secondary : "string",
        transition_tertiary : "string",},
    colors_available : []
}

let rotation2 : Rotation = {
    rotation_id : "abc",
    rotation_number : 1,
    players_in_rotation : [{player_num:1,player_id:"abc123"},{player_num:2,player_id:"abc123"},{player_num:3,player_id:"abc123"},{player_num:4,player_id:"abc123"},{player_num:5,player_id:"abc123"},{player_num:6,player_id:"abc123"}],
    movement_colors : ["","","","","",""],
    notes : {additional_notes : "string",
        blocking_scheme : "string",
        serve_primary : "string",
        serve_secondary : "string",
        serve_tertiary : "string",
        transition_primary : "string",
        transition_secondary : "string",
        transition_tertiary : "string",},
    colors_available : []
}

let rotation3 : Rotation = {
    rotation_id : "abc",
    rotation_number : 1,
    players_in_rotation : [{player_num:11,player_id:"abc123"},{player_num:22,player_id:"abc123"},{player_num:33,player_id:"abc123"},{player_num:44,player_id:"abc123"},{player_num:55,player_id:"abc123"},{player_num:66,player_id:"abc123"}],
    movement_colors : ["","","","","",""],
    notes : {additional_notes : "string",
        blocking_scheme : "string",
        serve_primary : "string",
        serve_secondary : "string",
        serve_tertiary : "string",
        transition_primary : "string",
        transition_secondary : "string",
        transition_tertiary : "string",},
    colors_available : []
}

let all_existing_rotations : Rotation[] = [rotation1,rotation2,rotation3];

// all colors/movements assigned to given player in all_existing_rotations


// all players on the team
let all_players : Player[] = [{player_id:"test",player_num:5}];

// selected player to add to a rotation
let add_rotation_player_selected : string= "";

// color that is used when only one player is selected for adding new rotation.
let success_color : string =  "#009fa1";

// color that is used when more than one player is selected for adding new rotation.
let too_many_color : string = "#b33647";

// list of items for each rotation which stores serve/recieve text box info.
// each item of list is list of format: *Primary*, *Secondary*, *Tertiary*
let all_existing_serve_options : string[][] = [["","",""],["","",""],["","",""]]

// list of items for each rotation which stores Transition text box info.
// each item of list is list of format: *Primary*, *Secondary*, *Tertiary*
let all_existing_transition_options : string[][] = [["","",""],["","",""],["","",""]]

let all_existing_additional_notes : string[] = ["","",""]

let all_existing_blocking_schemes : string[] = ["", "" , ""]

// INPUT: list of players that are part of the current rotation
// OUTPUT: N/A
//      - sets the current rotation to those 6 players and establishes their onClick function to buttonClickCurrentRotation
const currentRotationButtonsLower = (rotation: Rotation) : void => {
    let appended : HTMLDivElement= document.getElementById("currentRotation") as HTMLDivElement;
    appended.innerHTML = "";
    current_players_on_rotation = [];
    colors_available = [];
    
    for (let i : number = 0; i < colors.length; i++) {
        // need to get rgb of colors[i]
        let rgbColors : any = hexToRgb(colors[i]);
        let rgbString : string = "rgb("+rgbColors.r+", "+rgbColors.g+", "+rgbColors.b+")";
        if (rotation.colors_available.indexOf(rgbString) == -1){
            colors_available.push(colors[i]);
        }
    }
   
    let players : Player[] = rotation.players_in_rotation; 
    for(let i : number = 0; i < 3; i++){
        let element : HTMLButtonElement = document.createElement("button");
      
        element.id = "player" + players[i].player_num.toString();
        element.type = "rotationButton";
        element.innerHTML=players[i].player_num.toString();
        element.style.background = rotation.colors_available[i]
        element.onclick = () => buttonClickCurrentRotation(players[i].player_num.toString());
        appended.append(element);
        current_players_on_rotation.push(players[i]);
    }
    let lineBreak : HTMLElement = document.createElement("br");
    lineBreak.innerHTML="</br>";
    appended.append(lineBreak);
    for(let i : number = 3; i < 6; i++){
        let element : HTMLButtonElement= document.createElement("button");
        element.id = "player" + players[i].player_num.toString();
        element.type = "rotationButton";
        element.innerHTML=players[i].player_num.toString();
        element.style.background = rotation.colors_available[i]
        element.onclick = () => buttonClickCurrentRotation(players[i].player_num.toString());
        appended.append(element); 
        current_players_on_rotation.push(players[i]);
    }
}

// INPUT: N/A
// OUTPUT: N/A
//      - sets all different note pieces on the page with corresponding saved info
const setNotes = () : void => {
    
    let primaryServerRecieve : HTMLInputElement = document.getElementById("primaryServerRecieve") as HTMLInputElement;
    let secondaryServerRecieve : HTMLInputElement = document.getElementById("secondaryServerRecieve") as HTMLInputElement;
    let tertiaryServerRecieve : HTMLInputElement = document.getElementById("tertiaryServerRecieve") as HTMLInputElement;
    
    primaryServerRecieve.value = all_existing_serve_options[current_rotation_selected][0];
    secondaryServerRecieve.value = all_existing_serve_options[current_rotation_selected][1];
    tertiaryServerRecieve.value = all_existing_serve_options[current_rotation_selected][2];
    
    let primaryTransition : HTMLInputElement = document.getElementById("primaryTransition") as HTMLInputElement;
    let secondaryTransition : HTMLInputElement = document.getElementById("secondaryTransition") as HTMLInputElement;
    let tertiaryTransition : HTMLInputElement = document.getElementById("tertiaryTransition") as HTMLInputElement;
    
    primaryTransition.value = all_existing_transition_options[current_rotation_selected][0];
    secondaryTransition.value = all_existing_transition_options[current_rotation_selected][1];
    tertiaryTransition.value = all_existing_transition_options[current_rotation_selected][2];
    
    let additionalNotes : HTMLTextAreaElement = document.getElementById("additionalNotes") as HTMLTextAreaElement;
    let blockingNotes : HTMLTextAreaElement = document.getElementById("blockingScheme") as HTMLTextAreaElement;
    additionalNotes.value = all_existing_additional_notes[current_rotation_selected];
    blockingNotes.value = all_existing_blocking_schemes[current_rotation_selected];

    let extraNotesHeader : HTMLHeadingElement = document.getElementById("rotationNotesText") as HTMLHeadingElement;
    extraNotesHeader.innerText = "Rotation " +  (current_rotation_selected + 1).toString() +  " Extra Info";
}

// INPUT: N/A
// OUTPUT: N/A
//      - saves all transition and serve notes for the selected rotation
const saveTransitionServeNotes = () : void => {
    let primaryServerRecieve : HTMLInputElement = document.getElementById("primaryServerRecieve") as HTMLInputElement;
    let secondaryServerRecieve : HTMLInputElement = document.getElementById("secondaryServerRecieve") as HTMLInputElement;
    let tertiaryServerRecieve : HTMLInputElement = document.getElementById("tertiaryServerRecieve") as HTMLInputElement;
    
    all_existing_serve_options[current_rotation_selected][0] = primaryServerRecieve.value;
    all_existing_serve_options[current_rotation_selected][1] = secondaryServerRecieve.value;
    all_existing_serve_options[current_rotation_selected][2] = tertiaryServerRecieve.value;

    let primaryTransition : HTMLInputElement = document.getElementById("primaryTransition") as HTMLInputElement;
    let secondaryTransition : HTMLInputElement = document.getElementById("secondaryTransition") as HTMLInputElement;
    let tertiaryTransition : HTMLInputElement = document.getElementById("tertiaryTransition") as HTMLInputElement;

    all_existing_transition_options[current_rotation_selected][0] = primaryTransition.value;
    all_existing_transition_options[current_rotation_selected][1] = secondaryTransition.value;
    all_existing_transition_options[current_rotation_selected][2] = tertiaryTransition.value;

}

// INTPUT: N/A
// OUTPUT: N/A
//      - saves all additional notes and blocking scheme notes for the selected rotation
const saveAddtionalAndBlockingNotes = () : void => {
    let additionalNotes : HTMLTextAreaElement = document.getElementById("additionalNotes") as HTMLTextAreaElement;
    let blockingNotes : HTMLTextAreaElement = document.getElementById("blockingScheme") as HTMLTextAreaElement;
    all_existing_additional_notes[current_rotation_selected] = additionalNotes.value;
    all_existing_blocking_schemes[current_rotation_selected] = blockingNotes.value;
}

// INPUT: selected player number from roster of all existing players
// OUPTU: N/A
//      - FOR WHEN ADDING OR EDITING ROTATION
//      - changes the color of the corresponding button when adding a new rotation.
//      - sets add_rotation_player_selected to the currently selected player.
const selectPlayer = (selectedPlayerNum : string) : void=> {
    let selectedPlayer : HTMLButtonElement = document.getElementById("player" + selectedPlayerNum) as HTMLButtonElement;
    selectedPlayer.style.background =  "#533178";
    add_rotation_player_selected = selectedPlayerNum;
    for (let i : number = 0; i<all_players.length; i++){
        let otherPlayer : HTMLButtonElement = document.getElementById("player" + all_players[i]) as HTMLButtonElement;
        let rgbColors : any = hexToRgb("#533178");
        let rgbString : string = "rgb("+rgbColors.r+", "+rgbColors.g+", "+rgbColors.b+")";
        if (otherPlayer != selectedPlayer && otherPlayer.style.background == rgbString) {
            otherPlayer.style.background = "";
        }
    }
}

// INPUT: N/A
// OUTPUT: N/A
//         - USED WHEN ADDING OR EDITING ROTATION
//         - sets all spots in the player selection area when adding/editing rotation players to different color
//              if they are already selected.
const fillAddRotationWithCurrentlySelectedColors = () : void => {
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
//      - USED FOR EDITING AND ADDING ROTATION
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
        let newRotation : Rotation = {
            rotation_id : "abc",
            rotation_number : 1,
            players_in_rotation : [{player_num:11,player_id:"abc123"},{player_num:22,player_id:"abc123"},{player_num:33,player_id:"abc123"},{player_num:44,player_id:"abc123"},{player_num:55,player_id:"abc123"},{player_num:66,player_id:"abc123"}],
            movement_colors : ["","","","","",""],
            notes : {additional_notes : "",
                blocking_scheme : "",
                serve_primary : "",
                serve_secondary : "",
                serve_tertiary : "",
                transition_primary : "",
                transition_secondary : "",
                transition_tertiary : "",},
            colors_available : []
        }
        all_existing_rotations.push(newRotation);

        current_rotation_selected = all_existing_rotations.length - 1;
        allRotationButtonsUpper(all_existing_rotations);
        currentRotationButtonsLower(all_existing_rotations[all_existing_rotations.length - 1]);
        // -----------------
        // set default for display of lower table
        let table : HTMLTableElement = document.getElementById("rotationTable") as HTMLTableElement;
        table.style.display = "";
        // -----------------
        // set default for display of left html elements
        let htmlItems : HTMLTableElement = document.getElementById("leftSide") as HTMLTableElement;
        htmlItems.style.display = "";
        // -----------------
        // set default for display of switch buttons
        let htmlSwitchButtons : HTMLDivElement = document.getElementById("htmlSwitchButtons") as HTMLDivElement;
        htmlSwitchButtons.style.display="";
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
    // set lower table to not display
    let table : HTMLTableElement = document.getElementById("rotationTable") as HTMLTableElement;
    table.style.display = "none";
    // ----------------
    // change left element to not display
    let leftElement : HTMLDivElement = document.getElementById("leftSide") as HTMLDivElement;
    leftElement.style.display = "none";
    // -----------------
    // set switch buttons to not display
    let htmlSwitchButtons : HTMLDivElement = document.getElementById("htmlSwitchButtons") as HTMLDivElement;
    htmlSwitchButtons.style.display="none";
    // -----------------
    // change button actions and text for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Add";
    addButton.className="changeButton";
    editOrCancelButton.className="changeButton";
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
            element.innerHTML=all_players[i].player_num.toString();
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

// INPUT: player number
// OUTPUT: player associated with that player number
const getPlayerWithNumber = (playerNum : string) : Player | null => {
    for(let i : number = 0; i<all_players.length;i++){
        if(all_players[i].player_num == parseInt(playerNum)){
            return all_players[i];
        }
    }
    return null;
}

// INPUT: N/A
// OUTPUT: a blank set of notes
const blankNotes = () : Notes => {
    return {
        additional_notes : "",
        blocking_scheme : "",
        serve_primary : "",
        serve_secondary : "",
        serve_tertiary : "",
        transition_primary : "",
        transition_secondary : "",
        transition_tertiary : "",
    }
}

// INTPUT: N/A
// OUTPUT: N/A
//       - changes HTML for confirm of edit
//       - changes rotation to reflect edited rotation
const editRotationConfirm = () => {
    let count : number = 0;

    // ------- TODO --------
    // call API to create rotation
    let id : string = 'abcdefg'
    // -------------------
    

    let rotationPlayers : Player[] = []

    for(let i : number = 0; i < 6; i++){
        let rotationItem : HTMLButtonElement = document.getElementById("ele" + i.toString()) as HTMLButtonElement;
        let itemWithSuccessColor : HTMLButtonElement = document.createElement("button");
        itemWithSuccessColor.style.background = success_color;
        if(rotationItem.style.background == itemWithSuccessColor.style.background){
            count += 1;
            // get player associated with rotationItem.innerHTML which is player number.
            let player : Player | null = getPlayerWithNumber(rotationItem.innerHTML);
            if(player != null) {
                rotationPlayers.push(player);
            }
            
        }
    }
    
    let rotation : Rotation = {
        rotation_id : id,
        rotation_number : current_rotation_selected+1,
        players_in_rotation : rotationPlayers,
        movement_colors : ["","","","","",""],
        notes : blankNotes(),
        colors_available : colors
    }


    if(count == 6){
        all_existing_rotations[current_rotation_selected] = rotation;
        allRotationButtonsUpper(all_existing_rotations);
        currentRotationButtonsLower(all_existing_rotations[current_rotation_selected]);
        // ----------------
        // change lower HTML to display
        let table : HTMLTableElement = document.getElementById("rotationTable") as HTMLTableElement;
        table.style.display = "";
        // ----------------
        // change left HTML to display
        let leftHTML : HTMLTableElement = document.getElementById("leftSide") as HTMLTableElement;
        leftHTML.style.display = "";
        // -----------------
        // set default for display of switch buttons
        let htmlSwitchButtons : HTMLDivElement = document.getElementById("htmlSwitchButtons") as HTMLDivElement;
        htmlSwitchButtons.style.display="";
        // set defaults
        globalThis.able_to_add_rotation = false;
        createRotSvg();


    } else {
        alert("Invalid rotation selected.");
    }
    
}

// INPUT: index of where rotation is in all_existing_rotations
// OUTPUT: N/A
//      - generates HTML to edit rotation
//      - changes buttons to reflect actions appropriate for editing rotation 
const editASelectedRotation = (current_rotation : number) => {
    let rotation : Rotation = all_existing_rotations[current_rotation];
    // -----------------
    // change button actions and text for buttons with ids "AddButton" and "EditOrCancelButton"
    let addButton : HTMLButtonElement = document.getElementById("AddButton") as HTMLButtonElement;
    let editOrCancelButton : HTMLButtonElement = document.getElementById("EditOrCancelButton") as HTMLButtonElement;
    addButton.innerHTML = "Done";
    editOrCancelButton.innerHTML = "Cancel";
    addButton.onclick = editRotationConfirm;
    editOrCancelButton.onclick = () => allRotationButtonsUpper(all_existing_rotations);
    // ----------------
    // change lower HTML to not display
    let table : HTMLTableElement = document.getElementById("rotationTable") as HTMLTableElement;
    table.style.display = "none";
    // ----------------
    // change left element to not display
    let leftElement : HTMLDivElement = document.getElementById("leftSide") as HTMLDivElement;
    leftElement.style.display = "none";
    // -----------------
    // change switch buttons to not display
    let htmlSwitchButtons : HTMLDivElement = document.getElementById("htmlSwitchButtons") as HTMLDivElement;
    htmlSwitchButtons.style.display="none";
    // ----------------
    // change paragraph html element with id "SelectRotationText" 
    let rotationText : HTMLParagraphElement = document.getElementById("SelectRotationText") as HTMLParagraphElement;
    rotationText.innerHTML = "Editing Rotation " + (current_rotation_selected + 1).toString();
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
            element.innerHTML=all_players[i].player_num.toString();
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
    let playerOnRotation = rotation.players_in_rotation;
    for(let i : number = 0; i < 3; i++){
        let element : HTMLButtonElement = document.createElement("button");
        element.id = "ele" + i.toString();
        element.type = "rotationButton";
        element.innerHTML=playerOnRotation[i].player_num.toString();
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element);
        
    }
    
    addDivRotation.append(lineBreak);
    for(let i : number = 3; i < 6; i++){
        let element : HTMLButtonElement= document.createElement("button");
        element.id = "ele" + i.toString();
        element.type = "rotationButton";
        element.innerHTML=playerOnRotation[i].player_num.toString();
        element.onclick = () => selectSpotInRotation(i.toString());
        addDivRotation.append(element); 
      
    }
    fillAddRotationWithCurrentlySelectedColors();
}

// INPUT: index of where rotation is in all_existing_rotations
// OUTPUT: N/A
//      - sets the current rotation buttons to represent the existing rotation
//      - sets notes for current rotation
const selectRotation = (selectedRotation : number) => {
    globalThis.current_selected_player = "";
    globalThis.current_color = "";
    // send data for 
    sendAndReset(current_rotation_selected);
    // --------------------
    // clear button formatting
    for (let i : number = 0; i < all_existing_rotations.length; i++){
        let button : HTMLButtonElement = document.getElementById("rotation" + i.toString()) as HTMLButtonElement;
        button.style.background = "";
    }
    // --------------------
    // set selected button to have red background
    let rotationButton : HTMLButtonElement = document.getElementById("rotation" + selectedRotation.toString()) as HTMLButtonElement;
    rotationButton.style.background = "#51558b";
    // --------------------
    // change current_rotation_selected and update HTML
    current_rotation_selected = selectedRotation;
    currentRotationButtonsLower(all_existing_rotations[selectedRotation])
    // --------------------
    // change the rotation notes text
    setNotes();
    
}

// INPUT: all rotation numbers that were added
// OUTPUT: N/A
//      - sets div delement with id "allRotations" to have all the possible added rotations.
//      - also sets default button names for buttons with id "AddButton" and "EditOrCancelButton"
//      - also displays all main html page elements
const allRotationButtonsUpper = (allRotations : Rotation[]) => {
    
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
    addButton.className="changeButton";
    addButton.onclick = addNewRotationButtonSelected;
    editOrCancelButton.onclick = () => editASelectedRotation(current_rotation_selected);
    editOrCancelButton.className="changeButton";
    // -----------------
    // change switch buttons to default
    let htmlSwitchButtons : HTMLDivElement = document.getElementById("htmlSwitchButtons") as HTMLDivElement;
    htmlSwitchButtons.style.display="";
    // -----------------
    // set default for paragraph html element with id "SelectRotationText" and default for div html element with id "rotationToAdd"
    let rotationText : HTMLParagraphElement = document.getElementById("SelectRotationText") as HTMLParagraphElement;
    rotationText.innerHTML = "Select Rotation";
    let rotationToAdd : HTMLDivElement = document.getElementById("rotationToAdd") as HTMLDivElement;
    rotationToAdd.innerHTML = "";
    // -----------------
    // set default for display of lower table
    let table : HTMLTableElement = document.getElementById("rotationTable") as HTMLTableElement;
    table.style.display = "";
    // -----------------
    // set default for display of lower table
    let leftHTML : HTMLTableElement = document.getElementById("leftSide") as HTMLTableElement;
    leftHTML.style.display = "";
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
    
    // delete temporary data on SVG
    newSelection();
    globalThis.able_to_add_rotation = true;
    disableButton("addRouteButton");
    let button : HTMLButtonElement = document.getElementById("player"+ number) as HTMLButtonElement;
    
    globalThis.current_selected_player = number;

    if (button.style.background == ""){
        // new player selected with no existing rotation added
        
        button.style.background = colors_available[0];
        globalThis.current_color = colors_available[0];
        disableButton("deleteRouteButton");
    }
    else
    {
        // player with existing rotation selected
        globalThis.current_color = button.style.background;
        enableButton("deleteRouteButton");
    }
    
    
    button.style.border = "solid";
    button.style.borderColor = "#454977";
    button.style.borderWidth = "5px";
    
    let rotation : Rotation = all_existing_rotations[current_rotation_selected];
    // resent colors for other players
    for(let i : number = 0; i<rotation.players_in_rotation.length;i++){
        if (rotation.players_in_rotation[i].player_num.toString() != number){
            let non_selected_player : HTMLButtonElement = document.getElementById("player"+ rotation.players_in_rotation[i].player_num.toString()) as HTMLButtonElement;
            if (colors_available.length > 0) {
                let rgbColors : any = hexToRgb(colors_available[0]);
                let rgbString : string = "rgb("+rgbColors.r+", "+rgbColors.g+", "+rgbColors.b+")";
                if (non_selected_player.style.background == rgbString){
                    non_selected_player.style.background = "";
                }
            }
           
            non_selected_player.style.border = "none";
            non_selected_player.style.borderColor = "#454977";
            non_selected_player.style.borderWidth = "5px";
        }
    }
    

}

// INPUT: N/A
// OUTPUT: N/A
//      - adds the drawn route to routes and sets new color for future players.
const addRoute = () => {
    if (globalThis.current_selected_player != "") {
        let current_button : HTMLButtonElement = document.getElementById("player"+globalThis.current_selected_player) as HTMLButtonElement;
        // move the temp drawn info on SVG to rotation storage
        // include the notes in this call
        addRotationToSVG(all_existing_rotations[current_rotation_selected]);
        
        // ------------------
        // find index in rotation that is the spot of the player
        let rotation : Rotation = all_existing_rotations[current_rotation_selected];
        let index : number = 0;
        let stop : boolean = false;
        let rotationPlayers : Player[]= rotation.players_in_rotation;
        for(let i : number = 0; i < rotationPlayers.length; i++){
            if(rotationPlayers[i].player_num.toString() == globalThis.current_selected_player){
                stop = true;
            }
            if (!stop){
                index += 1;
            }
        }
        
        rotation.colors_available[index] = current_button.style.backgroundColor;
       
        
        let rgbColors : any = hexToRgb(colors_available[0]);
        let rgbString : string = "rgb("+rgbColors.r+", "+rgbColors.g+", "+rgbColors.b+")";
        
        if (current_button.style.background == rgbString){
            colors_available.shift();
        } 
        // remove current_selected_player
        globalThis.current_selected_player = "";
        // remove the button border
        current_button.style.border = "none";
        // remove the current color
        globalThis.current_color="";
        // disable addRotation button
        disableButton("addRouteButton");
        // set ability to addRoute to false until select new player
        globalThis.able_to_add_rotation = false;
    } else {
        alert("Please select a player.");
    }
    



}

function hexToRgb(hex:string) {
    // from: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

// INTPUT: N/A
// OUTPUT: N/A
//      - deletes the drawn route from routes
const deleteRoute = () => {
    if (globalThis.current_selected_player != "") {
        let current_button : HTMLButtonElement = document.getElementById("player"+globalThis.current_selected_player) as HTMLButtonElement;
        
        
        // ------------------
        // find index in rotation that is the spot of the player
        let rotation : Rotation = all_existing_rotations[current_rotation_selected];
        let index : number = 0;
        let stop : boolean = false;
        let rotationPlayers : Player[] = rotation.players_in_rotation;
        for(let i : number = 0; i < rotationPlayers.length; i++){
            if(rotationPlayers[i].player_num.toString() == globalThis.current_selected_player){
                stop = true;
            }
            if (!stop){
                index += 1;
            }
        }
        rotation.colors_available[index] = "";
        
        // I think this adds back too many availible colors...
       
        colors_available = [];
        for (let i : number = 0; i < colors.length; i++) {
            
            
            let rgbColors : any = hexToRgb(colors[i]);
            let rgbString : string = "rgb("+rgbColors.r+", "+rgbColors.g+", "+rgbColors.b+")";
            

            if (rotation.colors_available.indexOf(rgbString) == -1){
                colors_available.push(colors[i]);
            }
        }
        
    
        // gets rid of player info on SVG
       
        deletePlayerRotation(parseInt(globalThis.current_selected_player));
        current_button.style.background = "";
        current_button.style.border = "none";
        globalThis.current_color="";
        globalThis.current_selected_player ="";

        // disable add rotation button and delete rotation button
        disableButton("addRouteButton");
        disableButton("deleteRouteButton");
        // set ability to addRoute to false until select new player
        globalThis.able_to_add_rotation = false;



    } else {
        alert("Please select a player.");
    }
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


// adds the appropriate items to the page if Rotations is loaded
window.addEventListener("load", (event) => {
    if (window.location.href.includes("Rotations")){
        currentRotationButtonsLower(all_existing_rotations[0]); 
        allRotationButtonsUpper(all_existing_rotations);
       // selectRotation(0);
        createRotSvg();
        disableButton("addRouteButton");
        disableButton("deleteRouteButton");
    }
    
   });


// INPUT: N/A
// OUTPUT: returns the string of URL to get to Shot Entry page
const getShotEntryURL = () : string => {
    let url : string = window.location.href;
    let id : string = url.substring(url.lastIndexOf("/") + 1);
    return "/ShotEntry/" + id;
}

// INPUT: N/A
// OUTPUT: returns string of URL to get to scouting report
const getScountingReportURL = () : string => {
    let url : string = window.location.href;
    let id : string = url.substring(url.lastIndexOf("/") + 1);
    return "/report/" + id + "/playerStatsTab";
  }


// HTML backbone
function Rotations() {
  return (
    <div>
        <h1>Rotations</h1>
        <div className='left' id="leftSide">
            <div id='chart' className='left'></div>

            <h2 id="rotationNotesText">Rotation {current_rotation_selected + 1} Extra Info</h2>

            <br/>
            <div>
                
            <div className='inLine left'>
                    Additional Notes:
                    
                    <textarea className='notesField' id="additionalNotes"></textarea>
            </div>
            <div>
                    Blocking Scheme:
                    
                    <textarea className = 'notesField' id="blockingScheme"></textarea>
            </div>
            <br/><br/>
            <button className='saveButton' onClick={saveAddtionalAndBlockingNotes}>Save</button>
            </div>
        </div>
        <div className='right' >
            <table className='rotationTable'>
                <tbody>
                <tr className='spaceUnder rotationTable'>
                    <th className='rotationTable'>
                        <button id="AddButton"></button><br/>
                        <button id="EditOrCancelButton"></button>
                    </th>
                    <th className='padding rotationTable'>
                        <p id="SelectRotationText"></p>
                        <div id = "allRotations"></div>
                        <div id="rotationToAdd" className='padding-small'></div>
                    </th>
                </tr>
                <tr id="rotationTable" className='spaceUnder'>
                    <th className='rotationTable'>
                        <button className= "changeButton" id="addRouteButton" onClick={addRoute}>Add Route</button><br/>
                        <button className = "changeButton" id="deleteRouteButton" onClick={deleteRoute}>Delete Route</button>
                        
                    </th>
                    
                    <th className='rotationTable'>
                        <div id="currentRotation"></div>
                        <br/>
                        <div className='serveTransitionInputs'>
                        <h3>Serve Recieve</h3>
                        <table className='inputFieldTable'>
                            <tbody className='inputFieldTable'>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                    Primary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="primaryServerRecieve" className='textInput'></input>
                                    </th>
                                </tr>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                        Secondary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="secondaryServerRecieve" className='textInput'></input>
                                    </th>

                                </tr>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                        Tertiary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="tertiaryServerRecieve" className='textInput'></input>
                                    </th>
                                </tr>
                        
                       
                            </tbody>
                        </table>
                        <br/>
                        <h3>Transition</h3>
                        <table className='inputFieldTable'>
                            <tbody className='inputFieldTable'>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                    Primary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="primaryTransition" className='textInput'></input>
                                    </th>
                                </tr>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                    Secondary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="secondaryTransition" className='textInput'></input>
                                    </th>
                                </tr>
                                <tr className='inputFieldTable'>
                                    <th className='inputFieldTable inputLabel'>
                                        Tertiary:
                                    </th>
                                    <th className='inputFieldTable'>
                                    <input type='text' id="tertiaryTransition" className='textInput'></input>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
    
                        </div>
                        <button className='saveButton' onClick={saveTransitionServeNotes}>Save</button>


                    </th>
                </tr>
                
                <tr id="notesSection">
                    

                </tr>
                </tbody>
                
            </table>
            <div id='htmlSwitchButtons'>
            <a href={getScountingReportURL()}>
            <button id='switchShotEntry'>Scouting Report</button>
            </a>
            <a href={getShotEntryURL()}>
            <button id='switchShotEntry'>Switch to ShotEntry</button>
            </a>
            </div>
            
            
        </div>
    </div>
  )
}

export default Rotations