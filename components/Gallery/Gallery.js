// Gallery.js

import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
// import PropTypes from 'prop-types';
// import ImageViewer from 'ImageViewer';

import GalleryImage from './GalleryImage/GalleryImage';
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

export default class Gallery extends Component {
    constructor(props) {
        super(props);

        // this.openLightbox = (index) => {
        //   this.setState({
        //     index,
        //     shown: true,
        //   });
        // };

        // this.hideLightbox = () => {
        //   this.setState({
        //     index: 0,
        //     shown: false,
        //   });
        // };
    }

    state = {
        index: 0,
        shown: false,
    };

    render() {
        const { images, clicked, passedUserId, disabled, longclick } = this.props;
        const { index, shown } = this.state;
        console.log('[Gallery js] props carried over from feeds:', this.props);

        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >

                {
                    (
                        () => images.map((image, idx) =>
                            <GalleryImage
                                index={idx}
                                key={idx}
                                uri={GET_IMAGES_URI + image + '/display'}
                                onPress={clicked}
                                onLongPress={longclick}
                                imageId={image}
                                passedUserId={passedUserId}

                            />)
                    )()
                    // (() =>
                    // images.map((image, idx) =>
                    // <GalleryImage
                    // index={idx}
                    // key={idx}
                    // uri={image.uri}
                    // />
                    // )()
                }

            </View>
        );
    }
}