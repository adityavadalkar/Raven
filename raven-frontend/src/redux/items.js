import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  item: {}
}

export const postCreator = createSlice({
  name: 'itemsPage',
  initialState,
  reducers: {
    swap: (state, action) => {
      state.items[action.payload[0]] = action.payload[1]
    },
    set: (state, action) => {
        state.items = action.payload
      },
    get: (state) => {
        return state.items
    },
    getItem: (state) => {
      return state.item
    },
    setItemState: (state, action) => {
      state.item = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { swap, set, get, setItemState, getItem } = postCreator.actions

export default postCreator.reducer