import React from 'react'

const InputField = () => {
    return (
        <form className="input">
            <input type="input" placeholder="Enter ID" className='input__box'></input>
            <input type="input" placeholder="Enter PW" className='input__box'></input>
            <button className='input__submit' type='submit'>Enter</button>
        </form>
    )
}


export default InputField