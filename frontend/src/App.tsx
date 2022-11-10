import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
// import Test from './components/inputField';
import Main from './components/Main';
//https://www.npmjs.com/package/react-router-dom

const App: React.FC = () => {
  return (
    <div className="App">   
      <span className="heading">VolleyComps</span>
      {/* <Test /> */}
      <div>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/teams'>Teams</Link></li>
          <li><Link to='/addData'>Add Data</Link></li>
        </ul>
      </div>
      <Main />
    </div>
  );
}



export default App;
