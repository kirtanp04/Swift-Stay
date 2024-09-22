import { useTheme } from "@mui/material";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  IconColor?: string;
}

export function GraphIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="M1.5 14H15v-1H2V0H1v13.5zM3 11.5v-8l.5-.5h2l.5.5v8l-.5.5h-2zm2-.5V4H4v7zm6-9.5v10l.5.5h2l.5-.5v-10l-.5-.5h-2zm2 .5v9h-1V2zm-6 9.5v-6l.5-.5h2l.5.5v6l-.5.5h-2zm2-.5V6H8v5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function HotelIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <g
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M10 22v-6.57M12 11h.01M12 7h.01M14 15.43V22m1-6a5 5 0 0 0-6 0m7-5h.01M16 7h.01M8 11h.01M8 7h.01"></path>
        <rect width={16} height={20} x={4} y={2} rx={2}></rect>
      </g>
    </svg>
  );
}

export function RoomIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M7.5 15.5h9v.75q0 .325.213.538t.537.212t.538-.213t.212-.537v-3.4q0-.75-.413-1.337T16.5 10.65V9q0-.825-.587-1.412T14.5 7h-5q-.825 0-1.412.588T7.5 9v1.65q-.675.275-1.088.863T6 12.85v3.4q0 .325.213.538T6.75 17t.538-.213t.212-.537zm0-1.5v-1.15q0-.35.25-.6t.6-.25h7.3q.35 0 .6.25t.25.6V14zM9 10.5v-2h6v2zM4 22q-.825 0-1.412-.587T2 20V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v16q0 .825-.587 1.413T20 22zm0-2h16V4H4zm0 0V4z"
      ></path>
    </svg>
  );
}

export function BookingIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <g
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M4 18V8.5A4.5 4.5 0 0 1 8.5 4h7A4.5 4.5 0 0 1 20 8.5v7a4.5 4.5 0 0 1-4.5 4.5H6a2 2 0 0 1-2-2"></path>
        <path d="M8 12h3.5a2 2 0 1 1 0 4H8V9a1 1 0 0 1 1-1h1.5a2 2 0 1 1 0 4H9m7 4h.01"></path>
      </g>
    </svg>
  );
}

export function ReviewIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="M9 2.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m1.45-.5a2.5 2.5 0 0 0-4.9 0H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM8 5H5.5V3.5h-2v11h9v-11h-2V5zM5 7.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75m.75 1.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function ChatIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="M10.46 1.25h3.08c1.603 0 2.86 0 3.864.095c1.023.098 1.861.3 2.6.752a5.75 5.75 0 0 1 1.899 1.899c.452.738.654 1.577.752 2.6c.095 1.004.095 2.261.095 3.865v1.067c0 1.141 0 2.036-.05 2.759c-.05.735-.153 1.347-.388 1.913a5.75 5.75 0 0 1-3.112 3.112c-.805.334-1.721.408-2.977.43a10.81 10.81 0 0 0-.929.036c-.198.022-.275.054-.32.08c-.047.028-.112.078-.224.232c-.121.166-.258.396-.476.764l-.542.916c-.773 1.307-2.69 1.307-3.464 0l-.542-.916a10.605 10.605 0 0 0-.476-.764c-.112-.154-.177-.204-.224-.232c-.045-.026-.122-.058-.32-.08c-.212-.023-.49-.03-.93-.037c-1.255-.021-2.171-.095-2.976-.429A5.75 5.75 0 0 1 1.688 16.2c-.235-.566-.338-1.178-.389-1.913c-.049-.723-.049-1.618-.049-2.76v-1.066c0-1.604 0-2.86.095-3.865c.098-1.023.3-1.862.752-2.6a5.75 5.75 0 0 1 1.899-1.899c.738-.452 1.577-.654 2.6-.752C7.6 1.25 8.857 1.25 10.461 1.25M6.739 2.839c-.914.087-1.495.253-1.959.537A4.25 4.25 0 0 0 3.376 4.78c-.284.464-.45 1.045-.537 1.96c-.088.924-.089 2.11-.089 3.761v1c0 1.175 0 2.019.046 2.685c.045.659.131 1.089.278 1.441a4.25 4.25 0 0 0 2.3 2.3c.515.214 1.173.294 2.429.316h.031c.398.007.747.013 1.037.045c.311.035.616.104.909.274c.29.17.5.395.682.645c.169.232.342.525.538.856l.559.944a.52.52 0 0 0 .882 0l.559-.944c.196-.331.37-.624.538-.856c.182-.25.392-.476.682-.645c.293-.17.598-.24.909-.274c.29-.032.639-.038 1.037-.045h.032c1.255-.022 1.913-.102 2.428-.316a4.25 4.25 0 0 0 2.3-2.3c.147-.352.233-.782.278-1.441c.046-.666.046-1.51.046-2.685v-1c0-1.651 0-2.837-.089-3.762c-.087-.914-.253-1.495-.537-1.959a4.25 4.25 0 0 0-1.403-1.403c-.464-.284-1.045-.45-1.96-.537c-.924-.088-2.11-.089-3.761-.089h-3c-1.651 0-2.837 0-3.762.089"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M9 11a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
      ></path>
    </svg>
  );
}

