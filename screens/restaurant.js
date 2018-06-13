import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { createStackNavigator, NavigationActions, StackActions } from 'react-navigation';
// import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Gallery from '../components/Gallery/Gallery';
import MapView, { Marker } from 'react-native-maps';

// const ALL_USER_URI = 'http://localhost:5000/api/users?followedList=1&userid='
// const LOGOUT_URI = 'http://localhost:5000/logout'
// const GET_USERS_URI = 'http://localhost:5000/api/users/';
// const GET_FOLLOWED_BY = 'http://localhost:5000/api/users?usersFollowing=1&userid='
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_FOLLOWED_BY = 'https://app-api-testing.herokuapp.com/api/users?usersFollowing=1&userid='
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class RestaurantScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        console.log('[restaurant js]constructor - params:', this.props.navigation.state);


        // INITIALISE STATES
        this.state = {
            restaurantID: this.props.navigation.state.params.userId,// id of restaurant
            restaurantTitle: this.props.navigation.state.params.title,
            food: this.props.navigation.state.params.images,
            loggedID: this.props.navigation.state.params.previousId,// id of user viewing profile
            locationSaved: null,
            restaurantCoord: this.props.navigation.state.params.coordinates,
            followedUsers: "",
            profilePic: this.props.navigation.state.params.profile_pic,
            // savedLocationBtn: false
        }
        console.log('[restaurant js] constructor - Restaurant ID: ', this.state.restaurantID)
        console.log('[restaurant js] constructor - Name of restaurant: ', this.state.restaurantTitle)
        console.log('[restaurant js] constructor - Restaurant Image: ', this.state.food[0])
        console.log('[restaurant js] constructor - Food: ', this.state.food)
        console.log('[restaurant js] constructor - restaurantCoord', this.state.restaurantCoord)
        console.log('[restaurant js] constructor - profilePic', this.state.profilePic)
        console.log('[restaurant js] constructor - image uri + profilePic: ', GET_IMAGES_URI + this.state.profilePic + '/display')
    }
    componentDidMount = () => {
        this.getLocationSaved();
        this.displayFollowed();
    }

    onLogoutHandler = () => {

        Alert.alert(
            'Log out?',
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
                                })

                                console.log("[user js] onLogoutPressHandler - LOGGING OUT!");
                                const resetAction = StackActions.reset({
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
    onBackBtnPressed = () => {
        console.log('[user js] onBackBtnPressed');
        this.props.navigation.goBack();
    }
    onImageClicked = (imageId, passedId) => {
        console.log("[user js] onImageClicked - imageId: ", imageId);
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[user js] onImageClicked - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Images1', routeName: 'Image', params: {
                        data: response,
                        userId: passedId,
                        userData: this.props.navigation.state.params,
                        imagesDisplayed: this.state.userImages
                    }
                })
            })
            .catch(error => console.error('Error: ', error));
    };

    onImageLongClick = (imageId, passedId) => {
        console.log('[user js] onImageLongClick!!')
    }

    // get followed
    displayFollowed = () => {
        fetch(GET_FOLLOWED_BY + this.state.restaurantID, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {

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
                console.log('[restaurant js] displayFollowed - respObj:', respObj)

                this.setState({
                    followedUsers: respObj
                })

            }).catch(error => console.error('Error: ', error));

        })
    }

    //CHECK THE API TO SEE IF USER HAS SAVED THIS RESTAURANT AND DISPLAY THE CORRECT PROMPT
    getLocationSaved = () => {
        //variable to store the latitude from api
        let serverLat;
        //variable to store the longtitude from api
        let serverLng;

        // fetch data from api
        return fetch(GET_USERS_URI + this.state.loggedID, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        }).then(response => {
            console.log('[restaurant js] getLocationSaved - response: ', response);
            if (response.status !== 200) {
                console.log('[restaurant js] getLocationSaved - bad response: ', response);
                return;
            }
            response.json().then(data => {
                console.log('[restaurant js] getLocationSaved - json response: ', data);
                console.log('[restaurant js] getLocationSaved - data.locations: ', data.locations)
                console.log('[restaurant js] getLocationSaved - data.locations.length: ', data.locations.length)
                if (data.locations.length > 0) {
                    // loop through all available saved restaurants
                    for (i = 0; i != data.locations.length; i++) {
                        console.log('restaurant js getLocationSaved -  data.locations at for loop: ', data.locations)
                        console.log('restaurant js getLocationSaved -  data.locations.lat at for loop: ', data.locations[i].lat)
                        serverLat = data.locations[i].lat
                        serverLng = data.locations[i].lng
                        console.log('[restaurant js] getLocationSaved - serverLat: ', serverLat);
                        console.log('[restaurant js] getLocationSaved - serverLng: ', serverLng);
                        console.log('[restaurant js] getLocationSaved - this.state.restaurantCoord.lat: ', this.state.restaurantCoord.lat)
                        console.log('[restaurant js] getLocationSaved - this.state.restaurantCoord.lng: ', this.state.restaurantCoord.lng)

                        //check if the restaurant's latitude and longtitude matches with saved latitude and longtitude from server
                        if (serverLat == this.state.restaurantCoord.lat && serverLng == this.state.restaurantCoord.lng) {
                            this.setState({
                                locationSaved: true,

                            })
                            break;
                        }
                    }
                    console.log('[restaurant js] getLocationSaved - this.state.locationSaved: ', this.state.locationSaved);

                } else {
                    this.setState({
                        locationSaved: false,

                    })
                }
            });
        }).catch(err => console.log('[restaurant js] getLocationSaved - error: ', err));

    }

    // SAVE/REMOVE LOCATION DATA TO API 
    onLocationSave = () => {
        // initialise variables to store new marker to save
        let newMarker;
        let markerLat;
        let markerLng;

        return fetch(GET_USERS_URI, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    id: this.state.restaurantID,
                    lat: this.state.restaurantCoord.lat,
                    lng: this.state.restaurantCoord.lng,
                },
            })
        }).then(response => {
            console.log('[restaurant js] onLocationSavePressed - response: ', response);
            if (response.status !== 200) {
                console.log('[restaurant js] onLocationSavePressed - bad response: ', response);
                return;
            }
            response.json().then(data => {
                console.log('[restaurant js] onLocationSavePressed-  data.locations: ', data.updatedUser.locations)
                console.log('[restaurant js] onLocationSavePressed-  this.state.restaurantCoord: ', this.state.restaurantCoord)
                newMarker = data.updatedUser.locations.map(markers => {
                    markerLat = markers.lat
                    markerLng = markers.lng
                })
                console.log('[restaurant js] onLocationSavePressed - markerLat: ', markerLat);
                console.log('[restaurant js] onLocationSavePressed - markerLng: ', markerLng);

                //check if newly added marker matches restaurant coordinates
                if (markerLat == this.state.restaurantCoord.lat && markerLng == this.state.restaurantCoord.lng) {
                    this.setState({
                        locationSaved: true,

                    })
                    Toast.show({
                        text: 'Location saved',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 4000
                    })
                } else {
                    this.setState({
                        locationSaved: false,

                    })
                    Toast.show({
                        text: 'Location removed',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 4000
                    })

                }
            });
            // console.log('[restaurant js] onLocationSavePressed - locationSaved: ', this.state.locationSaved);

        }).catch(err => console.log('[restaurant js] onLocationSavePressed - error: ', err));
    }


    render() {
        let displayFood = (<Spinner />);
        if (this.state.food.length >= 1) {
            displayFood = (<Gallery
                images={this.state.food}
                clicked={this.onImageClicked}
                longclick={this.onImageLongClick}
                passedUserId={this.state.userId}
            />)
        } else {
            displayFood = (<Text>No food available</Text>)
        }

        let regionCoordinates = ({
            latitude: Number(this.state.restaurantCoord.lat),
            longitude: Number(this.state.restaurantCoord.lng),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
        })
        console.log('[restaurant js] render - regionCoordinates: ', regionCoordinates)

        let restaurantMarker = ({
            latitude: Number(this.state.restaurantCoord.lat),
            longitude: Number(this.state.restaurantCoord.lng)
        })

        let markerButton = (<Spinner />);
        console.log('[restaurant js] render - locationSaved: ', this.state.locationSaved);
        if (!this.state.locationSaved) {
            markerButton = (
                <Button onPress={this.onLocationSave}>
                    <Text>Save location</Text>
                </Button>
            )

        } else if (this.state.locationSaved) {
            markerButton = (
                <Button onPress={this.onLocationSave}>
                    <Text>Remove location</Text>
                </Button>
            )
        }
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>{this.state.restaurantTitle}</Title></Body>
                    <Right>
                        <Button transparent onPress={this.onLogoutHandler}>
                            <Icon name='home' />
                        </Button>
                    </Right>
                </Header>
                <Container>
                    <Content>
                        <Row style={{ marginTop: 10 }}>
                            {/* display restaurant picture */}
                            <Thumbnail style={{ marginLeft: 20 }} large source={{ uri: GET_IMAGES_URI + this.state.profilePic + '/display' }} />

                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text>{this.state.food.length}</Text>
                                <Label> Meals</Label>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text>{this.state.followedUsers.length}</Text>
                                <Label> Followers</Label>
                            </View>
                        </Row>
                        <Row>
                            <Label style={{
                                marginLeft: 20, marginTop: 20, alignItems: 'center',
                                fontSize: 20, fontWeight: 'bold'
                            }}
                            >
                                Food available:
                            </Label>
                        </Row>
                        <Row style={{ marginLeft: 50, marginTop: 20, alignItems: 'center' }}>
                            {displayFood}
                        </Row>

                        <Row>
                            <Label style={{
                                marginLeft: 125, alignItems: 'center', marginTop: 20,
                                fontSize: 20, fontWeight: 'bold'
                            }}>
                                Map of restaurant
                            </Label>
                        </Row>
                        <Row style={{ alignItems: 'center', marginTop: 20 }}>
                            <MapView
                                ref={map => this.map = map}
                                style={styles.mapContainer}
                                initialRegion={regionCoordinates}
                            >
                                <Marker
                                    coordinate={restaurantMarker}
                                    title={this.state.restaurantTitle}
                                />
                            </MapView>
                        </Row>
                    </Content>
                </Container>
                <Footer>
                    <FooterTab >
                        {markerButton}
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '85%',
        height: 250,
        // flex: 1,
        position: 'relative',
        // marginLeft: 50,
        // alignItems:'center'
    },
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: 350
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center"
    },

    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    }
})
module.exports = RestaurantScreen;