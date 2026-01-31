import React from 'react';
import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, useVideoConfig, staticFile, Audio, prefetch } from 'remotion';
import { z } from 'zod';
import { VideoCard, videoCardSchema } from './components/VideoCard';
import musicSource from "../public/assets/music.mp3";

export const leelaInMotionSchema = z.object({
    id: z.number(),
    question: z.string(),
    language: z.string(),
    status: videoCardSchema,
    obstacle: videoCardSchema,
    resource: videoCardSchema,
});

export const LeelaInMotion: React.FC<z.infer<typeof leelaInMotionSchema>> = ({
    question,
    status,
    obstacle,
    resource,
}) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Persistent Background */}
            <Img
                src={staticFile("assets/main_new.png")}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.8,
                }}
            />

            {/* Intro: Question - 5 seconds at 24fps */}
            <Sequence from={0} durationInFrames={120}>
                <Intro question={question} />
            </Sequence>

            {/* Card 1: Status - 8 seconds at 24fps to match video length */}
            <Sequence from={120} durationInFrames={192}>
                <VideoCard key={`status-${status.card_id}`} {...status} type="status" />
            </Sequence>

            {/* Card 2: Obstacle - 8 seconds at 24fps to match video length */}
            <Sequence from={312} durationInFrames={192}>
                <VideoCard key={`obstacle-${obstacle.card_id}`} {...obstacle} type="obstacle" />
            </Sequence>

            {/* Card 3: Resource - 8 seconds at 24fps to match video length */}
            <Sequence from={504} durationInFrames={192}>
                <VideoCard key={`resource-${resource.card_id}`} {...resource} type="resource" />
            </Sequence>

            {/* Outro - 3 seconds at 24fps */}
            <Sequence from={696} durationInFrames={72}>
                <Outro />
            </Sequence>

            {/* Background Music */}
            <Audio
                src={musicSource}
                volume={(f) =>
                    interpolate(f, [0, 48, 744, 768], [0, 0.5, 0.5, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    })
                }
            />
        </AbsoluteFill>
    );
};

// Prefetch helper component to load videos early
const PrefetchVideos: React.FC<{
    status: any;
    obstacle: any;
    resource: any;
}> = ({ status, obstacle, resource }) => {
    React.useEffect(() => {
        // Prefetch all videos at component mount to avoid buffering during playback
        prefetch(staticFile(status.video));
        prefetch(staticFile(obstacle.video));
        prefetch(staticFile(resource.video));
    }, [status.video, obstacle.video, resource.video]);

    return null;
};

const Intro: React.FC<{ question: string }> = ({ question }) => {
    const frame = useCurrentFrame();

    // Slow fade in for the question (starts at frame 30, takes 60 frames)
    const textOpacity = interpolate(frame, [30, 90], [0, 1]);
    const textTranslateY = interpolate(frame, [30, 90], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
    });

    // Silhouette fade in (faster)
    const imageOpacity = interpolate(frame, [0, 30], [0, 1]);

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'flex-start', // Move text to top
                alignItems: 'center',
                backgroundColor: 'black',
                paddingTop: 150
            }}
        >
            <Audio src={staticFile("assets/question_audio.mp3")} />

            {/* Thinking Woman Silhouette Background */}
            <Img
                src={staticFile("assets/main_new.png")}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.3, // Low opacity for base background
                    top: 0
                }}
            />
            <Img
                src={staticFile("assets/thinking_woman.png")}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Cover to fill
                    opacity: imageOpacity,
                    zIndex: 1,
                    // Blend edges to remove "own background" look
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
                    mixBlendMode: 'screen'
                }}
            />

            <div
                style={{
                    zIndex: 2,
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY}px)`,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: 40,
                    borderRadius: 20,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    border: '1px solid #D4AF37',
                    maxWidth: '80%'
                }}
            >
                <h1
                    style={{
                        fontSize: 60,
                        fontFamily: 'Philosopher',
                        textAlign: 'center',
                        color: '#D4AF37', // Gold text
                        textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                        margin: 0
                    }}
                >
                    {question}
                </h1>
            </div>
        </AbsoluteFill>
    );
};

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    // Breathing Animation (Alive)
    const breath = Math.sin(frame / 10) * 0.03 + 1;

    // Light Blick (Shine) effect - subtle sweep
    const shinePos = interpolate(frame % 90, [0, 45], [-100, 200]);

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                opacity,
            }}
        >
            <Img
                src={staticFile("assets/main_new.png")}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.4,
                }}
            />

            <div style={{
                position: 'relative',
                marginBottom: 50,
                marginTop: -50,
                transform: `scale(${breath})`,
                borderRadius: '50%',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.4), 0 20px 40px rgba(0,0,0,0.6)',
                overflow: 'hidden'
            }}>
                <Img
                    src={staticFile("assets/app_icon.png")}
                    style={{
                        width: 450,
                        height: 450,
                        borderRadius: '50%',
                        display: 'block'
                    }}
                />
                {/* Light Blick / Shine Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 100,
                    left: 0,
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
                    transform: `skewX(-20deg) translateX(${shinePos}%)`,
                    pointerEvents: 'none'
                }} />
            </div>

            <h1
                style={{
                    fontSize: 100,
                    fontFamily: 'Philosopher',
                    color: '#D4AF37',
                    textAlign: 'center',
                    textShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
                    margin: 0,
                    marginBottom: 20
                }}
            >
                LeelaClue
            </h1>
            <h2
                style={{
                    fontSize: 40,
                    fontFamily: 'Philosopher',
                    color: '#eee',
                    textAlign: 'center',
                    maxWidth: '80%',
                    lineHeight: 1.3,
                    marginBottom: 60
                }}
            >
                Die Antwort entsteht im Innehalten – <br /> LeelaClue begleitet dich dabei!
            </h2>

            <div style={{
                position: 'absolute',
                bottom: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: 0.8
            }}>
                <p style={{
                    fontSize: 28,
                    fontFamily: 'sans-serif',
                    color: '#aaa',
                    margin: 0,
                    marginBottom: 10
                }}>
                    Available on Apple Store and Google Play
                </p>
            </div>
        </AbsoluteFill>
    );
};
