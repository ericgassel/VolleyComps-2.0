import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
import Rotation from '../Rotation';
import { getSystemErrorMap } from 'util';


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

let rotation : any[] = [];

export const createRotSvg = () => {
    
    
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
        for (let i = 0; i < rotation[j].length; i++)
        {
            
            svg.append("rect")
            .attr("id", "court")
            .attr("x", rotation[j][i].x)
            .attr("y", rotation[j][i].y)
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", rotation[j][i].color)
            .attr("stroke", rotation[j][i].color)
            .attr("stroke-width", 2);
        }
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
                to_add["player_number"] = globalThis.current_selected_player
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
        console.log(rotation)
        point_tracking = false;
        //addRotationToSVG(8);
    })
}

// called when route is added to SVG
export const addRotationToSVG = (player_number_selected: number) => {
    rotation.push(new_rotation);
    // this should move temp 
    // ---------
    // adds a player to Dummy School

    /*
    fetch('http://cs400volleyball.mathcs.carleton.edu:5000/write/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "data": [[new_rotation[0].player_num, JSON.stringify(new_rotation), "5'11", "OPP", "Sr", "Hits really hard!"]] })
    })
    .then(response => response.json())
    
    */
    createRotSvg();
    
}

// to be called to delete all temporary data
export const newSelection = () => {
    // this will delete the temporary data (anything not added)
    new_rotation = []
    createRotSvg()
}

// to be called to delete from rotation data
export const deletePlayerRotation = (player_number_selected: number) => {
    // removes player info from svg

    rotation = rotation.filter(function(d) {return d[0].player_number.toString() !== player_number_selected.toString() })

    createRotSvg()
}

// this function will send all data to the API and reset the svg
export async function sendAndReset(rotationNumber : number) {
    // gets all roster info
   // http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster

   //http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?col=number
   // gets all player numbers
    let response = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?col=number', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    
    //then() function is used to convert the posted contents to the website into json format
    .then(result => result.json())
    
    console.log(response);
   


}

