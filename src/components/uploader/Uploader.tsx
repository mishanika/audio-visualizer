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
      optionHandler("", setMenuOption, menuOption);

      //if (isSongChangedRef.current.dots && isSongChangedRef.current.waves) {
      isSongChangedRef.current.dots = true;
      isSongChangedRef.current.waves = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      //}
      //   setIsSongPlay((prev) => !prev);
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
