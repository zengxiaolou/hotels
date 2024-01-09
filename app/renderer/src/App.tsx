import React from 'react';
import { Route, Routes } from 'react-router-dom';
import  Main  from '@/main';
import '@arco-design/web-react/dist/css/arco.css';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
};
