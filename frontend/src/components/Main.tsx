import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Teams from './Teams';
import AddData from './AddData';

const Main = () => {
return (         
  <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/teams' element={<Teams/>} />
    <Route path='/addData' element={<AddData/>} />
  </Routes>
);
}

export default Main;