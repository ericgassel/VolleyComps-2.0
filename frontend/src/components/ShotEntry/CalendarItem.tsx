import React from 'react'
import './ShotEntry.css'
import {loadShotEntryContent} from './ShotEntry'

// are the existing date ids and datefor shot spreads for said team.
let existing_dates : string[][] = [["123123","11/25/2023"],["123123","02/20/2023"]]

// INPUT: N/A
// OUTPUT: N/A
//    - adds all existing dates to calendarSection HTML div element.
export const addDates = () => {
  console.log("adding dates!");
  let calendarSection : HTMLDivElement = document.getElementById("calendarSection") as HTMLDivElement;
  for(let i : number = 0; i < existing_dates.length; i++){
    let item : HTMLUListElement = document.createElement("ul");
    
    let newCalendarDate : HTMLDivElement = document.createElement("div");
    item.className = "calendarItem";
    newCalendarDate.innerHTML = existing_dates[i][1];
    newCalendarDate.className = "inLine";
    item.append(newCalendarDate);
    let calendarButton : HTMLButtonElement = document.createElement("button");
    calendarButton.innerHTML = "Select";
    calendarButton.type = "rotationButton";
   
    calendarButton.onclick = () =>{loadShotEntryContent(existing_dates[i][0])}
    item.append(calendarButton);
    calendarSection.append(item);
  }
}

export const hideCalendar = () => {
  let calendar : HTMLDivElement= document.getElementById('calendarSection') as HTMLDivElement;
  calendar.className="left-hide";
}


function CalendarItem() {
  return (
    <div >
      <div className='scrollable' id='calendarSection'>

      </div>
    </div>
  )
}

export default CalendarItem