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
}

export default class MlFaceDetection extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    var canvas = document.getElementById("face-canvas");

    var context = canvas.getContext("2d");

    const image = new Image(); // Using optional size for image
    image.src = "./starwars-luke-leia-han.jpg"; // Load an image of intrinsic size in CSS pixels
    image.onload = () => {
      // Draw when image has loaded
      // Use the intrinsic size of image in CSS pixels for the canvas element
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Will draw the image as 300x227, ignoring the custom size of 60x45
      // given in the constructor
      context.drawImage(image, 0, 0);

      // To use the custom size we'll have to specify the scale parameters
      // using the element's width and height properties - lets draw one
      // on top in the corner:
      context.drawImage(image, 0, 0, image.width, image.height);
    };
  }

  getSize(img) {
    var MAX_WIDTH = 300;
    var MAX_HEIGHT = 300;

    var width = img.width;
    var height = img.height;

    // Change the resizing logic
    if (width > height) {
      if (width > MAX_WIDTH) {
        height = height * (MAX_WIDTH / width);
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = width * (MAX_HEIGHT / height);
        height = MAX_HEIGHT;
      }
    }

    console.log(width, height);

    return {
      width,
      height,
    };
  }

  async detect() {
    console.log("run it");

    // Make some sparkles
    const canvas = document.getElementById("face-canvas");
    const context = canvas.getContext("2d");
    const results = await faceapi.detect(canvas); //, (err, results) => {
    // if (err) {
    //   console.log("error: ", err);
    // }
    console.log(results);
    // });
    results.forEach((face) => {
      console.log(face.alignedRect);
      // face.alignedRect.box /width height /x /y
      context.beginPath();
      context.rect(
        face.alignedRect.box.x,
        face.alignedRect.box.y,
        face.alignedRect.box.width,
        face.alignedRect.box.height
      );
      // //context.fillStyle = "yellow";
      // //context.fill();
      context.lineWidth = 6;
      context.strokeStyle = "blue";
      context.stroke();
    });
    // const img = face;
    // const size = this.getSize(img);

    // context.drawImage(
    //   img,
    //   0,
    //   0,
    //   size.width,
    //   size.height // source rectangle
    //   // 0,
    //   // 0,
    //   // canvas.width,
    //   // canvas.height
    // ); // destination rectangle

    //context.drawImage(face, 0, 0, 300, 300);

    // context.beginPath();
    // context.rect(188, 50, 200, 100);
    // //context.fillStyle = "yellow";
    // //context.fill();
    // context.lineWidth = 2;
    // context.strokeStyle = "blue";
    // context.stroke();
  }

  render() {
    const imageUrl =
      "https://media.wired.com/photos/62ce0a69540a1fd5ca4bd82a/master/pass/Star-Wars-Ranking-Culture-607402182.jpg";
    return (
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <button onClick={() => this.detect()}>DETECT</button>
        {/* <img
          crossOrigin="Anonymous"
          id="face"
          src={imageUrl}
          style={{ width: "300px" }}
        /> */}
        {/* <img
          id="face"
          src="./starwars-luke-leia-han.jpg"
          style={{ width: "300px" }}
        /> */}

        <canvas id="face-canvas" />
      </div>
    );
  }
}
