import React from 'react';
import { StyleSheet, ListView, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {

constructor() {
  super();
  this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  this.state = {
    countries: []
  }
}

getCountries() {
  // Airtable API endpoint, replace with your own
  let airtableUrl = "https://api.airtable.com/v0/appEycGrh382kPcPx/countries%20visited/?sort%5B0%5D%5Bfield%5D=country&sort%5B0%5D%5Bdirection%5D=asc";

  // Needed for Airtable authorization, replace with your own API key
  let requestOptions = {
    headers: new Headers({
      'Authorization': 'Bearer keygO1DvVmTMI5b28'
    })
  };

  // Form the request
  let request = new Request(airtableUrl, requestOptions);

  // Make the request
  fetch(request).then(response => response.json()).then(json => {
    this.setState({
      countries: json.records
    });
  });
}

// Runs when the application loads (i.e. the "App" component "mounts")
componentDidMount() {
  this.getCountries(); // refresh the list when we're done
}

// Upvote an idea
upvoteCountries(data, secId, rowId, rowMap) {
  // Slide the row back into place
  rowMap[`${secId}${rowId}`].props.closeRow();

  // Airtable API endpoint
  let airtableUrl = "https://api.airtable.com/v0/appEycGrh382kPcPx/countries%20visited/" + data.id;

  // Needed for Airtable authorization
  let requestOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Authorization': 'Bearer keygO1DvVmTMI5b28', // replace with your own API key
      'Content-type': 'application/json'
    }),

    body: JSON.stringify({
      fields: {
        visited: data.fields.visited + 1
      }
    })
  };

  // Form the request
  let request = new Request(airtableUrl, requestOptions);

  // Make the request
  fetch(request).then(response => response.json()).then(json => {
    this.getCountries(); // refresh the list when we're done
  });
}

// Downvote an idea
downvoteCountries(data, secId, rowId, rowMap) {
  // Slide the row back into place
  rowMap[`${secId}${rowId}`].props.closeRow();

  // Airtable API endpoint
  let airtableUrl = "https://api.airtable.com/v0/appEycGrh382kPcPx/countries%20visited/" + data.id;

  // Needed for Airtable authorization
  let requestOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Authorization': 'Bearer keygO1DvVmTMI5b28', // replace with your own API key
      'Content-type': 'application/json'
    }),
    body: JSON.stringify({
      fields: {
        visited: data.fields.visited - 1
      }
    })
  };

  // Form the request
  let request = new Request(airtableUrl, requestOptions);

  // Make the request
  fetch(request).then(response => response.json()).then(json => {
    this.getCountries(); // refresh the list when we're done
  });
}

// The UI for each row of data
renderRow(data) {
  return (
    <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Body>
        <Text>{data.fields.country}</Text>
      </Body>
      <Right>
        <Text note>{data.fields.visited} visited</Text>
      </Right>
    </ListItem>
  )
}

// The UI for what appears when you swipe right
renderSwipeRight(data, secId, rowId, rowMap) {
  return (
    <Button full success onPress={() => this.upvoteCountries(data, secId, rowId, rowMap)}>
      <Icon active name="thumbs-up" />
    </Button>
  )
}

// The UI for what appears when you swipe left
renderSwipeLeft(data, secId, rowId, rowMap) {
  return (
    <Button full danger onPress={() => this.downvoteCountries(data, secId, rowId, rowMap)}>
      <Icon active name="thumbs-down" />
    </Button>
  )
}

render() {
  let rows = this.ds.cloneWithRows(this.state.countries);
  return (
    <Container>
      <Header>
        <Body>
          <Title>Countries Visited</Title>
        </Body>
      </Header>
      <Content>
        <List
          dataSource={rows}
          renderRow={(data) => this.renderRow(data)}
          renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
          renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </Content>
    </Container>
  );
}
}
