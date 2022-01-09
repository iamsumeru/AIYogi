/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licnses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// import * as tf from '@tensorflow/tfjs-core';
// import * as posenet from '../src';

const color = 'red';
const lineWidth = 2;

//let biomarkers=["Nose","Left Eye","Right Eye","Left Ear","Right Ear","Left Shoulder","Right Shoulder","Left Elbow","Right Elbow","Left Wrist","Right Wrist","Left Hip","Right Hip","Left Knee","Right Knee","Left Ankle","Right Ankle"]
function toTuple({ y, x }) {
  return [y, x];
}
function avge(x,y){
	return ((x+y)/2.0);
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(toTuple(keypoints[0].position),
      toTuple(keypoints[1].position), color, scale, ctx);
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
function calcAngle(x1,y1,x2,y2,x3,y3) {
	let x1_x2 = x1-x2;
    let y1_y2 = y1-y2;
    let x1_x3 = x1-x3;
    let y1_y3 = y1-y3;
    let x2_x3 = x2-x3;
    let y2_y3 = y2-y3;
    let a_s = x1_x2*x1_x2 + y1_y2*y1_y2
    let b_s = x2_x3*x2_x3 + y2_y3*y2_y3
    let c_s = x1_x3*x1_x3 + y1_y3*y1_y3
    let a = Math.sqrt(a_s)
    let b = Math.sqrt(b_s)
    let cos_theta = (a_s+b_s-c_s)/(2.0*a*b)
    let theta = (Math.acos(cos_theta))*(180.0/Math.PI)
    return theta
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  var marker = [];
  var y_arr =[];
  var x_arr =[];
  var score =[];
  var bad_index =[];
  var ind_nose = [];
  var ind_Lwrst = [];
  var ind_Rwrst = [];
  var ind_Lelbw = [];
  var ind_Relbw = [];
  var ind_Lshldr = [];
  var ind_Rshldr = [];
  var ind_Lhip = [];
  var ind_Rhip = [];
  var ind_Lknee = [];
  var ind_Rknee = [];
  var ind_Lankl = [];
  var ind_Rankl = [];
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
 
          
    if (keypoint.score < minConfidence) {
      bad_index.push(i);
      continue;
    }
	   //console.log(keypoint.part)
    marker.push(keypoint.part);

    switch (marker[i]){
	case "nose":
		ind_nose.push(i);
		break;
    case "leftWrist":
		ind_Lwrst.push(i);
		break;
	case "rightWrist":
		ind_Rwrst.push(i);
		break;
	case "leftElbow":
		ind_Lelbw.push(i);
		break;
	case "rightElbow":
		ind_Relbw.push(i);
		break;
	case "leftShoulder":
		ind_Lshldr.push(i);
		break;
	case "rightShoulder":
		ind_Rshldr.push(i);
		break;
	case "leftHip":
		ind_Lhip.push(i);
		break;
	case "rightHip":
		ind_Rhip.push(i);
		break;
	case "leftKnee":
		ind_Lknee.push(i);
		break;
	case "rightKnee":
		ind_Rknee.push(i);
		break;
	case "leftAnkle":
		ind_Lankl.push(i);
		break;
	case "rightAnkle":
		ind_Rankl.push(i);
		break;
	default:
		break;
	}

    const { y, x } = keypoint.position;
	if (y != null && x!= null && keypoint.score !=null){
    y_arr.push(y);
    x_arr.push(x);
    //console.log(y_arr[i])
    //console.log(x_arr[i])
    score.push(keypoint.score);
    //console.log(score[i])
	}
	let Flag_position = "General"

	let max_iter_L = Math.max (ind_Lankl.length,ind_Lelbw.length,ind_Lhip.length,ind_Lknee.length,ind_Lshldr.length,ind_Lwrst.length);
	let max_iter_R = Math.max (ind_Rankl.length,ind_Relbw.length,ind_Rhip.length,ind_Rknee.length,ind_Rshldr.length,ind_Rwrst.length);
	let max_iter = Math.max(max_iter_L,max_iter_R)
	if (max_iter_R == 0 || max_iter_L == 0) {
		Flag = "Profile";
	} 
		
	let Angle_Elb_L = 0.0;
	let Angle_Shldr_L = 0.0;
	let Angle_Hip_L = 0.0;
	let Angle_Knee_L = 0.0;
	let Angle_Elb_R = 0.0;
	let Angle_Shldr_R = 0.0;
	let Angle_Hip_R = 0.0;
	let Angle_Knee_R = 0.0;
	let ind_nose_t = ind_nose[0];
	let ind_Lwrst_t = ind_Lwrst[0];
    let ind_Rwrst_t = ind_Rwrst[0];
    let ind_Lelbw_t = ind_Lelbw[0];
    let ind_Relbw_t = ind_Relbw[0];
    let ind_Lshldr_t = ind_Lshldr[0];
    let ind_Rshldr_t = ind_Rshldr[0];
    let ind_Lhip_t = ind_Lhip[0];
    let ind_Rhip_t = ind_Rhip[0];
    let ind_Lknee_t = ind_Lknee[0];
    let ind_Rknee_t = ind_Rknee[0];
    let ind_Lankl_t = ind_Lankl[0];
    let ind_Rankl_t = ind_Rankl[0];
	if (Math.abs(x_arr[ind_nose_t] - (avge(x_arr[ind_Rshldr_t],x_arr[ind_Lshldr_t]))<=50)){
	Flag = "Front view";}
	if (ind_Lwrst_t != null && ind_Lelbw_t != null && ind_Lshldr_t != null){
	Angle_Elb_L = calcAngle(x_arr[ind_Lwrst_t],y_arr[ind_Lwrst_t],x_arr[ind_Lelbw_t],y_arr[ind_Lelbw_t],x_arr[ind_Lshldr_t],y_arr[ind_Lshldr_t]);}
	if (ind_Lhip_t != null && ind_Lelbw_t != null && ind_Lshldr_t != null){
	Angle_Shldr_L = calcAngle(x_arr[ind_Lelbw_t],y_arr[ind_Lelbw_t],x_arr[ind_Lshldr_t],y_arr[ind_Lshldr_t],x_arr[ind_Lhip_t],y_arr[ind_Lhip_t]);}
	if (ind_Lknee_t != null && ind_Lhip_t != null && ind_Lshldr_t != null){
	Angle_Hip_L = calcAngle(x_arr[ind_Lshldr_t],y_arr[ind_Lshldr_t],x_arr[ind_Lhip_t],y_arr[ind_Lhip_t],x_arr[ind_Lknee_t],y_arr[ind_Lknee_t]);}
	if (ind_Lknee_t != null && ind_Lhip_t != null && ind_Lankl_t != null){
	Angle_Knee_L = calcAngle(x_arr[ind_Lhip_t],y_arr[ind_Lhip_t],x_arr[ind_Lknee_t],y_arr[ind_Lknee_t],x_arr[ind_Lankl_t],y_arr[ind_Lankl_t]);}
	if (ind_Rwrst_t != null && ind_Relbw_t != null && ind_Rshldr_t != null){
	Angle_Elb_R = calcAngle(x_arr[ind_Rwrst_t],y_arr[ind_Rwrst_t],x_arr[ind_Relbw_t],y_arr[ind_Relbw_t],x_arr[ind_Rshldr_t],y_arr[ind_Rshldr_t]);}
	if (ind_Rhip_t != null && ind_Relbw_t != null && ind_Rshldr_t != null){
	Angle_Shldr_R = calcAngle(x_arr[ind_Relbw_t],y_arr[ind_Relbw_t],x_arr[ind_Rshldr_t],y_arr[ind_Rshldr_t],x_arr[ind_Rhip_t],y_arr[ind_Rhip_t]);}
	if (ind_Rknee_t != null && ind_Rhip_t != null && ind_Rshldr_t != null){
	Angle_Hip_R = calcAngle(x_arr[ind_Rshldr_t],y_arr[ind_Rshldr_t],x_arr[ind_Rhip_t],y_arr[ind_Rhip_t],x_arr[ind_Rknee_t],y_arr[ind_Rknee_t]);}
	if (ind_Rknee_t != null && ind_Rhip_t != null && ind_Rankl_t != null){
	Angle_Knee_R = calcAngle(x_arr[ind_Rhip_t],y_arr[ind_Rhip_t],x_arr[ind_Rknee_t],y_arr[ind_Rknee_t],x_arr[ind_Rankl_t],y_arr[ind_Rankl_t]);}
	if (Flag == "Left profile") {
		console.log("Left profile detected")
		if (Angle_Elb_L!=0){
		console.log("Angle_elbow_left:")
		console.log(Angle_Elb_L)}
		if (Angle_Shldr_L!=0){
		console.log("Angle_shoulder_left:")
		console.log(Angle_Shldr_L)}
		if (Angle_Hip_L!=0){
		console.log("Angle_hip_left:")
		console.log(Angle_Hip_L)}
		if (Angle_Knee_L!=0){
		console.log("Angle_knee_left:")
		console.log(Angle_Knee_L)}
	} else if (Flag == "Right Profile") {
		console.log("Right profile detected")
		if (Angle_Elb_R!=0){
		console.log("Angle_elbow_Right:")
		console.log(Angle_Elb_R)}
		if (Angle_Shldr_R!=0){
		console.log("Angle_shoulder_Right:")
		console.log(Angle_Shldr_R)}
		if (Angle_Hip_R!=0){
		console.log("Angle_hip_Right")
		console.log(Angle_Hip_R)}
		if (Angle_Knee_R!=0){
		console.log("Angle_knee_Right:")
		console.log(Angle_Knee_R)}
	}
	else {
		console.log(Flag)
		if (Angle_Elb_L!=0){
		console.log("Angle_elbow_left:")
		console.log(Angle_Elb_L)}
		if (Angle_Shldr_L!=0){
		console.log("Angle_shoulder_left:")
		console.log(Angle_Shldr_L)}
		if (Angle_Hip_L!=0){
		console.log("Angle_hip_left:")
		console.log(Angle_Hip_L)}
		if (Angle_Knee_L!=0){
		console.log("Angle_knee_left:")
		console.log(Angle_Knee_L)}
		if (Angle_Elb_R!=0){
		console.log("Angle_elbow_Right:")
		console.log(Angle_Elb_R)}
		if (Angle_Shldr_R!=0){
		console.log("Angle_shoulder_Right:")
		console.log(Angle_Shldr_R)}
		if (Angle_Hip_R!=0){
		console.log("Angle_hip_Right")
		console.log(Angle_Hip_R)}
		if (Angle_Knee_R!=0){
		console.log("Angle_knee_Right:")
		console.log(Angle_Knee_R)}
	}

    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(boundingBox.minX, boundingBox.minY,
    boundingBox.maxX - boundingBox.minX, boundingBox.maxY - boundingBox.minY);

  ctx.stroke();
}

/**
 * Converts an arary of pixel data into an ImageData object
 */
async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext('2d');
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));

  drawPoints(ctx, scaledValues, radius, color);
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
  const data = points.buffer().values;

  for (let i = 0; i < data.length; i += 2) {
    const pointY = data[i];
    const pointX = data[i + 1];

    if (pointX !== 0 && pointY !== 0) {
      ctx.beginPath();
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

/**
 * Draw offset vector values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's offset vector outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
function drawOffsetVectors(
  heatMapValues, offsets, outputStride, scale = 1, ctx) {
  const offsetPoints = posenet.singlePose.getOffsetPoints(
    heatMapValues, outputStride, offsets);

  const heatmapData = heatMapValues.buffer().values;
  const offsetPointsData = offsetPoints.buffer().values;

  for (let i = 0; i < heatmapData.length; i += 2) {
    const heatmapY = heatmapData[i] * outputStride;
    const heatmapX = heatmapData[i + 1] * outputStride;
    const offsetPointY = offsetPointsData[i];
    const offsetPointX = offsetPointsData[i + 1];

    drawSegment([heatmapY, heatmapX], [offsetPointY, offsetPointX],
      color, scale, ctx);
  }
}