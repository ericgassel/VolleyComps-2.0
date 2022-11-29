// Create actions for dispatch, receive data from API then dispatch
import axios, { AxiosResponse, AxiosError } from "axios";


export type Action =
  | { type: "success"; data: any }
  | { type: "error"; error: Error | AxiosError }

/* 
* basic api call to fetch all the data
*/
export const getAllData = async (dispatch: any, api: string) => {
    try {
        let response: AxiosResponse = await axios.get(api);
        const fetchedData = response.data;
        dispatch({ type: "success", data: fetchedData });
        return;
    }
    catch (error) {
        const errors = error as Error | AxiosError;
        dispatch({ type: "error", error: errors });
        return;
    }
  };