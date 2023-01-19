import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"

import Home from "./components/Home"
import PlayerStatsTab from "./components/PlayerStatsTab"
import TeamStatsTab from "./components/TeamStatsTab"
import RotationsTab from "./components/RotationsTab"
import PlaysTab from "./components/PlaysTab"
import ManageTeam from './components/ManageTeam'


import InnerContent from "./components/InnerContent"

import Tabs from "./components/Tabs"
import Teams from "./components/Teams"
import Login from "./components/Login"
import History from "./components/History"
import Knights from "./components/Knights"
import ShotEntry from "./components/ShotEntry/ShotEntry"
import Rotations from "./components/Rotations/Rotations"

import ProtectedRoutes from "./components/ProtectedRoutes"
import PublicRoutes from "./components/PublicRoutes"
import PermissionDenied from "./components/PermissionDenied"

const MainRoutes = () => (
	<Routes>
		{/** Protected Routes */}
		{/** Wrap all Route under ProtectedRoutes element */}
		<Route path="/" element={<ProtectedRoutes />}>
			<Route path="/" element={<InnerContent />}>
				<Route path="/" element={<Navigate replace to="home" />} />
				<Route path="home" element={<Home />} />
				<Route path="knights" element={<Knights />} />
				<Route path="management/:teamID" element={<ManageTeam />} />
				<Route path="teams" element={<Teams />} />
				<Route path="report/:teamID" element={<Tabs />}>
					<Route path="/report/:teamID" element={<Navigate replace to="playerStatsTab" />} />
					<Route path="playerStatsTab" element={<PlayerStatsTab />} />
					<Route path="teamStatsTab" element={<TeamStatsTab />} />
					<Route path="rotationsTab" element={<RotationsTab />} />
					<Route path="playsTab" element={<PlaysTab />} />
				</Route>
				<Route path="history" element={<History />} />
				<Route path="ShotEntry/:id" element={<ShotEntry/>}/>
				<Route path="Rotations" element={<Rotations/>}/>
			</Route>
		</Route>

		{/** Public Routes */}
		{/** Wrap all Route under PublicRoutes element */}
		<Route path="login" element={<PublicRoutes />}>
			<Route path="/login" element={<Login />} />
		</Route>

		{/** Permission denied route */}
		<Route path="/denied" element={<PermissionDenied />} />
	</Routes>
)

export default MainRoutes
