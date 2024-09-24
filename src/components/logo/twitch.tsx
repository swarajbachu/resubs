import * as React from "react";
import type { SVGProps } from "react";
const Twitch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 2400 2800"
    xmlSpace="preserve"
    id="Layer_1"
    x={0}
    y={0}
    viewBox="0 0 2400 2800"
    {...props}
  >
    <style>{".st1{fill:#9146ff}"}</style>
    <path
      d="m2200 1300-400 400h-400l-350 350v-350H600V200h1600z"
      style={{
        fill: "#fff",
      }}
    />
    <g id="Layer_1-2">
      <path
        d="M500 0 0 500v1800h600v500l500-500h400l900-900V0H500zm1700 1300-400 400h-400l-350 350v-350H600V200h1600v1100z"
        className="st1"
      />
      <path
        d="M1700 550h200v600h-200zM1150 550h200v600h-200z"
        className="st1"
      />
    </g>
  </svg>
);
export default Twitch;
