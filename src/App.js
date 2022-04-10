import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import './App.css';
import { AppRouters } from "./routers";
import { refreshNavContent } from "./slices/nav-content";

function App() {

  const dispathch = useDispatch();

  useEffect(() => {
    dispathch(refreshNavContent());
  }, [])

  return (
    <AppRouters />
  );
}

export default App;
