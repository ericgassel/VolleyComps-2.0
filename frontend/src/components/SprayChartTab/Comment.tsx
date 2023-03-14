import React, { useRef, useEffect } from 'react';
import { updateComment } from '../../action/action';
import { useAppContext, useAppDispatchContext } from '../../context/appContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import '../../TabStyles.css';

const Comment = ({ teamID, notes, selectedPlayer, isEditing, setIsEditing }: any) => {
  const state = useAppContext();
  const { api_base_url } = state;
  const dispatch = useAppDispatchContext();
  const notesRef = useRef(selectedPlayer.notes);

  useEffect(() => {
    // Updates ref value whenever the selectedPlayer is updated
    notesRef.current = selectedPlayer.notes;
  }, [selectedPlayer])
  

  const handleEdit = (event: any) => {
    if (event.target.textContent === 'Save') {
      const data = {
        "toedit":{
          "player_id": selectedPlayer.player_id,
        },
        "newvalue": [
          {
            "var": "notes",
            "value": notesRef.current,
          }
        ]
      };
      // Save it to the localStorage to persist previously selected player after re-rendering
      localStorage.setItem('selectedPlayer', JSON.stringify({ ...selectedPlayer, notes: notesRef.current }));
      updateComment(dispatch, `${api_base_url}/write/${teamID}/roster/edit`, data);
    } 
    setIsEditing(!isEditing);
  };

  const handleChange = (event: any) => {
    notesRef.current = event.target.value;
  };

  return (
    <div className='commentContents'>
      {isEditing ? (
        <form className='commentForm'>
          <textarea className='commentTextArea' defaultValue={notesRef.current} onChange={handleChange}></textarea>
        </form>
      ) : (
        <div className='commentForm notEditing'>
          {selectedPlayer.notes && selectedPlayer.notes.split(/\r?\n/).map((line: string, i: React.Key) => <p className='commentLine' key={i}>{line}</p>)}
        </div>
      )}
      {isEditing ? (
        <button className='commentBtn' onClick={handleEdit}>
          <div className='commentBtnText'>Save</div> 
          <FontAwesomeIcon className='commentBtnIcon' icon={faSave} />

        </button>
      ) : (
        <button className='commentBtn' onClick={handleEdit}>
          <div className='commentBtnText'>Edit</div> 
          <FontAwesomeIcon className='commentBtnIcon' icon={faEdit} />

        </button>
      )}
      
    </div>
  );
};

export default Comment;
