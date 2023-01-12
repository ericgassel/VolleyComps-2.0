
import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';

let data_graph : any[] = [{start_x: 50, start_y: 0, end_x: 30, end_y: 80, shot_type: "attack", result: "kill"}, 
{start_x: 20, start_y: 0, end_x: 30, end_y: 40, shot_type: "attack", result: null},
{start_x: 70, start_y: 0, end_x: 25, end_y: 85, shot_type: "attack", result: "kill"},
{start_x: 68, start_y: 0, end_x: 25, end_y: 30, shot_type: "attack", result: "kill"},
{start_x: 50, start_y: 0, end_x: 50, end_y: 80, shot_type: "attack", result: "kill"},
{start_x: 20, start_y: 0, end_x: 60, end_y: 70, shot_type: "attack", result: null},
{start_x: 70, start_y: 0, end_x: 55, end_y: 85, shot_type: "attack", result: "kill"},
{start_x: 68, start_y: 0, end_x: 55, end_y: 30, shot_type: "attack", result: "kill"}];

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

export const createSvg = (dateID : string) => {
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
    first_click = {x:0, y:0};
    second_click = {x:0, y:0};
    console.log(data_graph);
    createSvg(current_date_ID);
}

