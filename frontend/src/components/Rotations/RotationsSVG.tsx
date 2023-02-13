import React from 'react';

import * as d3 from 'd3';

import { getSystemErrorMap } from 'util';
import Rotations, { Player, Point, Rotation, disableButton, enableButton, sendEditRotation, sendNewRotation } from './Rotations';

let point_tracking = false;

// the current dateID for the page
let current_date_ID : string = "";

let x_scale = d3.scaleLinear()
        .domain([0, 100])
        .range([200, 700]);

let y_scale = d3.scaleLinear()
    .domain([0, 100])
    .range([50, 650]);

let x_scale_click = d3.scaleLinear()
    .domain([700, 200])
    .range([100, 0]);

let y_scale_click = d3.scaleLinear()
    .domain([650, 0])
    .range([100, 0]);

let new_rotation : any = [];
//let rotation : Array<Array<Array<number>>> = [];

let rotation : Point[] = [];

export const createRotSvg = (rotationInput : Rotation) => {
    
    rotation = rotationInput.points; 
    let checkboxes : string = "";
    let chartItem : HTMLDivElement =  document.getElementById("chart") as HTMLDivElement;
    chartItem.innerHTML = "";
    const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 900)
    .attr("height", 600)
    .append("g");

    svg.append("rect")
        .attr("id", "court")
        .attr("x", x_scale(0))
        .attr("y", y_scale(0))
        .attr("width", 500)
        .attr("height", 500)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    for (let j =0; j < rotation.length;j++)
    {
        
            
            svg.append("rect")
            .attr("id", "court")
            .attr("x", rotation[j].x)
            .attr("y", rotation[j].y)
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", rotation[j].color)
            .attr("stroke", rotation[j].color)
            .attr("stroke-width", 2);
        
    }


/*
    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .curve(d3.curveBasis) // Just add that to have a curve instead of segments
      .x(function(d) { return d.x })
      .y(function(d) { return d.y })
      )
*/
    
    svg.on("pointerdown", function() {
        new_rotation = [];
        point_tracking = true;
    })
    svg.on("pointermove", function() {
        if (globalThis.current_color != "")
            {
            if (point_tracking) {
                let vals = d3.pointer(event, svg.node());
                console.log(vals)
                let to_add : {x: number, y:number, color:string, player_number:string} = {x:0, y:0, color:"", player_number:""}
                if(typeof globalThis.current_color !== "undefined")
                {
                to_add["x"] = vals[0]
                to_add["y"] = vals[1]
                to_add["color"] = globalThis.current_color
                to_add["player_number"] = globalThis.current_selected_player!.player_num.toString()
                }
                new_rotation.push(to_add);

                svg.append("rect")
                    .attr("id", "court")
                    .attr("x", vals[0])
                    .attr("y", vals[1])
                    .attr("width", 4)
                    .attr("height", 4)
                    .attr("fill", globalThis.current_color)
                    .attr("stroke", globalThis.current_color)
                    .attr("stroke-width", 2);
            }
        }
    })
    svg.on("pointerup", function() {
        point_tracking = false;
        if(globalThis.able_to_add_rotation == true){
            enableButton("addRouteButton");
        }
        globalThis.able_to_add_rotation = true;
        //addRotationToSVG(8);
    })
}

// called when route is added to SVG
export const addRotationToSVG = (rotationObject: Rotation) => {
    for(let i : number = 0; i<new_rotation.length; i++){
        rotationObject.points.push(new_rotation[i]);
    }
    
    sendEditRotation(rotationObject);
    // -------------
    // recreate SVG
    createRotSvg(rotationObject);
    
}

// to be called to delete all temporary data
export const newSelection = (rotationInput : Rotation) => {
    // this will delete the temporary data (anything not added)
    new_rotation = []
    createRotSvg(rotationInput);
}

// to be called to delete from rotation data
export const deletePlayerRotation = (rotationObject : Rotation, colorSelected: string) => {
    // removes player info from svg
    
    rotation = rotation.filter(function(d) {return d.color.toString() !== colorSelected })
    rotationObject.points = rotation;
    sendEditRotation(rotationObject);
    createRotSvg(rotationObject);
}

// this function will send all data to the API and reset the svg
export async function sendAndReset(rotationNumber : number) {
    // gets all roster info
   // http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster

   //http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?col=number
   // gets all player numbers
   try {
    let response = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?col=number', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    
    //then() function is used to convert the posted contents to the website into json format
    .then(result => result.json())
   } catch (error) {
    
   }
    
    
    
   


}

