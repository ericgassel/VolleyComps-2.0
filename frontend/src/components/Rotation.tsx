import React, { FC, useMemo } from 'react'
import * as d3 from 'd3';
import { rotation_type, rotation_line } from '../context/appContext';
import { svgPath, bezierCommand } from './Rotations/RotationsSVG';

type RotationProps = { rotation: rotation_type }

type RotationChartProps = {
  line: rotation_line[]
  // player_number: string[]
  // movement_colors: string[]
}

type xy_point = [number, number]

type lineDataType = {
  d: string
  color: string
}

// Player number on each line
const RotationChart: FC<RotationChartProps> = ({ line }: RotationChartProps) => {
  const x_scale = (x:number) => (x-200) * 0.8;
  const y_scale = (y:number) => (y-50) * 0.8;

  const formattedLines = useMemo(() => {
    const newList: lineDataType[] = [];
    if (line.length !== 0) {
      let cur_player = line[0].player_number;
      let new_points: xy_point[] = [];
      for (let j = 0; j < line.length;j++) {      
        const { player_number, x, y } = line[j];
        if (cur_player === player_number && j !== line.length-1) {
          new_points.push([x_scale(x), y_scale(y)]);
        } else {
          const d = new_points.reduce((acc:string, point:xy_point, i:number, a:xy_point[]) => 
            i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${bezierCommand(point, i, a)}`, '');
          const lineData: lineDataType = { d, color: line[j-1].color };
          newList.push(lineData);
          cur_player = player_number;
          new_points = [[x_scale(x), y_scale(y)]];
        }
      }  
    }
    return newList;
  }, [line]);

  return (
    <svg className='rotationChartSVG' width={400} height={400}>
      <g>
        <rect stroke='black' fill='white' strokeWidth={2}></rect>
        {formattedLines && formattedLines.map((line: lineDataType, i:React.Key) => 
          <path key={i} d={line.d} fill="none" stroke={line.color} strokeWidth='3' />
        )}
      </g>
    </svg>
  )
}


type RotationTableProps = {
  title: string
  tableArr: string[]
};

const RotationTable:FC<RotationTableProps> = ({ title, tableArr }:RotationTableProps) => {
  const rowTitles = ['Primary', 'Secondary', 'Tertiary'];
  return (
    <table className='rotationNotesTable'>
      <thead>
        <tr>
          <th>{title}</th>
        </tr>
      </thead>
      <tbody>
        {rowTitles.map((text:string, i:number) => 
          <>
            <tr>
              <td key={text} className='notesRowTitle teamStatsCell'>{text}</td>
            </tr>
            <tr>
              <td key={i} className='teamStatsCell'>{tableArr[i]}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  )
}

const Rotation: FC<RotationProps> = ({rotation}: RotationProps) => {
  const { rotation_number, player_id, player_number, movement_colors, line, notes, blocking_scheme, serve_recieve, transition } = rotation;

  return (
    <div className='RotationContainer'>
      <div className='lineUpContainer'>
        {player_number.map((player:string, i:number) => 
          <div className='playerNumber' style={movement_colors[i] ? {backgroundColor: movement_colors[i], color: 'white'} : {}} key={player}>
            {player}
          </div>
        )}
      </div>

      <div className='chartInfoContainer'>
        <div className='rotationSVGContainer'>
          <RotationChart line={line} />
        </div>

        <div className='notesContainer'>
          <RotationTable title='Serve Receive' tableArr={serve_recieve} />
          <RotationTable title='Transition' tableArr={transition} />
        </div>
      </div>

      <div className='blockingSchemeContainer'>
        <div>Blocking Scheme</div>
        <div className='blockingSchemeContent'>{blocking_scheme}</div>
      </div>
      {/* Add additional notes */}
    </div>
  )
}

export default Rotation
