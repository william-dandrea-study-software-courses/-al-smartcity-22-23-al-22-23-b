import React from "react";
import {StartStop} from "../components";
import {TestDebug} from "../components/TestDebug";

const NavPage = () => {
  console.log("in home page");

  return <>
    <StartStop />
    <TestDebug />
  </>;
};

export default NavPage;
