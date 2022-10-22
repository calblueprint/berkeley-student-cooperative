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
