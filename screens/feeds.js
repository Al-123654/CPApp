import React, { Component } from 'react';
import { 
	Platform, Dimensions, StyleSheet, View, Image, 
	Alert , TouchableOpacity, TouchableHighlight, YellowBox} from 'react-native';
// import { StackNavigator, NavigationActions  } from 'react-navigation';
import { createStackNavigator, NavigationActions, StackActions} from 'react-navigation';
// import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Item, Input, 
	Form, Label, Thumbnail, Footer, FooterTab, Spinner, Toast, Drawer,
	Card, CardItem, ListItem, List } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Gallery from '../components/Gallery/Gallery';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import MapView, { Marker , PROVIDER_GOOGLE} from 'react-native-maps';
// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
// AIzaSyDGlZ-Zj1QuEX-u_77q2YZg3hRe1yEptM4

// const GET_USERS_URI = 'http://localhost:5000/api/users/';
// const GET_USERS_FOLLOWED_URI = 'http://localhost:5000/api/users?followed=followed';
// const GET_FOOD_URI = 'http://localhost:5000/api/images/';
// const LOGOUT_URI = 'http://localhost:5000/logout';
// const GET_RESTAURANT_USERS_URI = 'http://localhost:5000/api/users?user=2';

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_RESTAURANT_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users?user=2';
// const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/images/';
const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=1';
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';
const UPLOAD_URI = 'https://app-api-testing.herokuapp.com/upload';
const GET_FOOD_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class FeedsScreen extends Component {
	constructor(props) {
		super(props);
		
        // call props.navigation.state.params here
		const { params } = this.props.navigation.state;
		console.log('[feeds js] constructor - Data carried over: ', this.props.navigation.state);
		console.log('[feeds js] constructor - GET_USERS_URI: ', GET_USERS_URI)
		console.log('[feeds js] constructor - GET_RESTAURANT_USERS_URI: ', GET_RESTAURANT_USERS_URI)
		console.log('[feeds js] constructor - GET_USERS_FOLLOWED_URI: ', GET_USERS_FOLLOWED_URI)
		console.log('[feeds js] constructor - LOGOUT_URI: ', LOGOUT_URI)
		console.log('[feeds js] constructor - UPLOAD_URI: ', UPLOAD_URI)
		console.log('[feeds js] constructor - GET_FOOD_URI: ', GET_FOOD_URI)
        //initialize states
        this.state = {
			passedUsername : props.navigation.state.params.data.username,
			fname : props.navigation.state.params.data.fname,
			lname : props.navigation.state.params.data.lname,
			email : props.navigation.state.params.data.email,
			passedId : props.navigation.state.params.data._id,
			images : props.navigation.state.params.data.images,
			followed : props.navigation.state.params.data.following,
			feedImagesArray: props.navigation.state.params.processedImages ?  props.navigation.state.params.processedImages : null,
			areImagesLoaded: false,
			disableButtonLogout: false,
			isLoggedOut: false,
			role: props.navigation.state.params.data.role,
			imageIdToDelete : props.navigation.state.params.imageIdToDelete ?  props.navigation.state.params.imageIdToDelete : null,
			userImages: null,
			followedImages: null,
			restaurantUsers: null,
			locations: props.navigation.state.params.data.locations,
			mapRegion: null,
			mapMarkers: [],
			mapDisplay: null
			
			
		};
		this.goToRestaurant = this.goToRestaurant.bind(this);
		this._renderItem = this._renderItem.bind(this);
		console.log('[feeds js] constructor - Current states:', this.state);	
	}

	//GET RESTAURANT DATA FROM SERVER
	fetchRestaurantUsers = () => {
		let restaurantTitle;
		let title= [];
		let restaurantCoordinates;
		let coordinates;
		let id = [];
		return fetch(GET_RESTAURANT_USERS_URI, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			console.log('[feeds js] fetchRestaurantUsers - response: ', response);
			if (response.status !== 200) {
				console.log('[feeds js] fetchRestaurantUsers - bad response: ', response);
				console.log('[feeds js] fetchRestaurantUsers - Cannot fetch restaurants')
				return;
			}
			response.json().then(data => {
				console.log('[feeds js] fetchRestaurantUsers - json response: ', data);
				console.log('[feeds js] fetchRestaurantUsers - fetched Restaurants')
				
				this.setState({restaurantUsers: [...data],});
				console.log('[feeds js] fetchRestaurantUsers - this.state.restaurantUsers: ', this.state.restaurantUsers);
				this.setMapMarkers();
			});
		}).catch((error) => {
			console.log('[feeds js] fetchRestaurantUsers - error: ', error);
		});
		
		
	}

	//setting up carousel elements for rendering
	_renderItem ({item, index}, parallaxProps) {
		console.log('[feeds js] _renderItem - item: ', item);
		console.log('[feeds js] _renderItem - item._id: ', item._id);
		console.log('[feeds js] _renderItem - item.username: ', item.username);
		console.log('[feeds js] _renderItem - item.role: ', item.role);
		console.log('[feeds js] _renderItem - item.coordinates: ', item.coordinates);
		console.log('[feeds js] _renderItem - item.title: ', item.title);
		console.log('[feeds js] _renderItem - item.profile_pic: ', item.profile_pic);
		console.log('[feeds js] _renderItem - item.following: ', item.following);
		console.log('[feeds js] _renderItem - item.images: ', item.images);
		
        return (
			<View style={styles.item}>
				<TouchableOpacity onPress = {() => {this.goToRestaurant(item)}}
				>
					<ParallaxImage
						source={{ uri: GET_FOOD_URI + item.images[0] + '/display' }}
						containerStyle={styles.imageContainer}
						style={styles.image}
						parallaxFactor={0.2}
						{...parallaxProps} />

				</TouchableOpacity>
				<Text style={styles.title} numberOfLines={2}>
					{ item.username }
				</Text>
			</View>
        );
	}
	// function for carousel to navigate to restaurant after click
	goToRestaurant = (item) => {
		console.log('[feeds js] testFunction - Carousel image pressed');
		console.log('[feeds js] goToRestaurant - item: ', item)
		this.props.navigation.navigate({
			key: 'RestaurantPage1', routeName: 'Restaurant', params: {
				userId: item._id,
				username: item.username,
				images: item.images,
				following: item.following,
				role: item.role,
				previousId: this.state.passedId,
				coordinates: item.coordinates,
				title: item.title,
				profile_pic: item.profile_pic
			}
		})
		
	}
	//componentDidMount
	componentDidMount = () => {
		if(this.state.imageIdToDelete){
			console.log("[feeds js] componentDidMount - feedImagesArray from images: ", this.state.feedImagesArray);
			console.log("[feeds js] componentDidMount - imageIdToDelete: ", this.state.imageIdToDelete);
			// runs only if deleting using btn from images js
			this.onImageDelete(this.state.imageIdToDelete);
		}else{
			this.getUserImages();
			this.getFollowedImages();
		}
		// map-view related setup
		// this.setRegionBasedOnMarkers();
		this.fetchRestaurantUsers();
		// this.setMapMarkers();
	}

	componentDidUpdate(prevProps, prevState){
		console.log("[feeds js] componentDidUpdate - is imageIdToDelete set? ", this.state.imageIdToDelete);
		console.log("[feeds js] componentDidUpdate - is userImages set? ", this.state.userImages);
		console.log("[feeds js] componentDidUpdate - is followedImages set? ", this.state.followedImages);
		console.log("[feeds js] componentDidUpdate - is feedImagesArray set? ", this.state.feedImagesArray);

		// load user images and followed images only when states are available
		if( this.state.imageIdToDelete === null && this.state.userImages !== null && this.state.followedImages !== null && this.state.feedImagesArray === null ){
			console.log("[feeds js] componentDidUpdate - state update!");
			this.setState({
				feedImagesArray: [...this.state.userImages, ...this.state.followedImages ],
				areImagesLoaded: true
			});
		}
	}

	setRegionBasedOnMarkers = () => {
		
		// adjust location array to meet requirements of calculateRegionBasedOnMarkers()
		let adjustedLocationsArray = this.state.locations.map(location => {
			return {
				latitude: Number(location.lat),
				longitude: Number(location.lng)
			}
		});
		console.log("[feeds js] calculateRegionBasedOnMarkers - adjustedLocationsArray: ", adjustedLocationsArray);

		// calculate new region
		const adjustedRegion = this.calculateRegionBasedOnMarkers(adjustedLocationsArray);
		console.log("[feeds js] calculateRegionBasedOnMarkers - adjustedRegion: ", adjustedRegion);
		
		this.setState({mapRegion: adjustedRegion});
	}

	calculateRegionBasedOnMarkers = (points) => {
		console.log('[feeds js] getRegion- points: ', points)
		if(points.length > 0){
			let minX, maxX, minY, maxY;

			// init first point
			((point) => {
				console.log('[feeds js] getRegion- point: ', point)
				minX = point.latitude;
				maxX = point.latitude;
				minY = point.longitude;
				maxY = point.longitude;
				console.log('[feeds js] getRegion- minX at 1st point: ', minX);
				console.log('[feeds js] getRegion- maxX at 1st point: ', maxX);
				console.log('[feeds js] getRegion- minY at 1st point: ', minY);
				console.log('[feeds js] getRegion- maxY at 1st point: ', maxY);
			})(points[0]);

			// calculate rect
			points.map((point) => {
				minX = Math.min(minX, point.latitude);
				maxX = Math.max(maxX, point.latitude);
				minY = Math.min(minY, point.longitude);
				maxY = Math.max(maxY, point.longitude);
				console.log('[feeds js] getRegion- minX after .map: ', minX);
				console.log('[feeds js] getRegion- maxX after .map: ', maxX);
				console.log('[feeds js] getRegion- minY after .map: ', minY);
				console.log('[feeds js] getRegion- maxY after .map: ', maxY);
			});

			const midX = (minX + maxX) / 2;
			const midY = (minY + maxY) / 2;
			const deltaX = (maxX - minX);
			const deltaY = (maxY - minY);

			console.log('[feeds js] getRegion- midX: ', midX);
			console.log('[feeds js] getRegion- midY: ', midY);
			console.log('[feeds js] getRegion- deltaX: ', deltaX);
			console.log('[feeds js] getRegion- deltaY: ', deltaY);
			console.log('[feeds js] getRegion- deltaX + 0.5: ', deltaX + 0.5);
			console.log('[feeds js] getRegion- deltaY + 0.5: ', deltaY + 0.5);
			
			return {
				latitude: midX,
				longitude: midY,
				latitudeDelta: deltaX + 0.5,
				longitudeDelta: deltaY + 0.5
			}
		}
		else{
			return{
				latitude: 4.5353,
				longitude: 114.7277,
				latitudeDelta: 0.5,
				longitudeDelta: 0.5
			}	
		}
	}

	// display markers of saved restaurants
	setMapMarkers = () => {
	
		
		let mapMarkers = (<Text>No markers available</Text>);
		

		if(this.state.restaurantUsers != null){
			var locations = this.state.locations;
			var restUsers = this.state.restaurantUsers;
			console.log('[feeds js] setMapMarkers - locations: ', locations);
			console.log('[feeds js] setMapMarkers - restUsers: ', restUsers	);

			var locationsUpdated = [];

			var locationsLength = this.state.locations.length;
			var restUsersLength = this.state.restaurantUsers.length;

			console.log ('[feeds js] setMapMarkers - locationsLength: ', locationsLength)
			console.log ('[feeds js] setMapMarkers - restUsersLength: ', restUsersLength)

			// loop through locations
			for (var i = 0; i < locationsLength; i++) {
				console.log("LOCATIONS ID: ", locations[i].id);

				// loop through restUsers
				for (var j = 0; j < restUsersLength; j++) {
					console.log("REST ID: ", restUsers[j]._id);
					if (locations[i].id == restUsers[j]._id) {
						locationsUpdated.push({
							id: locations[i].id,
							lat: locations[i].lat,
							lng: locations[i].lng,
							title: restUsers[j].title
						});
					}
					// display markers on map
					mapMarkers = locationsUpdated.map(location => {
						console.log('[feeds js] setMapMarkers - location: ', location)
						
						return (
							<Marker
								key={location.id}
								coordinate={{
									latitude: Number(location.lat),
									longitude: Number(location.lng)
								}}
								title={location.title}
							/>
						);
					});
				}
			}
			// update state
			this.setState({ mapMarkers: mapMarkers })
		}
	}
	
	// prompt to delete images
	onImageDelete = (imageId) => {
		if(this.state.imageIdToDelete){
			this.deleteImage(imageId);
		}else{
			Alert.alert(
				'Delete image?',
				'This cannot be undone',
				[
					{
						text: 'OK', onPress: () => { this.deleteImage(imageId); }
					},
					{
						text: 'Cancel', onPress: () => { style: 'cancel' }
					}
				]
			)
		}	
	}
	// delete image from server if user is a particular role
	deleteImage = (imageId) => {
		let newImageArray = [...this.state.feedImagesArray];
		console.log('[feeds js] deleteImage - Current array of images: ', newImageArray);
		console.log('[feeds js] deleteImage - Image Id to delete: ', imageId);
		console.log('[feeds js] deleteImage - Index to delete: ', newImageArray.findIndex(function (el) {
			return el === imageId;
		}));
		let deleteIndex = newImageArray.findIndex(function (el) {
			return el === imageId;
		});
		// if role is 2
		if (this.state.role === 2) {
			return fetch(GET_FOOD_URI + imageId, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
			}).then((response) => {
				console.log('feeds js] onImageDelete: ', response);
				if (response.status !== 200) {

					console.log('feeds js] deleteImage - bad response: ', response);
					console.log('[feeds js] deleteImage - testing Json.parse:', JSON.parse(response._bodyInit));
					
					Toast.show({
						text: JSON.parse(response._bodyInit).message,
						buttonText: 'Ok',
						position: 'top',
						duration: 4000
					});
					
					if(response.status !== 401){
						return;
					}else {
						// unauthorized 401
						if(this.state.imageIdToDelete){
							this.setState({
								imageIdToDelete: null,
								areImagesLoaded: true
							});
						}
					}
				}else{
					Toast.show({
						text: 'Image deleted',
						buttonText: 'Ok',
						position: 'top',
						duration: 4000
					});
					
					if(this.state.imageIdToDelete){
						let removeImage = newImageArray.splice(deleteIndex, 1);
						console.log('[feeds js] deleteImage - from images js - image removed from array: ', removeImage);
						console.log('[feeds js] deleteImage - from images js - new array of images: ', newImageArray);
						this.setState({
							imageIdToDelete: null,
							areImagesLoaded: true,
							feedImagesArray: [...newImageArray]
						});
					}else{
						let removeImage = newImageArray.splice(deleteIndex, 1);
						console.log('[feeds js] deleteImage - from long press - image removed from array: ', removeImage);
						console.log('[feeds js] deleteImage - from long press - new array of images: ', newImageArray);
						this.setState({
							feedImagesArray: [...newImageArray]
						});
					}
				}
			}).catch((error) => {
				console.log(error);
			});
		} else {
			// if role is not 2
			
			Toast.show({
				text: 'Cannot delete, invalid role',
				buttonText: 'OK',
				position: 'top',
				duration: 4000
			});

			if(this.state.imageIdToDelete){
				this.setState({
					imageIdToDelete: null,
					areImagesLoaded: true
				});
			}
		}
	}

	getUserImages(){
		let userImagesArray = [];
		// let imageThumbnail;
		//check if user have images and display them
		if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){

			// find out length of image array
			console.log("[feeds js] getUserImages - Image Count: ", this.state.images.length);

			if(this.state.images.length >= 1 ){
				userImagesArray = [...this.state.images];
			}
		}
		console.log("[feeds js] getUserImages - userImagesArray: ", userImagesArray);
		this.setState({userImages: [...userImagesArray]});
	}

	getFollowedImages(){
		console.log('[feeds js] getFollowedImages - Number of following: ', this.state.followed.length);
		let followedImagesArray = [];
		if (this.state.followed.length === 0) {
			// 0 FOLLOWED
			console.log("[feeds js] getFollowedImages - 0 FOLLOWED");
			console.log('[feeds js] getFollowedImages - followedImagesArray:', followedImagesArray);
			this.setState({followedImages: [...followedImagesArray]});
		} else if (this.state.followed.length === 1) {
			// ONE FOLLOWED
			console.log('[feeds js] getFollowedImages - 1 FOLLOWED: ', this.state.followed);
			console.log('[feeds js] getFollowedImages - One followed Contents: ', this.state.followed[0]);
			const followedId = this.state.followed[0];

			return fetch(GET_USERS_URI + followedId)
				.then(response => response.json())
				.then(response => {
					console.log('[feeds js] getFollowedImages - fetch response: ', response);
					console.log('[feeds js] getFollowedImages - fetch response images: ', response.images);
					console.log('[feeds js] getFollowedImages - fetch response images length: ', response.images.length);

					if (response.images.length >= 1) {
						followedImagesArray = [...response.images];
					} else {
						console.log('[feeds js] getFollowedImages - No images from follow')
					}
					this.setState({followedImages: [...followedImagesArray]});
				})
				.catch(error => console.log('[feeds js] getFollowedImages - ONE followed fetch error: ', error));
		} else if (this.state.followed.length > 1) {
			// MULTIPLE FOLLOWED
			console.log('[feeds js] getFollowedImages - Multiple followed: ', this.state.followed);
			console.log('[feeds js] getFollowedImages - Multiple followed uri: ', GET_USERS_URI + this.state.followed);
			return fetch(GET_USERS_FOLLOWED_URI)
				.then(response => response.json())
				.then(response => {
					// save images
					console.log('[feeds js] getFollowedImages - Multiple followed response: ', response);

					// loop through followed users
					response.data.forEach((followedUser, index) => {
						// check image array length
						if (followedUser.images.length >= 1) {
							let followedImagesArray2 = followedUser.images.map((imageId, index) => {
								let tempImageUri = GET_FOOD_URI + imageId + '/display';
								return (
									<Button
										transparent style={styles.thumbnail}
										onPress={() => this.onImageClicked(imageId, this.state.passedId)}
										key={imageId}
									>
										<Thumbnail
											large square source={{ uri: tempImageUri }}
										/>
									</Button>
								);
							});
							followedImagesArray = [...followedImagesArray, ...followedUser.images];
						}
					});
					this.setState({followedImages: [...followedImagesArray]});
					
				})
				.catch(error => console.log('[feeds js] getFollowedImages - MULTIPLE followed fetch error: ', error));
		}
	}
	// log out logic
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
								this.setState({
									isLoggedOut: true,
									disableButtonLogout: true
								});
								Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })
								console.log("[feeds js] onLogoutPressHandler - LOGGING OUT!");
								// return back to Home and reset the state
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

	// when Explore btn is clicked
	// onExplorePressedHandler = (currentUserId) => {
	// 	console.log('[feeds js] onExplorePressedHandler - clicked!');
	// 	console.log('[feeds js] onExplorePressedHandler - ID passed by app js: ', currentUserId);
	// 	this.props.navigation.navigate({ key: 'Explore1', routeName: 'Explore', params: {
	// 			currentUserId:currentUserId
	// 		} 
	// 	});
	// };
	//upload image logic
	onImagePickerHandler = () => {
		if(this.state.role == 2){
			let imagePickerOptions = {
				title: 'Select Image',
				storageOptions: {
					skipBackup: true,
				}
			};

			ImagePicker.showImagePicker(imagePickerOptions, (response) => {

				console.log('[feeds js] onImagePickerHandler - Image Picker Response: ', response.fileSize);
				this.setState({ log: '' });
				if (response.didCancel) {
					console.log('[feeds js] onImagePickerHandler - User cancelled the picker.');
				} else if (response.error) {
					console.log('[feeds js] onImagePickerHandler - ImagePicker Error:', response.error);
				} else if (response.customButton) {
					console.log('[feeds js] onImagePickerHandler - User tapped custom button: ', response.customButton);
				} else {
					let source = { uri: response.uri };
					this.setState({
						imageSource: source,
						log: "Image chosen"
					});

					console.log('[feeds js] onImagePickerHandler - IMAGE CHOSEN: ', source);

					let platformPath = '';
					if (Platform.OS == 'ios') {
						console.log("[feeds js] onImagePickerHandler - PATH OF IMAGE SELECTED IOS: ", response.uri);
						platformPath = response.uri.replace(/^file?\:\/\//i, "");
						console.log('[feeds js] onImagePickerHandler - SPECIAL CHARACTERS REMOVED: ', platformPath);
					} else if (Platform.OS == 'android') {
						console.log("[feeds js] onImagePickerHandler - PATH OF IMAGE SELECTED ANDROID: ", response.path);
						platformPath = response.path;
					}

					if (platformPath == '') {
						return this.setState({
							log: "Platform path empty"
						});
					}
					console.log('[feeds js] onImagePickerHandler - TEST:', response.uri);
					console.log("[feeds js] onImagePickerHandler - PLATFORM PATH ", platformPath);

					RNFetchBlob.fetch('POST',
						UPLOAD_URI,
						{},
						[
							{ name: 'sampleFile', filename: response.fileName, data: RNFetchBlob.wrap(platformPath) }
						])
						.then((res) => {
							// console.log('[user js] Response from server - ', res);
							console.log('[feeds js] onImagePickerHandler - Status code - ', res.respInfo.status);
							if (res.respInfo.status == 200) {
								console.log('[feeds js] onImagePickerHandler - UPLOAD OK');
								this.setState({ log: 'Upload ok!' });
							} else {
								console.log('[feeds js] onImagePickerHandler - UPLOAD FAILED - ', res);
								this.setState({ log: 'Upload failed!' });
							}
						})
						.catch((err) => {
							console.log('[feeds js] onImagePickerHandler - showImagePicker: ', res);
						});
				}
			});
		}
	}
	//enter image page if image is clicked
	onImageClicked = (imageId,passedId) => {
        console.log("[feeds js] onImageClicked - imageId: ", imageId );
        console.log("[feeds js] onImageClicked - passedId: ", passedId );
        return fetch(GET_FOOD_URI+ imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
		})
		.then (response => response.json())
        .then(response => {
            console.log('[feeds js] onImageClicked - response from server: ', response);
			this.props.navigation.navigate({ key: 'Food1', routeName: 'Food', params: { 
					data:response,
					userId: passedId,
					userData: this.props.navigation.state.params,
					imagesDisplayed: this.state.feedImagesArray
				} 
			})
		})
		.catch(error => console.error('Error: ', error));
	};

	onBackBtnPressed = () => {
		console.log('[feeds js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onProfilePressedHandler = (passedId, fname, lname, images, username) => {
		console.log('[feeds js] onProfilePressedHandler - passedId: ', passedId);
		if (this.state.role == 2){
			this.props.navigation.navigate({
				key: 'Profile1', routeName: 'Profile', params: {
					userId: passedId
				}
			});
		}else{
			this.props.navigation.navigate({
				key: 'User1', routeName: 'User', params: {
					userId:passedId,
					fname: fname,
					lname: lname,
					images: images,
					username: username
				}
			})
		}
		
	}

	

	render() {
		console.log('[feeds js] render - Role of user at onImageDelete:', this.state.role);
		console.log('[feeds js] render - feedImagesArray:', this.state.feedImagesArray);
		console.log('[feeds js] render - areImagesLoaded:', this.state.areImagesLoaded);
		console.log('[feeds js] render - locations:', this.state.locations);
		console.log('[feeds js] render - typeof locations:', typeof this.state.locations);
		console.log('[feeds js] render - mapRegion: ', this.state.mapRegion);
		console.log('[feeds js] render - mapMarkers:', this.state.mapMarkers);
		console.log('[feeds js] render - this.state.restaurantUsers:', this.state.restaurantUsers);
		
		let gallery = (<Spinner/>);
		// let imagePickerButton;
		let logoutLoader = (
			<Button transparent onPress={this.onLogoutHandler}>
				<Icon name='home' />
			</Button>
		);
		// console.log('[feeds js] render - testFunction: ', this.testFunction)
		// console.log('[feeds js] render - onImageClicked: ', this.onImageClicked)
		// //render images
		if(this.state.feedImagesArray && this.state.areImagesLoaded){
			if (this.state.feedImagesArray.length > 0) {
				gallery = (
				<Gallery
					images={this.state.feedImagesArray}
					clicked={this.onImageClicked}
					longclick={this.onImageDelete}
					passedUserId={this.state.passedId}
				/>);
				
			} else if (this.state.feedImagesArray.length === 0) {
				gallery = (<Text>No images available</Text>);
			}
		}

		if(this.state.isLoggedOut){
			logoutLoader = (
				<Button transparent disabled ={this.state.disableButtonLogout}>
					<Spinner/>
				</Button>
			)
		}

		// if(this.state.role == 2){
		// 	footers = (
		// 		<Footer>
		// 			<FooterTab>
		// 				<Button full onPress={this.onImagePickerHandler}>
		// 					<Icon name="camera" />
		// 					<Text>Image Picker</Text>
		// 				</Button>
		// 				<Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
		// 					<Icon name="navigate" />
		// 					<Text>Explore</Text>
		// 				</Button>
		// 				<Button full onPress={() => { this.onProfilePressedHandler(this.state.passedId) }}>
		// 					<Icon name="ios-person" />
		// 					<Text>Profile</Text>
		// 				</Button>
		// 			</FooterTab>
		// 		</Footer>
		// 	)
			
		// }else{
		// 	footers = (
		// 		<Footer>
		// 			<FooterTab>
		// 				<Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
		// 					<Icon name="navigate" />
		// 					<Text>Explore</Text>
		// 				</Button>
		// 				<Button full onPress={() => { this.onProfilePressedHandler(this.state.passedId, this.state.fname, 
		// 					this.state.lname, this.state.images, this.state.passedUsername ) }}>
		// 					<Icon  name="ios-person" />
		// 					<Text>Profile</Text>
		// 				</Button>
		// 			</FooterTab>
		// 		</Footer>
		// 	)
		// }

		// carousel display
		let carousel = (<Spinner/>);
		if(this.state.restaurantUsers){
			carousel = (
				<Carousel
					ref={(c) => { this._carousel = c; }}
					data={this.state.restaurantUsers}
					renderItem={this._renderItem.bind(this)}
					sliderWidth={Dimensions.get('window').width}
					itemWidth={Dimensions.get('window').width * 0.85}
					hasParallaxImages={true}
				/>
			);
		}

		// display map only if there are markers available
		let displayMap;
		if(this.state.locations.length > 0){
			displayMap = (
				<View style= {{width: '100%'}}>
					<Label style={{alignItems: 'center', marginLeft: 130, marginBottom: 10, fontSize: 20, fontWeight:'bold'}}>Saved restaurants</Label>
					<MapView
						ref={map => this.map = map}
						style={styles.mapContainer}
						initialRegion={this.state.mapRegion}
					>
						{this.state.mapMarkers}
					</MapView>
				</View>
			)
			
		}else{
			displayMap = (
				<View style={{ alignItems: 'center', marginLeft: 90, marginTop: 50 }}>
					<Icon style={{ fontSize: 50, color: 'grey'  }} name='ios-close-circle-outline' />
					<Text>No saved restaurants available</Text>
				</View>
			)
		}

        return (
			<Container>
				<Header>
					<Left></Left>
					<Body><Title>{this.state.passedUsername}</Title></Body>
					<Right>
						{logoutLoader}
					</Right>
				</Header>
				<Content>
					<Row style = {{marginTop: 10, alignItems: 'center', }}>
						<Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 50 }}>Feeds</Text>
					</Row>
					<Row style={{ marginTop: 10, marginLeft: 50, flex: 1, alignItems: 'center' }}>
						{gallery}
					</Row>

					<Row style={{ marginTop: 20, alignItems: 'center', }}>
						<Text style={{ fontSize: 20, fontWeight: 'bold',marginLeft: 50}}>Restaurants</Text>
					</Row>
					<Row style = {{marginTop: 10, marginLeft: 20}}>
						{carousel}
					</Row>
					<Row style = {{marginTop:40}}>
						{displayMap}
					</Row>
				</Content>
				{/* {footers} */}
			</Container>
        );
        return (
            <Text>Feeds js</Text>
        );
    }
}

const styles = StyleSheet.create({    
    thumbnail: {
        width: 80,
        height: 80,
	},
	title: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		zIndex: 999,
		color: '#fff',
		width: '89%',
		padding: 10
	},
	imageContainer: {
		width: '89%',
		height: 250,
		flex: 1,
		position: 'relative'
	},
	image: {
		width: '89%',
		height: 100
	},
	mapContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		width: '100%',
		height: 275,
		// marginLeft: 32,
	}
});

module.exports = FeedsScreen;