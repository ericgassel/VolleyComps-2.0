import { AxiosError } from "axios";
import React, { useReducer, createContext, useContext, Dispatch } from "react";
import { Action } from "../action/action";

type player = {
  player_id: Number; 
  class: string; 
  height: string; 
  name: string; 
  number: string; 
  position: string;
  notes?: string | null
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
    rotations: any;
}

// -- Global react state managed by React Context API --
let initialState = {
    error: null,
    roster: [],
    schedule: [],
    spray_chart: [],
    rotations: [],
    api_base_url: "http://cs400volleyball.mathcs.carleton.edu:5000"
}

type AppDispatch = Dispatch<Action>

/*
* -- Reducer --
* Reducer is a function that takes the current state and an action as arguments, and return a new state result.
* logic: use a switch case to handle different actions and update the state based on the given action 
*/


const appReducer = (state: any, action: Action) => {
    switch (action.type) {
        case "roster_success": {
            const { data } = action;
            return {
              ...state,
              roster: data
            }
        }
        case "rotation_success": {
          const { data } = action;
          return {
            ...state,
            rotations: data
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

