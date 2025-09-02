import type { Meta, StoryFn } from '@storybook/react-vite';
import { Background, type BackgroundProps } from './Background';

export default {
    title: 'App/Background',
    component: Background,
    argTypes: {
        type: {
            control: 'select',
            options: ['color', 'image', 'gradient'],
            description: 'Type of background to render'
        },
        color: {
            control: 'color',
            description: 'Background color (hex, rgb, or named color)'
        },
        imageUrl: {
            control: 'text',
            description: 'Image URL for background'
        },
        gradient: {
            control: 'text',
            description: 'CSS gradient string'
        },
        position: {
            control: 'select',
            options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
            description: 'Position for background image'
        },
        size: {
            control: 'select',
            options: ['cover', 'contain', 'auto', '100% 100%'],
            description: 'Size for background image'
        },
        overlay: {
            control: 'boolean',
            description: 'Whether to apply overlay on image backgrounds'
        },
        overlayColor: {
            control: 'color',
            description: 'Overlay color (rgba recommended)'
        },
        animation: {
            control: 'select',
            options: ['none', 'pan', 'pan-vertical', 'pulse', 'fade'],
            description: 'Animation type for the background'
        },
        animationDuration: {
            control: 'number',
            description: 'Duration of animation in seconds',
            defaultValue: 30
        },
        animationLoop: {
            control: 'boolean',
            description: 'Whether animation should loop continuously',
            defaultValue: true
        }
    },
    parameters: {
        docs: {
            description: {
                component: 'A flexible background component that supports colors, images, and gradients with optional overlays and animations.'
            }
        }
    }
} as Meta;

const Template: StoryFn<BackgroundProps> = (args: BackgroundProps) => (
    <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd',
        margin: '20px 0',
        position: 'relative'
    }}>
        <Background {...args}>
            <div style={{
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                textShadow: '0 0 5px rgba(0,0,0,0.7)'
            }}>
                <h1 style={{ margin: 0 }}>Background Component</h1>
                <p style={{ margin: '10px 0 0' }}>This content is layered on top of the background</p>
                {args.animation !== 'none' && (
                    <div style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 0,
                        right: 0,
                        fontSize: '0.8rem',
                        color: '#000',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        padding: '2px 5px',
                        borderRadius: '3px'
                    }}>
                        Animation: {args.animation} ({args.animationDuration}s)
                    </div>
                )}
            </div>
        </Background>
    </div>
);

export const ColorBackground = Template.bind({});
ColorBackground.args = {
    type: 'color',
    color: '#3498db',
};
ColorBackground.storyName = 'Solid Color Background';

export const ImageBackground = Template.bind({});
ImageBackground.args = {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    position: 'center',
    size: 'cover',
    overlay: true,
    overlayColor: 'rgba(0,0,0,0.4)',
};
ImageBackground.storyName = 'Image with Overlay';

export const GradientBackground = Template.bind({});
GradientBackground.args = {
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};
GradientBackground.storyName = 'CSS Gradient';

export const AnimatedBackground = Template.bind({});
AnimatedBackground.args = {
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    animation: 'pan',
    animationDuration: 45,
    animationLoop: true
};
AnimatedBackground.storyName = 'Animated Gradient (Pan)';
AnimatedBackground.parameters = {
    docs: {
        description: {
            story: 'Smooth horizontal panning animation on gradient background'
        }
    }
};

export const VerticalPanAnimation = Template.bind({});
VerticalPanAnimation.args = {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    position: 'center',
    size: 'cover',
    overlay: true,
    overlayColor: 'rgba(0,0,0,0.3)',
    animation: 'pan-vertical',
    animationDuration: 60
};
VerticalPanAnimation.storyName = 'Image with Vertical Pan';
VerticalPanAnimation.parameters = {
    docs: {
        description: {
            story: 'Vertical panning animation on image background with overlay'
        }
    }
};

export const PulseAnimation = Template.bind({});
PulseAnimation.args = {
    type: 'color',
    color: '#e74c3c',
    animation: 'pulse',
    animationDuration: 5
};
PulseAnimation.storyName = 'Color Pulse Animation';
PulseAnimation.parameters = {
    docs: {
        description: {
            story: 'Subtle pulsing animation on solid color background'
        }
    }
};

export const FadeAnimation = Template.bind({});
FadeAnimation.args = {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    size: 'cover',
    overlay: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    animation: 'fade',
    animationDuration: 8
};

FadeAnimation.parameters = {
    docs: {
        description: {
            story: 'Smooth fade animation on image background with overlay'
        }
    }
};