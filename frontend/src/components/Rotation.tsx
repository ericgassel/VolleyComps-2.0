import React from 'react'
import * as d3 from 'd3';


const RotationChart = ({ line }: { line: any }) => {
  const x_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([100, 600]);

  const y_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 600]);

  console.log('line:', line);

  return (
    <svg className='rotationChartSVG' width={500} height={500}>
      <g>
        {line && line.map((data: any, i: React.Key) => 
          <rect key={i} x={data.x - 200} y={data.y - 50} stroke={data.color} strokeWidth={2} width={4} height={4}></rect>
        )}
      </g>
    </svg>
  )
}

const Rotation = ({ rotation }: {rotation: any}) => {
  const lineUpArr = [1, 5, 2, 15, 3, 6];
  const { rotation_number, line,	blocking_scheme, serve_recieve } = rotation;

  return (
    <div className='RotationContainer'>
      <div className='lineUpContainer'>
        {lineUpArr.map((player, i) => <div className='playerNumber' key={player}>{player}</div>)}
      </div>

      <div className='notesContainer'>Notes</div>

      <div className='rotationSVGContainer'><RotationChart line={line} /></div>
    </div>
  )
}

export default Rotation