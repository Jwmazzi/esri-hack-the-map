/** @jsx jsx */
import { jsx } from 'jimu-core';

export const Logo = () => (
  <svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E5E5E5" d="M0 0h48v49H0z" />
    <g filter="url(#a)">
      <g clip-path="url(#b)">
        <rect x="-16" y="-4" width="1440" height="1024" rx="16" fill="#fff" />
        <g filter="url(#c)">
          <path fill="#fff" d="M-16-4h1440v57H-16z" />
          <rect x="3.8" y="4.8" width="41.2" height="41.2" rx="8" fill="#004874" stroke="#fff" />
          <rect x="7.3" y="14.8" width="16.9" height="33.8" rx="3.8" transform="rotate(-27.1 7.3 14.8)" fill="#fff" />
          <rect
            x="16.8"
            y="18.3"
            width="3.1"
            height="7.5"
            rx="1.6"
            transform="rotate(-27.1 16.8 18.3)"
            fill="#004874"
          />
          <rect
            x="19.1"
            y="28.4"
            width="8.1"
            height="11.9"
            rx="1.9"
            transform="rotate(-27.1 19.1 28.4)"
            stroke="#004874"
            stroke-width="1.3"
          />
          <mask id="d" maskUnits="userSpaceOnUse" x="15.1" y="1.5" width="16.4" height="20.3" fill="#000">
            <path fill="#fff" d="M15.1 1.5h16.4v20.3H15.1z" />
            <path d="M23.2 20a6 6 0 0 0 4.3-1.6c1.2-1 1.9-2.6 1.9-4.1.1-5.8-5.2-10.3-5.5-10.5a.7.7 0 0 0-.8 0c-.2.1-5.8 4.4-5.9 10.2 0 1.6.6 3.1 1.7 4.2a6.2 6.2 0 0 0 4.3 1.9Zm.6-4.6.7-.7c.2-.3.3-.7.3-1 0-.3.2-.5.3-.7a1 1 0 0 1 1.5 0c.2.2.3.5.3.7 0 .7-.3 1.4-.6 2a4 4 0 0 1-1.6 1.4 1 1 0 0 1-.7.1 1 1 0 0 1-.6-.5 1 1 0 0 1-.1-.7c0-.3.2-.5.5-.6Z" />
          </mask>
          <path
            d="M23.2 20a6 6 0 0 0 4.3-1.6c1.2-1 1.9-2.6 1.9-4.1.1-5.8-5.2-10.3-5.5-10.5a.7.7 0 0 0-.8 0c-.2.1-5.8 4.4-5.9 10.2 0 1.6.6 3.1 1.7 4.2a6.2 6.2 0 0 0 4.3 1.9Zm.6-4.6.7-.7c.2-.3.3-.7.3-1 0-.3.2-.5.3-.7a1 1 0 0 1 1.5 0c.2.2.3.5.3.7 0 .7-.3 1.4-.6 2a4 4 0 0 1-1.6 1.4 1 1 0 0 1-.7.1 1 1 0 0 1-.6-.5 1 1 0 0 1-.1-.7c0-.3.2-.5.5-.6Z"
            fill="#009AF2"
          />
          <path
            d="M23.2 20a6 6 0 0 0 4.3-1.6c1.2-1 1.9-2.6 1.9-4.1.1-5.8-5.2-10.3-5.5-10.5a.7.7 0 0 0-.8 0c-.2.1-5.8 4.4-5.9 10.2 0 1.6.6 3.1 1.7 4.2a6.2 6.2 0 0 0 4.3 1.9Zm.6-4.6.7-.7c.2-.3.3-.7.3-1 0-.3.2-.5.3-.7a1 1 0 0 1 1.5 0c.2.2.3.5.3.7 0 .7-.3 1.4-.6 2a4 4 0 0 1-1.6 1.4 1 1 0 0 1-.7.1 1 1 0 0 1-.6-.5 1 1 0 0 1-.1-.7c0-.3.2-.5.5-.6Z"
            stroke="#fff"
            stroke-width="2.5"
            mask="url(#d)"
          />
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="a"
        x="-32"
        y="-14"
        width="1472"
        height="1056"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feMorphology radius="2" in="SourceAlpha" result="effect1_dropShadow_0_1" />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="6" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feMorphology radius="4" in="SourceAlpha" result="effect2_dropShadow_0_1" />
        <feOffset dy="6" />
        <feGaussianBlur stdDeviation="10" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="effect1_dropShadow_0_1" result="effect2_dropShadow_0_1" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow_0_1" result="shape" />
      </filter>
      <filter
        id="c"
        x="-16"
        y="-4"
        width="1440"
        height="57"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="-1" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix values="0 0 0 0 0.792157 0 0 0 0 0.792157 0 0 0 0 0.792157 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_0_1" />
      </filter>
      <clipPath id="b">
        <rect x="-16" y="-4" width="1440" height="1024" rx="16" fill="#fff" />
      </clipPath>
    </defs>
  </svg>
);
