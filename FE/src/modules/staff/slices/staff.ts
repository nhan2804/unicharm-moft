import { createSlice } from "@reduxjs/toolkit";

export interface StaffState {
  currentCheckIn: string;
}

const initialState: StaffState = {
  currentCheckIn: "",
};

export const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setCurrentCheckIn: (state, action) => {
      state.currentCheckIn = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentCheckIn } = staffSlice.actions;

export default staffSlice.reducer;
