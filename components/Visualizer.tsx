import React, { useRef, useEffect } from 'react';

interface VisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
}

const WAVE_COLORS = [
    'rgba(244, 114, 182, 0.7)', // pink-400
    'rgba(219, 39, 119, 0.7)',  // pink-600
    'rgba(192, 38, 211, 0.7)',  // fuchsia-600
    'rgba(168, 85, 247, 0.7)',  // purple-500
];

const Visualizer: React.FC<VisualizerProps> = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameData = useRef({ id: 0, phase: 0 });

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audioEl = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    if (!canvasCtx) return;

    const parent = canvas.parentElement;
    if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }

    const setupAudioContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
        }

        if(!sourceRef.current){
            try {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
                sourceRef.current.connect(analyserRef.current!);
                analyserRef.current!.connect(audioContextRef.current.destination);
            } catch(e) {
                console.error("Error setting up audio source node:", e)
            }
        }
    }
    
    const bufferLength = analyserRef.current?.frequencyBinCount || 128;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationFrameData.current.id = requestAnimationFrame(draw);
      animationFrameData.current.phase += 0.02; // Wave speed

      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      const bassFrequencies = dataArray.slice(0, bufferLength / 4);
      const average = bassFrequencies.reduce((a, b) => a + b, 0) / bassFrequencies.length;
      const amplitude = (average / 128.0) * (canvas.height / 4);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerY = canvas.height / 2;

      WAVE_COLORS.forEach((color, index) => {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = color;
        canvasCtx.lineWidth = 2;

        const phaseOffset = index * Math.PI / 3;
        const yOffset = (index - (WAVE_COLORS.length -1) / 2) * 20;

        for (let x = 0; x < canvas.width; x++) {
            const angle = x * 0.01 + animationFrameData.current.phase + phaseOffset;
            const y = centerY + yOffset + Math.sin(angle) * amplitude;
            
            if (x === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        }
        canvasCtx.stroke();
      });
    };

    if (isPlaying) {
        setupAudioContext();
        if(audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        draw();
    } else {
        if (animationFrameData.current.id) {
            cancelAnimationFrame(animationFrameData.current.id);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return () => {
      if (animationFrameData.current.id) {
        cancelAnimationFrame(animationFrameData.current.id);
      }
    };
  }, [audioRef, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none"
    />
  );
};

export default Visualizer;