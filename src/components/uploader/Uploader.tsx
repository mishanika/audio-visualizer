import { useEffect, useRef, useState } from "react";
import "./Uploader.css";
import { optionHandler } from "../utils/utils";

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  menuOption: {
    stream: boolean;
    preload: boolean;
    demo: boolean;
  };

  setReadyState: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOption: React.Dispatch<
    React.SetStateAction<{
      stream: boolean;
      preload: boolean;
      demo: boolean;
    }>
  >;
  setUploaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEnded: React.Dispatch<React.SetStateAction<boolean>>;
  isSongChangedRef: React.MutableRefObject<{
    waves: boolean;
    dots: boolean;
  }>;
  streamRef: React.MutableRefObject<MediaStream | null>;
};

const Uploader: React.FC<Props> = ({
  audioRef,
  menuOption,
  isSongChangedRef,
  streamRef,
  setReadyState,
  setMenuOption,
  setUploaderOpen,
  setEnded,
  //setIsSongChanged,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handler = () => {
    if (inputRef.current && audioRef.current && inputRef.current.files) {
      audioRef.current.src = URL.createObjectURL(inputRef.current.files[0]);
      // audioRef.current.srcObject = inputRef.current.files[0];
      console.log(audioRef.current.src);
      console.log(audioRef.current.srcObject);
      setReadyState(true);
      optionHandler("preload", setMenuOption, menuOption);
      setUploaderOpen(false);
      setEnded(false);

      isSongChangedRef.current.dots = true;
      isSongChangedRef.current.waves = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="uploader-wrapper">
      <div className="uploader">
        Click and choose file or drag'n'drop
        <input type="file" onChange={() => handler()} ref={inputRef} />
      </div>
    </div>
  );
};

export default Uploader;
