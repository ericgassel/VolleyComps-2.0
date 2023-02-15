import React, { FC, useMemo } from 'react'
import * as d3 from 'd3';
import { rotation_type, rotation_line } from '../context/appContext';
import { svgPath, bezierCommand } from './Rotations/RotationsSVG';

type RotationProps = { rotation: rotation_type }

type RotationChartProps = {
  line: rotation_line[]
  player_number: string[]
  movement_colors: string[]
}

type xy_point = [number, number]

{/* <path d="" fill="none" stroke="rgb(91, 83, 91)" stroke-width="3"></path>
 */}

const RotationChart: FC<RotationChartProps> = ({ line, player_number, movement_colors }: RotationChartProps) => {
  const x_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([100, 500]);

  const y_scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 500]);

  console.log('line in chart:', line);
  console.log('player_number in chart:', player_number);

  const getPathTag = (line: xy_point[], color: string) => {
    // build the d attributes by looping over the points
    const d = line.reduce((acc: string, point:xy_point, i: number, a: xy_point[]) => 
      // if first point, `M ${point.x},${point.y}` else, `${acc} ${command(point, i, a)}`
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${bezierCommand(point, i, a)}`, '')
    return {d, color}
    // return <path d="${d}" fill="none" stroke="${color}" stroke-width='3' />
  }

  const formattedLines = useMemo(() => {
    const newList = [];
    for (let i = 0; i < player_number.length; i++) {
      const filteredLines: xy_point[] | any = line.filter((point) => point.player_number === player_number[i])
        .map((point) => [point.x, point.y]);
      console.log('filteredLines:', filteredLines);
      if (filteredLines.length) {
        const pathTag = getPathTag(filteredLines, movement_colors[i]);
        newList.push(pathTag);
      }
    }
    return newList;
  }, []);

  console.log('formattedLines:', formattedLines);

  return (
    <svg className='rotationChartSVG' width={500} height={500}>
      <g>
        {/* {line && line.map((data: any, i: React.Key) => 
          // <rect key={i} x={data.x - 200} y={data.y - 50} stroke={data.color} strokeWidth={2} width={4} height={4}></rect>
          
          )} */}
          {/* <rect x={data.x - 200} y={data.y - 50} stroke={data.color} fill='white' strokeWidth={2}></rect> */}
          <rect stroke='black' fill='white' strokeWidth={2}></rect>
          {formattedLines && formattedLines.map((line) => 
            <path d={line.d} fill="none" stroke={line.color} stroke-width='3' />
          )}
      </g>
    </svg>
  )
}

const Rotation: FC<RotationProps> = ({rotation}: RotationProps) => {
  const lineUpArr = [1, 5, 2, 15, 3, 6];
  const { rotation_number, player_id, player_number, movement_colors, line, notes, blocking_scheme, serve_recieve, transition } = rotation;

  return (
    <div className='RotationContainer'>
      <div className='lineUpContainer'>
        {player_number.map((player, i) => <div className='playerNumber' key={player}>{player}</div>)}
      </div>

      <div className='notesContainer'>Notes</div>

      <div className='rotationSVGContainer'>
        <RotationChart line={line} player_number={player_number} movement_colors={movement_colors}  />
      </div>
    </div>
  )
}

export default Rotation

// path("M 349.361 335.732 C 349.361 335.674 349.361 336.036 349.361 335.442 C 349.361 334.848 349.361 334.49 349.361 332.761 C 349.361 331.032 349.361 329.429 349.361 326.796 C 349.361 324.163 349.361 322.165 349.361 319.598 C 349.361 317.03 349.361 316.509 349.361 313.957 C 349.361 311.405 349.361 310.374 349.361 306.838 C 349.361 303.302 349.361 300.729 349.361 296.276 C 349.361 291.824 349.361 289.292 349.361 284.576 C 349.361 279.861 349.048 277.165 349.361 272.698 C 349.674 268.23 349.869 266.115 350.927 262.24 C 351.986 258.365 352.986 256.647 354.653 253.323 C 356.32 249.999 357.403 248.311 359.262 245.618 C 361.122 242.926 362.156 241.821 363.951 239.862 C 365.745 237.902 366.657 237.186 368.234 235.819 C 369.81 234.453 370.443 233.912 371.835 233.031 C 373.226 232.15 373.73 231.903 375.192 231.414 C 376.653 230.925 377.226 230.807 379.142 230.587 C 381.058 230.367 381.92 230.369 384.771 230.314 C 387.621 230.26 389.382 230 393.394 230.314 C 397.406 230.629 399.868 230.515 404.829 231.886 C 409.79 233.258 412.776 234.649 418.2 237.172 C 423.623 239.694 426.463 241.568 431.948 244.498 C 437.434 247.429 440.318 249.079 445.627 251.826 C 450.937 254.572 453.893 256.073 458.497 258.231 C 463.1 260.389 464.891 261.073 468.645 262.615 C 472.4 264.156 473.898 264.811 477.269 265.939 C 480.641 267.066 482.559 267.544 485.502 268.253 C 488.446 268.963 489.752 269.129 491.986 269.486 C 494.219 269.843 494.955 269.939 496.67 270.036 C 498.384 270.134 499.002 270.376 500.559 269.973 C 502.117 269.571 502.682 269.534 504.457 268.024 C 506.232 266.515 507.063 265.503 509.432 262.426 C 511.801 259.349 513.309 257.437 516.302 252.64 C 519.296 247.842 521.175 244.885 524.399 238.439 C 527.623 231.992 529.461 228.148 532.423 220.407 C 535.384 212.666 536.976 207.975 539.205 199.734 C 541.433 191.494 542.22 187.001 543.565 179.206 C 544.911 171.41 545.287 167.597 545.933 160.756 C 546.578 153.914 546.621 150.385 546.794 145 C 546.966 139.615 546.794 137.63 546.794 133.83 C 546.794 130.03 546.916 128.776 546.794 126.002 C 546.671 123.228 546.302 121.17 546.179 119.962");
// path("M 349.361 335.732 C 349.361 335.674 349.361 336.036 349.361 335.442 C 349.361 334.848 349.361 334.49 349.361 332.761 C 349.361 331.032 349.361 329.429 349.361 326.796 C 349.361 324.163 349.361 322.165 349.361 319.598 C 349.361 317.03 349.361 316.509 349.361 313.957 C 349.361 311.405 349.361 310.374 349.361 306.838 C 349.361 303.302 349.361 300.729 349.361 296.276 C 349.361 291.824 349.361 289.292 349.361 284.576 C 349.361 279.861 349.048 277.165 349.361 272.698 C 349.674 268.23 349.869 266.115 350.927 262.24 C 351.986 258.365 352.986 256.647 354.653 253.323 C 356.32 249.999 357.403 248.311 359.262 245.618 C 361.122 242.926 362.156 241.821 363.951 239.862 C 365.745 237.902 366.657 237.186 368.234 235.819 C 369.81 234.453 370.443 233.912 371.835 233.031 C 373.226 232.15 373.73 231.903 375.192 231.414 C 376.653 230.925 377.226 230.807 379.142 230.587 C 381.058 230.367 381.92 230.369 384.771 230.314 C 387.621 230.26 389.382 230 393.394 230.314 C 397.406 230.629 399.868 230.515 404.829 231.886 C 409.79 233.258 412.776 234.649 418.2 237.172 C 423.623 239.694 426.463 241.568 431.948 244.498 C 437.434 247.429 440.318 249.079 445.627 251.826 C 450.937 254.572 453.893 256.073 458.497 258.231 C 463.1 260.389 464.891 261.073 468.645 262.615 C 472.4 264.156 473.898 264.811 477.269 265.939 C 480.641 267.066 482.559 267.544 485.502 268.253 C 488.446 268.963 489.752 269.129 491.986 269.486 C 494.219 269.843 494.955 269.939 496.67 270.036 C 498.384 270.134 499.002 270.376 500.559 269.973 C 502.117 269.571 502.682 269.534 504.457 268.024 C 506.232 266.515 507.063 265.503 509.432 262.426 C 511.801 259.349 513.309 257.437 516.302 252.64 C 519.296 247.842 521.175 244.885 524.399 238.439 C 527.623 231.992 529.461 228.148 532.423 220.407 C 535.384 212.666 536.976 207.975 539.205 199.734 C 541.433 191.494 542.22 187.001 543.565 179.206 C 544.911 171.41 545.287 167.597 545.933 160.756 C 546.578 153.914 546.621 150.385 546.794 145 C 546.966 139.615 546.794 137.63 546.794 133.83 C 546.794 130.03 546.916 128.776 546.794 126.002 C 546.671 123.228 546.652 121.905 546.179 119.962 C 545.706 118.019 544.78 117.021 544.43 116.286");