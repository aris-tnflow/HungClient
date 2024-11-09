import React, { useEffect, useRef } from "react";
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  Time,
  Track,
} from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "./Video.css";

const Video = ({
  time,
  title,
  src,
  poster,
  textTracks,
  thumbnailTracks,
  autoPlay = true,
  height = "auto",
  videoId,
  className,
  mediaPlayerRef,
  onPlay,
  onPause,
}) => {
  return (
    <MediaPlayer
      ref={mediaPlayerRef}
      style={{ height: height }}
      className={className}
      onPause={onPause}
      title={title}
      src={src}
      currentTime={time}
      onPlay={() => onPlay(videoId, time)}
      onEnded={() => console.log("Video ended")}
      autoplay={autoPlay}
    >
      <MediaProvider>
        <Poster className="vds-poster" src={poster} />
        {textTracks?.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        thumbnails={thumbnailTracks}
      />
    </MediaPlayer>
  );
};

export default Video;
