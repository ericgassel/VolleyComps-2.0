import React, { useState } from "react"
import { Outlet } from "react-router-dom"

import TavNav from "./TabNav"

import './TabStyles.css';

const Tabs = () => {
	const [schoolName, setSchoolName] = useState('Concordia');
	return (
		<div className="tabs">
			<h1>{schoolName}</h1>

			{/** Tab navigation  */}
			<TavNav />
			{/** Tab inner content */}
			<Outlet />
		</div>
	)
}

export default Tabs
