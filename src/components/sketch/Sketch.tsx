// import { P5CanvasInstance, ReactP5Wrapper,  } from "@p5-wrapper/react";
import { useEffect, useRef, useState } from "react";
import "./Sketch.css";

// Создание FFT объекта

type Props = {
  menuOption: {
    stream: boolean;
    preload: boolean;
    demo: boolean;
  };
  audioRef: React.RefObject<HTMLAudioElement>;
  audioStreamRef: React.RefObject<HTMLAudioElement>;
  readyState: boolean;

  isSongChangedRef: React.MutableRefObject<{
    waves: boolean;
    dots: boolean;
  }>;
  settings: {
    dots: number;
    radius: number;
    bass: number;
    bassDetection: number;
    low: number;
    middle: number;
    high: number;
  };
  ended: boolean;
  uploaderOpen: boolean;
};

const P5Sketch: React.FC<Props> = ({
  menuOption,
  audioRef,
  audioStreamRef,
  readyState,
  isSongChangedRef,
  settings,
  ended,
  uploaderOpen,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<{ preloaded: AnalyserNode; stream: AnalyserNode } | { preloaded: null; stream: null }>({
    preloaded: null,
    stream: null,
  });
  const sourceRef = useRef<
    { preloaded: MediaElementAudioSourceNode; stream: MediaStreamAudioSourceNode } | { preloaded: null; stream: null }
  >({
    preloaded: null,
    stream: null,
  });
  const streamRef = useRef<{ preloaded: MediaStream; stream: MediaStream } | { preloaded: null; stream: null }>({
    preloaded: null,
    stream: null,
  });
  const audio = useRef<{ preloaded: AudioContext; stream: AudioContext } | { preloaded: null; stream: null }>({
    preloaded: null,
    stream: null,
  });

  const menuOptionRef = useRef({
    stream: false,
    preload: false,
    demo: false,
  });
  const settingsRef = useRef({
    dots: 0,
    radius: 0,
    bass: 0,
    bassDetection: 0,
    low: 0,
    middle: 0,
    high: 0,
  });
  const stoppedRef = useRef(false);
  const endedRef = useRef(false);
  const uploaderRef = useRef(false);
  const [stopped, setStopped] = useState(false);

  const fromRangeToRange = (number: number, to: number, secondTo: number) => {
    return Math.floor((number / to) * secondTo);
  };

  const getBass = (data: Uint8Array) => {
    const bassElems = data.slice(0, 100).filter((number) => number > settingsRef.current.bassDetection);
    return bassElems.length > (data.length - (data.length - 100)) / 2;
  };

  const draw = () => {
    if (audioRef.current && audioStreamRef.current && canvasRef.current) {
      audio.current!.preloaded = new AudioContext();
      audio.current!.stream = new AudioContext();
      if (menuOption.stream) {
        streamRef.current!.stream = audioStreamRef.current.srcObject as MediaStream;

        sourceRef.current!.stream = audio.current!.stream.createMediaStreamSource(streamRef.current!.stream);

        analyserRef.current!.stream = audio.current!.stream.createAnalyser();
        sourceRef.current!.stream!.connect(analyserRef.current!.stream!);
        analyserRef.current!.stream!.fftSize = 512;
      } else {
        analyserRef.current!.preloaded = audio.current!.preloaded.createAnalyser();

        sourceRef.current!.preloaded = audio.current!.preloaded.createMediaElementSource(audioRef.current);
        if (analyserRef.current) {
          analyserRef.current.preloaded.connect(audio.current!.preloaded.destination);
        }
        sourceRef.current!.preloaded!.connect(analyserRef.current!.preloaded!);
        analyserRef.current!.preloaded!.fftSize = 512;

        audioRef.current.play();
      }
      const ctx = canvasRef.current.getContext("2d");

      const data = new Uint8Array(analyserRef.current!.stream ? analyserRef.current!.stream.frequencyBinCount : 256);

      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;

      const numPointsDots = 5;

      const pointRadius = 1;

      const drawWaves = () => {
        const angleIncrement = (2 * Math.PI) / settingsRef.current.dots; // угол между точками

        if (stoppedRef.current && audioRef.current && !menuOptionRef.current.stream) {
          audioRef.current.pause();
        } else if (
          audioRef.current &&
          !menuOptionRef.current.stream &&
          !endedRef.current &&
          analyserRef.current.preloaded &&
          !uploaderRef.current
        ) {
          audioRef.current.play();
        }
        if (ctx && canvasRef.current && analyserRef.current && !stoppedRef.current) {
          //функція яка відображає отримані дані частот на полотні canvas
          if (menuOptionRef.current.stream && analyserRef.current.stream) {
            analyserRef.current.stream.getByteFrequencyData(data);
          } else if ((menuOptionRef.current.preload || menuOptionRef.current.demo) && analyserRef.current.preloaded) {
            analyserRef.current.preloaded.getByteFrequencyData(data);
          }
          // console.log(data);

          let proccessedData: number[] = [];
          for (let i = 0; i < settingsRef.current.dots / 2 + 1; i++) {
            const index = fromRangeToRange(i, settingsRef.current.dots, data.length);
            proccessedData.push(data[index]);
          }
          proccessedData.pop();
          proccessedData = [...proccessedData, ...proccessedData.reverse()];

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          ctx.fillStyle = "white";

          const cords = {
            x: centerX,
            y: centerY - settingsRef.current.radius,
          };

          ctx.beginPath();

          for (let i = 0; i < proccessedData.length; i++) {
            const angle = i * angleIncrement;

            let num;
            if (proccessedData[i] < 16) {
              num = -proccessedData[i] * settingsRef.current.low;
            } else if (130 < proccessedData[i] && proccessedData[i] < 255) {
              num = proccessedData[i] * settingsRef.current.high;
            } else {
              num = (proccessedData[i] - 40) * settingsRef.current.middle;
            }

            const x = centerX + (settingsRef.current.radius + num) * Math.sin(angle);
            const y = centerY + (settingsRef.current.radius + num) * -Math.cos(angle);

            if (i < settingsRef.current.dots) {
              ctx.lineTo(x, y);
            } else {
              ctx.moveTo(cords.x, cords.y);
            }
          }

          ctx.closePath();

          ctx.strokeStyle = "white";
          ctx.stroke();
        }
        requestAnimationFrame(drawWaves);
      };

      const points: { x: number; y: number; velocity: number; angle: number }[] = [];

      const drawDots = () => {
        const angleIncrement = (2 * Math.PI) / numPointsDots;

        if (ctx && canvasRef.current && !stoppedRef.current) {
          ctx.fillStyle = "white";
          const angle = Math.random() * numPointsDots * angleIncrement;
          let bassNum = 1;
          points.push({
            x: centerX + settingsRef.current.radius * Math.sin(angle),
            y: centerY + settingsRef.current.radius * -Math.cos(angle),
            velocity: 2,
            angle: angle,
          });

          if (getBass(data)) {
            bassNum = settingsRef.current.bass;
          }

          for (let y = 0; y < bassNum; y++) {
            for (let i = 0; i < points.length; i++) {
              points[i].x += points[i].velocity * Math.sin(points[i].angle);
              points[i].y += points[i].velocity * -Math.cos(points[i].angle);
              ctx.beginPath();
              ctx.arc(points[i].x, points[i].y, pointRadius, 0, 2 * Math.PI);
              ctx.fill();
              if (
                points[i].x > canvasRef.current.width ||
                points[i].x < -canvasRef.current.width ||
                points[i].y > canvasRef.current.height ||
                points[i].y < -canvasRef.current.height
              ) {
                points.splice(i, 1);
              }
            }
          }
        }
        requestAnimationFrame(drawDots);
      };

      drawWaves();
      drawDots();
    }
  };

  useEffect(() => {
    if (readyState) {
      draw();
    }
  }, [readyState]);

  useEffect(() => {
    if (isSongChangedRef.current.waves && analyserRef.current) {
      let flag = true;
      if (analyserRef.current.stream && analyserRef.current.preloaded) {
        flag = false;
      }
      if (flag && audioRef.current!.src && !menuOptionRef.current.stream) {
        if (analyserRef.current.stream) {
          analyserRef.current.preloaded = audio.current!.preloaded!.createAnalyser();

          sourceRef.current.preloaded = audio.current!.preloaded!.createMediaElementSource(audioRef.current!);

          analyserRef.current.preloaded.connect(audio.current!.preloaded!.destination);

          sourceRef.current.preloaded!.connect(analyserRef.current.preloaded!);
          analyserRef.current.preloaded!.fftSize = 512;
        }

        // audioRef.current!.play();
      } else if (audioStreamRef.current!.srcObject && menuOptionRef.current.stream) {
        streamRef.current.stream = audioStreamRef.current!.srcObject as MediaStream;

        sourceRef.current!.stream = audio.current!.stream!.createMediaStreamSource(streamRef.current!.stream);

        analyserRef.current.stream = audio.current!.stream!.createAnalyser();
        sourceRef.current.stream!.connect(analyserRef.current.stream!);
        analyserRef.current.stream!.fftSize = 512;
      }

      if (menuOptionRef.current.stream && audioStreamRef.current) {
        // stoppedRef.current = !stoppedRef.current;
        audioRef.current?.pause();
      } else if (!menuOptionRef.current.stream && audioRef.current) {
        console.log(audioRef.current.srcObject);
        stoppedRef.current = false;
        audioRef.current?.play();
      }

      isSongChangedRef.current.waves = !isSongChangedRef.current.waves;
    }
  }, [menuOption]);

  useEffect(() => {
    for (const k in menuOption) {
      menuOptionRef.current[k as keyof typeof menuOption] = menuOption[k as keyof typeof menuOption];
    }
  }, [menuOption]);

  // useEffect(() => {
  //   if (audioRef.current) {
  //     if (stopped) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //   }
  //   ;stoppedRef.current = !stoppedRef.current
  // }, [stopped]);

  useEffect(() => {
    for (const k in settings) {
      settingsRef.current[k as keyof typeof settings] = settings[k as keyof typeof settings];
    }
  }, [settings]);

  useEffect(() => {
    endedRef.current = !endedRef.current;
  }, [ended]);

  useEffect(() => {
    uploaderRef.current = !uploaderRef.current;
  }, [uploaderOpen]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [readyState]);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => {
        stoppedRef.current = !stoppedRef.current;
      }}
    ></canvas>
  );
};

export default P5Sketch;
