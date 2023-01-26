// Create actions for dispatch, receive data from API then dispatch
import axios, { AxiosResponse, AxiosError } from "axios";

export type Action = 
| { type: "roster_success", data: any } 
| { type: "schedule_success", data: any }
| { type: "spray_chart_success", data: any }
| { type: "rotation_success", data: any }
| { type: "error"; error: Error | AxiosError }

export const ACTIONS = {
  FECTH_ROSTER_SUCCESS: "roster_success",
  FECTH_SCHEDULE_SUCCESS: "schedule_success",
  FECTH_SPRAYCHART_SUCCESS: "spray_chart_success",
  FECTH_ROTATIONS_SUCCESS: "rotation_success",
  ERROR: "error",
};

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