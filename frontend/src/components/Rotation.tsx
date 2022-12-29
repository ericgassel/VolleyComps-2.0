import React from 'react'

const Rotation = () => {
  const lineUpArr = [1, 5, 2, 15, 3, 6];
  return (
    <div className='RotationContainer'>
      <div className='lineUpContainer'>
        {lineUpArr.map((player, i) => <div className='playerNumber' key={player}>{player}</div>)}
      </div>

      <div className='notesContainer'>Notes</div>

      <div className='rotationSVGContainer'></div>
    </div>
  )
}

export default Rotation