import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createClient, defaultExchanges, Provider, subscriptionExchange, useSubscription } from 'urql';
import { withStyles } from '@material-ui/styles';

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', {});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const BoxWrapper = props => {
  return (
    <Provider value={client}>
      <Box currentTime={props.currentTime} />
    </Provider>
  );
};

export default BoxWrapper;

const getMetrics = state => {
  const { selectedMetrics } = state.metrics;
  return selectedMetrics;
};

const measurementSubscriptionQuery = `
subscription{
    newMeasurement{
        metric
        value
        unit
        at
    }
}
`;

const handleSubscription = (measurements, response) => {
  if (!measurements) {
    measurements = [];
  }
  return response.newMeasurement;
};

const Box = props => {
  const dispatch = useDispatch();
  const selectedMetrics = useSelector(getMetrics);

  const [val, setVal] = useState({
    oilTemp: {},
  });

  const [result] = useSubscription({ query: measurementSubscriptionQuery }, handleSubscription);

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error || !data) {
      return;
    }
    const newVal = { ...val, [data.metric]: data };
    setVal(newVal);
  }, [dispatch, data, error]);

  return (
    <Grid container direction="row" spacing={2}>
      {selectedMetrics.map((key, i) => {
        return (
          <Grid item xs={4} key={i}>
            <Card key={i}>
              <CardHeader title={key} />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Last Received"
                      secondary={val[key] ? `${val[key].value} ${val[key].unit}` : null}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
