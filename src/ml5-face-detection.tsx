import React from "react";

declare var ml5: any;

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

  image;

  async componentDidMount() {
    var canvas: any =
      document.getElementById("face-canvas") || new HTMLElement();

    var context = canvas.getContext("2d");

    this.image = new Image(); // Using optional size for image
    this.image.src = "./obi-wan-kenobi.jpeg"; // Load an image of intrinsic size in CSS pixels
    this.image.onload = () => {
      // Draw when image has loaded
      // Use the intrinsic size of image in CSS pixels for the canvas element
      canvas.width = this.image.naturalWidth;
      canvas.height = this.image.naturalHeight;

      // Will draw the image as 300x227, ignoring the custom size of 60x45
      // given in the constructor
      // context.drawImage(image, 0, 0);

      // To use the custom size we'll have to specify the scale parameters
      // using the element's width and height properties - lets draw one
      // on top in the corner:
      context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
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
    const canvas: any = document.getElementById("face-canvas");
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

    return results;
  }

  /** This method to determine the best area to focus on in an image */
  async findGravity() {}

  /** This method to do the cropping of an image based on gravity */
  // TODO - Add padding around the face detection as a % of the size of the image
  async crop() {
    const detection = await this.detect();

    // Is it one face?
    if (detection.length === 1) {
      const face = detection[0].alignedRect.box;

      // To crop the image we use the drawImage again
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      // The (s) parameters being the source size to place in the (d) destination area
      var canvas: any = document.getElementById("face-canvas");

      var context = canvas.getContext("2d");
      context.drawImage(
        this.image,
        face.x,
        face.y,
        face.width,
        face.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    // Is it multiple faces?
    // How to handle this?
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={() => this.detect()}>DETECT</button>
        <button onClick={() => this.crop()}>CROP</button>
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
