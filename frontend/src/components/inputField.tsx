import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
  } from 'react-router-dom';
//https://reactrouter.com/en/v6.3.0/upgrading/v5#upgrade-all-switch-elements-to-routes
const InputField = () => {
    return (
        <form className="input">
            <input type="input" placeholder="Enter ID" className='input__box'></input>
            <input type="input" placeholder="Enter PW" className='input__box'></input>
            <button className='input__submit' type='submit'>Enter</button>
        </form>
    )
}

const Test = () =>{
    return (
    <Router>
        <div>
        <nav>
            <ul>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/about">About</Link>
                </li>
                <li>
                <Link to="/rotations">rotation</Link>
                </li>
            </ul>
            </nav>
        </div>
    </Router>
    )
}


export default Test