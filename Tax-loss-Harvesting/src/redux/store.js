import { configureStore } from '@reduxjs/toolkit';
import harvestReducer from './harvestSlice';

export const store = configureStore({
  reducer: {
    harvest: harvestReducer,
  },
});
