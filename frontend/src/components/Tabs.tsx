import React, { useState } from "react"
import { Outlet } from "react-router-dom"

import TavNav from "./TabNav"

import './TabStyles.css';

const Tabs = () => {
	// Maybe use context to update school name when link is clicked and use the names afterward
	const [schoolName, setSchoolName] = useState('St Olaf');
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