export function LogoutIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <g
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M10 8V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"></path>
        <path d="M15 12H3l3-3m0 6l-3-3"></path>
      </g>
    </svg>
  );
}

export function LoadingAnimation({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
        opacity={0.5}
      ></path>
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 12 12"
          repeatCount="indefinite"
          to="360 12 12"
          type="rotate"
        ></animateTransform>
      </path>
    </svg>
  );
}

export function ErrorLogIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2q2.2 0 4.163.9t3.387 2.55L12 13V4Q8.65 4 6.325 6.325T4 12t2.325 5.675T12 20q1.725 0 3.3-.712T18 17.25V20q-1.325.95-2.85 1.475T12 22m8-4v-8h2v8zm1 4q-.425 0-.712-.288T20 21t.288-.712T21 20t.713.288T22 21t-.288.713T21 22"
      ></path>
    </svg>
  );
}

export function RefreshIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"
      ></path>
    </svg>
  );
}

export function EditIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"
      />
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"
      />
    </svg>
  );
}

export function DeleteIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"
      />
    </svg>
  );
}

export function CloseCircleIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
      ></path>
    </svg>
  );
}

export function PlusIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
      />
    </svg>
  );
}

export function HorizontalLineIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function CloseIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
      />
    </svg>
  );
}

export function LoginIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
      ></path>
    </svg>
  );
}

export function UpdateIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="m12 16.5l4-4h-3v-9h-2v9H8zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2"
      ></path>
    </svg>
  );
}

export function SaveIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-2 .85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6zM5 7.85V19V5z"
      ></path>
    </svg>
  );
}

export function PencilEditIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="m16.828 1.416l5.755 5.755L7.755 22H2v-5.756zm0 8.681l2.927-2.926l-2.927-2.927l-2.926 2.927zm-4.34-1.512L4 17.074V20h2.926l8.488-8.488z"
      ></path>
    </svg>
  );
}

export function LightModeIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      {...other}
    >
      <circle cx={32} cy={32.12} r={31.875} fill="#f5eb35"></circle>
      <g fill="#e0cf35">
        <circle cx={29.32} cy={53.02} r={9.226}></circle>
        <path d="M41.904 24.487a3.918 3.918 0 1 1-7.836-.002a3.918 3.918 0 0 1 7.836.002"></path>
        <circle cx={5.967} cy={36.54} r={3.845}></circle>
        <circle cx={6.313} cy={18.917} r={2.195}></circle>
        <path d="M20.967 19.656a3.433 3.433 0 1 1-6.866 0a3.433 3.433 0 0 1 6.866 0"></path>
        <circle cx={42.896} cy={11.07} r={4.835}></circle>
      </g>
    </svg>
  );
}

export function DarkModeIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      {...other}
    >
      <circle cx={32} cy={32} r={32} fill="#405866"></circle>
      <g fill="#4f6977">
        <circle cx={29.31} cy={52.982} r={9.262}></circle>
        <path d="M41.943 24.333a3.936 3.936 0 0 1-7.869 0a3.934 3.934 0 0 1 7.869 0"></path>
        <circle cx={5.863} cy={36.434} r={3.86}></circle>
        <circle cx={6.211} cy={18.742} r={2.204}></circle>
        <circle cx={17.477} cy={19.481} r={3.446}></circle>
        <path d="M47.792 10.867a4.853 4.853 0 1 1-9.706 0a4.853 4.853 0 0 1 9.706 0"></path>
      </g>
    </svg>
  );
}

export function PreviewIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V7H5zm7-2q-2.05 0-3.662-1.112T6 13q.725-1.775 2.338-2.887T12 9q2.05 0 3.663 1.113T18 13q-.725 1.775-2.337 2.888T12 17m0-2.5q-.625 0-1.062-.437T10.5 13q0-.625.438-1.062T12 11.5q.625 0 1.063.438T13.5 13q0 .625-.437 1.063T12 14.5m0 1q1.05 0 1.775-.725T14.5 13q0-1.05-.725-1.775T12 10.5q-1.05 0-1.775.725T9.5 13q0 1.05.725 1.775T12 15.5"
      />
    </svg>
  );
}

