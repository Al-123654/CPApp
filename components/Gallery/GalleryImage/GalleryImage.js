// GalleryImage.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import { Button } from 'native-base';
// import { Image } from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;

export default class GalleryImage extends Component {
    render() {
        const { uri, index, onPress, imageId, passedUserId, disabled, onLongPress } = this.props;
        console.log('[GalleryImage js] props from Gallery:', this.props)

        return (
            <Button

                onPress={() => {
                    onPress(imageId, passedUserId)
                }
                }
                onLongPress={() => {
                    onLongPress(imageId, passedUserId)
                }
                }
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 0,
                    height: WIDTH / 4,
                    width: WIDTH / 4,
                }}
            >
                <Image
                    source={{ uri: uri }}
                    style={{
                        height: WIDTH / 4,
                        left: 0,
                        position: 'absolute',
                        resizeMode: 'cover',
                        top: 0,
                        width: WIDTH / 4,
                    }}
                />
            </Button>
        );
    }
}