import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';

function App() {
  return (
    <div className="App">
     
    </div>
  );
}

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


// heatmap of shot results
/*
  const svg2 = d3
    .select("#heat")
    .append("svg")
    .attr("width", 900)
    .attr("height", 700)
    .append("g");

  let zoneColor = d3.scaleLinear()
  .domain([0, 1])
  .range(['white', '#ca0b1b'])
  .interpolate(d3.interpolateLab)

  let x_zone_scale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([200, 367, 533, 200, 367, 533, 200, 367, 533]);

  let y_zone_scale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([50, 50, 50, 250, 250, 250, 450, 450, 450]);

  let x_zone = d3.scaleQuantize()
    .domain([0, 100])
    .range([1, 2, 3]);

  let y_zone = d3.scaleQuantize()
    .domain([0, 100])
    .range([0, 1, 2]);

  let zone_freq: { [key: number]: number } = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
  let kill_freq: { [key: number]: number } = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}

  for (let i = 0; i<data_graph.length; i++)
  {
    console.log(data_graph[i])
    console.log(x_zone(data_graph[i].end_x))
    console.log(y_zone(data_graph[i].end_y))
    console.log(x_zone(data_graph[i].end_x) + 3 * y_zone(data_graph[i].end_y))
    zone_freq[(x_zone(data_graph[i].end_x) + 3 * y_zone(data_graph[i].end_y))]++
    if (data_graph[i].result === "kill")
    {
      kill_freq[x_zone(data_graph[i].end_x) + 3 * y_zone(data_graph[i].end_y)]++
    }
  }
  console.log(zone_freq)

  let total_shots = 0;
  for (let i = 1; i<=9; i++)
  {
    total_shots += zone_freq[i];
  }
  console.log(total_shots)

  let percentages: { [key: number]: number } = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}

  //percentage per zone
  let kill_percentages: { [key: number]: number } = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
  //kills as a percentage of total [TO IMPLEMENT]
  let total_kill_percentages: { [key: number]: number } = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}

  for (let i = 1; i<=9; i++)
  {
    percentages[i] = zone_freq[i]/total_shots;
    if (zone_freq[i] === 0)
    {
      kill_percentages[i] = 0
    }
     else { kill_percentages[i] = kill_freq[i]/zone_freq[i] }
  }
  console.log(kill_percentages)
  
  for (let i = 1; i<=9; i++)
  {
    console.log(y_zone_scale(i))
    svg2.append("rect")
      .attr("x", x_zone_scale(i))
      .attr("y", y_zone_scale(i))
      .attr("width", 167)
      .attr("height", 200)
      .attr("fill", function(d) {
        if (colorBy === 'frequency')
            {
          return zoneColor(percentages[i]);
        }
        else if (colorBy === 'kill percentage')
            {
          return zoneColor(kill_percentages[i]);
        }
        else if (colorBy === 'kills')
          {
          return zoneColor(kill_percentages[i]);
        }
          
      })
      .attr("stroke-thickness", 4)
      .attr("stroke", "black")
      .on('mouseover', function(event, d) {
        d3.select('#nameText').attr("x", x_zone_scale(i)+167/2).attr("y", y_zone_scale(i)+200/2+10) 
        d3.select('#nameText').text(kill_freq[i] + "/" + zone_freq[i]);
      })
      .on('mouseout', function(event, d) {
        d3.select('#nameText').text('');
      });
  }
    svg2.append('text')
    .attr('id', 'nameText')
    .attr('x', 10)
    .attr('y', 20).attr('style', "font-size: 30px;").attr("text-anchor", "middle");
  
*/

export default App;
