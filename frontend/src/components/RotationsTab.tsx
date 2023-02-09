import React, { useEffect } from 'react';
import { getRotation } from '../action/action';
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import Rotation from './Rotation';
import './TabStyles.css';

const  RotationsTab = () => {
  const state = useAppContext();
  const { api_base_url, rotations } = state;
  const dispatch = useAppDispatchContext();

  console.log('rotations:', rotations);

  useEffect(() => {
    getRotation(dispatch, `${api_base_url}/data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/rotations`)
  }, [])
  
  const numOfColumns = 2;
  const numOfRows = Math.ceil(rotations.length / numOfColumns);
  const columnData = [];
  for (let i = 0; i < numOfColumns; i++) {
    columnData.push(rotations.slice(i * numOfRows, (i + 1) * numOfRows));
  }

  return (
    <div className='rotationsTab'>
      <div className='rotationsTab__columns'>
        {columnData.map((column, i) => (
          <div className='rotationsTab__column' key={i}>
            {column.map((rotation: any, j: React.Key) => (
              <Rotation key={j} rotation={rotation} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RotationsTab;
