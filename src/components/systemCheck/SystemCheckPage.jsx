"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tfConfig from "../../utils/tfConfig";
import Webcam from "react-webcam";
import ProgressCard from "./ProgressCard";
import { Alert, Button, Modal } from "antd";

const SystemCheckPage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isOnline, setIsOnline] = useState();
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [micAvailable, setMicAvailable] = useState(null);
  const [turnOnWebam, setTurnOnWebcam] = useState(false);
  const [camAvailable, setCamAvailable] = useState(null);
  const [isCheckDone, setIsCheckDone] = useState(false);

  //parameters data arrays
  const [objectData, setObjectData] = useState([]);
  const [internetSpeedData, setInternetSpeedData] = useState([]);
  const [miCheckData, setMiCheckData] = useState([]);
  const [brightnessData, setBrightnessData] = useState([]);
  const [alert, setAlert] = useState(()=>{});

  // useEffect(() => {}, [turnOnWebam]);

 useEffect(() => {
    // if (isCheckDone) setTurnOnWebcam(false);
    const newAlert = () => {if (isCheckDone) {
      if (findMostFrequent(miCheckData) !== false && findMostFrequent(objectData) === "person" && findMostFrequent(brightnessData) !== "low" && calculateMean(internetSpeedData) >= 600) {
        setIsModalOpen(true);
      } else if (findMostFrequent(objectData) !== "person") {
        return <Alert closable message="Error" description="Camera cannot detect you, please position properly and keep camera on" type="error" showIcon />;
      } else if (findMostFrequent(miCheckData) === false) {
        return <Alert closable message="Error" description="Please check your mic and ensure your mic is unmuted" type="error" showIcon />;
      } else if (findMostFrequent(brightnessData) === "low") {
        return <Alert closable message="Error" description="Please check that your area has good lighting" type="error" showIcon />;
      } else if (calculateMean(internetSpeedData) < 600) {
        return <Alert closable message="Error" description="Please check your internet connection" type="error" showIcon />;
      }
   }
   }
   setAlert(newAlert())
  }, [brightnessData, internetSpeedData, isCheckDone, miCheckData, objectData]);

  // ANALYZING DATA
  function findMostFrequent(arr) {
    const countMap = {};
    let maxCount = 0;
    let mostFrequentItem;

    arr.forEach((item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      if (countMap[item] > maxCount) {
        maxCount = countMap[item];
        mostFrequentItem = item;
      }
    });

    return mostFrequentItem;
  }
  function calculateMean(arr) {
    const sum = arr.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / arr.length;

    return mean;
  }

  // HANDLERS
  // Object detetion function
  const handleRunCoco = async () => {
    const net = await cocossd.load();

    const timer = setInterval(() => {
      detect(net);
    }, 100);
    setTimeout(() => {
      clearInterval(timer);
    }, 5000);
    return () => clearInterval(timer);
  };

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      setObjectData((prev) => [...prev, obj[0] ? obj[0].class : "none"]);
    }
  };

  // Internet speed
  const checkInternetSpeed = async () => {
    const startTime = Date.now();
    try {
      await fetch("https://www.google.com/", { mode: "no-cors" });
      const endTime = Date.now();
      const speed = endTime - startTime;
      setInternetSpeedData((prev) => [...prev, speed]);
      // above 600ms slow
      console.log("speed", speed);
      // setInternetSpeed(speed);
    } catch (error) {
      console.error("Error checking internet speed:", error);
      setInternetSpeedData((prev) => [...prev, 0]);
    }
  };
  // Check if Online
  const checkIfOnline = () => {
    const handleConnectionChange = () => {
      setIsOnline(window.navigator.onLine);
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);
    console.log("online", isOnline);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  };

  // Check camera availability
  const handleCameraCheck = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCamAvailable(true);
    } catch (err) {
      setCamAvailable(false);
      console.error("Error accessing camera:", err);
    }
  };

  // Handle mic check
  const handleMicCheck = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMiCheckData((prev) => [...prev, true]);
    } catch (error) {
      setMiCheckData((prev) => [...prev, false]);
    }
  };

  //Handle Brightness
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  const checkBrightness = async () => {
    const imageSrc = await capture();
    const image = new Image();
    image.src = imageSrc;

    const calculateBrightness = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Get the pixel data from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate the average brightness of the pixels
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += luminance;
      }
      const avgBrightness = sum / (data.length / 4);

      // Determine the lighting based on the average brightness
      let lighting;
      if (avgBrightness < 100) {
        lighting = "low";
      } else if (avgBrightness < 200) {
        lighting = "medium";
      } else {
        lighting = "high";
      }
      setBrightnessData((prev) => [...prev, lighting]);
    };

    image.onload = () => {
      calculateBrightness();
    };
  };

  const handleLighting = () => {
    const timer = setInterval(checkBrightness, 100);
    setTimeout(() => {
      clearInterval(timer);
    }, 5000);
    return () => clearInterval(timer);
  };

  const handleSystemCheck = async () => {
    setAnalyzing(true);
    const cameraPromise = handleCameraCheck();
    const lightingPromise = handleLighting();
    const micPromise = new Promise((resolve) => {
      const micTimer = setInterval(() => {
        handleMicCheck();
      }, 100);
      setTimeout(() => {
        clearInterval(micTimer);
        resolve();
      }, 5000);
    });
    const objPromise = handleRunCoco();
    const internetPromise = new Promise((resolve) => {
      const internetTimer = setInterval(() => {
        checkInternetSpeed();
      }, 100);
      setTimeout(() => {
        clearInterval(internetTimer);
        resolve();
      }, 5000);
    });

    await Promise.all([cameraPromise, lightingPromise, micPromise, objPromise, internetPromise]);
    setTurnOnWebcam(false);
    setIsCheckDone(true);
    setAnalyzing(false);
  };

  // HANDLERS END

  return (
    <>
      {alert}
      <Modal open={isModalOpen} title="Start Assessment" cancelButtonProps={{ className: "hidden" }} closable={false} footer={null}>
        <h1 className="text-[var(--app-purple)] text-2xl font-bold text-center">Proceed to start assessment</h1>
        <p className="text-center text-sm">Kindly keep to the rules of the assessment and sit up, stay in front of your camera/webcam and start your assessment.</p>
        <div className="mt-6 py-3 bg-white rounded-xl w-full">
          <Button
            onClick={() => {
              setBrightnessData([]);
              setInternetSpeedData([]);
              setObjectData([]);
              setMiCheckData([]);
              setIsCheckDone(false);
              // setTurnOnWebcam(false);
              setIsModalOpen(false);
            }}
            className="bg-[var(--app-purple)] text-white text-xs py-2 px-3 rounded-md ml-auto">
            Proceed
          </Button>
        </div>
      </Modal>
      <div className="bg-white rounded-[20px] px-[2vw] sm:px-12 py-9 mx-auto w-5/6 sm:w-[61vw] flex flex-col gap-10">
        <div>
          <h1 className="font-semibold text-xl pb-2">System check</h1>
          <p className="text-sm ">We utilize your camera image to ensure fairness for all participants, and we also employ both your camera and microphone for a video questions where you will be prompted to record a response using your camera or webcam, so its essential to verify that your camera and microphone are functioning correctly and that you have a stable internet connection. To do this, please position yourself in front of your camera, ensuring that your entire face is clearly visible on the screen. This includes your forehead, eyes, ears, nose, and lips. You can initiate a 5-second recording of yourself by clicking the button below.</p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row  gap-6 ">
          <div className="relative h-40 w-[275px]">
            {turnOnWebam ? <Webcam ref={webcamRef} className="border rounded-[10px] border-[var(--app-purple)] h-40 w-[275px] absolute " /> : <div></div>} <canvas ref={canvasRef} className="border rounded-[10px] border-[var(--app-purple)] h-40 w-[275px] absolute " />
          </div>
          {/* mr-8 */}
          <div className="relative grid grid-cols-2 gap-3 w-[275px] lg:w-fit ">
            <>
              <ProgressCard parameter="Webcam" checkComplete={isCheckDone} result={findMostFrequent(objectData) === "person" ? "pass" : "fail"} key={1} />
              <ProgressCard parameter="Speed" checkComplete={isCheckDone} result={calculateMean(internetSpeedData) > 600 ? "pass" : "fail"} key={2} />
            </>
            <>
              <ProgressCard parameter="Gadget mic" checkComplete={isCheckDone} result={findMostFrequent(miCheckData) === true ? "pass" : "fail"} key={3} />
              <ProgressCard parameter="Lighting" checkComplete={isCheckDone} result={findMostFrequent(brightnessData) === "medium" ? "average" : findMostFrequent(brightnessData) === "high" ? "pass" : "fail"} key={4} />
            </>
          </div>
        </div>
        {/* Button for systemcheck */}
        <Button
          loading={analyzing}
          className="border bg-[var(--app-purple)] text-white rounded-md px-4 py-2 w-fit text-sm"
          onClick={() => {
            setTurnOnWebcam(true);
            handleSystemCheck();
          }}
          title="Take picture and continue">
          {analyzing ? "Analyzing" : "Take picture and continue"}
        </Button>
      </div>
    </>
  );
};

export default SystemCheckPage;
