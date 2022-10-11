import React from "react";

const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};
// Initialize the magicFeature
const faceapi = ml5.faceApi(detectionOptions, modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");

  const imageUrl =
    "https://media.wired.com/photos/62ce0a69540a1fd5ca4bd82a/master/pass/Star-Wars-Ranking-Culture-607402182.jpg";
  // Make some sparkles
  faceapi.detect(imageUrl, (err, results) => {
    console.log(results);
  });
}

export default class MlFaceDetection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Face</div>;
  }
}
