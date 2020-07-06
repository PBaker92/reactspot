import React, { Component } from 'react'

export default class Home extends Component {

    render() {
        return (
            <div>
                <h1>About the Model</h1>
                <p>MobileNets are small, low-latency, low-power models parameterized to meet the resource constraints of a variety of use cases. They can be built upon for classification, detection, embeddings and segmentation similar to how other popular large scale models, such as Inception, are used. MobileNets can be run efficiently on mobile devices with TensorFlow Lite.</p>
            </div>
        )
    }
}

