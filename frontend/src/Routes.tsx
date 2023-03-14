import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"

import Home from "./components/Home/Home"
import SprayChartTab from "./components/SprayChartTab/SprayChartTab"
import TeamStatsTab from "./components/TeamStatsTab/TeamStatsTab"
import RotationsTab from "./components/RotationsTab/RotationsTab"
import ManageTeam from './components/Teams/ManageTeam'


import InnerContent from "./components/InnerContent"

import Tabs from "./components/Tabs"
import Teams from "./components/Teams/Teams"
import ShotEntry from "./components/ShotEntry/ShotEntry"
import Rotations from "./components/Rotations/Rotations"

const MainRoutes = () => (
	<Routes>
		{/** Protected Routes */}
		{/** Wrap all Route under ProtectedRoutes element */}
		{/* <Route path="/" element={<PublicRoutes />}> */}
		<Route path="/" element={<InnerContent />}>
			<Route path="/" element={<Navigate replace to="home" />} />
			<Route path="home" element={<Home />} />
			<Route path="management/:teamID" element={<ManageTeam />} />
			<Route path="teams" element={<Teams />} />
			<Route path="report/:teamID" element={<Tabs />}>
				<Route path="/report/:teamID" element={<Navigate replace to="sprayChartTab" />} />
				<Route path="sprayChartTab" element={<SprayChartTab />} />
				<Route path="teamStatsTab" element={<TeamStatsTab />} />
				<Route path="rotationsTab" element={<RotationsTab />} />
			</Route>
			<Route path="ShotEntry/:id" element={<ShotEntry/>}/>
			<Route path="Rotations/:id" element={<Rotations/>}/>
		</Route>
	</Routes>
)

export default MainRoutes
