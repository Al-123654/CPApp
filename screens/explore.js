import React, { Component } from 'react';
import {
    Platform, StyleSheet, View,
    Image, Alert,
    TouchableOpacity, TouchableHighlight
} from 'react-native';
import { createStackNavigator, NavigationActions, StackActions  } from 'react-navigation';
import {
    Container, Header, Left, Body, Right, Icon,
    Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Card, CardItem, ListItem,
    List, Toast, Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// const GET_USERS_URI = 'http://localhost:5000/api/users';
// const LOGOUT_URI = 'http://localhost:5000/logout';
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users';
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';
const GET_IMAGE_URI = 'https://app-api-testing.herokuapp.com/api/images';

class ExploreScreen extends Component {

    constructor(props) {
        super(props);
        //TODO: check if props.navigation.state.params exists
        console.log('[explore js] constructor - passedParams: ', props.navigation.state.params);

        // initialize state
        this.state = {
            searchTerm: null,
            listOfUsers: null,
            passedUserId: props.navigation.state.params.currentUserId,
            currentUserDetails: null,
            isListLoading: false,
            searchBtnPressed: false,
        };

        console.log('[explore js] constructor - State after init: ', this.state);
    }

    componentDidMount() {
        this.fetchCurrentUser();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("[explore js] componentDidUpdate!");
        console.log("[explore js] componentDidUpdate - prevState: ", prevState);
        console.log("[explore js] componentDidUpdate - curState: ", this.state);
        if (this.state.listOfUsers === null && this.state.currentUserDetails === null) {
            this.fetchCurrentUser();
            this.fetchUsers();
        }
    }

    fetchCurrentUser = () => {
        console.log("[explore js] fetchCurrentUser");
        fetch(GET_USERS_URI + '/' + this.state.passedUserId)
            .then(response => {
                console.log("[explore js] fetchCurrentUser - Response from api: ", response);
                if (response.status !== 200) {
                    Toast.show({
                        text: 'Lookup failed!',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 2000
                    });
                    return;
                }

                // if fetch ok
                response.json().then(respObj => {
                    console.log('[explore js] fetchCurrentUser - Response object: ', respObj);
                    console.log('[explore js] fetchCurrentUser - Lookup ok!!!');

                    if (respObj) {
                        this.setState({ currentUserDetails: respObj });
                    }
                });
            })
            .catch(error => console.log("[explore js] fetchCurrentUser - Error fetching search results: ", error));
    }

    fetchUsers = () => {
        console.log("[explore js] fetchUsers!");
        if (this.state.searchTerm) {
            fetch(GET_USERS_URI + '/?username=' + this.state.searchTerm)
                .then(response => {
                    console.log("[explore js] fetchUsers - Response from api: ", response);
                    if (response.status !== 200) {
                        Toast.show({
                            text: 'Search failed!',
                            buttonText: 'Ok',
                            position: 'top',
                            duration: 2000
                        });
                        return;
                    }

                    // if fetch ok
                    response.json().then(respObj => {
                        console.log('[explore js] fetchUsers - Response object: ', respObj);
                        console.log('[explore js] fetchUsers - Search ok!!!');
                        console.log('[explore js] fetchUsers - Response object data: ', respObj.data);

                        // check data contents
                        if (respObj.data) {
                            if (respObj.data.length === 0) {
                                // if no results
                                this.setState({
                                    listOfUsers: [],
                                    isListLoading: false,

                                });
                            } else {
                                // if more than one results
                                this.setState({
                                    listOfUsers: respObj.data,
                                    isListLoading: false,

                                });
                            }
                        }
                    });
                })
                .catch(error => console.log("[explore js] fetchUsers - Error fetching search results: ", error));
        }
        // if nothing entered in search field
        else {
            this.setState({
                listOfUsers: null,
                isListLoading: false,

            })
        }
    }

    //user enters data into search field
    onChangedSearchHandler = (text) => {
        // if user enters data into search field
        if (text && text.length >= 1) {
            console.log('[explore js] onChangedSearchHandler - text in searchbox: ', text);
            this.setState({ searchTerm: text });
        }
        // if user does not enter data into search field
        else {
            this.setState({ searchTerm: null });
        }
    }

    //user clicks search button
    onSubmitSearchHandler = () => {
        console.log("[explore js] onSubmitSearchHandler - Clicked search btn.");
        this.setState({
            listOfUsers: null,
            isListLoading: true,
            searchBtnPressed: true,
        });
        this.fetchUsers();
    }

    onBackBtnPressed = () => {
        console.log('[explore js] onBackBtnPressed');
        this.props.navigation.goBack();
    }

    onLogoutHandler = () => {

        Alert.alert(
            'Logging out',
            "",
            [
                {
                    text: 'OK', onPress: () => {
                        return fetch(LOGOUT_URI, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                Toast.show({
                                                                        text: 'Logout successful',
                                                                        buttonText: 'Ok',
                                                                        position: 'top',
                                                                        duration: 4000
                                                                });
                                console.log("[explore js] onLogoutPressHandler - LOGGING OUT!");
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                    }
                },
                {
                    text: 'Cancel', onPress: () => {
                        style: 'cancel'
                    }
                }
            ]
        )

    }

    // Clicking the follow button
    onListItemPressed = (itemId, userId) => {
        console.log('[explore js] onListItemPressed - itemID: ', itemId);
        console.log('[explore js] onListItemPressed - itemID type: ', typeof itemId);
        console.log('[explore js] onListItemPressed - userID: ', userId);

        return fetch(GET_USERS_URI,
            {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    following: itemId
                })
            })
            .then(response => {
                console.log('[explore js] onListItemPressed - response: ', response);
                if (response.status !== 200) {
                    console.log('[explore js] onListItemPressed - bad response: ', response);
                    return;
                }
                response.json().then(data => {
                    console.log('[explore js] onListItemPressed - json response: ', data);
                    this.setState({
                        listOfUsers: null,
                        currentUserDetails: null,
                        isListLoading: true
                    });
                });
            })
            .catch(err => console.log('[explore js] onListItemPressed - error: ', err));
    }

    // Clicking user icon
    onUserPagePress = (itemId, itemFname, itemLname, itemImages, itemUsername,
        itemFollowing, itemRole, previousId, coordinates, title, profile_pic) => {

        console.log('[explore js] Testing onUserPagePress');
        console.log('[explore js] item._id: ', itemId);
        console.log('[explore js] item.fname: ', itemFname);
        console.log('[explore js] item.lname: ', itemLname);
        console.log('[explore js] item.images: ', itemImages);
        console.log('[explore js] item.username: ', itemUsername);
        console.log('[explore js] item.following: ', itemFollowing);
        console.log('[explore js] item.role: ', itemRole);
        console.log('[explore js] passedId: ', previousId);
        console.log('[explore js] item.coordinates: ', coordinates)
        console.log('[explore js] item.title: ', title)
        console.log('[explore js] item.profile_pic: ', profile_pic)

        console.log('TESTING 123')
        if (itemRole === 1) {
            this.props.navigation.navigate({
                key: 'UserPage1', routeName: 'User', params: {
                    userId: itemId,
                    fname: itemFname,
                    lname: itemLname,
                    images: itemImages,
                    username: itemUsername,
                    following: itemFollowing,
                    role: itemRole,
                    previousId: previousId
                }
            });
        } else {
            this.props.navigation.navigate({
                key: 'RestaurantPage1', routeName: 'Restaurant', params: {
                    userId: itemId,
                    username: itemUsername,
                    images: itemImages,
                    following: itemFollowing,
                    role: itemRole,
                    previousId: previousId,
                    coordinates: coordinates,
                    title: title,
                    profile_pic: profile_pic
                }
            })
        }


    }

    render() {

        let jsxList = null;
        if (this.state.isListLoading) {
            jsxList = (<Spinner />);
        }

        if (this.state.listOfUsers !== null && this.state.currentUserDetails !== null) {
            console.log("[explore js] render - listOfUsers: ", this.state.listOfUsers);
            console.log("[explore js] render - currentUserDetails: ", this.state.currentUserDetails);
            console.log("[explore js] render - followingList: ", this.state.currentUserDetails.following);

            let listOfUsersCopy = [...this.state.listOfUsers];
            let followingList = [...this.state.currentUserDetails.following];
            let isFollowedCount = 0;

            // loop through list of users, comparing ids with following list
            for (var i = 0; i < listOfUsersCopy.length; i++) {
                console.log('[explore js] render - ID lisOfUsersCopy: ', listOfUsersCopy[i]._id);
                for (var j = 0; j < followingList.length; j++) {
                    console.log('[explore js] render - ID followingList: ', followingList[j]);
                    if (listOfUsersCopy[i]._id == followingList[j]) {
                        console.log('[explore js] render - Found a match!');
                        listOfUsersCopy[i].isFollowed = true;
                        isFollowedCount++;
                    }
                }
            }

            console.log("[explore js] render - listOfUsersCopy after for loop: ", listOfUsersCopy);
            console.log("[explore js] render - isFollowedCount: ", isFollowedCount);

            jsxList = (
                <List dataArray={listOfUsersCopy}
                    renderRow={(item) =>
                        item.profile_pic ?
                            <ListItem avatar>
                                <Left>
                                    <Thumbnail small
                                        source={{ uri: GET_IMAGE_URI + '/' + item.profile_pic + '/display' }}
                                    />
                                </Left>
                                <Body>
                                    <Text
                                        onPress={() => this.onUserPagePress(item._id,
                                            item.fname, item.lname, item.images, item.username, item.following, item.role,
                                            this.state.passedUserId, item.coordinates, item.title, item.profile_pic)
                                        } >
                                        {item.title || item.username}</Text>
                                    <Text
                                        style={{ fontSize: 13 }}
                                        onPress={() => this.onUserPagePress(item._id,
                                            item.fname, item.lname, item.images, item.username, item.following, item.role,
                                            this.state.passedUserId, item.coordinates, item.title, item.profile_pic)
                                        }
                                    >
                                        {item.title ? item.username : ''}
                                    </Text>
                                </Body>
                                <Right>
                                    <Button bordered primary small
                                        onPress={() => this.onListItemPressed(item._id, this.state.passedUserId)}>
                                        <Text>{item.isFollowed ? 'Unfollow' : 'Follow'}</Text>
                                    </Button>
                                </Right>
                            </ListItem>
                            :
                            <ListItem icon>
                                <Left>
                                    <Icon fontSize="36" name="ios-contact-outline" />
                                </Left>
                                <Body>
                                    <Text
                                        onPress={() => this.onUserPagePress(item._id,
                                            item.fname, item.lname, item.images, item.username, item.following, item.role,
                                            this.state.passedUserId, item.coordinates, item.title, item.profile_pic)
                                        } >
                                        {item.title || item.username}
                                    </Text>
                                    <Text style={{ fontSize: 13 }}>{item.title ? item.username : ''}</Text>
                                </Body>
                                <Right>
                                    <Button bordered primary small
                                        onPress={() => this.onListItemPressed(item._id, this.state.passedUserId)}
                                    >
                                        <Text>{item.isFollowed ? 'Unfollow' : 'Follow'}</Text>
                                    </Button>
                                </Right>
                            </ListItem>
                    }>
                </List>
            );
        }
        else if (this.state.listOfUsers == null && this.state.searchBtnPressed && !this.state.isListLoading) {
            jsxList = (<Text>Enter search query</Text>)
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>Explore</Title></Body>
                    <Right>
                        <Button transparent onPress={this.onLogoutHandler}>
                            <Icon name='home' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Grid style={{ padding: 10 }}>
                        <Row>
                            <Item style={{ width: '100%' }}>
                                <Icon name="ios-search" />
                                <Input placeholder="Search" onChangeText={(text) => this.onChangedSearchHandler(text)}
                                    onSubmitEditing={this.onSubmitSearchHandler}
                                />
                            </Item>
                        </Row>
                        <Row>
                            <Button transparent onPress={this.onSubmitSearchHandler}>
                                <Text>Search</Text>
                            </Button>
                        </Row>
                        <Row>
                            {jsxList}
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    outerList: {
        marginTop: 0
    },
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictures: {
        flex: 1, flexDirection: 'row',
        width: '80%',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 75,
        height: 75,
    }
});

module.exports = ExploreScreen;
