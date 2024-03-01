import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    lists: [],
}

export const postCreator = createSlice({
  name: 'listsPage',
  initialState,
  reducers: {
    set: (state, action) => {
        state.lists = action.payload
      },
    get: (state) => {
        return state.lists
    }
  },
})

// Action creators are generated for each case reducer function
export const { set, get } = postCreator.actions

export default postCreator.reducer