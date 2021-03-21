import React, { RefObject, useEffect } from 'react'
import Hls, { Config } from 'hls.js'

export interface HlsPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    hlsConfig?: Config
    playerRef ?: RefObject<HTMLVideoElement>
    url: string
}

// Hijacked from: https://github.com/devcshort/react-hls
// Rewrote code to try to understand useEffect() better
function HlsPlayer({
    hlsConfig,
    playerRef = React.createRef<HTMLVideoElement>(),
    autoPlay,
    url,
    ...props
}: HlsPlayerProps) {
    useEffect(() => {
        let hls: Hls

        function _initPlayer() {
            if (hls != null) {
                hls.destroy()
            }

            let newHls = new Hls({
                enableWorker: false,
                ...hlsConfig
            })
            
            if (playerRef.current != null) {
                newHls.attachMedia(playerRef.current)
            }

            newHls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError()
                            break
                        default:
                            _initPlayer()
                            break
                    }
                }
            })

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                newHls.loadSource(url)
                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (autoPlay) {
                        playerRef?.current?.play()
                    }
                })
            })

            hls = newHls
        }

        _initPlayer()

        return () => {
            if (hls != null) {
                hls.destroy()
            }
        }
    }, [autoPlay, playerRef, hlsConfig, url])

    return (
        <video ref={playerRef} {...props} />
    )
}
export default HlsPlayer