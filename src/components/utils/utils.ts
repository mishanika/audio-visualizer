export const optionHandler = (
  key: string,
  setMenuOption: React.Dispatch<
    React.SetStateAction<{
      stream: boolean;
      preload: boolean;
      demo: boolean;
    }>
  >,
  menuOption: {
    stream: boolean;
    preload: boolean;
    demo: boolean;
  }
) => {
  for (const k in menuOption) {
    if (k !== key) {
      setMenuOption((prev) => ({
        ...prev,
        [k]: false,
      }));
    } else {
      setMenuOption((prev) => ({
        ...prev,
        [k]: true,
      }));
    }
  }
};

// export const optionHandler = (
//   key: string,

//   menuOption: React.MutableRefObject<{
//     stream: boolean;
//     preload: boolean;
//     demo: boolean;
//   }>
// ) => {
//   for (const k in menuOption.current) {
//     if (k !== key) {
//       menuOption.current[k as keyof typeof menuOption.current] = false;
//     } else {
//       menuOption.current[k as keyof typeof menuOption.current] = true;
//     }
//   }
// };
