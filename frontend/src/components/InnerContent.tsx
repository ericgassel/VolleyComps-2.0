import React from 'react';
import { Outlet } from 'react-router-dom';
import './InnerContent.css';

const  InnerContent = () =>{
  return <div className='inner-content'>
      <Outlet/>
  </div>;
}

export default InnerContent;
