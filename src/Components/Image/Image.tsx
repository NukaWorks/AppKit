import React from 'react'
import PropTypes from 'prop-types'
import './Image.scss'

// Code forked on https://github.com/Sundev79/render-smooth-image-react/

export default class Image extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            imageLoaded: false,
            isValidSrc: !!props.src
        }
        this.showImage = (loadEvent = null) => {
            // https://reactjs.org/docs/legacy-event-pooling.html
            loadEvent !== null && loadEvent.persist()

            this.setState(
                { imageLoaded: true },
                () =>
                    loadEvent !== null &&
                    typeof props.onLoad === 'function' &&
                    props.onLoad(loadEvent)
            )
        }
        this.handleError = (errorEvent = null) => {
            // https://reactjs.org/docs/legacy-event-pooling.html
            errorEvent !== null && errorEvent.persist()

            this.setState(
                { isValidSrc: false },
                () =>
                    errorEvent !== null &&
                    typeof props.onError === 'function' &&
                    props.onError(errorEvent)
            )
        }
        this.imageRef = React.createRef()
    }

    componentDidMount () {
        if (this.state.isValidSrc) {
            new Image().src = this.props.src
        }
        // Image tag is not rendered for invalid src - Hence the check for ref's presence.
        if (!!this.imageRef.current && this.imageRef.current.complete) {
            this.showImage()
        }
    }

    render () {
        const { imageLoaded, isValidSrc } = this.state
        const { src, alt, objectFit, imageProps, wrapperProps } = this.props

        return (
            <div className="smooth-image-wrapper" {...wrapperProps}>
                {isValidSrc
                    ? (
                        <img
                            ref={this.imageRef}
                            className={`${this.props.className} smooth-image img-${imageLoaded ? 'visible' : 'hidden'}`}
                            style={{ objectFit }}
                            src={src}
                            alt={alt}
                            onLoad={this.showImage}
                            onError={this.handleError}
                            {...imageProps}
                        />
                    )
                    : (
                        <div className="smooth-no-image">{alt}</div>
                    )}
                {isValidSrc && !imageLoaded && (
                    <div className="smooth-preloader">
                    </div>
                )}
            </div>
        )
    }
}

ImageCompnt.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    objectFit: PropTypes.oneOf([
        'contain',
        'fill',
        'cover',
        'none',
        'scale-down'
    ]),
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    wrapperProps: PropTypes.shape({}),
    imageProps: PropTypes.shape({})
}

ImageCompnt.defaultProps = {
    alt: 'not found',
    objectFit: 'contain',
    onLoad: () => null,
    onError: () => null,
    wrapperProps: {},
    imageProps: {}
}
