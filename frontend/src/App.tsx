import React from 'react';
// import './App.css';
import './styles.css'
import Sidebar from './components/Sidebar';
import MainRoutes from './Routes'

const App: React.FC = () => {
  return (
    <div className="app">
     {/** Sidebar */}
     <Sidebar/>

     {/** Inner container */}
    <MainRoutes/>
    </div>
  );
}



export default App;
