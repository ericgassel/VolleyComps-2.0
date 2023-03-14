import { AxiosError } from "axios";
import React, { useReducer, createContext, useContext, Dispatch } from "react";
import { Action } from "../action/action";

export type player = {
  player_id: string; 
  class: string; 
  height: string; 
  name: string; 
  number: string; 
  position: string;
  notes?: string | undefined;
  image: string | undefined;
}

export type spray_line = {
  player_id: string;
  type: string;
  result: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  date: string;
}

export type team_stats = {
  Aces: string;
  Aces_Errors: string;
  Aces_Per_Set: string;
  Assists_Per_Set: string;
  Attack_Errors: string;
  Attempts: string;
  Ball_Handling_Errors: string;
  Blocking_Assists: string;
  Blocking_Errors: string;
  Blocks: string;
  Blocks_Per_Set: string;
  Digs: string;
  Digs_Per_Set: string;
  Kills: string;
  Kills_Per_Set: string;
  Percent: string;
  Serve_Errors: string;
  Serve_Errors_Per_Set: string;
  Set_Assists: string;
  Solo: string;
  Team: string;
}

export type rotation_line = {
  color: string
  player_number: string
  x: number
  y: number
}

export type rotation_type = {
  blocking_scheme: string
  line: rotation_line[]
  movement_colors: string[]
  notes: string
  player_id: string[]
  player_number: string[]
  rotation_number: number
  serve_recieve: string[]
  transition: string[]
}

type State = {
    error: Error | AxiosError;
    api_base_url: string;
    roster: player[];
    fetchedRoster: boolean;
    schedule: any;
    spray_chart: spray_line[];
    teams_stats: team_stats[];
    stats: any;
    rotations: [rotation_type[]];
    teams: any;
    currTeamData: {name:string; id:string}, 
    isCurrTeamFilled: boolean
}

// -- Global react state managed by React Context API --
let initialState: any = {
    error: null,
    teams_stats: [],
    roster: [],
    fetchedRoster: false,
    teams: [],
    schedule: [],
    spray_chart: [],
    rotations: [],
    api_base_url: "http://cs400volleyball.mathcs.carleton.edu:5000",
    currTeamData: {}, 
    isCurrTeamFilled: false
}

type AppDispatch = Dispatch<Action>

/*
* -- Reducer --
* Reducer is a function that takes the current state and an action as arguments, and return a new state result.
* logic: use a switch case to handle different actions and update the state based on the given action 
*/


const appReducer = (state: any, action: Action) => {
    switch (action.type) {
        case "post_team_success": {
          const { data } = action;
          let newTeams = [...state.teams]
          newTeams.push(data)
          return {
            ...state,
            teams: newTeams
          }
        }
        case "update_curr_team_success": {
            const { data } = action;
            return {
              ...state,
              currTeamData: data,
              isCurrTeamFilled: true,
              fetchedRoster: false, 
              roster: []
            }
        }
        case "delete_roster_success": {
          const { data } = action;
          let newRoster = state.roster.filter((member: any) => member.player_id !== data)

          return {
            ...state,
            roster: newRoster
          }
        }
        case "post_roster_success": {
          const { data } = action;
          let updatedRoster = [...state.roster]
          updatedRoster.push(data)
          return {
            ...state,
            roster: updatedRoster
          }
        }
        case "roster_success": {
            const { data } = action;
            return {
              ...state,
              roster: data, 
              fetchedRoster: true
            }
            // const { data } = action;
            // return {
            //   ...state,
            //   roster: data, 
            //   fetchedRoster: true
            // }
        }
        case "teams_success": {
            const { data } = action;
            return {
              ...state,
              teams: data
            }
        }
        case "rotation_success": {
          const { data } = action;
          const convertedData = data.map((rotation: any) => {
            const parsedRotation: any = {};
            for (const key in rotation) {
              parsedRotation[key] = JSON.parse(rotation[key]);
            }
            return parsedRotation;
          })

          const columnData = [];
          columnData.push(convertedData.filter((rotation: rotation_type, i:number) => i % 2 === 0));
          columnData.push(convertedData.filter((rotation: rotation_type, i:number) => i % 2 === 1));

          return {
            ...state,
            rotations: columnData,
          }
        }
        case "schedule_success": {
        const { data } = action;
        return {
          ...state,
          schedule: data
          }
        }
        case "spray_chart_success": {
          const { data } = action;
          return {
            ...state,
            spray_chart: [...data]
          }
        }
        case "teams_stats_success": {
          const { data } = action;
          const formatedData = data.map((team_stats: any) => {
            for (const key in team_stats) {
              if (key !== 'Team') {
                team_stats[key] = String(team_stats[key]);
              }
            }
            return team_stats;
          });
          return {
            ...state,
            teams_stats: [...formatedData],
          }
        }
        case "stats_success": {
          const { data } = action;
          const formatedData = data.map((stats: any) => {
            for (const key in stats) {
              if (key !== 'Height' && key !== "Image" && key !== 'Name' && 
              key !== 'Position(s)'&& key !== 'Year' && key !== 'Notes' && key !== 'Seasons') {
                stats[key] = Number(stats[key]);
              }
            }
            return stats;
          });

          return {
            ...state,
            stats: [...data],
          }
        }
        case "update_comment_success": {
          const { value, player_id } = action.data;
          const updatedRoster = state.roster.map((player: player) => {
            if (player.player_id === player_id) {
              return { ...player, notes: value }
            }
            return player;
          });

          return {
            ...state,
            roster: [...updatedRoster],
          }
        }
        case "error": {
            return {
              ...state,
              error: action.error,
            };
        }
        default:
            throw new Error(`Unhandled action`);
    }
}
    
const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// custom hooks to use state and dispatch
export function useAppContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("Cannot find AppProvider");
  }
  return context;
}

export function useAppDispatchContext() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error("Cannot find AppProvider");
  }
  return context;
}

