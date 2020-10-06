import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { createClient, Provider, useQuery } from 'urql';
import { IState } from '../../store';
import { actions } from './reducer';

const COLOR_MAP = ['#800000', '#000075', '#3cb44b', '#f58231', '#a9a9a9', '#000000'];
const useStyles = makeStyles({
  chartContainer: {
    margin: '20px',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `query($input: [MeasurementQuery]){
  getMultipleMeasurements(input: $input){
    metric
    measurements{
      metric
      at
      value
      unit
    }
  }
}`;

export type ChartWrapperProps = {
  currentTime: number;
};

const getMetrics = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  return selectedMetrics;
};

const ChartWrapper = (props: ChartWrapperProps) => {
  return (
    <Provider value={client}>
      <Chart currentTime={props.currentTime} />
    </Provider>
  );
};

export default ChartWrapper;

interface ISomeObject {
  [key: string]: string;
}
interface KSomeObject {
  id: string;
  unit: string;
}

const Chart = (props: ChartWrapperProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedMetrics = useSelector(getMetrics);
  const chartDimensions = {
    width: 800,
    height: 500,
  };
  const input: any = [];

  selectedMetrics.forEach(sm => {
    input.push({
      metricName: sm,
      after: props.currentTime - 30 * 60 * 1000,
      before: props.currentTime,
    });
  });

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.chartApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  if (!data.getMultipleMeasurements || !data.getMultipleMeasurements.length) {
    return null;
  }

  const K: KSomeObject[] = [];
  const chartData: ISomeObject[] = [];

  data.getMultipleMeasurements.forEach((mes: any) => {
    K.push({ id: mes.metric, unit: mes.measurements[0].unit });
  });

  data.getMultipleMeasurements[0].measurements.forEach((mes: any, i: number) => {
    let obj: ISomeObject = {};
    K.forEach((met: KSomeObject, j: number) => {
      obj[met.id] = data.getMultipleMeasurements[j].measurements[i].value;
    });
    const date = new Date(mes.at);
    obj['at'] = `${date.getHours()}:${date.getMinutes()}`;
    chartData.push(obj);
  });

  return (
    <div className={classes.chartContainer}>
      <Paper>
        <ResponsiveContainer height={chartDimensions.height}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            {K.map((m: KSomeObject, i: number) => {
              return (
                <Line
                  type="monotone"
                  yAxisId={m.id}
                  dataKey={m.id}
                  stroke={COLOR_MAP[i]}
                  dot={false}
                  key={`${i}-line`}
                />
              );
            })}
            <Tooltip />
            <XAxis dataKey="at" interval="preserveStartEnd" tickCount={6} />
            {K.map((m: KSomeObject, i: number) => {
              return <YAxis yAxisId={m.id} key={i} label={{ value: m.unit, angle: 90, position: 'insideLeft' }} />;
            })}
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};
