import { configureStore } from '@reduxjs/toolkit'
import photosReducer from './Slices/photosSlice'  // düz yol (və ya './slices/photosSlice')

export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
})
