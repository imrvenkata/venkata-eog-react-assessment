import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as chartReducer } from '../Features/Chart/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  chart: chartReducer,
};
