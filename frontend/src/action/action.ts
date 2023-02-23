// Create actions for dispatch, receive data from API then dispatch
import axios, { AxiosResponse, AxiosError } from "axios";
import { changeTeams, formatMember } from "../helper/changeFormat";

export type Action = 
| { type: "post_team_success", data: any } 
| { type: "delete_roster_success", data: any } 
| { type: "post_roster_success", data: any } 
| { type: "roster_success", data: any } 
| { type: "teams_success", data: any } 
| { type: "schedule_success", data: any }
| { type: "spray_chart_success", data: any }
| { type: "teams_stats_success", data: any }
| { type: "stats_success", data: any }
| { type: "rotation_success", data: any }
| { type:"update_curr_team_success", data: any }
| { type:"update_comment_success", data: any }
| { type: "error"; error: Error | AxiosError }

export const ACTIONS = {
  POST_TEAM_SUCCESS: "post_team_success",
  DELETE_ROSTER_SUCCESS: "delete_roster_success",
  POST_ROSTER_SUCCESS: "post_roster_success",
  FECTH_ROSTER_SUCCESS: "roster_success",
  FECTH_TEAMS_SUCCESS: "teams_success",
  FECTH_SCHEDULE_SUCCESS: "schedule_success",
  FECTH_SPRAYCHART_SUCCESS: "spray_chart_success",
  FECTH_TEAMS_STATS_SUCCESS: "teams_stats_success",
  FECTH_STATS_SUCCESS: "stats_success",
  FECTH_ROTATIONS_SUCCESS: "rotation_success",
  UPDATE_CURR_TEAM_SUCCESS: "update_curr_team_success",
  UPDATE_COMMENT_SUCCESS: "update_comment_success",
  ERROR: "error",
};

export const updateCurrentTeam = (dispatch: any, teamData: {name:string; id:string}) => {
  dispatch({ type: ACTIONS.UPDATE_CURR_TEAM_SUCCESS, data: teamData });
  return;
}

/* 
* api call for adding team
*/
export const addTeam = async (dispatch: any, teamName: string, apiWithTeam: string) => {
  try {
    let response: AxiosResponse = await axios.post(apiWithTeam, {teamname: teamName});
    if (response.status == 200) {
      const fetchedData: {spreadsheet_id: string} = response.data;
      dispatch({ type: ACTIONS.POST_TEAM_SUCCESS, data: {name: teamName, id: fetchedData.spreadsheet_id} });
      return;
    }
    throw Error;
  }
  catch (error) {
    const errors = error as Error | AxiosError;
    dispatch({ type: ACTIONS.ERROR, error: errors });
    return;
  }}

/* 
* api call for deleting member
*/
export const deleteMember = async (dispatch: any, memberID: string, api: string) => {
  try {
    let response: AxiosResponse = await axios.post(api, {todelete: {player_id: memberID}});
    if (response.status == 200) {
      dispatch({ type: ACTIONS.DELETE_ROSTER_SUCCESS, data: memberID });
      return;
    }
    throw Error;
  }
  catch (error) {
    const errors = error as Error | AxiosError;
    dispatch({ type: ACTIONS.ERROR, error: errors });
    return;
  }}

/* 
* api call for adding member
*/
export const addMember = async (dispatch: any, memberData: string[], api: string) => {
  try {
    let response: AxiosResponse = await axios.post(api, {data: [memberData]});
    if (response.status == 200) {
      const fetchedData = response.data;
      let memberData = formatMember(fetchedData[0]);
      dispatch({ type: ACTIONS.POST_ROSTER_SUCCESS, data: memberData });
      return;
    }
    throw Error;
}
catch (error) {
    const errors = error as Error | AxiosError;
    dispatch({ type: ACTIONS.ERROR, error: errors });
    return;
}}

/* 
* api call for roster
*/
export const getRoster = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        dispatch({ type: ACTIONS.FECTH_ROSTER_SUCCESS, data: fetchedData });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for schedule
*/
export const getSchedule = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        dispatch({ type: ACTIONS.FECTH_SCHEDULE_SUCCESS, data: fetchedData });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for teams
*/
export const getTeams = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        let formattedTeams = changeTeams(fetchedData);
        // remove first row of the data, which is the header
        formattedTeams.shift()
        dispatch({ type: ACTIONS.FECTH_TEAMS_SUCCESS, data: formattedTeams });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for spray chart
*/
export const getSprayChart = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        dispatch({ type: ACTIONS.FECTH_SPRAYCHART_SUCCESS, data: fetchedData });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for stats
*/
export const getTeamStats = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const { data } = response;
        dispatch({ type: ACTIONS.FECTH_TEAMS_STATS_SUCCESS, data });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for stats
*/
export const getStats = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        // console.log('stats:', fetchedData);
        dispatch({ type: ACTIONS.FECTH_STATS_SUCCESS, data: fetchedData });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

/* 
* api call for rotation
*/
export const getRotation = async (dispatch: any, api: string) => {
  try {
      let response: AxiosResponse = await axios.get(api);
      if (response.status == 200) {
        const fetchedData = response.data;
        dispatch({ type: ACTIONS.FECTH_ROTATIONS_SUCCESS, data: fetchedData });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};

export const updateComment = async (dispatch: any, api: string, data: any) => {
  try {
      let response: AxiosResponse = await axios.post(api, data);
      if (response.status == 200) {
        const fetchedData = response.data;
        const { value } = data.newvalue;
        const { player_id } = data.toedit;
        dispatch({ type: ACTIONS.UPDATE_COMMENT_SUCCESS, data: { fetchedData, value, player_id } });
        return;
      }
      throw Error;
  }
  catch (error) {
      const errors = error as Error | AxiosError;
      dispatch({ type: ACTIONS.ERROR, error: errors });
      return;
  }
};