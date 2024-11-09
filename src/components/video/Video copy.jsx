import React from 'react';
import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import { DefaultAudioLayout, defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import './Video.css'
const Video = ({ src, poster, textTracks, thumbnailTracks, autoPlay = true, height = 'auto' }) => {
    return (
        <>
            <MediaPlayer
                style={{ height: height }}
                className="player"
                src={src}
                autoplay={autoPlay}
                paused={true}
            >
                <MediaProvider>
                    <Poster
                        className="vds-poster"
                        src={poster}
                    />
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

        </>
    )
}

export default Video