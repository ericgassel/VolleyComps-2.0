import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRotation } from '../action/action';
import { useAppContext, useAppDispatchContext } from '../context/appContext';
import { rotation_type } from '../context/appContext';
import Rotation from './Rotation';
import './TabStyles.css';

const  RotationsTab = () => {
  const state = useAppContext();
  const { api_base_url, rotations } = state;
  const dispatch = useAppDispatchContext();
  const { teamID } = useParams();

  useEffect(() => {
    getRotation(dispatch, `${api_base_url}/data/${teamID}/rotations`)
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
        {columnData.map((column: rotation_type[], i) => (
          <div className='rotationsTab__column' key={i}>
            {column.map((rotation: rotation_type, j: React.Key) => (
              <Rotation key={j} rotation={rotation} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RotationsTab;
