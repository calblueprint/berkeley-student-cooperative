import React from "react";
import { SvgIcon } from "@mui/material";

export type IconType = "close" | "search";

const IconSvgs: Record<IconType, React.ReactElement> = {
  close: (
    <svg
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5002 13.0256L3.12599 0.651367L0.651489 3.12587L13.0257 15.5001L0.651489 27.8744L3.12599 30.3489L15.5002 17.9746L27.8745 30.3489L30.349 27.8744L17.9747 15.5001L30.349 3.12587L27.8745 0.651367L15.5002 13.0256Z"
        fill="black"
      />
    </svg>

    // <SvgIcon viewBox="0, 0, 18, 18">
    //   <path
    //     d="M14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V4.5C2.25 3.67157
    //      2.92157 3 3.75 3H5.25V1.5H6.75V3H11.25V1.5H12.75V3H14.25C15.0784 3 15.75
    //      3.67157 15.75 4.5V15C15.75 15.8284 15.0784 16.5 14.25 16.5ZM3.75
    //      7.5V15H14.25V7.5H3.75ZM3.75 4.5V6H14.25V4.5H3.75ZM12.75 13.5H11.25V12H12.75V13.5ZM9.75
    //      13.5H8.25V12H9.75V13.5ZM6.75 13.5H5.25V12H6.75V13.5ZM12.75 10.5H11.25V9H12.75V10.5ZM9.75
    //      10.5H8.25V9H9.75V10.5ZM6.75 10.5H5.25V9H6.75V10.5Z"
    //     fill="#253C85"
    //   />
    // </SvgIcon>
  ),
  search: (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z"
        fill="black"
      />
    </svg>
  ),
};

type Props = {
  className?: string;
  type: IconType;
};

const Icon: React.FC<Props> = ({ className, type }: Props) => {
  return React.cloneElement(IconSvgs[type], {
    className,
  });
};

export default Icon;
