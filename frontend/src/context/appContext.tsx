import { AxiosError } from "axios";
import React, { useReducer, createContext, useContext, Dispatch } from "react";
import { Action } from "../action/action";

export type player = {
  player_id: Number; 
  class: string; 
  height: string; 
  name: string; 
  number: string; 
  position: string;
  notes?: string | undefined;
}

export type spray_line = {
  player_id: Number;
  type: string;
  result: string;
  start_x: Number;
  start_y: Number;
  end_x: Number;
  end_y: Number;
  date: string;
}

type State = {
    error: Error | AxiosError;
    api_base_url: string;
    roster: player[];
    schedule: any;
    spray_chart: spray_line[];
    team_stats: any;
    stats: any;
    rotations: any;
    teams: any;
    currTeamData: {name:string; id:string}
}

// -- Global react state managed by React Context API --
let initialState = {
    error: null,
    team_stats: [],
    roster: [],
    teams: [],
    schedule: [],
    spray_chart: [],
    rotations: [],
    api_base_url: "http://cs400volleyball.mathcs.carleton.edu:5000",
    currTeamData: {}
}

type AppDispatch = Dispatch<Action>

/*
* -- Reducer --
* Reducer is a function that takes the current state and an action as arguments, and return a new state result.
* logic: use a switch case to handle different actions and update the state based on the given action 
*/


const appReducer = (state: any, action: Action) => {
    switch (action.type) {
        case "update_curr_team_success": {
            const { data } = action;
            return {
              ...state,
              currTeamData: data
            }
        }
        case "post_roster_success": {
          const { data } = action;
          return {
            ...state,
            roster: [data, ...initialState.roster]
          }
        }
        case "roster_success": {
            const { data } = action;
            return {
              ...state,
              roster: data
            }
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
          console.log('ratation data: ', data);
          const convertedData = data.map((element: any) => ({ ...element, line: JSON.parse(element.line)}));
          console.log('convertedData: ', convertedData);
          return {
            ...state,
            rotations: convertedData,
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
          const convertedData = data.map((line: spray_line) =>  ({ 
            ...line,
            player_id: line.player_id,
            start_x: Number(line.start_x),
            start_y: Number(line.start_y),
            end_x: Number(line.end_x),
            end_y: Number(line.end_y),
          }))
          return {
            ...state,
            spray_chart: convertedData
          }
        }
        case "team_stats_success": {
          const { data } = action;
          // console.log('data:', data)
          // const formatedData = data.map((stats: any) => {
          //   for (const key in stats) {
          //     if (key !== 'Height' && key !== "Image" && key !== 'Name' && 
          //     key !== 'Position(s)'&& key !== 'Year' && key !== 'Notes' && key !== 'Seasons') {
          //       stats[key] = Number(stats[key]);
          //     }
          //   }
          //   return stats;
          // });
          // console.log('formatedData:', formatedData);
          return {
            ...state,
            team_stats: [...data],
          }
        }
        case "stats_success": {
          const { data } = action;
          // console.log('data:', data)
          const formatedData = data.map((stats: any) => {
            for (const key in stats) {
              if (key !== 'Height' && key !== "Image" && key !== 'Name' && 
              key !== 'Position(s)'&& key !== 'Year' && key !== 'Notes' && key !== 'Seasons') {
                stats[key] = Number(stats[key]);
              }
            }
            return stats;
          });
          console.log('formatedData:', formatedData);
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
          console.log('data in appContext:', value);
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

