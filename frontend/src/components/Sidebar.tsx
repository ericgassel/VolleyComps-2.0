import React, { useEffect } from "react"
import {Link, useLocation, useNavigate, useParams} from "react-router-dom"
import { getTeams } from "../action/action";
import NavigationItems from "../config/navigation";
import { useAppContext, useAppDispatchContext } from "../context/appContext";


const Sidebar = () => {
	const state = useAppContext();
	const dispatch = useAppDispatchContext();

	const {teams, api_base_url} = state;

	const location = useLocation();
	let pathname = location.pathname.split("/")

	let teamId = pathname.pop()

	if (pathname[1] === "report") {
		teamId = pathname.pop()
	} 
	
	const getCurrentTeamFromURL = () => {
		let currTeam = teams.find((team: {name:string; id:string}) => team.id === teamId)
		return currTeam;
	}

	let currTeam = getCurrentTeamFromURL()

	let navigationItems = NavigationItems(currTeam)

	useEffect(() => {
		if (!teams.length) {
		  let getTeamsAPI = `${api_base_url}/data/schools`
		  getTeams(dispatch, getTeamsAPI);
		}

	  }, [teams])

	return (
		<div className="sidebar">
			<div className="sidebar__items">
				{(
					<>
						{navigationItems.sidebar.map((item: {name: string; to: string; text: string}) => (
							<Link
								key={item.text}
								to={item.to}
								className={
									location.pathname.includes(item.to) ? "sidebar_active sidebar_title" : "sidebar_title"
								}>
								{item.name}
							</Link>
						))}
						{navigationItems.currTeamName ? (<div className="sidebar_team">↳ {navigationItems.currTeamName}</div>) : ""}
						{navigationItems.currTeamInfo.map((item: any) => (
							item.name === "Edit Report " ?
							<a
								key={item.text}
								href={item.href}
								className={location.pathname.includes(item.text) ? "sidebar_active sidebar_team_options" : "sidebar_team_options"}>
								→ {item.name}
							</a> :
							<Link
								key={item.text}
								to={item.to}
								className={location.pathname.includes(item.text) ? "sidebar_active sidebar_team_options" : "sidebar_team_options"}>
								→ {item.name}
							</Link>
						))}
					</>
				)}
			</div>
		</div>
	)
}

export default Sidebar
