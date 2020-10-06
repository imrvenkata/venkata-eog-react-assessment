import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metrics: [];
};
export type SelectedMetrics = {
  selectedMetrics: string[];
};

export type ApiErrorAction = {
  error: string;
};

interface InitialState {
  metrics: any[];
  selectedMetrics: string[];
}

const initialState: InitialState = {
  metrics: [],
  selectedMetrics: [],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<Metrics>) => {
      const { metrics } = action.payload;
      state.metrics = metrics;
    },
    metricsUpdateSelectedValue: (state, action: PayloadAction<SelectedMetrics>) => {
      const selectedmetrics: string[] = action.payload.selectedMetrics;
      state.selectedMetrics = selectedmetrics;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
