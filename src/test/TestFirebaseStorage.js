import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { firebaseConnect } from 'react-redux-firebase'

class Uploader extends Component {
    static propTypes = {
        firebase: PropTypes.object
    }

    addTestFile = () => {
        const { firebase: { storage } } = this.props;
        const storageRef = storage().ref();
        console.log(storageRef)
        // const fileRef = storageRef.child('test.txt')
        // return fileRef.putString('Some File Contents')
        //     .then(snap => console.log('upload successful', snap))
        //     .catch(err => console.error('error uploading file', err))
    }

    render() {
        return (
            <div>
                <h1>Example Upload</h1>
                <button onClick={this.addTestFile}>
                    Upload Example File
        </button>
            </div>
        )
    }
}

export default firebaseConnect()(Uploader)