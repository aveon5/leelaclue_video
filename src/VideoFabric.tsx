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

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                opacity
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
            <Img
                src={staticFile("assets/app_icon.png")}
                style={{
                    width: 300,
                    height: 300,
                    marginBottom: 40,
                    borderRadius: 40,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                }}
            />
            <h1
                style={{
                    fontSize: 50,
                    fontFamily: 'Philosopher',
                    color: '#D4AF37',
                    textAlign: 'center',
                    textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}
            >
                LeelaClue
            </h1>
            <h2
                style={{
                    fontSize: 40,
                    fontFamily: 'Philosopher',
                    color: '#eee',
                    marginTop: 20,
                    textAlign: 'center'
                }}
            >
                Get your download today!
            </h2>
        </AbsoluteFill>
    );
};
