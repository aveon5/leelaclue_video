import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile } from 'remotion';
import { z } from 'zod';
import { Card, cardSchema } from './components/Card';

export const taskSchema = z.object({
    id: z.number(),
    question: z.string(),
    language: z.string(),
    status: cardSchema,
    obstacle: cardSchema,
    resource: cardSchema,
});

export const VideoFabric: React.FC<z.infer<typeof taskSchema>> = ({
    question,
    status,
    obstacle,
    resource,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bgOpacity = interpolate(frame, [0, 20], [0, 1]);

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
                    opacity: 0.8, // Visible but slightly darkened by black bg
                }}
            />

            {/* Intro: Question */}
            <Sequence from={0} durationInFrames={150}>
                <Intro question={question} />
            </Sequence>

            {/* Card 1: Status */}
            <Sequence from={150} durationInFrames={150}>
                <Card {...status} type="status" />
            </Sequence>

            {/* Card 2: Obstacle */}
            <Sequence from={300} durationInFrames={150}>
                <Card {...obstacle} type="obstacle" />
            </Sequence>

            {/* Card 3: Resource */}
            <Sequence from={450} durationInFrames={150}>
                <Card {...resource} type="resource" />
            </Sequence>

            {/* Outro */}
            <Sequence from={600} durationInFrames={90}>
                <Outro />
            </Sequence>
        </AbsoluteFill>
    );
};

const Intro: React.FC<{ question: string }> = ({ question }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: {
            damping: 200,
        },
    });

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 50,
            }}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    backgroundColor: 'rgba(0,0,0,0.6)', // Dark container
                    padding: 40,
                    borderRadius: 20,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '2px solid #D4AF37' // Gold border
                }}
            >
                <h1
                    style={{
                        fontSize: 60,
                        fontFamily: 'Philosopher', // Use mystic font
                        textAlign: 'center',
                        color: '#D4AF37', // Gold text
                        textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
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
    const breath = Math.sin(frame / 10) * 0.03 + 1; // 1.0 to 1.06

    // Light Blick (Shine) effect - subtle sweep
    const shinePos = interpolate(frame % 90, [0, 45], [-100, 200]); // Fast sweep every 3 sec

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
                marginTop: -50, // Move higher
                transform: `scale(${breath})`,
                borderRadius: '50%',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.4), 0 20px 40px rgba(0,0,0,0.6)', // Gold glow + shadow
                overflow: 'hidden' // For shine
            }}>
                <Img
                    src={staticFile("assets/app_icon.png")}
                    style={{
                        width: 450, // Bigger
                        height: 450,
                        borderRadius: '50%', // Round
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
                    fontSize: 100, // Bigger
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
                bottom: 80, // Not at very bottom
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
                {/* Could add store icons here later if needed */}
            </div>
        </AbsoluteFill>
    );
};
