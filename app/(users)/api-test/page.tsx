// import { fetchPodcasts } from "../utils/podbean";
"use client"

import { cookies } from "next/headers";
import { useState, useRef, useEffect } from "react";
import './styles.css';



export default function Page() {
const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
const audioRef = useRef(null);
const progressBarRef = useRef(null);
const playAnimationRef = useRef(null);


function togglePlayPause (){
  setIsPlaying((prev) => !prev);

if(isPlaying){
  audioRef.current.pause();
}
else{ 
  audioRef.current.play();
}
playAnimationRef.current = requestAnimationFrame(repeat);
};

function handleProgressChange(){
audioRef.current.currentTime = progressBarRef.current.value;
setTimeProgress(progressBarRef.current.value);
}

function onLoadedMetadata(){
  const seconds = audioRef.current.duration;
  setDuration(seconds);
    progressBarRef.current.max = seconds;
    progressBarRef.current.value = 0;
}


function formatTime(time){
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const formatMinutes =
      minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds =
      seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
  }
  return '00:00';
};


const repeat = () => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
  playAnimationRef.current = requestAnimationFrame(repeat);
};


  return (

    <div>
      <audio 
      src="https://mcdn.podbean.com/mf/web/7hwf5hmcypbqjj8b/eng.mp3"
      onLoadedMetadata={onLoadedMetadata}
      ref={audioRef}
       >
    </audio>
      <h1 className="text-white">Player Test</h1>
       <p className="text-white">{isPlaying ? "Audio playing" : "Audio stop"} </p>
      <div className="audio-container">
        
    <button
        type="button"
        onClick={togglePlayPause}
      >{isPlaying ? "Pause" : "Play"}</button>
<div className="progress">

      <input type="range" ref={progressBarRef} 
              onChange={handleProgressChange}
      />
      <div className="time-container">      <span className="time current">{formatTime(timeProgress)}</span>
      <span className="time">{formatTime(duration)}</span></div>



          
    </div>
     
          

    </div>
    </div>  
  );
}