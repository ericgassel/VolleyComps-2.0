
import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
export const createSvg = () => {


let checkboxes = "";

const svg = d3
.select("#chart")
.append("svg")
.attr("width", 900)
.attr("height", 600)
.append("g");

let data_graph = [{start_x: 50, start_y: 0, end_x: 30, end_y: 80, shot_type: "attack", result: "kill"}, 
{start_x: 20, start_y: 0, end_x: 30, end_y: 40, shot_type: "attack", result: null},
{start_x: 70, start_y: 0, end_x: 25, end_y: 85, shot_type: "attack", result: "kill"},
{start_x: 68, start_y: 0, end_x: 25, end_y: 30, shot_type: "attack", result: "kill"},
{start_x: 50, start_y: 0, end_x: 50, end_y: 80, shot_type: "attack", result: "kill"},
{start_x: 20, start_y: 0, end_x: 60, end_y: 70, shot_type: "attack", result: null},
{start_x: 70, start_y: 0, end_x: 55, end_y: 85, shot_type: "attack", result: "kill"},
{start_x: 68, start_y: 0, end_x: 55, end_y: 30, shot_type: "attack", result: "kill"}];

  if (checkboxes === "kills")
  {
    data_graph = data_graph.filter(d => d.result === "kill")
  }
  let x_scale = d3.scaleLinear()
    .domain([0, 100])
    .range([200, 700]);

  let y_scale = d3.scaleLinear()
    .domain([0, 100])
    .range([50, 650]);

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
    .attr("stroke", function(d) {if (d.result === "kill"){return "#000"} else {return "red"}}).on('mouseover', function(event, d) {
      d3.select(this).attr("stroke-width", 2);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).attr("stroke-width", 1);
    });

    let width = 500;
    let height = 500;
}