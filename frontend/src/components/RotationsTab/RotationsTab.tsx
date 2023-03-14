import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRotation } from '../../action/action';
import { useAppContext, useAppDispatchContext } from '../../context/appContext';
import { rotation_type } from '../../context/appContext';
import Rotation from './Rotation';
import '../../TabStyles.css';

const  RotationsTab = () => {
  const state = useAppContext();
  const { api_base_url, rotations } = state;
  const dispatch = useAppDispatchContext();
  const { teamID } = useParams();

  useEffect(() => {
    getRotation(dispatch, `${api_base_url}/data/${teamID}/rotations`)
  }, [])
  
  return (
    <div className='rotationsTab'>
      {rotations.every(column => column.length === 0) ? (
        <div className='noAPIContainer'>
          <div>There is no Rotation to show!</div>
          <a className='shotEntryLink' href={`/Rotations/${teamID}`}>Add Rotation</a>
        </div>
      ) : (
        <div className='rotationsTab__columns'>
          {rotations.map((column: rotation_type[], i) => (
            <div className='rotationsTab__column' key={i}>
              {column.map((rotation: rotation_type, j: React.Key) => (
                <Rotation key={j} rotation={rotation} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RotationsTab;
