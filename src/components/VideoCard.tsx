import { AbsoluteFill, Video, interpolate, useCurrentFrame, staticFile, spring, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const videoCardSchema = z.object({
    card_id: z.number(),
    title: z.string(),
    description: z.string(),
    video: z.string(),
    theme_location: z.array(z.string()).optional(),
    theme_blindspot: z.array(z.string()).optional(),
    theme_solution: z.array(z.string()).optional(),
});

type VideoCardProps = z.infer<typeof videoCardSchema> & {
    type: 'status' | 'obstacle' | 'resource';
};

export const VideoCard: React.FC<VideoCardProps> = ({
    title,
    description,
    video,
    theme_location,
    theme_blindspot,
    theme_solution,
    type,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Simple fade-in animation only - no 3D transforms to avoid jerkiness
    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Text appears after 2 seconds (48 frames at 24 fps)
    const textOpacity = interpolate(frame, [48, 72], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Theme logic
    let themeTitle = '';
    let themeQuestions: string[] = [];
    let themeColor = '#D4AF37'; // Default Gold

    if (type === 'status' && theme_location) {
        themeTitle = 'Status / Location';
        themeQuestions = theme_location;
        themeColor = '#4EA8DE'; // Blueish
    } else if (type === 'obstacle' && theme_blindspot) {
        themeTitle = 'Obstacle / Blindspot';
        themeQuestions = theme_blindspot;
        themeColor = '#E63946'; // Reddish
    } else if (type === 'resource' && theme_solution) {
        themeTitle = 'Resource / Solution';
        themeQuestions = theme_solution;
        themeColor = '#2A9D8F'; // Greenish
    }

    // Video path handling
    const videoSource = staticFile(video);
    console.log(`Rendering VideoCard type=${type} video=${video} source=${videoSource}`);

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    width: '900px',
                    height: '1400px',
                    borderRadius: 30,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'black',
                    border: '3px solid #D4AF37',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 30px 80px rgba(0,0,0,0.5)',
                    opacity,
                }}
            >
                {/* Mystic Inner Frame Decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: 15,
                        left: 15,
                        right: 15,
                        bottom: 15,
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: 20,
                        zIndex: 10,
                        pointerEvents: 'none',
                        boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.2)'
                    }}
                />

                {/* Corner Accents */}
                <div style={{ position: 'absolute', top: 15, left: 15, width: 60, height: 60, borderTop: '4px double #D4AF37', borderLeft: '4px double #D4AF37', borderTopLeftRadius: 20, zIndex: 11 }} />
                <div style={{ position: 'absolute', top: 15, right: 15, width: 60, height: 60, borderTop: '4px double #D4AF37', borderRight: '4px double #D4AF37', borderTopRightRadius: 20, zIndex: 11 }} />
                <div style={{ position: 'absolute', bottom: 15, left: 15, width: 60, height: 60, borderBottom: '4px double #D4AF37', borderLeft: '4px double #D4AF37', borderBottomLeftRadius: 20, zIndex: 11 }} />
                <div style={{ position: 'absolute', bottom: 15, right: 15, width: 60, height: 60, borderBottom: '4px double #D4AF37', borderRight: '4px double #D4AF37', borderBottomRightRadius: 20, zIndex: 11 }} />

                {/* Video Background */}
                <Video
                    key={videoSource}
                    src={videoSource}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    muted
                    playbackRate={1}
                    pauseWhenBuffering={false}
                />


                {/* Top Gradient Overlay for Title/Description */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: 50,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        opacity: textOpacity
                    }}
                >
                    <h2
                        style={{
                            fontSize: 70,
                            marginBottom: 20,
                            fontFamily: 'Philosopher',
                            color: 'white',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            textAlign: 'center'
                        }}
                    >
                        {title}
                    </h2>
                    <p
                        style={{
                            fontSize: 32,
                            fontFamily: 'Philosopher',
                            color: '#eee',
                            lineHeight: 1.4,
                            textAlign: 'center'
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* Bottom Gradient Overlay REMOVED - causing rendering issues */}
                {/* Keeping only title and description as requested */}
            </div>
        </AbsoluteFill>
    );
};
