import React from "react";
import { SvgIcon } from "@mui/material";
export type IconType =
  | "close"
  | "search"
  | "navDashboard"
  | "navSchedule"
  | "navHouse"
  | "navSettings"
  | "navPlanner"
  | "navProfile"
  | "navLogout"
	| "leftArrow"
	| "rightArrow";

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
	navDashboard: (
		<svg 
		  width="23" 
			height="24" 
			viewBox="0 0 23 24" 
			fill="none" 
			xmlns="http://www.w3.org/2000/svg"
		>
			<path 
			  d="M0.186523 13.25H10.1865V0.75H0.186523V13.25ZM0.186523 23.25H10.1865V15.75H0.186523V23.25ZM12.6865 23.25H22.6865V10.75H12.6865V23.25ZM12.6865 0.75V8.25H22.6865V0.75H12.6865Z" 
				fill="#C2C2C2"
			/>
    </svg>
	),
	leftArrow: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M7.03458 9.11416L6.36527 9.78348L11.7207 15.1389L13.0593 13.8003L9.04346 9.78348L13.0593 5.76666L11.7207 4.42804L7.03458 9.11416Z" fill="#969696"/>
		</svg>
	),
	rightArrow: (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.9659 10.4527L13.6352 9.78342L8.27978 4.42798L6.94116 5.76661L10.957 9.78342L6.94116 13.8002L8.27978 15.1389L12.9659 10.4527Z" fill="#969696"/>
		</svg>
	),
  navSchedule: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 12.75H25.5V24C25.5 24.3315 25.3683 24.6495 25.1339 24.8839C24.8995 25.1183 24.5815 25.25 24.25 25.25H1.75C1.41848 25.25 1.10054 25.1183 0.866116 24.8839C0.631696 24.6495 0.5 24.3315 0.5 24V12.75ZM19.25 2.75H24.25C24.5815 2.75 24.8995 2.8817 25.1339 3.11612C25.3683 3.35054 25.5 3.66848 25.5 4V10.25H0.5V4C0.5 3.66848 0.631696 3.35054 0.866116 3.11612C1.10054 2.8817 1.41848 2.75 1.75 2.75H6.75V0.25H9.25V2.75H16.75V0.25H19.25V2.75Z"
        fill="#C2C2C2"
      />
    </svg>
  ),
  navHouse: (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.25 23C23.25 23.3316 23.1183 23.6495 22.8839 23.8839C22.6495 24.1183 22.3315 24.25 22 24.25H2C1.66848 24.25 1.35054 24.1183 1.11612 23.8839C0.881696 23.6495 0.75 23.3316 0.75 23V9.86253C0.749868 9.67205 0.793271 9.48406 0.876895 9.31291C0.960519 9.14176 1.08215 8.99199 1.2325 8.87503L11.2325 1.09753C11.4519 0.926842 11.722 0.834167 12 0.834167C12.278 0.834167 12.5481 0.926842 12.7675 1.09753L22.7675 8.87503C22.9179 8.99199 23.0395 9.14176 23.1231 9.31291C23.2067 9.48406 23.2501 9.67205 23.25 9.86253V23V23Z"
        fill="#CECECE"
      />
    </svg>
  ),
  navSettings: (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.66744 2.68128C5.95085 1.53163 7.4583 0.660017 9.09494 0.121277C9.56291 0.707556 10.157 1.18081 10.8331 1.50586C11.5092 1.83091 12.2498 1.99939 12.9999 1.99878C13.7501 1.99939 14.4907 1.83091 15.1668 1.50586C15.8429 1.18081 16.437 0.707556 16.9049 0.121277C18.5416 0.660017 20.049 1.53163 21.3324 2.68128C21.0593 3.37934 20.9469 4.12995 21.0036 4.87739C21.0603 5.62483 21.2847 6.3499 21.6599 6.99878C22.0344 7.64889 22.5507 8.20622 23.1703 8.6293C23.7899 9.05239 24.4969 9.33036 25.2387 9.44253C25.5894 11.1287 25.5894 12.8689 25.2387 14.555C23.7887 14.7775 22.4512 15.63 21.6599 16.9988C21.2845 17.6478 21.06 18.3731 21.0033 19.1208C20.9466 19.8685 21.0591 20.6193 21.3324 21.3175C20.0489 22.4667 18.5415 23.3379 16.9049 23.8763C16.4368 23.2902 15.8427 22.8172 15.1666 22.4924C14.4906 22.1676 13.75 21.9993 12.9999 22C12.2498 21.9994 11.5092 22.1679 10.8331 22.4929C10.157 22.818 9.56291 23.2912 9.09494 23.8775C7.4584 23.3392 5.95096 22.468 4.66744 21.3188C4.94075 20.6205 5.05324 19.8697 4.99654 19.122C4.93984 18.3744 4.71542 17.6491 4.33994 17C3.9653 16.3501 3.449 15.7931 2.82942 15.3702C2.20984 14.9473 1.50291 14.6696 0.76119 14.5575C0.410333 12.871 0.410333 11.1303 0.76119 9.44378C1.50302 9.33161 2.21002 9.05364 2.82961 8.63055C3.4492 8.20747 3.96544 7.65014 4.33994 7.00003C4.71523 6.35115 4.93954 5.62608 4.99624 4.87864C5.05294 4.1312 4.94056 3.38059 4.66744 2.68253V2.68128ZM14.8749 15.2463C15.3049 15.0018 15.6822 14.6748 15.9852 14.2839C16.2882 13.8931 16.5109 13.4461 16.6405 12.9689C16.7701 12.4916 16.8039 11.9934 16.7402 11.503C16.6765 11.0126 16.5163 10.5396 16.2691 10.1113C16.0218 9.68301 15.6922 9.30786 15.2994 9.00745C14.9065 8.70705 14.4581 8.48731 13.98 8.36091C13.5019 8.2345 13.0035 8.20391 12.5135 8.27091C12.0235 8.33791 11.5516 8.50116 11.1249 8.75128C10.2707 9.25209 9.64916 10.0705 9.39605 11.0278C9.14294 11.9852 9.27877 13.0038 9.77391 13.8614C10.269 14.719 11.0833 15.3459 12.0389 15.6053C12.9946 15.8648 14.0141 15.7357 14.8749 15.2463Z"
        fill="#C2C2C2"
      />
    </svg>
  ),
  navPlanner: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 0.75H22C22.3315 0.75 22.6495 0.881696 22.8839 1.11612C23.1183 1.35054 23.25 1.66848 23.25 2V22C23.25 22.3315 23.1183 22.6495 22.8839 22.8839C22.6495 23.1183 22.3315 23.25 22 23.25H2C1.66848 23.25 1.35054 23.1183 1.11612 22.8839C0.881696 22.6495 0.75 22.3315 0.75 22V2C0.75 1.66848 0.881696 1.35054 1.11612 1.11612C1.35054 0.881696 1.66848 0.75 2 0.75ZM10.75 10.75H5.75V13.25H10.75V18.25H13.25V13.25H18.25V10.75H13.25V5.75H10.75V10.75Z"
        fill="#C2C2C2"
      />
    </svg>
  ),
  navProfile: (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 18C18 18.2652 17.8946 18.5196 17.7071 18.7071C17.5196 18.8947 17.2652 19 17 19H1C0.734784 19 0.48043 18.8947 0.292893 18.7071C0.105357 18.5196 2.4071e-07 18.2652 2.4071e-07 18V7.49003C-0.000105484 7.33764 0.0346172 7.18724 0.101516 7.05033C0.168415 6.91341 0.26572 6.79359 0.386 6.70003L8.386 0.478028C8.56154 0.341473 8.7776 0.267334 9 0.267334C9.2224 0.267334 9.43846 0.341473 9.614 0.478028L17.614 6.70003C17.7343 6.79359 17.8316 6.91341 17.8985 7.05033C17.9654 7.18724 18.0001 7.33764 18 7.49003V18ZM16 17V7.97803L9 2.53403L2 7.97803V17H16ZM4 13H14V15H4V13Z"
        fill="white"
      />
    </svg>
  ),
  navLogout: (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.66663 15.5H5.49996V17.3334H16.5V2.66671H5.49996V4.50004H3.66663V1.75004C3.66663 1.50693 3.7632 1.27377 3.93511 1.10186C4.10702 0.929951 4.34018 0.833374 4.58329 0.833374H17.4166C17.6597 0.833374 17.8929 0.929951 18.0648 1.10186C18.2367 1.27377 18.3333 1.50693 18.3333 1.75004V18.25C18.3333 18.4932 18.2367 18.7263 18.0648 18.8982C17.8929 19.0701 17.6597 19.1667 17.4166 19.1667H4.58329C4.34018 19.1667 4.10702 19.0701 3.93511 18.8982C3.7632 18.7263 3.66663 18.4932 3.66663 18.25V15.5ZM5.49996 9.08337H11.9166V10.9167H5.49996V13.6667L0.916626 10L5.49996 6.33337V9.08337Z"
        fill="white"
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
