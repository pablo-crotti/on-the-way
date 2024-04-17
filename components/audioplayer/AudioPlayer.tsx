
"use client"

import { useState, useRef, useEffect, use } from "react";
import './styles.css';
import { Play } from "@/components/play";


export const  AudioPlayer = ({ episodeSource }: {episodeSource: string}) => {

const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
const audioRef = useRef<HTMLAudioElement| null>(null);
const playAnimationRef = useRef<Number | null>(null);
const ProgressBarRef = useRef<HTMLInputElement| null>(null);
const borderProgressBarRef = useRef<HTMLDivElement| null>(null);





function togglePlayPause (){
  setIsPlaying((prev) => !prev);

  if (isPlaying) {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  } else { 
    if (audioRef.current) {
      audioRef.current.play();
    }
  }
    requestAnimationFrame(repeat);

}





function formatTime(time: number) {
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

function handleNext () {
  if(audioRef.current) {
    audioRef.current.currentTime = 0;
  }
  if(ProgressBarRef.current) {
    setTimeProgress(Number(ProgressBarRef.current.value));
  }
  setIsPlaying(false);
}


function repeat (){
  if(audioRef.current && ProgressBarRef.current) {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    ProgressBarRef.current.value = `${currentTime}`;
    ProgressBarRef.current.style.setProperty(
      '--range-progress',
      `${(Number(ProgressBarRef.current.value) / duration) * 100}%`
    );

  playAnimationRef.current = requestAnimationFrame(repeat);
  }
};

function handleProgressChange(e : React.MouseEvent<HTMLDivElement>){

  const clicked = e.clientX;
 
  if(borderProgressBarRef.current && audioRef.current) {
const rightEl = borderProgressBarRef.current.getBoundingClientRect().right;
const leftEl = borderProgressBarRef.current.getBoundingClientRect().left;
const widthEl = borderProgressBarRef.current.offsetWidth;
  
const percentage = ((clicked - leftEl) / widthEl) * 100;
const time = (percentage * duration) / 100;
setTimeProgress(time);
audioRef.current.currentTime = time;
  }

}

function test(){
  if(audioRef.current) {
    setDuration(audioRef.current.duration);
  }
}



  return (

    <div>

        <audio
        src={episodeSource}
      preload="auto"
        onEnded={handleNext}
        ref={audioRef}
        onLoadedMetadata={test}
         >

      </audio>
      <div className="audio-container">
        
    <button
        type="button"
        onClick={togglePlayPause}
      >

{isPlaying ? <Play  active={false}  /> : <Play active={true} />}

</button>
<div className="progress">


      
      <div className="borderProgressBar" onClick={handleProgressChange} ref={borderProgressBarRef}>   
 <div className="progressBar" ref={ProgressBarRef} ></div>
      </div>
      
     
      <div className="time-container">      <span className="time current">{formatTime(timeProgress)}</span>
      <span className="time">{formatTime(duration)}</span></div>



          
    </div>
     
          

    </div>
    </div>  
  );
}