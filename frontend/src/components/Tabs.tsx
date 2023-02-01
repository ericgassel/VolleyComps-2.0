import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { useAppContext } from "../context/appContext";

import TavNav from "./TabNav"

import './TabStyles.css';

const Tabs = () => {
	const state = useAppContext();
  	const { currTeamData } = state;

	// Maybe use context to update school name when link is clicked and use the names afterward

	return (
		<div className="tabs">
			<h1>{currTeamData.name || "Carleton College"}</h1>

			{/** Tab navigation  */}
			<TavNav />
			{/** Tab inner content */}
			<Outlet />
		</div>
	)
}

export default Tabs