export function VerticleMenuIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...other}
    >
      <circle
        cx={16}
        cy={8}
        r={2}
        fill={IconColor ? IconColor : "currentColor"}
      ></circle>
      <circle
        cx={16}
        cy={16}
        r={2}
        fill={IconColor ? IconColor : "currentColor"}
      ></circle>
      <circle
        cx={16}
        cy={24}
        r={2}
        fill={IconColor ? IconColor : "currentColor"}
      ></circle>
    </svg>
  );
}

export function HorizontalMenuIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinejoin="round"
        strokeWidth={3.75}
        d="M12.01 12v.01H12V12zm7 0v.01H19V12zm-14 0v.01H5V12z"
      ></path>
    </svg>
  );
}

export function FaviconIcon({ IconColor, ...other }: Props) {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="50"
      height="50"
      viewBox="0 0 172 172"
      fill={theme.themeColor}
      {...other}
    >
      <g
        fill="none"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
        style={{ mixBlendMode: "normal" }}
      >
        <path d="M0,172v-172h172v172z" fill="none"></path>
        <g fill={IconColor}>
          <path d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"></path>
        </g>
      </g>
    </svg>
  );
}

export function SendMessageIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...other}
    >
      <g
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinejoin="round"
        strokeWidth={4}
      >
        <path d="M42 6L4 20.138l20 3.87L29.005 44z"></path>
        <path strokeLinecap="round" d="m24.008 24.008l5.657-5.656"></path>
      </g>
    </svg>
  );
}

export function LocationIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="m12.065 21.243l-.006-.005zm.182-.274a29 29 0 0 0 3.183-3.392c2.04-2.563 3.281-5.09 3.365-7.337a6.8 6.8 0 1 0-13.591 0c.085 2.247 1.327 4.774 3.366 7.337a29 29 0 0 0 3.183 3.392q.166.15.247.218zm-.985 1.165S4 16.018 4 10a8 8 0 1 1 16 0c0 6.018-7.262 12.134-7.262 12.134c-.404.372-1.069.368-1.476 0M12 12.8a2.8 2.8 0 1 0 0-5.6a2.8 2.8 0 0 0 0 5.6m0 1.2a4 4 0 1 1 0-8a4 4 0 0 1 0 8"
      ></path>
    </svg>
  );
}

export function CalenderIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z"
      ></path>
    </svg>
  );
}

export function PersonIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...other}
    >
      <path
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96"
      ></path>
      <path
        fill="none"
        stroke={IconColor ? IconColor : "currentColor"}
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304Z"
      ></path>
    </svg>
  );
}

export function NextIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M10.02 6L8.61 7.41L13.19 12l-4.58 4.59L10.02 18l6-6z"
      ></path>
    </svg>
  );
}

export function PreviousIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...other}
      style={{ transform: "rotate(180deg)" }}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        d="M10.02 6L8.61 7.41L13.19 12l-4.58 4.59L10.02 18l6-6z"
      ></path>
    </svg>
  );
}

interface Heartprops extends Props {
  isWishlist: boolean;
}

export function HeartIcon({ IconColor, isWishlist, ...other }: Heartprops) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...other}
    >
      <path
        fill={isWishlist ? (IconColor ? IconColor : "currentCollor") : "none"}
        stroke={IconColor ? IconColor : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81c-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42c-.54-52.67-42.32-96.81-95.08-96.81"
      ></path>
    </svg>
  );
}

export function ShareIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...other}
    >
      <path
        fill={IconColor ? IconColor : "currentColor"}
        fillRule="evenodd"
        d="M12.5 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 1.5a2.5 2.5 0 1 0-2.469-2.104L5.298 6.263a2.5 2.5 0 1 0 0 3.475l4.733 2.366a2.5 2.5 0 1 0 .671-1.341L5.97 8.396a2.5 2.5 0 0 0 0-.792l4.733-2.367c.455.47 1.092.763 1.798.763Zm1 6.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M4.5 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export function PDFIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="#909090"
        d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"
      ></path>
      <path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path>
      <path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path>
      <path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path>
      <path
        fill="#464648"
        d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"
      ></path>
      <path
        fill="#dd2025"
        d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"
      ></path>
      <path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path>
      <path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path>
      <path
        fill="#fff"
        d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"
      ></path>
    </svg>
  );
}

