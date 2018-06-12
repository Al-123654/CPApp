import React, { Component } from 'react';
import {  TextInput, StyleSheet, View,  Image, Alert, FlatList } from 'react-native';
// import { StackNavigator, } from 'react-navigation';
import { createStackNavigator } from 'react-navigation';
import validator from 'validator';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Form, Item, 
    Input, Label, Footer, Spinner, FooterTab, Toast
} from 'native-base';

class RegisterScreen extends Component {
    constructor(props) {
        super(props);
	}
	
    state = {
        username: "",
        password: "",
        fname: "",
        lname: "",
        email: "",
        log:"",
        logUsername: "",
        logFname: "",
        logLname: "",
        logPassword: "",
        logEmail: "",
        logDetails: "",
        disableButton: false,
        // registerLoaded:false
    };

    onChangedUsernameHandler = (username) => {
        if (username) {
            this.setState({
                username: username, logUsername: ''
            });
        }
    }

    onChangedPasswordHandler = (password) => {
        if (password) {
            this.setState({
                password: password, logPassword: ''
            });
        }
    }
    

    onChangedFnameHandler = (fname) => {
        if (fname){
            this.setState({
                fname: fname, logFname: ''
            });
        }
    }

    onChangedLnameHandler = (lname) => {
        if (lname){
            this.setState({
                lname: lname, logLname: ''
            });
        }
    }

    onChangedEmailHandler = (email) => {
        if (email){           
            this.setState({
                email: email, logEmail: ''
            });
        }
	}
	
	onBackBtnPressed = () => {
		console.log('[register js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

    onRegisterFinishedHandler = () => {
        
        this.setState({
			logUsername: "",
            logFname: "",
            logLname: "",
            logPassword: "",
            logEmail: "",
            disableButton: true
        });
        
        if (!validator.isAlphanumeric(this.state.username) ) {
            this.setState({ 
                logUsername: "Numbers and letters only", 
                disableButton: false
            });
            return;
        }
        if (!validator.isLength(this.state.username, { min: 5, max: 10 })){
            this.setState({ 
                logUsername: "Min: 5, max: 10",
                disableButton: false
            });
            return;
        }
        if(!validator.isLength(this.state.password,{min:8})){
            this.setState({
                logPassword: "Min: 8",
                disableButton: false
            });
            return;
        }
        if(!validator.isAlpha(this.state.fname)){
            this.setState({
                logFname: "Letters only",
                disableButton: false
            });
            return;
        }
        if (!validator.isLength(this.state.fname, { min: 2 })){
            this.setState({ 
                logFname: "Too short", 
                disableButton: false
            });
            return;
        }        
        if (!validator.isAlpha(this.state.lname)){
            this.setState({
                logLname: "Letters only",
                disableButton: false
            });
            return;
        } 
        if (!validator.isLength(this.state.lname, { min: 2 })){
            this.setState({ 
                logLname: "Too short",
                disableButton: false
            });
            return;
        }       
        if(!validator.isEmail(this.state.email)){
            this.setState({
                logEmail: "Invalid Email",
                disableButton: false
            });
            return;
        }        

        // return fetch('http://localhost:5000/api/users', {
        return fetch('https://app-api-testing.herokuapp.com/api/users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                fname: this.state.fname,
                lname: this.state.lname,
                email: this.state.email
            }),
        })
            .then((response) => {
                console.log('[register.js] responseOnRegister: ', response);
                if (response.status !== 200) {
                    console.log('[register js] responseOnLogin bad response: ', response);
                    this.setState({ log: "Cannot register" });
                    return;
                }
                response.json().then(data => {
                    console.log('[register js] componentDidMount json response: ', data);
					console.log("[register js] REGISTERED");
					this.setState({ log: "Registered!" });
                    // go to user page
                    console.log('[register js] Response', data);
                    // this.props.navigation.navigate('User', data);
                    Toast.show({
                        text: 'Registered',
                        buttonText: 'Ok',
                        position:'top',
                        duration: 4000
                    })
                });

            })
            .catch((error) => {
                console.error(error);
            });

            // this.setState({registerLoaded = true})
        
    }

    render() {

        let registerButton;

        if(this.state.disableButton){
            registerButton = 
              (  <Button disabled={this.state.disableButton} onPress={this.onRegisterFinishedHandler}>
                    <Spinner />
                </Button>)
            
        }else{
            registerButton = (
                <Button disabled={this.state.disableButton} onPress={this.onRegisterFinishedHandler}>
                    <Icon name="person-add" />
                    <Text style={{ fontSize: 15 }}>Register</Text>
                </Button>
            )
        }

        return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={this.onBackBtnPressed}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
					<Body>
						<Title>Register</Title>
					</Body>
                    <Right>
                        
                    </Right>
				</Header>
				<Content>
					<Form>
						<Item floatingLabel error={this.state.logUsername.length > 0}>
							<Label>Username</Label>
                            <Input onChangeText={(text) => this.onChangedUsernameHandler(text)}
                                onSubmitEditing = {this.onRegisterFinishedHandler}
                            />
						</Item>
						{this.state.logUsername.length > 0 ? (<Text style={styles.formLogText}>{this.state.logUsername}</Text>) : null}

						<Item floatingLabel error={this.state.logPassword.length > 0}>
							<Label>Password</Label>
							<Input onChangeText={(text) => this.onChangedPasswordHandler(text)} 
                                onSubmitEditing={this.onRegisterFinishedHandler}
                                secureTextEntry={true}
                            />
						</Item>
						{this.state.logPassword.length > 0 ? (<Text style={styles.formLogText}>{this.state.logPassword}</Text>) : null}

						<Item floatingLabel error={this.state.logFname.length > 0}>
							<Label>First name</Label>
							<Input onChangeText={(text) => this.onChangedFnameHandler(text)} 
                                onSubmitEditing={this.onRegisterFinishedHandler}
                            />
						</Item>
						{this.state.logFname.length > 0 ? (<Text style={styles.formLogText}>{this.state.logFname}</Text>) : null}

						<Item floatingLabel error={this.state.logLname.length > 0}>
							<Label>Last name</Label>
							<Input onChangeText={(text) => this.onChangedLnameHandler(text)} 
                                onSubmitEditing={this.onRegisterFinishedHandler}
                            />
						</Item>
						{this.state.logLname.length > 0 ? (<Text style={styles.formLogText}>{this.state.logLname}</Text>) : null}

						<Item floatingLabel last error={this.state.logEmail.length > 0}>
							<Label>Email</Label>
							<Input onChangeText={(text) => this.onChangedEmailHandler(text)} 
                                onSubmitEditing={this.onRegisterFinishedHandler}
                            />
						</Item>
						{this.state.logEmail.length > 0 ? (<Text style={styles.formLogText}>{this.state.logEmail}</Text>) : null}

					</Form>
					<View style={styles.formMessages}>
						{this.state.log.length > 0 ? (<Text style={styles.formLogText}>{this.state.log}</Text>) : null}
					</View>
						
				</Content>
				<Footer>
					<FooterTab>
                        {registerButton}
					</FooterTab>
				</Footer>
			</Container>
        );
    }
}

const styles = StyleSheet.create({
    formMessages: {
		marginTop: 10,
		marginLeft: 10,
		flex: 1,
		flexDirection: 'column'
	},
	formLogText: {
		fontSize: 12,
		color: 'red',
		marginTop: 5,
		marginLeft: 18
	}
});
module.exports = RegisterScreen;