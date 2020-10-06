import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createClient, Provider, useQuery } from 'urql';
import { actions } from './reducer';

const useStyles = makeStyles({
  metricsContainer: {
    margin: '20px',
  },
  chipClass: {
    backgroundColor: '#ffffff',
    color: '#000000',
    marginRight: '4px',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `{
  getMetrics
}`;

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricsDataRecevied({ metrics: getMetrics }));
    dispatch(actions.metricsUpdateSelectedValue({ selectedMetrics: [getMetrics[0]] }));
  }, [dispatch, data, error]);

  const handleChange = (e: any) => {
    dispatch(actions.metricsUpdateSelectedValue({ selectedMetrics: e.target.value }));
  };

  if (fetching) return <LinearProgress />;
  return (
    <div className={classes.metricsContainer}>
      <Select
        multiple
        defaultValue={[data.getMetrics[0]]}
        onChange={handleChange}
        renderValue={(selected: any) => (
          <div>
            {selected.map((value: any) => (
              <Chip className={classes.chipClass} key={value} label={value} />
            ))}
          </div>
        )}
      >
        {data.getMetrics.map((d: string, i: number) => (
          <MenuItem key={i} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
