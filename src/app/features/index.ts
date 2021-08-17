import { combineReducers } from "redux";
import userSlice from "./user/userSlice";

export const combinedReducers = combineReducers({
  user: userSlice,
});
