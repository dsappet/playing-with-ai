import React, { useEffect, useRef } from "react";
import { findGravity } from "./helpers/gravity";

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

export default function MlFaceDetection(props): JSX.Element {
  const { imgSrc } = props;
  const ogCanvasRef = useRef<HTMLCanvasElement>(null);
  var image;

  useEffect(() => {
    var canvas: any =
      document.getElementById("face-canvas") || new HTMLElement();

    var context = canvas.getContext("2d");

    image = new Image(); // Using optional size for image
    image.src = "./obi-wan-kenobi.jpeg"; // Load an image of intrinsic size in CSS pixels
    image.onload = () => {
      // Draw when image has loaded
      // Use the intrinsic size of image in CSS pixels for the canvas element
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Will draw the image as 300x227, ignoring the custom size of 60x45
      // given in the constructor
      // context.drawImage(image, 0, 0);

      // To use the custom size we'll have to specify the scale parameters
      // using the element's width and height properties - lets draw one
      // on top in the corner:
      context.drawImage(image, 0, 0, image.width, image.height);

      // Also draw the "OG" image
      ogCanvasRef.current
        ?.getContext("2d")
        ?.drawImage(image, 0, 0, image.width, image.height);
    };
  }, [imgSrc]);

  function getSize(img) {
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

  async function detect() {
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

  /** This method to do the cropping of an image based on gravity */
  // TODO - Add padding around the face detection as a % of the size of the image
  async function crop() {
    const detection = await detect();

    // Is it one face?
    if (detection.length === 1) {
      const face = detection[0].alignedRect.box;

      // To crop the image we use the drawImage again
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      // The (s) parameters being the source size to place in the (d) destination area
      var canvas: any = document.getElementById("face-canvas");

      const gravity = findGravity({
        planets: [face],
        galaxySize: { width: canvas.width, height: canvas.height },
      });

      var newWidth = face.width + canvas.width * gravity.pull;
      var newHeight = face.height + canvas.height * gravity.pull;

      /** The new starting x and y  */
      var nudgeX = face.x - (newWidth - face.width) / 2;
      var nudgeY = face.y - (newHeight - face.height) / 2;

      /** If we are trying to start farther than the origin of the image, nudge the other direction and don't try to start farther than 0,0 */
      if (nudgeX < 0) {
        newWidth += Math.abs(nudgeX);
        nudgeX = 0;
      }

      if (nudgeY < 0) {
        newHeight += Math.abs(nudgeY);
        nudgeY = 0;
      }

      var context = canvas.getContext("2d");
      context.drawImage(
        image,
        nudgeX,
        nudgeY,
        newWidth,
        newHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    // Is it multiple faces?
    // How to handle this?
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={() => detect()}>DETECT</button>
      <button onClick={() => crop()}>CROP</button>
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
      <div style={{ display: "flex" }}>
        <canvas ref={ogCanvasRef} id="original" />
        <canvas id="face-canvas" />
      </div>
    </div>
  );
}
