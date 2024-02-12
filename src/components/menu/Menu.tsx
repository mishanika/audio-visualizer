import { useState } from "react";
import "./Menu.css";
import { optionHandler } from "../utils/utils";

type Props = {
  menuOption: {
    stream: boolean;
    preload: boolean;
    demo: boolean;
  };
  settings: {
    dots: number;
    radius: number;
    bass: number;
    bassDetection: number;
    low: number;
    middle: number;
    high: number;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      dots: number;
      radius: number;
      bass: number;
      bassDetection: number;
      low: number;
      middle: number;
      high: number;
    }>
  >;
  setMenuOption: React.Dispatch<
    React.SetStateAction<{
      stream: boolean;
      preload: boolean;
      demo: boolean;
    }>
  >;
};

const Menu: React.FC<Props> = ({ menuOption, settings, setSettings, setMenuOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: number) => {
    if (value) {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  return !isOpen ? (
    <div className={`equals ${!isOpen ? "activeMark" : ""}`} onClick={() => setIsOpen(true)}>
      <div className="stick"></div>
    </div>
  ) : (
    <div className={`menu ${isOpen ? "activeMenu" : ""}`}>
      <div className={`xmark `} onClick={() => setIsOpen(false)}></div>
      <div className="options">
        <div className="" onClick={() => optionHandler("stream", setMenuOption, menuOption)}>
          {" "}
          Stream
        </div>
        <div className="" onClick={() => optionHandler("preload", setMenuOption, menuOption)}>
          Preloaded Audio
        </div>
        <div className="" onClick={() => optionHandler("demo", setMenuOption, menuOption)}>
          Demo
        </div>
      </div>
      <div className="audio-settings">
        <div className="circle-dots-quantity">
          Circle dots quantity
          <input
            type="text"
            placeholder={settings.dots + ""}
            onChange={(e) => handleChange("dots", parseFloat(e.target.value))}
          />
        </div>
        <div className="cirle-radius">
          Circle radius
          <input
            type="text"
            placeholder={settings.radius + ""}
            onChange={(e) => handleChange("radius", parseFloat(e.target.value))}
          />
        </div>
        <div className="bass-acceleration">
          Bass acceleration
          <input
            type="text"
            placeholder={settings.bass + ""}
            onChange={(e) => handleChange("bass", parseFloat(e.target.value))}
          />
        </div>
        <div className="bass-detection">
          <div className="">
            Bass detection, hover a{" "}
            <span className="question">
              <span className="mark">? </span>
              <span className="hint">
                We have the range of audiowaves from 0 to 255, so you can change it, because every melody has its own
                property. For example, you hear bass, but it can be not that loud so programm doesn't proccess it lika a
                bass
              </span>
            </span>
          </div>
          <input
            type="text"
            placeholder={settings.bassDetection + ""}
            onChange={(e) => handleChange("bassDetection", parseFloat(e.target.value))}
          />
        </div>
        <div className="low-frequency">
          <div className="">
            {" "}
            Low frequency waves, hover a{" "}
            <span className="question">
              <span className="mark">? </span>
              <span className="hint">
                We have the range of audiowaves from 0 to 255, in my programm, low frequency waves is from 0 to 16 and
                this parameter, you changing, is their amplification
              </span>
            </span>
          </div>
          <input
            type="text"
            placeholder={settings.low + ""}
            onChange={(e) => handleChange("low", parseFloat(e.target.value))}
          />
        </div>
        <div className="middle-frequency">
          <div className="">
            Middle frequency waves, hover a{" "}
            <span className="question">
              <span className="mark">? </span>
              <span className="hint">
                We have the range of audiowaves from 0 to 255, in my programm, low frequency waves is from 16 to 130 and
                this parameter, you changing, is their amplification
              </span>
            </span>
          </div>
          <input
            type="text"
            placeholder={settings.middle + ""}
            onChange={(e) => handleChange("middle", parseFloat(e.target.value))}
          />
        </div>
        <div className="high-frequency">
          <div className="">
            High frequency waves, hover a{" "}
            <span className="question">
              <span className="mark">? </span>
              <span className="hint">
                We have the range of audiowaves from 0 to 255, in my programm, low frequency waves is from 130 to 255
                and this parameter, you changing, is their amplification
              </span>
            </span>
          </div>
          <input
            type="text"
            placeholder={settings.high + ""}
            onChange={(e) => handleChange("high", parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
