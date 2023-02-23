import React from 'react';

import * as d3 from 'd3';

import { getSystemErrorMap } from 'util';
import Rotations, { Player, Point, Rotation, disableButton, enableButton, sendEditRotation, sendNewRotation } from './Rotations';

let point_tracking = false;
//determines if a new line can be drawn
let lock = 0;

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

export const svgPath = (points: any, command:any, color: any) => {
    // build the d attributes by looping over the points
    const d = points.reduce((acc:any, point:any, i:any, a:any) => i === 0
      // if first point
      ? `M ${point[0]},${point[1]}`
      // else
      : `${acc} ${command(point, i, a)}`
    , '')
    return `<path d="${d}" fill="none" stroke="${color}", stroke-width=3 />`
  }

const line = (pointA: any, pointB:any) => {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
}

const controlPoint = (current:any, previous:any, next:any, reverse:any) => {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current
    const n = next || current
    // The smoothing ratio
    const smoothing = 0.2
    // Properties of the opposed-line
    const o = line(p, n)
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing
    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
  }

export const bezierCommand = (point:any, i:any, a:any) => {
    // start control point
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point, false)
    // end control point
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
  }

let points = [[5, 10], [10, 40], [40, 30], [60, 5], [90, 45], [120, 10], [150, 45], [400, 10]]

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

    if (rotation.length !== 0)
        {
        let cur_player = rotation[0].player_number;
        let new_points: any[] = []
        for (let j = 0; j < rotation.length;j++)
        {      
            if (cur_player == rotation[j].player_number && j !== rotation.length-1)
            {
                new_points.push([rotation[j].x, rotation[j].y])
            }
            else
            {
                let first_points = new_points[0]
                let second_point = new_points[1]
                console.log("first point: ")
                console.log(first_points)
                svg.append("text")
                    .text(cur_player)
                    .attr("x", function(d) {if (first_points[0] > second_point[0]) {return first_points[0] - 11} else {return first_points[0] + 6}})
                    .attr("y",  function(d) {if (first_points[1] > second_point[1]) {return first_points[1] + 25} else {return first_points[1] - 2}})
                    .attr("fill", rotation[j-1].color)
                    .attr('style', "font-size: 25px;");

                console.log("drawing path!")
                console.log(new_points)
                //console.log(new_points)
                const svg_int = document.querySelector('g')
                svg_int!.innerHTML = svg_int!.innerHTML + svgPath(new_points, bezierCommand, rotation[j-1].color)
                cur_player = rotation[j].player_number;
                new_points = [[rotation[j].x, rotation[j].y]]
            }
            // let new_points = []
            // for (let k = 0; k < rotation[j].length; k++)
            // {
                
            // }
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

    svg.on("pointerdown", function(event) {
        if (lock == 0 && globalThis.current_color != "")
        {
            this.setPointerCapture(event.pointerId);
            new_rotation = [];
            point_tracking = true;
            lock = 1;
        }
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
        if (globalThis.current_color != ""){
            globalThis.able_to_add_rotation = true;
        }
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
    lock = 0;

    createRotSvg(rotationObject);
    
}

// to be called to delete all temporary data
export const newSelection = (rotationInput : Rotation) => {
    // this will delete the temporary data (anything not added)
    new_rotation = []
    lock = 0
    createRotSvg(rotationInput);
}

// to be called to delete from rotation data
export const deletePlayerRotation = (rotationObject : Rotation, colorSelected: string) => {
    // removes player info from svg
    lock = 0
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

