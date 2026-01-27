import { AbsoluteFill, Img, interpolate, useCurrentFrame, staticFile, spring, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const cardSchema = z.object({
    card_id: z.number(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    theme_location: z.array(z.string()).optional(),
    theme_blindspot: z.array(z.string()).optional(),
    theme_solution: z.array(z.string()).optional(),
});

type CardProps = z.infer<typeof cardSchema> & {
    type: 'status' | 'obstacle' | 'resource';
};

export const Card: React.FC<CardProps> = ({
    title,
    description,
    image,
    theme_location,
    theme_blindspot,
    theme_solution,
    type,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // "Mystical" Fly-in: Slower, floaty
    const spr = spring({
        frame,
        fps,
        config: {
            damping: 20, // Less bouncy, more smooth
            stiffness: 60, // Softer spring
            mass: 2, // Heavier feel
        },
    });

    // Fly in from deep Z-space with rotation
    // "Drehen": Rotate Y axis for the flipping card effect
    const translateY = interpolate(spr, [0, 1], [800, 0]);
    const translateZ = interpolate(spr, [0, 1], [-2000, 0]); // Come from far away
    const rotateY = interpolate(spr, [0, 1], [360 * 2, 0]); // Spin twice
    const opacity = interpolate(spr, [0, 0.5], [0, 1]);

    // Floating effect after landing (sine wave)
    const float = Math.sin(frame / 40) * 10;

    // Text appears softly
    const textOpacity = interpolate(frame, [40, 60], [0, 1], {
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

    const imagePath = staticFile(image.replace('assets/', 'app_assets/'));

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                perspective: 2000, // Stronger perspective for the 3D fly-in
            }}
        >
            <div
                style={{
                    transform: `translateY(${translateY + float}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                    width: '900px', // Bigger
                    height: '1400px', // Tall card format
                    borderRadius: 30,
                    position: 'relative',
                    overflow: 'hidden', // Clip image
                    backgroundColor: 'black',
                    border: '3px solid #D4AF37', // Outer Gold Border
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 30px 80px rgba(0,0,0,0.5)', // Gold Glow + Drop Shadow
                    opacity
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

                {/* Corner Accents (Top-Left) */}
                <div style={{ position: 'absolute', top: 15, left: 15, width: 60, height: 60, borderTop: '4px double #D4AF37', borderLeft: '4px double #D4AF37', borderTopLeftRadius: 20, zIndex: 11 }} />
                {/* Corner Accents (Top-Right) */}
                <div style={{ position: 'absolute', top: 15, right: 15, width: 60, height: 60, borderTop: '4px double #D4AF37', borderRight: '4px double #D4AF37', borderTopRightRadius: 20, zIndex: 11 }} />
                {/* Corner Accents (Bottom-Left) */}
                <div style={{ position: 'absolute', bottom: 15, left: 15, width: 60, height: 60, borderBottom: '4px double #D4AF37', borderLeft: '4px double #D4AF37', borderBottomLeftRadius: 20, zIndex: 11 }} />
                {/* Corner Accents (Bottom-Right) */}
                <div style={{ position: 'absolute', bottom: 15, right: 15, width: 60, height: 60, borderBottom: '4px double #D4AF37', borderRight: '4px double #D4AF37', borderBottomRightRadius: 20, zIndex: 11 }} />

                {/* Full Card Image Background */}
                <Img
                    src={imagePath}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Top Gradient Overlay for Title/Description */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0, // Align to top
                        left: 0,
                        right: 0,
                        padding: 50,
                        // Gradient from top down
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

                {/* Bottom Gradient Overlay for Questions */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0, // Align to bottom
                        left: 0,
                        right: 0,
                        padding: 50,
                        // Gradient from bottom up
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        opacity: textOpacity
                    }}
                >
                    <div style={{
                        borderTop: `4px solid ${themeColor}`,
                        paddingTop: 30
                    }}>
                        <h3
                            style={{
                                fontSize: 40,
                                marginBottom: 20,
                                fontFamily: 'Philosopher',
                                color: themeColor,
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                                textAlign: 'center'
                            }}
                        >
                            {themeTitle}
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
                            {themeQuestions.map((q, i) => (
                                <li
                                    key={i}
                                    style={{
                                        fontSize: 32, // Slightly bigger
                                        marginBottom: 15,
                                        fontFamily: 'Philosopher',
                                        color: '#D4AF37', // Gold
                                        fontStyle: 'normal',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    {q}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
