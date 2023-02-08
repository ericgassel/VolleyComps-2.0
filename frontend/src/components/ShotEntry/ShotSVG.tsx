
import React from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
import internal from 'stream';
import ShotEntry, { disableButton, enableButton } from './ShotEntry';
import { isConstructorDeclaration } from 'typescript';
import { assert } from 'console';
import { AssertionError } from 'assert';

// representation of Shot type dictionary
export interface Shot {
    player_id : string;
    shot_type : string;
    result : string;
    start_x : number;
    start_y : number;
    end_x : number;
    end_y : number;
    date : string;
    clicked : boolean;
}



declare global {
    // represents all shots
    var data_graph : Shot[];

    var first_click : {[key : string]: number} | null;
    var second_click : {[key : string]: number} | null;
}



// the current dateID for the page
let current_date_ID : string = "";

// boolean for if hovering over a line
let onLine : boolean = false;


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


export async function fullNewLoadSvg(dateID : string){
    current_date_ID = dateID;
    globalThis.data_graph = [];
    let url : string = window.location.href;
    let id : string = url.substring(url.lastIndexOf("/") + 1);
    let response : any[] = await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/data/'+ id + '/spray_chart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json());

    
    
    for (let i : number = 0; i < response.length; i++){
        
        //let shot : Shot = {playerID : response[i].player_id, type:response[i].type, result:response[i].result,startX:response[i].start_x,startY:response[i].start_y,endX:response[i].end_x,endY:response[i].end_y,date:response[i].date};
        
        // only add to chart if is equal to the date on calendar.
        if (response[i].date == current_date_ID){
        let shot : Shot = {player_id : response[i].player_id, shot_type:response[i].type, result:response[i].result,start_x:response[i].start_x,start_y:response[i].start_y,end_x:response[i].end_x,end_y:response[i].end_y,date:response[i].date,clicked:false};
        globalThis.data_graph.push(shot);
      }}
   
    
    createSvg();
}

export function createSvg(){
    // set first and second clicks to null
    globalThis.first_click = null;
    globalThis.second_click = null;
    // set okay_to_add to false. variable to represent if can display AddShot button.
    globalThis.okay_to_add = false;
    // set clicked values all to false
    for(let i : number = 0; i< globalThis.data_graph.length;i++){
        globalThis.data_graph[i].clicked = false;
    }

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
        globalThis.data_graph = globalThis.data_graph.filter(d => d.result === "kill")
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
        .data(globalThis.data_graph)
        .join('line')
        .attr('x1', function(d, i){return x_scale(d.start_x)})
        .attr('x2', function(d, i){return x_scale(d.end_x)})
        .attr('y1', function(d, i){return y_scale(d.start_y)})
        .attr('y2', function(d, i){return y_scale(d.end_y)})
        
        .attr("opacity", function (d) {if (d.shot_type === "serve"){return .5} else {return 1}})
        .attr("stroke-width",function(d, i){return 2})
        .on("click", function(event,d){
            // i is the shot thing
            
            d.clicked = !d.clicked;
          
            let enableDelete : boolean = false;
            for(let i : number = 0;i<globalThis.data_graph.length;i++){
                
                if (globalThis.data_graph[i].clicked){
                    enableDelete = true;
                }
            }
            if(enableDelete){
                enableButton("delete");
            } else {
                disableButton("delete");
            }

            
        })
        .attr("stroke", function(d) {if (d.result === "kill"){return "#000"} else if (d.result === "out"){return "red"} else {return "green"}}).on('mouseover', function(event, d) {
        d3.select(this).attr("stroke-width", 6);
        onLine = true;
        })
        .on('mouseout', function(event, d) {
            if (d.clicked == false){
                d3.select(this).attr("stroke-width", 2);
                
            }
            onLine = false;
        
        });

        let width = 500;
        let height = 500;

    svg.on("click", function() {
        
        let vals = d3.pointer(event, svg.node())
        //(x_scale(x_scale_click(vals[0])));

        if (globalThis.first_click == null && !onLine) {
            globalThis.first_click = {x : x_scale_click(vals[0]), y : y_scale_click(vals[1])};
           
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
        else if (globalThis.second_click == null && !onLine) {
            globalThis.second_click = {x : x_scale_click(vals[0]), y : y_scale_click(vals[1])};
            
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


        if(globalThis.okay_to_add && globalThis.first_click != null && globalThis.second_click != null){
            enableButton("addShot");
        }
        


    })
}

export function deleteShotFromSvg(){
    for( let i : number = 0; i < globalThis.data_graph.length; i++){

    }
}

export async function addShotToSvg(shot_type_selected: string, shot_result_selected: string, player_id: string){
    // the ! after globalThis.first_click is a non-null assertion
    let shot : Shot = {start_x: globalThis.first_click!.x, start_y: globalThis.first_click!.y, end_x: globalThis.second_click!.x, end_y: globalThis.second_click!.y, shot_type: shot_type_selected, result: shot_result_selected, player_id: player_id, date:current_date_ID, clicked:false}
    globalThis.data_graph.push(shot);
    console.log(globalThis.data_graph);
    
    // send shot info to database
    let url : string = window.location.href;
    let id : string = url.substring(url.lastIndexOf("/") + 1);
    await fetch('http://cs400volleyball.mathcs.carleton.edu:5000/write/'+ id+'/spray_chart', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "data": [[player_id,shot_type_selected,shot_result_selected,globalThis.first_click!.x,globalThis.first_click!.y,globalThis.second_click!.x,globalThis.second_click!.y,current_date_ID]] })
    })
    .then(response => response.json())
    //.then(response => console.log(JSON.stringify(response)))
    
    // reset info relating to shot
    globalThis.first_click = null;
    globalThis.second_click = null;
    
    // recreate the svg
    createSvg();
    
    
}

