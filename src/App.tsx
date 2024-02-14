import { useEffect, useRef, useState } from "react";
import "./App.css";
import P5Sketch from "./components/sketch/Sketch";
import Menu from "./components/menu/Menu";
import Uploader from "./components/uploader/Uploader";
import { optionHandler } from "./components/utils/utils";
import eightBit from "./assets/music/Your Love Is My Drug 8 Bit Version.wav";

const App = () => {
  const audioStreamRef = useRef<HTMLAudioElement>(null);
  const audioPreloadedRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [readyState, setReadyState] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const isSongChangedRef = useRef({ waves: false, dots: false });
  const [ended, setEnded] = useState(false);

  //const [isSongChanged, setIsSongChanged] = useState({ waves: true, dots: true });
  // const menuOption = useRef({ waves: false, dots: false });
  const [menuOption, setMenuOption] = useState({
    stream: false,
    preload: false,
    demo: false,
  });

  const [settings, setSettings] = useState({
    dots: 360,
    radius: 150,
    bass: 3,
    bassDetection: 100,
    low: 2,
    middle: 1.4,
    high: 0.8,
  });

  useEffect(() => {
    if (menuOption.stream) {
      navigator.mediaDevices
        .getDisplayMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        })
        .then((stream) => {
          if (audioStreamRef.current) {
            if (streamRef) {
              streamRef.current?.getTracks().forEach((track) => track.stop());
            }
            streamRef.current = stream;

            const audioTrack = streamRef.current.getAudioTracks()[0];

            const audioStream = new MediaStream([audioTrack]);

            audioStreamRef.current.srcObject = audioStream;

            isSongChangedRef.current.dots = true;
            isSongChangedRef.current.waves = true;
            optionHandler("stream", setMenuOption, menuOption);
            setReadyState(true);
          }
        })
        .catch((err) => console.log(err));
    } else if (menuOption.demo && audioPreloadedRef.current) {
      // streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioPreloadedRef.current.paused) {
      }
      isSongChangedRef.current.dots = true;
      isSongChangedRef.current.waves = true;

      audioPreloadedRef.current.src = "/static/media/Your Love Is My Drug 8 Bit Version.88f987bb8e4cc2235db6.wav";
      audioPreloadedRef.current.play();
      setReadyState(true);
    }
  }, [menuOption]);

  useEffect(() => {
    audioPreloadedRef.current!.onended = () => {
      setEnded((prev) => !prev);
    };
  }, []);

  return (
    <div className="App">
      <Menu
        setMenuOption={setMenuOption}
        menuOption={menuOption}
        settings={settings}
        setSettings={setSettings}
        setUploaderOpen={setUploaderOpen}
      />
      {uploaderOpen && menuOption.preload ? (
        <Uploader
          audioRef={audioPreloadedRef}
          menuOption={menuOption}
          isSongChangedRef={isSongChangedRef}
          setReadyState={setReadyState}
          setMenuOption={setMenuOption}
          setUploaderOpen={setUploaderOpen}
          streamRef={streamRef}
          setEnded={setEnded}
          //setIsSongChanged={setIsSongChanged}
        />
      ) : null}
      <P5Sketch
        audioRef={audioPreloadedRef}
        audioStreamRef={audioStreamRef}
        readyState={readyState}
        menuOption={menuOption}
        isSongChangedRef={isSongChangedRef}
        settings={settings}
        ended={ended}
        uploaderOpen={uploaderOpen}
        //setIsSongChanged={setIsSongChanged}
      />

      <audio controls style={{ display: "none" }} ref={audioStreamRef} />
      <audio src={eightBit} controls style={{ display: "none" }} ref={audioPreloadedRef} />
    </div>
  );
};

export default App;
