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
    
let rotation : Array<Array<number>> = [];

export const createRotSvg = (dateID : string) => {
    


    current_date_ID = dateID;
    console.log("made it here!");
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
    for (let i = 0; i < rotation.length; i++)
    {
        data.push({"x": rotation[i][0], "y":rotation[i][0]});
        console.log(rotation);
        svg.append("rect")
        .attr("id", "court")
        .attr("x", rotation[i][0])
        .attr("y", rotation[i][1])
        .attr("width", 4)
        .attr("height", 4)
        .attr("fill", "black")
        .attr("stroke", "black")
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
        rotation = [];
        point_tracking = true;
    })
    svg.on("pointermove", function() {
        if (point_tracking) {
            let vals = d3.pointer(event, svg.node());
            rotation.push(vals);
            console.log(x_scale(x_scale_click(vals[0])))
        }
    })
    svg.on("pointerup", function() {
        console.log(rotation)
        point_tracking = false;
        addRotationToSVG(8);
    })
}

export const addRotationToSVG = (player_number_selected: number) => {
    createRotSvg(current_date_ID);
}

