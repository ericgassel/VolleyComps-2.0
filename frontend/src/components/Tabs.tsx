import React, { useEffect } from "react"
import { Outlet, useParams } from "react-router-dom"
import { getTeams } from "../action/action";
import { useAppContext, useAppDispatchContext } from "../context/appContext";

import TavNav from "./TabNav"

import '../TabStyles.css';

const Tabs = () => {
	const state = useAppContext();
	const dispatch = useAppDispatchContext();

  	const { currTeamData, teams, api_base_url } = state;

	  let getTeamAPI = `${api_base_url}/data/schools`

	useEffect(() => {
		getTeams(dispatch, getTeamAPI);
	}, []);

	const getCurrentTeamFromURL = () => {
		let {teamID} = useParams()
		let currTeam = teams.find((team: {name:string; id:string}) => team.id === teamID) || {name: "Dummy_school", id: "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM"}
		return currTeam.name;
	}

	return (
		<div className="tabs">
			<h1>{currTeamData.name || getCurrentTeamFromURL()}</h1>

			{/** Tab navigation  */}
			<TavNav />
			{/** Tab inner content */}
			<Outlet />
		</div>
	)
}

export default Tabs
