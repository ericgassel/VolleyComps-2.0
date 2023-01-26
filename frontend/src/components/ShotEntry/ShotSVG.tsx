
import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
import internal from 'stream';
import ShotEntry from './ShotEntry';
import { isConstructorDeclaration } from 'typescript';

let data_graph : any[] = [];

let first_click = {x:0, y:0};
let second_click = {x:0, y:0};

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



export async function createSvg(dateID : string){
    current_date_ID = dateID;

    let response : any[] = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/spray_chart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json());

    console.log(response);

    for (let i : number = 0; i < response.length; i++){
        
        //let shot : Shot = {playerID : response[i].player_id, type:response[i].type, result:response[i].result,startX:response[i].start_x,startY:response[i].start_y,endX:response[i].end_x,endY:response[i].end_y,date:response[i].date};
        


        data_graph.push({start_x: response[i].start_x, start_y: response[i].start_y, end_x: response[i].end_x, end_y: response[i].end_y, shot_type: response[i].type, result: response[i].result, player_num: response[i].player_id});
      }

    

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



    if (checkboxes === "kills")
    {
        data_graph = data_graph.filter(d => d.result === "kill")
    }

    svg.append("rect")
        .attr("id", "court")
        .attr("x", x_scale(0))
        .attr("y", y_scale(0))
        .attr("width", 500)
        .attr("height", 500)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    svg.selectAll('shots')
        .data(data_graph)
        .join('line')
        .attr('x1', function(d, i){return x_scale(d.start_x)})
        .attr('x2', function(d, i){return x_scale(d.end_x)})
        .attr('y1', function(d, i){return y_scale(d.start_y)})
        .attr('y2', function(d, i){return y_scale(d.end_y)})
        .attr("opacity", function (d) {if (d.shot_type === "serve"){return .5} else {return 1}})
        .attr("stroke", function(d) {if (d.result === "kill"){return "#000"} else if (d.result === "out"){return "red"} else {return "green"}}).on('mouseover', function(event, d) {
        d3.select(this).attr("stroke-width", 2);
        })
        .on('mouseout', function(event, d) {
        d3.select(this).attr("stroke-width", 1);
        });

        let width = 500;
        let height = 500;

    svg.on("click", function() {
        let vals = d3.pointer(event, svg.node())
        console.log(x_scale(x_scale_click(vals[0])));

        if (first_click.x === 0) {
            first_click.x = x_scale_click(vals[0]);
            first_click.y = y_scale_click(vals[1]);
            svg.append("circle")
                .attr("id", "selected")
                .attr("cx", vals[0])
                .attr("cy", vals[1])
                .attr("r", 20)
                .attr("height", 500)
                .attr("fill", "white")
                .attr("stroke", "green")
                .attr("stroke-width", 2);
        }
        else if (second_click.x === 0) {
            second_click.x = x_scale_click(vals[0]);
            second_click.y = y_scale_click(vals[1]);
            svg.append("circle")
                .attr("id", "selected")
                .attr("cx", vals[0])
                .attr("cy", vals[1])
                .attr("r", 20)
                .attr("height", 500)
                .attr("fill", "white")
                .attr("stroke", "red")
                .attr("stroke-width", 2);


        }
    })
}


export const addShotToSvg = (shot_type_selected: string, shot_result_selected: string, player_number_selected: number) => {
    console.log(first_click.x);
    data_graph.push({start_x: first_click.x, start_y: first_click.y, end_x: second_click.x, end_y: second_click.y, shot_type: shot_type_selected, result: shot_result_selected, player_num: 0});
    
    // send shot info to database
    fetch('http://cs400volleyball.mathcs.carleton.edu:5000/write/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/spray_chart', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "data": [[player_number_selected,shot_type_selected,shot_result_selected,first_click.x,first_click.y,second_click.x,second_click.y,current_date_ID]] })
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
    
    // reset info relating to shot
    first_click = {x:0, y:0};
    second_click = {x:0, y:0};
    console.log(data_graph);

    // recreate the svg
    createSvg(current_date_ID);
    
}

