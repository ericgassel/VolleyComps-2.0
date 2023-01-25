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

let new_rotation : Array<Array<number>> = [];
let rotation : Array<Array<Array<number>>> = [];

export const createRotSvg = () => {
    
    console.log("Rotations SVG Loading");
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

    let data = [];
    for (let j =0; j < rotation.length;j++)
    {
        for (let i = 0; i < rotation[j].length; i++)
        {
            data.push({"x": rotation[j][i][0], "y":rotation[j][i][0]});
            console.log(rotation);
            svg.append("rect")
            .attr("id", "court")
            .attr("x", rotation[j][i][0])
            .attr("y", rotation[j][i][1])
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", rotation[j][i][2])
            .attr("stroke", rotation[j][i][2])
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
                let to_add : Array<any> = []
                if(typeof globalThis.current_color !== "undefined")
                {
                to_add.push(vals[0])
                to_add.push(vals[1])
                to_add.push(globalThis.current_color)
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
        rotation.push(new_rotation);
        addRotationToSVG(8);
    })
}

// called when route is added to SVG
export const addRotationToSVG = (player_number_selected: number) => {
    // this should move temp 
    createRotSvg();
}

// to be called to delete all temporary data
export const newSelection = () => {
    // this will delete the temporary data (anything not added)
}

// to be called to delete from rotation data
export const deletePlayerRotation = (player_number_selected: number) => {
    // removes player info from svg
}

// this function will send all data to the API and reset the svg
export const sendAndReset = (rotationNumber : number) => {
   // http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster
    let response = fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    //then() function is used to convert the posted contents to the website into json format
    .then(result => result.json())
    
    console.log(response);
   


}

