import React from 'react';
// import './App.css';
import './styles.css'
import Sidebar from './components/Sidebar';
import MainRoutes from './Routes'
import { AppProvider } from './context/appContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="app">
      {/** Sidebar */}
      <Sidebar/>

      {/** Inner container */}
      <MainRoutes/>
      </div>
    </AppProvider>
  );
}



export default App;