export function VisacardIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2.25em"
      height="1em"
      viewBox="0 0 256 114"
      {...other}
    >
      <path
        fill={IconColor || "#1a1f71"}
        d="M97.197 1.46L63.68 81.418H41.814L25.32 17.604c-1-3.921-1.869-5.364-4.912-7.022C15.434 7.88 7.22 5.353 0 3.781L.487 1.46h35.204c4.48 0 8.514 2.983 9.54 8.148l8.715 46.273L75.462 1.46zm29.56 0l-17.103 79.958H88.966L106.071 1.46zm56.116 53.852c.086-21.099-29.174-22.27-28.983-31.697c.07-2.866 2.8-5.917 8.776-6.697c2.96-.383 11.138-.688 20.401 3.58l3.624-16.966C181.714 1.732 175.309 0 167.342 0c-20.45 0-34.835 10.862-34.95 26.428c-.134 11.514 10.275 17.931 18.103 21.766c8.063 3.916 10.767 6.433 10.73 9.933c-.058 5.365-6.44 7.74-12.373 7.828c-10.404.165-16.435-2.812-21.246-5.053l-3.755 17.528c4.84 2.218 13.76 4.145 22.999 4.243c21.74 0 35.959-10.737 36.023-27.36m54 26.106H256L239.29 1.46h-17.647c-3.98 0-7.325 2.31-8.809 5.861l-31.04 74.097h21.723l4.309-11.944h26.54zm-23.09-28.329l10.892-30.027l6.257 30.027zm-60.55 50.338h-8.406v7.823h9.402v2.352h-12.234V91.9h11.752v2.352h-8.92v6.857h8.405zm5.339-12.686h2.832v22.86h-2.832zm9.978 15.583c.064 3.833 2.48 5.41 5.344 5.41c2.03 0 3.285-.354 4.317-.804l.514 2.029c-.998.45-2.736.997-5.217.997c-4.796 0-7.661-3.187-7.661-7.889c0-4.7 2.767-8.372 7.308-8.372c5.12 0 6.44 4.445 6.44 7.31c0 .579-.033.997-.098 1.32zm8.307-2.028c.033-1.77-.74-4.572-3.928-4.572c-2.898 0-4.122 2.608-4.348 4.572zm18.154 8.758c-.74.355-2.383.903-4.475.903c-4.701 0-7.76-3.188-7.76-7.954c0-4.798 3.283-8.307 8.371-8.307c1.674 0 3.155.417 3.928.837l-.642 2.157c-.679-.354-1.741-.742-3.286-.742c-3.575 0-5.505 2.673-5.505 5.895c0 3.605 2.318 5.827 5.409 5.827c1.61 0 2.672-.386 3.477-.74zm7.948-18.772v3.735h4.056v2.156h-4.056v8.405c0 1.934.548 3.027 2.125 3.027c.772 0 1.224-.063 1.643-.194l.129 2.16c-.548.192-1.417.385-2.512.385c-1.321 0-2.384-.451-3.059-1.19c-.773-.871-1.095-2.254-1.095-4.09v-8.503h-2.416v-2.156h2.416V95.12zm8.013 8.598c0-1.836-.034-3.413-.129-4.863h2.48l.13 3.09h.094c.71-2.091 2.447-3.412 4.346-3.412c.291 0 .517.033.775.064v2.674c-.29-.066-.579-.066-.968-.066c-1.994 0-3.413 1.481-3.798 3.608a8.5 8.5 0 0 0-.097 1.32v8.308h-2.833zm25.111 2.8c0 5.764-4.026 8.276-7.76 8.276c-4.187 0-7.47-3.092-7.47-8.017c0-5.185 3.445-8.243 7.728-8.243c4.475 0 7.502 3.25 7.502 7.985m-12.333.162c0 3.413 1.932 5.99 4.701 5.99c2.706 0 4.733-2.546 4.733-6.055c0-2.64-1.32-5.958-4.669-5.958c-3.315 0-4.765 3.093-4.765 6.023m16.675-3.607c0-1.641-.034-2.93-.13-4.217h2.512l.161 2.576h.064c.773-1.45 2.576-2.898 5.152-2.898c2.156 0 5.506 1.288 5.506 6.631v9.275h-2.833v-8.984c0-2.51-.934-4.605-3.606-4.605c-1.836 0-3.286 1.321-3.799 2.898c-.13.355-.194.837-.194 1.321v9.37h-2.833z"
      ></path>
    </svg>
  );
}

export function ApplyIcon({ IconColor, ...other }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...other}
    >
      <g fill={IconColor ? IconColor : "currentColor"}>
        <path
          fillRule="evenodd"
          d="M7 3.207V5h1V3.207l2.647 2.647l.707-.708l-3.5-3.5h-.707l-3.5 3.5l.707.708z"
          clipRule="evenodd"
        ></path>
        <path d="m1.5 9l-.5.5v5l.5.5h12l.5-.5v-5l-.5-.5H9.95a2.5 2.5 0 0 1-4.9 0zm9.163 1H13v4H2v-4h2.337a3.5 3.5 0 0 0 6.326 0M7 6h1v1H7zm0 2h1v1H7z"></path>
      </g>
    </svg>
  );
}
