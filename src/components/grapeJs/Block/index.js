/* eslint-disable no-useless-escape */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */

import { baseClient, baseURL } from '~/utils/index';
import { toastSuccess, toastError, toastLoading } from '~/components/toast';
import { fileApi } from '~/apis/fileApi';

const model3d = (editor, slug) => {
  const glb = { id: '1', label: 'File 3D', };
  const light = { id: '2', label: 'Ánh sáng', open: false };
  const shadow = { id: '3', label: 'Bóng đỗ', open: false };
  const rotate = { id: '4', label: 'Tự động xoay', open: false };
  const environment = { id: '5', label: 'Môi trường', open: false };
  const loader = { id: '6', label: 'Loader', open: false };
  const skybox = { id: '7', label: 'Skybox', open: false };
  const option = { id: '8', label: 'Tùy chọn', open: true };
  const camera = { id: '9', label: 'Camera', open: false };


  const getAllObjects = (object) => {
    let objects = [];

    object.traverse(function (child) {
      if (child.isMesh) {
        objects.push(child);
      }
    });

    return objects;
  }

  const groupObjectNames = (objects) => {
    const groupedNames = {};
    objects.forEach(object => {
      const nameParts = object.name.split('_');
      const groupName = nameParts[0];
      if (!(groupName in groupedNames)) {
        groupedNames[groupName] = [];
      }
      groupedNames[groupName].push(object.name);
    });
    return Object.keys(groupedNames).length > 0 ? groupedNames : null;
  }

  editor.Components.addType('Model 3D', {
    model: {
      defaults: {
        name: 'Model 3D',
        tagName: 'model-viewer',
        droppable: false,
        resizable: true,
        script: function () {
          const modelViewer = this;
          const loader = this.querySelector(".wheel-and-hamster");
          modelViewer.addEventListener("load", () => {
            loader.style.display = "none";
          });

          modelViewer.addEventListener("loading", () => {
            loader.style.display = "block";
          });
        },

        traits: [
          {
            name: 'input-src-glb',
            type: 'input-file',
            label: 'Link file',
            category: glb,
          },
          {
            name: 'src',
            type: 'input-file-glb',
            category: glb,
          },
          {
            label: "Camera",
            name: 'camera-model',
            type: 'camera-model',
            category: camera,
          },
          {
            label: "Min FOV",
            name: 'camera-min-fov',
            type: 'camera-min-fov',
            category: camera,
          },
          {
            label: "Max FOV",
            name: 'camera-max-fov',
            type: 'camera-max-fov',
            category: camera,
          },
          {
            label: "Độ sáng",
            name: 'exposure',
            type: 'range-light',
            category: light,
          },
          {
            name: 'input-src-environment',
            type: 'input-src-environment',
            label: 'Link file',
            category: environment,
          },
          {
            label: "Môi trường",
            name: 'environment-image',
            type: 'environment',
            category: environment
          },
          {
            name: 'add-environment',
            type: 'add-environment',
            category: environment
          },
          {
            label: "Skybox",
            name: 'skybox',
            type: 'skybox',
            category: skybox
          },
          {
            label: "Distance",
            name: 'floor-skybox',
            type: 'floor-skybox',
            category: skybox
          },
          {
            label: 'Cường độ',
            name: 'shadow-intensity',
            type: 'shadow-intensity',
            category: shadow
          },
          {
            label: 'Độ mềm',
            name: 'shadow-softness',
            type: 'shadow-softness',
            category: shadow
          },
          {
            label: 'Vị trí',
            name: 'shadow-placement',
            type: 'shadow-placement',
            category: shadow
          },
          {
            label: 'Góc xoay',
            name: 'rotation-per-second',
            type: 'rotation-per-second',
            category: rotate
          },
          {
            label: 'Độ trễ',
            name: 'delay-rotate',
            type: 'delay-rotate',
            category: rotate
          },
        ],

        attributes: {
          'camera-controls': true,
          'touch-action': 'pan-y',
          'src': 'http://localhost:8082/uploads/3d/file3d/1.glb',
          'auto-rotate': true,
          'environment-image': "https://modelviewer.dev/shared-assets/environments/whipple_creek_regional_park_04_1k.hdr"
        },

        content: `
         <style>
      .wheel-and-hamster {
        --dur: 1s;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12em;
        height: 12em;
        font-size: 14px;
        z-index: 1;
      }

      .wheel,
      .hamster,
      .hamster div,
      .spoke {
        position: absolute;
      }

      .wheel,
      .spoke {
        border-radius: 50%;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .wheel {
        background: radial-gradient(
          100% 100% at center,
          hsl(0deg 100% 50% / 0%) 47.8%,
          hsl(46.72deg 100% 50%) 48%
        );
        z-index: 2;
      }
      .hamster {
        animation: hamster var(--dur) ease-in-out infinite;
        top: 50%;
        left: calc(50% - 3.5em);
        width: 7em;
        height: 3.75em;
        transform: rotate(4deg) translate(-0.8em, 1.85em);
        transform-origin: 50% 0;
        z-index: 1;
      }

      .hamster__head {
        animation: hamsterHead var(--dur) ease-in-out infinite;
        background: #ffc000;
        border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
        box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset,
          0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
        top: 0;
        left: -2em;
        width: 2.75em;
        height: 2.5em;
        transform-origin: 100% 50%;
      }

      .hamster__ear {
        animation: hamsterEar var(--dur) ease-in-out infinite;
        background: hsl(0, 90%, 85%);
        border-radius: 50%;
        box-shadow: -0.25em 0 #ffaa00 inset;
        top: -0.25em;
        right: -0.25em;
        width: 0.75em;
        height: 0.75em;
        transform-origin: 50% 75%;
      }

      .hamster__eye {
        animation: hamsterEye var(--dur) linear infinite;
        background-color: hsl(0, 0%, 0%);
        border-radius: 50%;
        top: 0.375em;
        left: 1.25em;
        width: 0.5em;
        height: 0.5em;
      }

      .hamster__nose {
        background: hsl(0, 90%, 75%);
        border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
        top: 0.75em;
        left: 0;
        width: 0.2em;
        height: 0.25em;
      }

      .hamster__body {
        animation: hamsterBody var(--dur) ease-in-out infinite;
        background: hsl(30, 90%, 90%);
        border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
        box-shadow: 0.1em 0.75em 0 #ffc000 inset,
          0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
        top: 0.25em;
        left: 2em;
        width: 4.5em;
        height: 3em;
        transform-origin: 17% 50%;
        transform-style: preserve-3d;
      }

      .hamster__limb--fr,
      .hamster__limb--fl {
        clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
        top: 2em;
        left: 0.5em;
        width: 1em;
        height: 1.5em;
        transform-origin: 50% 0;
      }

      .hamster__limb--fr {
        animation: hamsterFRLimb var(--dur) linear infinite;
        background: linear-gradient(
          hsl(30, 90%, 80%) 80%,
          hsl(0, 90%, 75%) 80%
        );
        transform: rotate(15deg) translateZ(-1px);
      }

      .hamster__limb--fl {
        animation: hamsterFLLimb var(--dur) linear infinite;
        background: linear-gradient(
          hsl(30, 90%, 90%) 80%,
          hsl(0, 90%, 85%) 80%
        );
        transform: rotate(15deg);
      }

      .hamster__limb--br,
      .hamster__limb--bl {
        border-radius: 0.75em 0.75em 0 0;
        clip-path: polygon(
          0 0,
          100% 0,
          100% 30%,
          70% 90%,
          70% 100%,
          30% 100%,
          40% 90%,
          0% 30%
        );
        top: 1em;
        left: 2.8em;
        width: 1.5em;
        height: 2.5em;
        transform-origin: 50% 30%;
      }

      .hamster__limb--br {
        animation: hamsterBRLimb var(--dur) linear infinite;
        background: linear-gradient(
          hsl(30, 90%, 80%) 90%,
          hsl(0, 90%, 75%) 90%
        );
        transform: rotate(-25deg) translateZ(-1px);
      }

      .hamster__limb--bl {
        animation: hamsterBLLimb var(--dur) linear infinite;
        background: linear-gradient(
          hsl(30, 90%, 90%) 90%,
          hsl(0, 90%, 85%) 90%
        );
        transform: rotate(-25deg);
      }

      .hamster__tail {
        animation: hamsterTail var(--dur) linear infinite;
        background: hsl(0, 90%, 85%);
        border-radius: 0.25em 50% 50% 0.25em;
        box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
        top: 1.5em;
        right: -0.5em;
        width: 1em;
        height: 0.5em;
        transform: rotate(30deg) translateZ(-1px);
        transform-origin: 0.25em 0.25em;
      }

      .spoke {
        animation: spoke var(--dur) linear infinite;
        background: radial-gradient(
            100% 100% at center,
            hsl(49deg 100% 47.76%) 4.8%,
            hsla(0, 0%, 60%, 0) 5%
          ),
          linear-gradient(
              hsla(0, 0%, 55%, 0) 46.9%,
              hsl(44.44deg 100% 50%) 47% 52.9%,
              hsla(0, 0%, 65%, 0) 53%
            )
            50% 50% / 99% 99% no-repeat;
      }

      @keyframes hamster {
        from,
        to {
          transform: rotate(4deg) translate(-0.8em, 1.85em);
        }

        50% {
          transform: rotate(0) translate(-0.8em, 1.85em);
        }
      }

      @keyframes hamsterHead {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(8deg);
        }
      }

      @keyframes hamsterEye {
        from,
        90%,
        to {
          transform: scaleY(1);
        }

        95% {
          transform: scaleY(0);
        }
      }

      @keyframes hamsterEar {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(12deg);
        }
      }

      @keyframes hamsterBody {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(2deg);
        }
      }

      @keyframes hamsterFRLimb {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(50deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(-30deg) translateZ(-1px);
        }
      }

      @keyframes hamsterFLLimb {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(-30deg);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(50deg);
        }
      }

      @keyframes hamsterBRLimb {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(-60deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(20deg) translateZ(-1px);
        }
      }

      @keyframes hamsterBLLimb {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(20deg);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(-60deg);
        }
      }

      @keyframes hamsterTail {
        from,
        25%,
        50%,
        75%,
        to {
          transform: rotate(30deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
          transform: rotate(10deg) translateZ(-1px);
        }
      }

      @keyframes spoke {
        from {
          transform: rotate(0);
        }

        to {
          transform: rotate(-1turn);
        }
      }

      .model-container {
        position: relative;
        width: 100%;

      }

      model-viewer {
        width: 100%;
        height: 100%;
      }
    </style>

        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          class="wheel-and-hamster"
        >
          <div class="wheel"></div>
          <div class="hamster">
            <div class="hamster__body">
              <div class="hamster__head">
                <div class="hamster__ear"></div>
                <div class="hamster__eye"></div>
                <div class="hamster__nose"></div>
              </div>
              <div class="hamster__limb hamster__limb--fr"></div>
              <div class="hamster__limb hamster__limb--fl"></div>
              <div class="hamster__limb hamster__limb--br"></div>
              <div class="hamster__limb hamster__limb--bl"></div>
              <div class="hamster__tail"></div>
            </div>
          </div>
          <div class="spoke"></div>
        </div>
        `,

        style: {
          width: '100%',
          height: '345px',
          display: 'block',
        }
      },
    }
  });

  editor.TraitManager.addType('camera-model', {
    noLabel: true,
    createInput({ component }) {
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center');
      el.innerHTML = `
      <button id="a">Đặt làm camera mặc định</button>
      `;

      // Event 
      const button = el.querySelector('#a');
      button.addEventListener('click', () => {
        const modelviewer = component.view.el;
        const orbit = modelviewer.getCameraOrbit()
        const fov = modelviewer.getFieldOfView();

        function formatOrbit(orbit) {
          const thetaDeg = (orbit.theta * 180 / Math.PI).toFixed(2);
          const phiDeg = (orbit.phi * 180 / Math.PI).toFixed(2);
          const radius = orbit.radius.toFixed(2);
          return `${thetaDeg}deg ${phiDeg}deg ${radius}m`;
        }

        const formatOrbitString = formatOrbit(orbit);
        component.addAttributes({ 'camera-orbit': formatOrbitString });

        component.addAttributes({ 'field-of-view': fov });
        toastSuccess("", "Đã Cập Nhập Camera!", "Vui lòng lưu lại trang.");
      });

      return el;

    },

    onEvent({ component }) {
    },
  });

  editor.TraitManager.addType('camera-max-fov', {

    createInput({ component }) {
      const value = parseInt(component.view.el?.getAttribute('max-field-of-view')?.replace("deg", "")) || component.view.el.getFieldOfView().toFixed(0);
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="fov" 
        type="range" 
        min="30" max="120" step="10" value="${value}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#fov');
      var fov = input.value;
      component.addAttributes({ 'max-field-of-view': `${fov}deg` });
    },
  });

  editor.TraitManager.addType('camera-min-fov', {

    createInput({ component }) {
      const maxOrbit = parseInt(component.view.el?.getAttribute('max-field-of-view')?.replace("deg", "")) || 30;
      const minOrbit = parseInt(component.view.el?.getAttribute('min-field-of-view')?.replace("deg", "")) || 30;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="fov" 
        type="range" 
        min="0" max="${maxOrbit}" step="1" value="${minOrbit}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#fov');
      var fov = input.value;
      component.addAttributes({ 'min-field-of-view': `${fov}deg` });
    },
  });

  // editor.TraitManager.addType('option-file', {
  //   noLabel: true,
  //   createInput({ component }) {
  //     const el = document.createElement('div');
  //     el.classList.add('flex', 'items-center', 'justify-center');
  //     el.innerHTML = `
  //     <button id="a">Thêm tùy chọn</button>
  //     `;

  //     const mvElement = component.view.el;
  //     const scene = mvElement[Object.getOwnPropertySymbols(mvElement).find(e => e.description === 'scene')];
  //     // Event 
  //     const button = el.querySelector('#a');
  //     button.addEventListener('click', () => {

  //       editor.DomComponents.addComponent({
  //         tagName: 'div',
  //         classes: ['aaa'],
  //         components: `
  //             <style>
  //           .aaa{
  //               position: absolute;
  //               bottom: 20px;
  //               right: 0;
  //               display: flex;
  //           }

  //           .aaa:hover .main {
  //               height: auto;
  //           }

  //           .main {
  //               display: flex;
  //               flex-wrap: wrap;
  //               width: 14em;
  //               height: 0px;
  //               overflow: hidden;
  //               align-items: center;
  //               justify-content: center;
  //               gap: 10px;
  //           }

  //           .card {
  //               display: flex;
  //               align-items: center;
  //               justify-content: center;
  //               width: 60px;
  //               height: 60px;
  //               border-top-left-radius: text10px;
  //               background: lightgrey;
  //               transition: 0.4s ease-in-out, 0.2s background-color ease-in-out,
  //                   0.2s background-image ease-in-out;
  //               background: none;
  //               border: 1px solid transparent;
  //               -webkit-backdrop-filter: blur(5px);
  //           }

  //           .card img {
  //               opacity: 0;
  //               width: 90%;
  //               height: 90%;
  //               border-radius: 5px;
  //               object-fit: cover;
  //               transition: 0.2s ease-in-out;
  //           }

  //           .card .instagram {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: #cc39a4;
  //           }

  //           .card:nth-child(2) {
  //               border-radius: 0px;
  //           }

  //           .card:nth-child(2) .twitter {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: #03a9f4;
  //           }

  //           .card:nth-child(3) {
  //               border-top-right-radius: 10px;
  //               border-top-left-radius: 0px;
  //           }

  //           .card:nth-child(3) .dribble {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: #ffb5d2;
  //           }

  //           .card:nth-child(4) {
  //               border-radius: 0px;
  //           }

  //           .card:nth-child(4) .codepen {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: black;
  //           }

  //           .card:nth-child(5) {
  //               border-radius: 0px;
  //           }

  //           .card:nth-child(5) .uiverse {
  //               position: absolute;
  //               margin-left: 0.2em;
  //               margin-top: 0.2em;
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //           }

  //           .card:nth-child(6) {
  //               border-radius: 0px;
  //           }

  //           .card:nth-child(6) .discord {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: #8c9eff;
  //           }

  //           .card:nth-child(7) {
  //               border-bottom-left-radius: 10px;
  //               border-top-left-radius: 0px;
  //           }

  //           .card:nth-child(7) .github {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: black;
  //           }

  //           .card:nth-child(8) {
  //               border-radius: 0px;
  //           }

  //           .card:nth-child(8) .telegram {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //               fill: #29b6f6;
  //           }

  //           .card:nth-child(9) {
  //               border-bottom-right-radius: 10px;
  //               border-top-left-radius: 0px;
  //           }

  //           .card:nth-child(9) .reddit {
  //               opacity: 0;
  //               transition: 0.2s ease-in-out;
  //           }

  //           .main:hover {
  //               width: 14em;
  //               cursor: pointer;
  //           }
  //           .main:hover .card {
  //               border-radius: 10px;
  //               box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  //               border: 1px solid rgba(255, 255, 255, 0.3);
  //               background: rgba(255, 255, 255, 0.2);
  //           }

  //           .main:hover .card:nth-child(5) {
  //               border: transparent;
  //           }

  //           .main:hover .text {
  //               opacity: 0;
  //               z-index: -3;
  //           }

  //           .main:hover img {
  //               opacity: 1;
  //           }

  //           .card:nth-child(1):hover {
  //               background-color: #cc39a4;
  //           }

  //           .card:nth-child(2):hover {
  //               background-color: #03a9f4;
  //           }

  //           .card:nth-child(3):hover {
  //               background-color: #ffb5d2;
  //           }

  //           .card:nth-child(4):hover {
  //               background-color: #1e1f26;
  //           }
  //           .card:nth-child(5):hover {
  //               animation: backgroundIMG 0.1s;
  //               animation-fill-mode: forwards;
  //           }

  //           @keyframes backgroundIMG {
  //               100% {
  //                   background-image: linear-gradient(#bf66ff, #6248ff, #00ddeb);
  //               }
  //           }

  //           .card:nth-child(6):hover {
  //               background-color: #8c9eff;
  //           }

  //           .card:nth-child(7):hover {
  //               background-color: black;
  //           }

  //           .card:nth-child(8):hover {
  //               background-color: #29b6f6;
  //           }

  //           .card:nth-child(9):hover {
  //               background-color: rgb(255, 69, 0);
  //           }

  //           .text {
  //               bottom: 0px;
  //               width: 100%;
  //               position: absolute;
  //               display: flex;
  //               justify-content: center;
  //               align-items: center;
  //               font-size: 0.7em;
  //               transition: 0.4s ease-in-out;
  //               text-align: center;
  //               font-weight: bold;
  //               letter-spacing: 0.33em;
  //               z-index: 3;
  //           }
  //       </style>

  //       <style>
  //           .btn {
  //               display: flex;
  //               justify-content: center;
  //               align-items: center;
  //               width: 11rem;
  //               overflow: hidden;
  //               height: 2.5rem;
  //               background-size: 300% 300%;
  //               backdrop-filter: blur(1rem);
  //               border-radius: 5rem;
  //               transition: 0.5s;
  //               animation: gradient_301 5s ease infinite;
  //               border: double 4px transparent;
  //               background-image: linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #FE53BB 45%, #8F51EA 67%, #0044ff 87%);
  //               background-origin: border-box;
  //               background-clip: content-box, border-box;
  //           }

  //           #container-stars {
  //               position: absolute;
  //               z-index: -1;
  //               width: 100%;
  //               height: 100%;
  //               overflow: hidden;
  //               transition: 0.5s;
  //               backdrop-filter: blur(1rem);
  //               border-radius: 5rem;
  //           }

  //           strong {
  //               z-index: 2;
  //               font-family: 'Roboto', sans-serif;
  //               font-size: 12px;
  //               letter-spacing: 2px;
  //               color: #FFFFFF;
  //           }

  //           #glow {
  //               position: absolute;
  //               display: flex;
  //               width: 12rem;
  //           }

  //           .circle {
  //               width: 100%;
  //               height: 30px;
  //               filter: blur(2rem);
  //               animation: pulse_3011 4s infinite;
  //               z-index: -1;
  //           }

  //           .circle:nth-of-type(1) {
  //               background: rgba(254, 83, 186, 0.636);
  //           }

  //           .circle:nth-of-type(2) {
  //               background: rgba(142, 81, 234, 0.704);
  //           }

  //           .btn:hover #container-stars {
  //               z-index: 1;
  //               background-color: #212121;
  //           }

  //           .btn:hover {
  //               transform: scale(1.1)
  //           }

  //           .btn:active {
  //               border: double 4px #FE53BB;
  //               background-origin: border-box;
  //               background-clip: content-box, border-box;
  //               animation: none;
  //           }

  //           .btn:active .circle {
  //               background: #FE53BB;
  //           }

  //           #stars {
  //               position: relative;
  //               background: transparent;
  //               width: 200rem;
  //               height: 200rem;
  //           }

  //           #stars::after {
  //               content: "";
  //               position: absolute;
  //               top: -10rem;
  //               left: -100rem;
  //               width: 100%;
  //               height: 100%;
  //               animation: animStarRotate 90s linear infinite;
  //           }

  //           #stars::after {
  //               background-image: radial-gradient(#ffffff 1px, transparent 1%);
  //               background-size: 50px 50px;
  //           }

  //           #stars::before {
  //               content: "";
  //               position: absolute;
  //               top: 0;
  //               left: -50%;
  //               width: 170%;
  //               height: 500%;
  //               animation: animStar 60s linear infinite;
  //           }

  //           #stars::before {
  //               background-image: radial-gradient(#ffffff 1px, transparent 1%);
  //               background-size: 50px 50px;
  //               opacity: 0.5;
  //           }

  //           @keyframes animStar {
  //               from {
  //                   transform: translateY(0);
  //               }

  //               to {
  //                   transform: translateY(-135rem);
  //               }
  //           }

  //           @keyframes animStarRotate {
  //               from {
  //                   transform: rotate(360deg);
  //               }

  //               to {
  //                   transform: rotate(0);
  //               }
  //           }

  //           @keyframes gradient_301 {
  //               0% {
  //                   background-position: 0% 50%;
  //               }

  //               50% {
  //                   background-position: 100% 50%;
  //               }

  //               100% {
  //                   background-position: 0% 50%;
  //               }
  //           }

  //           @keyframes pulse_3011 {
  //               0% {
  //                   transform: scale(0.75);
  //                   box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  //               }

  //               70% {
  //                   transform: scale(1);
  //                   box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  //               }

  //               100% {
  //                   transform: scale(0.75);
  //                   box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  //               }
  //           }
  //       </style>
  //             <div class="main">
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>
  //                   <div class="card">
  //                       <img src="https://img.freepik.com/free-photo/banner-with-blue-orange-balls-generative-al_169016-28604.jpg" alt="">
  //                   </div>

  //                   <div class="text">
  //                       <button class="btn" type="button">
  //                           <strong>Chân đế giày Okla</strong>
  //                           <div id="container-stars">
  //                               <div id="stars"></div>
  //                           </div>

  //                           <div id="glow">
  //                               <div class="circle"></div>
  //                               <div class="circle"></div>
  //                           </div>
  //                       </button>
  //                   </div>
  //               </div>
  //             `,
  //       });

  //       // console.log(getAllObjects(scene));
  //       // console.log(groupObjectNames(getAllObjects(scene)));
  //     });

  //     return el;
  //   },

  //   onEvent({ component }) {
  //   },
  // });

  editor.TraitManager.addType('loader', {
    createInput() {
      const options = [
        { text: 'Neutral', value: 'neutral' },
        { text: 'Legacy', value: 'legacy' },
        { text: 'Spruit Sunrise', value: '' },
        { text: 'Creek Regional', value: '' },
      ];
      let optionsHTML = '';
      options.forEach(option => {
        optionsHTML += `<option value="${option.value}">${option.text}</option>`;
      });

      const el = document.createElement('div');
      el.innerHTML = `
      <select id="loader">
        ${optionsHTML}
      </select>
      `;
      return el;
    },

    onEvent({ component }) {
    },
  });

  editor.TraitManager.addType('add-loader', {
    noLabel: true,
    createInput() {
      const el = document.createElement('div');
      el.innerHTML = `
      <h4 style="text-align: center;">Html</h4>
      <textarea id="codeHtml" name="code" style="height: 70px;">
        <h1>Hello, world!</h1>
        <p>This is a sample HTML code.</p>
      </textarea>

      <h4 style="text-align: center;">Css</h4>
      <textarea id="codeCss" name="code" style="height: 70px;">
        <h1>Hello, world!</h1>
        <p>This is a sample HTML code.</p>
      </textarea>
      `;
      return el;
    },

    onEvent({ component }) {
    },
  });

  editor.TraitManager.addType('input-src-glb', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('src') || '';
      const el = document.createElement('div');
      el.innerHTML = `
      <input id="file" type="text" placeholder="Nhập link file glb" value="${value}" />
    `;
      return el;
    },

    onEvent({ component }) {
      function isLink(value) {
        const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*(\:[0-9]+)?(\/.*)?$/;
        return urlPattern.test(value);
      }

      const inputType = this.el.querySelector('#file');

      if (isLink(inputType.value)) {
        fetch(inputType.value, { method: 'HEAD' })
          .then(response => {
            if (response.ok == true) {
              component.addAttributes({ src: inputType.value });
              toastSuccess("", "File Đã Được Cập Nhập", "Vui lòng lưu lại trang.");
            } else {
              toastError("", "File Không Tồn Tại Hoặc Đã Bị Xóa!", "Vui lòng thử lại sau.");
            }
          })
          .catch(() => {
            toastError("", "Có Lỗi Xảy Ra", "Vui lòng thử lại sau.");
          });
      } else {
        toastError("", "Link Không Hợp Lệ", "Vui lòng thử lại sau.");
      }
    },
  });

  editor.TraitManager.addType('input-file-glb', {
    noLabel: true,

    createInput() {
      const el = document.createElement('div');
      el.innerHTML = `
      <input id="file-glb" type="file" class="input-file" accept=".glb, .gltf"/>
    `;
      return el;
    },

    onEvent({ component }) {
      toastLoading('3d', 'Đang giảm kích thước..');
      const inputType = this.el.querySelector('#file-glb');
      if (inputType.files[0]) {
        let formData = new FormData();
        formData.append('file3d', inputType.files[0]);
        fileApi.file3D(formData)
          .then((data) => {
            toastSuccess('3d', "Đã Cập Nhập File!", "Vui lòng lưu lại trang.");
            component.addAttributes({ src: `${baseURL}/uploads/3d/${data.file}` });
          })
          .catch(() => toastError('3d', "Có Lỗi Xảy Ra", "Vui lòng thử lại sau."));
      }
    },
  });

  editor.TraitManager.addType('range-light', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('exposure') || 1;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="exposure" 
        type="range" 
        min="0" max="5" step="0.2" value="${value}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#exposure');
      var exposure = input.value;
      component.addAttributes({ exposure });
    },
  });

  editor.TraitManager.addType('environment', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('environment-image') || 'neutral';
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center');
      const options = [
        { text: 'Neutral', value: 'neutral' },
        { text: 'Legacy', value: 'legacy' },
        { text: 'Spruit Sunrise', value: 'https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.jpg' },
        { text: 'Creek Regional', value: 'https://modelviewer.dev/shared-assets/environments/whipple_creek_regional_park_04_1k.hdr' },
        { text: 'Custom', value: 'custom', disabled: true }
      ];

      let optionsHTML = '';
      options.forEach(option => {
        optionsHTML += `<option value="${option.value}" ${option.value === value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}>${option.text}</option>`;
      });

      el.innerHTML = `
      <select id="environment">
        ${optionsHTML}
      </select>
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#environment');
      const skyboxValue = component.view.el.getAttribute('skybox-image');
      var ev = input.value;

      if (skyboxValue != null) {
        component.addAttributes({ 'skybox-image': ev });
      }

      if (ev == 'neutral' || ev == 'legacy') {
        component.removeAttributes('skybox-image');
      }

      component.addAttributes({ 'environment-image': ev });
    },
  });

  editor.TraitManager.addType('add-environment', {
    noLabel: true,
    createInput() {
      const el = document.createElement('div');
      el.innerHTML = `
        <input id="file-environment" type="file" class="input-file" accept=".png, .jpg"/>
      `;
      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#file-environment');
      const skyboxValue = component.view.el.getAttribute('skybox-image');
      if (inputType.files[0]) {
        let formData = new FormData();
        formData.append('ev', inputType.files[0]);

        settingGlbApi.environment(formData)
          .then((data) => {
            if (skyboxValue) {
              console.log('skyboxValue', skyboxValue);
              component.addAttributes({ 'skybox-image': `${baseURL}/uploads/3d/environment/${data.link}` });
            }

            component.addAttributes({ 'environment-image': `${baseURL}/uploads/3d/environment/${data.link}` });
          })
      }
    },
  });

  editor.TraitManager.addType('input-src-environment', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('environment-image') || '';
      const el = document.createElement('div');
      el.innerHTML = `
      <input id="file" type="text" placeholder="Nhập link môi trường" value="${value}" />
    `;
      return el;
    },

    onEvent({ component }) {
      function isLink(value) {
        const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*(\:[0-9]+)?(\/.*)?$/;
        return urlPattern.test(value);
      }

      const inputType = this.el.querySelector('#file');

      if (isLink(inputType.value)) {
        fetch(inputType.value, { method: 'HEAD' })
          .then(response => {
            if (response.ok == true) {
              component.addAttributes({ 'environment-image': inputType.value });
              toastSuccess("", "File đã được cập nhập", "Vui lòng lưu lại trang.");
            } else {
              toastError("", "File Không Tồn Tại Hoặc Đã Bị Xóa!", "Vui lòng thử lại sau.");
            }
          })
          .catch(() => {
            toastError("", "Có Lỗi Xảy Ra", "Vui lòng thử lại sau.");
          });
      } else {
        toastError("", "Link Không Hợp Lệ", "Vui lòng thử lại sau.");
      }
    },
  });

  editor.TraitManager.addType('skybox', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('skybox-image') ? true : false;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center');
      const options = [
        { text: 'Tắt', value: false },
        { text: 'Bật', value: true },
      ];

      let optionsHTML = '';
      options.forEach(option => {
        optionsHTML += `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.text}</option>`;
      });

      el.innerHTML = `
      <select id="skybox">
        ${optionsHTML}
      </select>
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#skybox');
      const environment = component.view.el.getAttribute('environment-image');
      var sk = input.value;

      if (environment == 'neutral' || environment == 'legacy') {
        component.removeAttributes('skybox-image');
        toastError("", "Môi Trường Mặc Định Không Hỗ Trợ Skybox!", "Vui lòng chọn môi trường khác.");
        return;
      }

      if (sk === 'true') {
        component.addAttributes({ 'skybox-image': environment });
      } else {
        component.removeAttributes('skybox-image');
      }
    },
  });

  editor.TraitManager.addType('floor-skybox', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('skybox-height') || 1;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="floor-skybox" 
        type="range" 
        min="0" max="500" step="0.5" value="${value}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#floor-skybox');
      var flSk = input.value;
      component.addAttributes({ 'skybox-height': `${parseFloat(flSk)}m` });
    },
  });

  editor.TraitManager.addType('shadow-intensity', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('shadow-intensity') || 1;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="shadow-intensity" 
        type="range" 
        min="0" max="3" step="0.2" value="${value}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#shadow-intensity');
      var si = input.value;
      component.addAttributes({ 'shadow-intensity': si });
    },
  });

  editor.TraitManager.addType('shadow-softness', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('shadow-softness') || 1;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="shadow-softness" 
        type="range" 
        min="0" max="1" step="0.1" value="${value}"
        class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#shadow-softness');
      var ss = input.value;
      component.addAttributes({ 'shadow-softness': ss });
    },
  });

  editor.TraitManager.addType('shadow-placement', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('ar-placement') || 'floor';
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');

      const options = [
        {
          text: 'Mặt đất',
          value: 'floor'
        },
        {
          text: 'Bức tường',
          value: 'wall'
        }
      ]

      let optionsHTML = '';
      options.forEach(option => {
        optionsHTML += `<option value="${option.value}" ${option.value === value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}>${option.text}</option>`;
      });

      el.innerHTML = `
      <select id="placement">
        ${optionsHTML}
      </select>
    `;
      return el;
    },

    onEvent({ component }) {
      const input = this.el.querySelector('#placement');
      var pl = input.value;
      component.addAttributes({ 'ar-placement': pl });
    },
  });

  editor.TraitManager.addType('delay-rotate', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('auto-rotate-delay') || 500;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="rotateDelay" 
        type="range" 
        min="0" max="5000" step="500" value="${value}"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const autoRotate = component.view.el.getAttribute('auto-rotate') ? true : false;
      const input = this.el.querySelector('#rotateDelay');
      var dl = input.value;
      if (!autoRotate) {
        component.addAttributes({ 'auto-rotate': true });
      }
      component.addAttributes({ 'auto-rotate-delay': dl });
    },
  });

  editor.TraitManager.addType('rotation-per-second', {

    createInput({ component }) {
      const value = component.view.el.getAttribute('rotation-per-second') || 30;
      const el = document.createElement('div');
      el.classList.add('flex', 'items-center', 'justify-center', 'flex-col');
      el.innerHTML = `
      <input 
        id="rotation-per-second" 
        type="range" 
        min="0" max="180" step="10" value="${value}"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      >
    `;
      return el;
    },

    onEvent({ component }) {
      const autoRotate = component.view.el.getAttribute('auto-rotate') ? true : false;
      const input = this.el.querySelector('#rotation-per-second');
      var sc = input.value;
      if (!autoRotate) {
        component.addAttributes({ 'auto-rotate': true });
      }
      component.addAttributes({ 'rotation-per-second': `${sc}deg` });
    },
  });

  editor.Blocks.add('model-3D', {
    label: `3D`,
    media:
      `<svg width="100%" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19.3297 5.68003L13.0597 2.30003C12.3997 1.94003 11.5997 1.94003 10.9397 2.30003L4.66969 5.68003C4.20969 5.93003 3.92969 6.41003 3.92969 6.96003C3.92969 7.50003 4.20969 7.99003 4.66969 8.24003L10.9397 11.62C11.2697 11.8 11.6397 11.89 11.9997 11.89C12.3597 11.89 12.7297 11.8 13.0597 11.62L19.3297 8.24003C19.7897 7.99003 20.0697 7.51003 20.0697 6.96003C20.0697 6.41003 19.7897 5.93003 19.3297 5.68003Z" fill="currentColor"></path> 
        <path d="M9.91 12.79L4.07 9.87C3.62 9.65 3.1 9.67 2.68 9.93C2.25 10.2 2 10.65 2 11.15V16.66C2 17.61 2.53 18.47 3.38 18.9L9.21 21.82C9.41 21.92 9.63 21.97 9.85 21.97C10.11 21.97 10.37 21.9 10.6 21.76C11.03 21.5 11.28 21.04 11.28 20.54V15.03C11.29 14.07 10.76 13.21 9.91 12.79Z" fill="currentColor"></path> 
        <path d="M21.3207 9.9299C20.8907 9.6699 20.3707 9.6399 19.9307 9.8699L14.1007 12.7899C13.2507 13.2199 12.7207 14.0699 12.7207 15.0299V20.5399C12.7207 21.0399 12.9707 21.4999 13.4007 21.7599C13.6307 21.8999 13.8907 21.9699 14.1507 21.9699C14.3707 21.9699 14.5907 21.9199 14.7907 21.8199L20.6207 18.8999C21.4707 18.4699 22.0007 17.6199 22.0007 16.6599V11.1499C22.0007 10.6499 21.7507 10.1999 21.3207 9.9299Z" fill="currentColor"></path>
       </svg>`
    ,
    content: { type: 'Model 3D' },
    category: 'Basic',
  });
}

const imageLink = (editor) => {
  editor.Blocks.add('block-link', {
    label: `Link Block`,
    media: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM9.198 7.25H9.30203C10.2005 7.24997 10.9497 7.24995 11.5445 7.32991C12.1723 7.41432 12.7391 7.59999 13.1945 8.05546C13.65 8.51093 13.8357 9.07773 13.9201 9.70552C14.0001 10.3003 14 11.0495 14 11.948L14 12C14 12.4142 13.6642 12.75 13.25 12.75C12.8358 12.75 12.5 12.4142 12.5 12C12.5 11.036 12.4984 10.3884 12.4335 9.9054C12.3714 9.44393 12.2642 9.24644 12.1339 9.11612C12.0036 8.9858 11.8061 8.87858 11.3446 8.81654C10.8616 8.7516 10.214 8.75 9.25 8.75C8.28599 8.75 7.63843 8.7516 7.15539 8.81654C6.69393 8.87858 6.49644 8.9858 6.36612 9.11612C6.2358 9.24644 6.12858 9.44393 6.06654 9.9054C6.0016 10.3884 6 11.036 6 12C6 12.964 6.0016 13.6116 6.06654 14.0946C6.12858 14.5561 6.2358 14.7536 6.36612 14.8839C6.49644 15.0142 6.69393 15.1214 7.15539 15.1835C7.63843 15.2484 8.28599 15.25 9.25 15.25C9.66422 15.25 10 15.5858 10 16C10 16.4142 9.66422 16.75 9.25 16.75L9.19798 16.75C8.29951 16.75 7.5503 16.7501 6.95552 16.6701C6.32773 16.5857 5.76093 16.4 5.30546 15.9445C4.84999 15.4891 4.66432 14.9223 4.57991 14.2945C4.49995 13.6997 4.49997 12.9505 4.5 12.052V11.948C4.49997 11.0495 4.49995 10.3003 4.57991 9.70552C4.66432 9.07773 4.84999 8.51093 5.30546 8.05546C5.76093 7.59999 6.32773 7.41432 6.95552 7.32991C7.55029 7.24995 8.29954 7.24997 9.198 7.25ZM16.8446 8.81654C16.3616 8.7516 15.714 8.75 14.75 8.75C14.3358 8.75 14 8.41422 14 8C14 7.58579 14.3358 7.25 14.75 7.25L14.802 7.25C15.7005 7.24997 16.4497 7.24995 17.0445 7.32991C17.6723 7.41432 18.2391 7.59999 18.6945 8.05546C19.15 8.51093 19.3357 9.07773 19.4201 9.70552C19.5001 10.3003 19.5 11.0495 19.5 11.9479V12.052C19.5 12.9505 19.5001 13.6997 19.4201 14.2945C19.3357 14.9223 19.15 15.4891 18.6945 15.9445C18.2391 16.4 17.6723 16.5857 17.0445 16.6701C16.4497 16.7501 15.7005 16.75 14.802 16.75H14.698C13.7995 16.75 13.0503 16.7501 12.4555 16.6701C11.8277 16.5857 11.2609 16.4 10.8055 15.9445C10.35 15.4891 10.1643 14.9223 10.0799 14.2945C9.99995 13.6997 9.99997 12.9505 10 12.052L10 12C10 11.5858 10.3358 11.25 10.75 11.25C11.1642 11.25 11.5 11.5858 11.5 12C11.5 12.964 11.5016 13.6116 11.5665 14.0946C11.6286 14.5561 11.7358 14.7536 11.8661 14.8839C11.9964 15.0142 12.1939 15.1214 12.6554 15.1835C13.1384 15.2484 13.786 15.25 14.75 15.25C15.714 15.25 16.3616 15.2484 16.8446 15.1835C17.3061 15.1214 17.5036 15.0142 17.6339 14.8839C17.7642 14.7536 17.8714 14.5561 17.9335 14.0946C17.9984 13.6116 18 12.964 18 12C18 11.036 17.9984 10.3884 17.9335 9.9054C17.8714 9.44393 17.7642 9.24644 17.6339 9.11612C17.5036 8.9858 17.3061 8.87858 16.8446 8.81654Z"></path> </g></svg>
    `,
    content: { type: 'block-link' },
    category: 'Basic',
  });

  editor.Components.addType('block-link', {
    model: {
      defaults: {
        name: 'Link Block',
        tagName: 'a',
        resizable: true,

        traits: [
          {
            type: 'title-link',
            name: 'title-link',
            label: 'title',
          },
          {
            type: 'href-next',
            name: 'href',
            label: 'New href',
          },
          {
            type: 'target-link',
            name: 'target-link',
            label: 'Mở cửa sổ',
          },
        ],

        style: {
          width: '100%',
          height: '345px',
          display: 'block',
          cursor: 'pointer',
        }
      },
    }
  });

  editor.TraitManager.addType('target-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('target') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <select id="target-link">
          <option value="" ${value === '' ? 'selected' : ''}>Cửa sổ trang hiện tại</option>
          <option value="_blank" ${value === '_blank' ? 'selected' : ''}>Cửa sổ trang mới</option>
        </select>
      `;
      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#target-link');
      if (inputType.value === '_blank') {
        component.addAttributes({ target: inputType.value });
        console.log(component.view.el);
      } else {
        component.removeAttributes('target');
      }
    },
  });

  editor.TraitManager.addType('title-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('title') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <input id="title" type="text" placeholder="Nhập tiêu đề" value="${value}" />
      `;
      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#title');
      component.addAttributes({ title: inputType.value });
    },
  });

  editor.TraitManager.addType('href-next-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('href') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <input id="link" type="text" value="${value}" />
      `;

      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#link');
      component.addAttributes({ href: inputType.value });
    },
  });
}

const slider = (editor) => {
  editor.Components.addType('Slider', {
    model: {
      defaults: {
        name: 'Slider',
        resizable: true,
        droppable: false,
        copyable: false,

        traits: [
          {
            name: "navigation",
            type: "select",
            options: [
              { id: 'no', label: 'Không có' },
              { id: 'yes', label: 'Có' },
            ],
            default: 'yes',
            placeholder: 'Chọn ẩn/hiển nút điều hướng',
            changeProp: true,
          },
        ],

        navigation: 'yes',
        'script-props': ['navigation'],

        script: function (navigation) {
          let swiperInstance = null;

          function initializeSwiper(navigation) {
            if (swiperInstance) {
              swiperInstance.destroy(true, true);
            }

            const swiperConfig = {
              pagination: {
                el: ".swiper-pagination",
                dynamicBullets: true,
              },
            };

            if (navigation === 'yes') {
              swiperConfig.navigation = {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              };
            }
            swiperInstance = new Swiper(".mySwiper", swiperConfig);
          }
          initializeSwiper(navigation.navigation);
        },

        components: `
        <style>
          .swiper {
            width: 100%;
            height: 100%;
          }

          .swiper-slide {
            text-align: center;
             overflow: hidden;
          }
        </style>

        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide"></div>
            <div class="swiper-slide"></div>
          </div>

          <div class="button-swiper swiper-button-next"></div>
          <div class="button-swiper swiper-button-prev"></div>

          <div class="swiper-pagination"></div>
        </div>
        `,

        style: {
          "height": "80vh",
        }
      }
    }
  });

  editor.Blocks.add('Slider', {
    label: `Slider`,
    media: `
    <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 218.207 218.207" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M214.31,27.276H3.897C1.743,27.276,0,29.019,0,31.172v27.276v77.931v50.655c0,2.154,1.743,3.897,3.897,3.897H214.31 c2.154,0,3.897-1.743,3.897-3.897v-50.655V58.448V31.172C218.207,29.019,216.464,27.276,214.31,27.276z M7.793,62.345h35.069 v70.138H7.793V62.345z M210.414,132.483h-11.69V62.345h11.69V132.483z M210.414,54.552h-15.586c-2.154,0-3.897,1.743-3.897,3.897 v77.931c0,2.154,1.743,3.897,3.897,3.897h15.586v42.862H7.793v-0.001v-42.862h38.966c2.154,0,3.897-1.743,3.897-3.897V58.448 c0-2.154-1.743-3.897-3.897-3.897H7.793V35.069h202.621V54.552z"></path> <circle cx="113" cy="163.655" r="7.793"></circle> <path d="M66.241,140.277h109.103c2.154,0,3.897-1.743,3.897-3.897V58.448c0-2.153-1.743-3.896-3.896-3.896H66.241 c-2.154,0-3.897,1.743-3.897,3.897v77.931C62.344,138.534,64.087,140.277,66.241,140.277z M70.138,62.345h101.31v70.138H70.138 V62.345z"></path> <rect x="66.241" y="159.759" width="11.69" height="7.793"></rect> <rect x="85.724" y="159.759" width="11.69" height="7.793"></rect> <rect x="128.586" y="159.759" width="11.69" height="7.793"></rect> <rect x="148.069" y="159.759" width="11.69" height="7.793"></rect> </g> </g> </g> </g></svg>
    `,
    content: { type: 'Slider' },
    category: 'Basic',
  });
}

const masonry = (editor, link) => {
  editor.Components.addType('Masonry', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        // dmode: 'absolute',
        script: function () {
          var elem = document.querySelector('.grid');
          var pckry = new Packery(elem, {
            itemSelector: '.grid-item',
          });
        },
        content:
          `
         <iframe
            name="masonry"
            style="width: 100%; height: 100dvh;"
            src="${baseClient}/admin/page-custom/masonry/${link}" 
            title="ARIS">
          </iframe>
        `,
      }
    }
  });

  editor.Blocks.add('Masonry', {
    label: `Masonry`,
    media: `
    <svg width="201px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M22 20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16zm-11-5H4v4h7v-4zm9-4h-7v8h7v-8zm-9-6H4v8h7V5zm9 0h-7v4h7V5z"></path> </g> </g></svg>
    `,
    content: { type: 'Masonry' },
    category: 'Basic',
  });
}

const header = (editor) => {
  editor.Components.addType('HeaderLayout', {
    model: {
      defaults: {
        droppable: false,
        copyable: false,
        resizable: true,
        script: function () {
          const showMenu = (toggleId, navId) => {
            const toggle = document.getElementById(toggleId), nav = document.getElementById(navId)

            toggle.addEventListener('click', () => {
              // Add show-menu class to nav menu
              nav.classList.toggle('show-menu')

              // Add show-icon to show and hide the menu icon
              toggle.classList.toggle('show-icon')
            })
          }

          showMenu('nav-toggle-2', 'nav-menu-2');
        },
        components: `
        <style>
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");
          root {
            --header-height: 3.5rem;
            --black-color: hsl(220, 24%, 12%);
            --black-color-light: hsl(220, 24%, 15%);
            --black-color-lighten: hsl(220, 20%, 18%);
            --white-color: #fff;
            --body-color: hsl(220, 100%, 97%);
            --body-font: "Montserrat", sans-serif;
            --normal-font-size: .938rem;
            --font-regular: 400;
            --font-semi-bold: 600;
            --z-tooltip: 10;
            --z-fixed: 100;
        }

        @media screen and (min-width: 1024px) {
            :root {
                --normal-font-size: 1rem;
            }
        }

        * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }

        body {
            font-family: var(--body-font);
            font-size: var(--normal-font-size);
            background-color: var(--body-color);
        }

        ul {
            list-style: none;
            /* Color highlighting when pressed on mobile devices */
            /*-webkit-tap-highlight-color: transparent;*/
        }

        a {
            text-decoration: none;
        }

        .container {
            max-width: 1120px;
            margin-inline: 1.5rem;
        }

        .headerr {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--black-color);
            box-shadow: 0 2px 16px hsla(220, 32%, 8%, .3);
            z-index: var(--z-fixed);
        }

        .nav__logo,
        .nav__burger,
        .nav__close {
            color: var(--white-color);
        }

        .nav__data {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav__logo {
            display: inline-flex;
            align-items: center;
            column-gap: .25rem;
            font-weight: var(--font-semi-bold);
            /* Color highlighting when pressed on mobile devices */
            /*-webkit-tap-highlight-color: transparent;*/
        }

        .nav__logo i {
            font-weight: initial;
            font-size: 1.25rem;
        }

        .nav__toggle {
            position: relative;
            width: 32px;
            height: 32px;
        }

        .nav__burger,
        .nav__close {
            position: absolute;
            width: max-content;
            height: max-content;
            inset: 0;
            margin: auto;
            font-size: 1.25rem;
            cursor: pointer;
            transition: opacity .1s, transform .4s;
        }

        .nav__close {
            opacity: 0;
        }

        @media screen and (max-width: 1118px) {}

        .nav__link {
            color: var(--white-color);
            background-color: var(--black-color);
            font-weight: var(--font-semi-bold);
            padding: 1.25rem 1.5rem;
            display: flex;
            height: 100%;
            column-gap: .25rem;
            justify-content: space-between;
            align-items: center;
            transition: background-color .3s;
        }

        .nav__link:hover {
            background-color: var(--black-color-light);
        }

        /* Show menu */
        .show-menu {
            opacity: 1;
            top: 3.5rem;
            pointer-events: initial;
        }

        /* Show icon */
        .show-icon .nav__burger {
            opacity: 0;
            transform: rotate(90deg);
        }

        .show-icon .nav__close {
            opacity: 1;
            transform: rotate(90deg);
        }

        /*=============== DROPDOWN ===============*/
        .dropdown__item {
            cursor: pointer;
        }

       .dropdown__arrow, .submenu-icon  {
            font-size: 1.25rem;
            font-weight: initial;
            transition: transform .4s;
        }

        .dropdown__link{
          background-color: #0a0a0a78;
          border-bottom: 1px solid #fff;
        }

        .dropdown__link,
        .dropdown__sublink {
            padding: 1.25rem;
            color: var(--white-color);
            background-color: var(--black-color-light);
            display: flex;
            align-items: center;
            column-gap: .5rem;
            font-weight: var(--font-semi-bold);
            transition: background-color .3s;
        }

        .dropdown__link i,
        .dropdown__sublink i {
            font-size: 1.25rem;
            font-weight: initial;
        }

        .dropdown__link:hover,
        .dropdown__sublink:hover {
            background-color: var(--black-color);
        }

        .dropdown__menu,
        .dropdown__submenu {
            max-height: 0;
            overflow: hidden;
            transition: max-height .4s ease-out;
        }

        /* Show dropdown menu & submenu */
        .dropdown__item:hover .dropdown__menu,
        .dropdown__subitem:hover>.dropdown__submenu {
            max-height: 1000px;
            transition: max-height .4s ease-in;
        }

        /* Rotate dropdown icon */
        .dropdown__item:hover .dropdown__arrow {
            transform: rotate(180deg);
        }

        /*=============== DROPDOWN SUBMENU ===============*/
        .dropdown__add {
            margin-left: auto;
        }

        .dropdown__sublink {
            background-color: var(--black-color-lighten);
        }

        @media screen and (min-width: 1118px) {
            .nav {
                height: calc(var(--header-height) + 2rem);
                width: 100%;
                display: flex;
                justify-content: center;
            }

            .nav__list {
                height: 100%;
                display: flex;
            }

            .nav__link:hover {
                background-color: transparent;
            }

            .dropdown__item,
            .dropdown__subitem {
                position: relative;
            }

            .dropdown__menu,
            .dropdown__submenu {
                max-height: initial;
                overflow: initial;
                position: absolute;
                left: 0;
                top: 6rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity .3s, top .3s;
            }


            .dropdown__subitem .dropdown__link {
                padding-inline: 1rem;
            }

            .dropdown__submenu {
                position: absolute;
                left: 100%;
                top: .5rem;
            }

            /* Show dropdown menu */
            .dropdown__item:hover .dropdown__menu {
                opacity: 1;
                top: 5.5rem;
                pointer-events: initial;
                transition: top .3s;
            }

            /* Show dropdown submenu */
            .dropdown__subitem:hover .dropdown__submenu {
              opacity: 1;
              top: 0;
              pointer-events: initial;
              transition: top .3s;
            }

            .dropdown__link:hover .submenu-icon {
              transform: rotate(90deg);
            }
        }
    </style>

    <header class="headerr">
        <nav class="nav">
            <div class="nav__data">
              <a href="#" class="nav__logo">
                <i class="ri-planet-line"></i> Company
              </a>

              <div class="nav__toggle" id="nav-toggle">
                <i class="ri-menu-line nav__burger"></i>
                <i class="ri-close-line nav__close"></i>
              </div>
            </div>

            <div class="nav__menu" id="nav-menu">
              <ul class="nav__list">
                <li class="dropdown__item menu-dropdown">
                  <div class="nav__link">
                    <h4 class="menu-text">ABOUT US</h4>
                    <ul class="dropdown__menu dropdown-aris">
                    </ul>
                  </div>
                </li>

                <li class="dropdown__item menu-dropdown">
                    <div class="nav__link">
                        <h4 class="menu-text">COURSES</h4>
                        <div class="dropdown__arrow">
                            <i class="ri-arrow-down-s-line"></i>
                        </div>
                        <ul class="dropdown__menu dropdown-aris">
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                  <i class="ri-bar-chart-line"></i>
                                  <h4 class="menu-text">LOWPOLY HANDPAINTED</h4>
                                  <ul class="dropdown__submenu dropdown-aris">
                                  </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">MODELING HARD SURFACE</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">MODELING CHARACTER</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">CREATURE DESIGN</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>

                <li class="dropdown__item menu-dropdown">
                    <div class="nav__link">
                        <h4 class="menu-text">STUDENT WORKS</h4>
                        <div class="dropdown__arrow">
                            <i class="ri-arrow-down-s-line"></i>
                        </div>
                        <ul class="dropdown__menu dropdown-aris">
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">ALL PROJECTS</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">ENVIRONMENT</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">HARD SURFACE</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">CHARACTER</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">PORTRAIT</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">CREATURE DESIGN ZBRUSH</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>

                <li class="dropdown__item menu-dropdown">
                    <div class="nav__link">
                        <h4 class="menu-text">TUTORIALS</h4>
                        <div class="dropdown__arrow">
                            <i class="ri-arrow-down-s-line"></i>
                        </div>
                        <ul class="dropdown__menu dropdown-aris">
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">All Tutorials</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                            <li class="dropdown__subitem">
                                <div class="dropdown__link">
                                    <i class="ri-bar-chart-line"></i>
                                    <h4 class="menu-text">Making Of</h4>
                                    <ul class="dropdown__submenu dropdown-aris">
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>

                <li class="dropdown__item menu-dropdown">
                    <div class="nav__link">
                        <h4 class="menu-text">CONTACT US</h4>
                        <ul class="dropdown__menu dropdown-aris">
                        </ul>
                    </div>
                </li>
            </ul>
            </div>
        </nav>
    </header>
        `,
      }
    }
  });

  editor.Blocks.add('HeaderLayout', {
    label: `Header`,
    title: 'Header',
    media: `
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"> <path d="m14.4978951 12.4978973-.0105089-9.99999996c-.0011648-1.10374784-.8962548-1.99789734-2-1.99789734h-9.99999995c-1.0543629 0-1.91816623.81587779-1.99451537 1.85073766l-.00548463.151365.0105133 10.00000004c.0011604 1.1037478.89625045 1.9978973 1.99999889 1.9978973h9.99999776c1.0543618 0 1.9181652-.8158778 1.9945143-1.8507377z"></path> <path d="m4.5 4.5v9.817"></path> <path d="m7-2v14" transform="matrix(0 1 -1 0 12.5 -2.5)"></path> </g> </g></svg>
      `,
    content: { type: 'HeaderLayout' },
    category: 'Layout',
  });

  editor.DomComponents.addType('link', {
    model: {
      defaults: {
        traits: [
          {
            type: 'title-link',
            name: 'title-link',
            label: 'title',
          },
          {
            type: 'href-next',
            name: 'href',
            label: 'New href',
          },
          {
            type: 'href-next-link',
            name: 'href-link',
            label: 'Link file',
          },
          {
            type: 'target-link',
            name: 'target-link',
            label: 'Mở cửa sổ',
          },
        ]
      }
    }
  })

  editor.TraitManager.addType('target-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('target') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <select id="target-link">
          <option value="" ${value === '' ? 'selected' : ''}>Cửa sổ trang hiện tại</option>
          <option value="_blank" ${value === '_blank' ? 'selected' : ''}>Cửa sổ trang mới</option>
        </select>
      `;
      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#target-link');
      if (inputType.value === '_blank') {
        component.addAttributes({ target: inputType.value });
        console.log(component.view.el);
      } else {
        component.removeAttributes('target');
      }
    },
  });

  editor.TraitManager.addType('title-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('title') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <input id="title" type="text" placeholder="Nhập tiêu đề" value="${value}" />
      `;
      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#title');
      component.addAttributes({ title: inputType.value });
    },
  });

  editor.TraitManager.addType('href-next-link', {
    createInput({ component }) {
      const value = component.view.el.getAttribute('href') || '';
      const el = document.createElement('div');

      el.innerHTML = `
        <input id="link" type="text" value="${value}" />
      `;

      return el;
    },

    onEvent({ component }) {
      const inputType = this.el.querySelector('#link');
      component.addAttributes({ href: inputType.value });
    },
  });

  editor.Commands.add('addMenu', {
    run(editor) {
      const selectedComponent = editor.getSelected();
      if (selectedComponent) {
        const navList = selectedComponent.find('.nav__list')[0];
        if (navList) {
          const newListItem = editor.DomComponents.addComponent({
            tagName: 'li',
            classes: ['dropdown__item', 'menu-dropdown'],
            components: `
            <div class="nav__link">
              <h4 class="menu-text">New</h4> 
              <ul class="dropdown__menu"></ul>
            </div>
            `,
          });
          navList.append(newListItem);
        }
      }
    }
  });

  editor.Commands.add('addNavLink', {
    run(editor) {
      const selectedComponent = editor.getSelected();
      const navList = selectedComponent.find('.dropdown__menu')[0];
      const navIcon = selectedComponent?.view?.el?.querySelector('.dropdown__arrow');

      const addNewLi = () => {
        const newListItem = editor.DomComponents.addComponent({
          tagName: 'li',
          classes: ['dropdown__subitem'],
          components: `
          <a class="dropdown__link">
            <h4 class="menu-text">Items</h4> 
            <ul class="dropdown__submenu dropdown-aris"></ul>
          </a>
          `,
        });
        navList.append(newListItem);
      }

      if (navIcon == null) {
        const newIcon = editor.DomComponents.addComponent({
          tagName: 'div',
          classes: ['dropdown__arrow'],
          components: '<i class="ri-arrow-down-s-line"></i>'
        });
        addNewLi();
        selectedComponent.append(newIcon);
      } else {
        addNewLi();
      }
    }
  });

  editor.Commands.add('delMenu', {
    run(editor) {
      const selected = editor.getSelected().view.el;
      const menu = selected?.closest('li.dropdown__item')?.querySelector('ul.dropdown__menu');
      const selectedComponent = editor.getSelected();
      if (selectedComponent) {
        const parentComponent = selectedComponent.parent();
        console.log(parentComponent.parent().parent());
        if (parentComponent) {
          parentComponent.remove(selectedComponent);
          if (menu) {
            menu.style.opacity = "";
            menu.style.top = "";
          }
        }
      }
    }
  });

  editor.Commands.add('del-sub-menu', {
    run(editor) {
      const selectedDiv = editor.getSelected().view.el;
      const selectedComponent = editor.getSelected();
      const menu = selectedDiv?.closest('li.dropdown__item')?.querySelector('ul.dropdown__menu');
      const submenu = selectedDiv?.closest('li.dropdown__subitem')?.querySelector('ul.dropdown__submenu');
      if (selectedComponent) {
        const parentComponent = selectedComponent.parent();
        if (parentComponent) {
          parentComponent.remove(selectedComponent);
          submenu.style.opacity = "";
          submenu.style.top = "";
          menu.style.opacity = "";
          menu.style.top = "";
        }
      }
    }
  });

  editor.Commands.add('del-menu-cha', {
    run(editor) {
      const selectedComponent = editor.getSelected();
      if (selectedComponent) {
        const parentComponent = selectedComponent.parent();
        console.log(parentComponent);
        if (parentComponent) {
          parentComponent.remove(selectedComponent);
        }
      }
    }
  });

  const addToolBarHeader = (component, opacityValue, topValue, topValueSubmenu) => {
    const selectedDiv = component.view.el;
    const toolbarItems = component.get('toolbar');

    const firstClass = selectedDiv.classList[0];
    const itemExists = toolbarItems.some(item => item.id === 'new-menu');
    const itemExist2 = toolbarItems.some(item => item.id === 'new-con');
    const itemExist3 = toolbarItems.some(item => item.id === 'del-menu');
    const itemExist4 = toolbarItems.some(item => item.id === 'del-menu-cha');

    const menu = selectedDiv?.closest('li.dropdown__item')?.querySelector('ul.dropdown__menu');
    const submenu = selectedDiv?.closest('li.dropdown__subitem')?.querySelector('ul.dropdown__submenu');

    const updatedToolbarItems = toolbarItems.filter(item => item.command !== 'tlb-delete' && item.command !== 'tlb-clone' && item.command !== 'tlb-move');

    switch (firstClass) {
      case 'dropdown__sublink':
        if (!itemExists) {
          const newItem = {
            label: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>',
            id: 'del-sub-menu',
            command: 'del-sub-menu',
          };

          updatedToolbarItems.push(newItem);
          component.set('toolbar', updatedToolbarItems);
        }
        break;

      case 'nav__link':
        if (!itemExist4) {
          const newItem3 = {
            label: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>',
            id: 'del-menu-cha',
            command: 'del-menu-cha',
          };

          updatedToolbarItems.push(newItem3);
        }

        if (!itemExists) {
          const newItem = {
            label: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M18 15l-.001 3H21v2h-3.001L18 23h-2l-.001-3H13v-2h2.999L16 15h2zm-7 3v2H3v-2h8zm10-7v2H3v-2h18zm0-7v2H3V4h18z"></path> </g> </g></svg>',
            id: 'new-menu',
            command: 'addNavLink',
          };

          updatedToolbarItems.push(newItem);
        }

        component.set('toolbar', updatedToolbarItems);
        break;


      case 'dropdown__link':
        if (!itemExist3) {
          const newItem2 = {
            label: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>',
            id: 'del-menu',
            command: 'delMenu',
          };

          updatedToolbarItems.push(newItem2);
        }
        component.set('toolbar', updatedToolbarItems);
        break;

      case 'nav':
        if (!itemExist2) {
          const newItem2 = {
            label: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g data-name="add" id="add-2"> <g> <line fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"></line> <line fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"></line> </g> </g> </g> </g></svg>',
            id: 'new-menu',
            command: 'addMenu',
          };

          updatedToolbarItems.push(newItem2);
        }

        component.set('toolbar', updatedToolbarItems);
        break;

      default:
        break;
    }

    if (menu) {
      menu.style.opacity = opacityValue;
      menu.style.top = topValue;
    }
    if (submenu) {
      submenu.style.opacity = opacityValue;
      submenu.style.top = topValueSubmenu;
    }
  };

  editor.on('component:selected', (component) => {
    addToolBarHeader(component, '1', "60px", "0");
  });

  editor.on('component:deselected', (component) => {
    addToolBarHeader(component, '', "", "0");
  });

};

const footer = (editor) => {
  editor.Components.addType('FooterLayout', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        script: function () {

        },
        components: `
                <div class="mx-auto w-full max-w-screen-xl" style="height: 100%">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
              <a href="https://flowbite.com/" class="flex items-center">
                  <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 me-3" alt="FlowBite Logo" />
                  <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
              </a>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="https://flowbite.com/" class="hover:underline">Flowbite</a>
                      </li>
                      <li>
                          <a href="https://tailwindcss.com/" class="hover:underline">Tailwind CSS</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="https://github.com/themesberg/flowbite" class="hover:underline ">Github</a>
                      </li>
                      <li>
                          <a href="https://discord.gg/4eeurUVvTy" class="hover:underline">Discord</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="#" class="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" class="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
          </span>
          <div class="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span class="sr-only">Facebook page</span>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                    </svg>
                  <span class="sr-only">Discord community</span>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                  <span class="sr-only">Twitter page</span>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                  </svg>
                  <span class="sr-only">GitHub account</span>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/>
                </svg>
                  <span class="sr-only">Dribbble account</span>
              </a>
          </div>
      </div>
    </div>
        `,
        style: {
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }
      }
    }
  });

  editor.Blocks.add('FooterLayout', {
    label: `Footer`,
    media: `
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" transform="matrix(1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"> <path d="m14.4978951 12.4978973-.0105089-9.99999996c-.0011648-1.10374784-.8962548-1.99789734-2-1.99789734h-9.99999995c-1.0543629 0-1.91816623.81587779-1.99451537 1.85073766l-.00548463.151365.0105133 10.00000004c.0011604 1.1037478.89625045 1.9978973 1.99999889 1.9978973h9.99999776c1.0543618 0 1.9181652-.8158778 1.9945143-1.8507377z"></path> <path d="m4.5 4.5v9.817"></path> <path d="m7-2v14" transform="matrix(0 1 -1 0 12.5 -2.5)"></path> </g> </g></svg>
        `,
    content: { type: 'FooterLayout' },
    category: 'Layout',
  });
}

const user = (editor) => {
  editor.Components.addType('User', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        components: `
                    <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
                `,
        style: {
          width: '40px',
        }
      }
    }
  });

  editor.Blocks.add('User', {
    label: `User`,
    media: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        `,
    content: { type: 'User' },
    category: 'Layout',
  });
}

const socical = (editor) => {
  infoApi.allInfo().then(data => {
    let componentsContent = '';
    data.social.forEach(item => {
      componentsContent += `
      <a class="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 gap-2">
      ${item.Icon}
      </a>
      `;
    });

    editor.Components.addType('Social', {
      model: {
        defaults: {
          droppable: false,
          resizable: true,
          copyable: false,
          components: componentsContent,
          style: {
            display: 'flex',
          }
        }
      }
    });

    // Thêm khối 'Social' vào trình chỉnh sửa
    editor.Blocks.add('Social', {
      label: `Social`,
      media: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 19H1V18C1 16.1362 2.27477 14.5701 4 14.126M6 10.8293C4.83481 10.4175 4 9.30621 4 7.99999C4 6.69378 4.83481 5.58254 6 5.1707M21 19H23V18C23 16.1362 21.7252 14.5701 20 14.126M18 5.1707C19.1652 5.58254 20 6.69378 20 7.99999C20 9.30621 19.1652 10.4175 18 10.8293M10 14H14C16.2091 14 18 15.7909 18 18V19H6V18C6 15.7909 7.79086 14 10 14ZM15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      `,
      content: { type: 'Social' },
      category: 'Layout',
    });
  }).catch(error => {
    console.error('Error fetching data from API:', error);
  });
}

const container = (editor) => {
  editor.Components.addType('Container', {
    model: {
      defaults: {
        resizable: true,
        components: `
          <div class="md:container md:mx-auto">
          </div>  
        `,
        style: {
          width: '100%',
          height: '75px',
          "max-width": '100%',
          "max-height": '100%',
          overflow: 'hidden',
        }
      }
    }
  });

  editor.Blocks.add('Container', {
    label: `Container`,
    media: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 19H1V18C1 16.1362 2.27477 14.5701 4 14.126M6 10.8293C4.83481 10.4175 4 9.30621 4 7.99999C4 6.69378 4.83481 5.58254 6 5.1707M21 19H23V18C23 16.1362 21.7252 14.5701 20 14.126M18 5.1707C19.1652 5.58254 20 6.69378 20 7.99999C20 9.30621 19.1652 10.4175 18 10.8293M10 14H14C16.2091 14 18 15.7909 18 18V19H6V18C6 15.7909 7.79086 14 10 14ZM15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        `,
    content: { type: 'Container' },
    category: 'Layout',
  });
}

const imgSlider = (editor) => {
  editor.Components.addType('ImgSlider', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        script: function () {
          setTimeout(() => {
            // external js: packery.pkgd.js, draggabilly.pkgd.js

            var pckry = new Packery('.grid', {
              itemSelector: '.grid-item',
              columnWidth: 100
            });

            pckry.getItemElements().forEach(function (itemElem) {
              var draggie = new Draggabilly(itemElem);
              pckry.bindDraggabillyEvents(draggie);
            });

            // show item order after layout
            function orderItems() {
              pckry.getItemElements().forEach(function (itemElem, i) {
                itemElem.textContent = i + 1;
              });
            }

            pckry.on('layoutComplete', orderItems);
            pckry.on('dragItemPositioned', orderItems);

          }, 0);
        },

        components: `
        <style>
        </style>
        `,
      }
    }
  });

  editor.Blocks.add('ImgSlider', {
    label: `ImgSlider`,
    media: `
    <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 218.207 218.207" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M214.31,27.276H3.897C1.743,27.276,0,29.019,0,31.172v27.276v77.931v50.655c0,2.154,1.743,3.897,3.897,3.897H214.31 c2.154,0,3.897-1.743,3.897-3.897v-50.655V58.448V31.172C218.207,29.019,216.464,27.276,214.31,27.276z M7.793,62.345h35.069 v70.138H7.793V62.345z M210.414,132.483h-11.69V62.345h11.69V132.483z M210.414,54.552h-15.586c-2.154,0-3.897,1.743-3.897,3.897 v77.931c0,2.154,1.743,3.897,3.897,3.897h15.586v42.862H7.793v-0.001v-42.862h38.966c2.154,0,3.897-1.743,3.897-3.897V58.448 c0-2.154-1.743-3.897-3.897-3.897H7.793V35.069h202.621V54.552z"></path> <circle cx="113" cy="163.655" r="7.793"></circle> <path d="M66.241,140.277h109.103c2.154,0,3.897-1.743,3.897-3.897V58.448c0-2.153-1.743-3.896-3.896-3.896H66.241 c-2.154,0-3.897,1.743-3.897,3.897v77.931C62.344,138.534,64.087,140.277,66.241,140.277z M70.138,62.345h101.31v70.138H70.138 V62.345z"></path> <rect x="66.241" y="159.759" width="11.69" height="7.793"></rect> <rect x="85.724" y="159.759" width="11.69" height="7.793"></rect> <rect x="128.586" y="159.759" width="11.69" height="7.793"></rect> <rect x="148.069" y="159.759" width="11.69" height="7.793"></rect> </g> </g> </g> </g></svg>
    `,
    content: { type: 'ImgSlider' },
    category: 'Basic',
  });
}

const threeJs = (editor) => {
  editor.Components.addType('ThreeJs1', {
    model: {
      defaults: {

        resizable: true,
        copyable: false,
        traits: [
          {
            type: 'range-shadow',
            name: 'Shadow',
            label: 'Test',
          },
        ],
        script: function () {

        },

        content: `
       <style>
          * {
              box-sizing: border-box;
          }

          body {
              font-family: sans-serif;
          }

          /* ---- grid ---- */

          .grid {
              background: #DDD;
              max-width: 1200px;
          }

          /* clear fix */
          .grid:after {
              content: '';
              display: block;
              clear: both;
          }

          .grid-item {
              float: left;
              width: 100px;
              height: 100px;
              background: #C09;
              border: 2px solid hsla(0, 0%, 0%, 0.5);
          }

          .grid-item--width2 {
              width: 200px;
          }

          .grid-item--height2 {
              height: 200px;
          }
      </style>

      <div class="grid">
        <div class="grid-item grid-item--width2"></div>
        <div class="grid-item grid-item--height2"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item grid-item--width2 grid-item--height2"></div>
        <div class="grid-item grid-item--width2"></div>
        <div class="grid-item grid-item--width2"></div>
        <div class="grid-item grid-item--height2"></div>
        <div class="grid-item"></div>
        <div class="grid-item grid-item--width2"></div>
        <div class="grid-item grid-item--height2"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
      </div>
        `,
      }
    }
  });

  editor.Blocks.add('ThreeJs1', {
    label: `ThreeJs1`,
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g font-weight="400" font-family="sans-serif"><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M16.219 15.762a1.129 1.129 0 00-1.076 1.399l24.394 98.742a1.129 1.129 0 001.879.544l73.386-70.59a1.129 1.129 0 00-.47-1.899L16.55 15.806a1.129 1.129 0 00-.331-.044zm1.584 2.754l94.024 27.07-70.566 67.877-23.458-94.947z" overflow="visible"/><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M65.137 29.84a1.129 1.129 0 00-.807.315L27.654 65.46a1.129 1.129 0 00.471 1.898L76.984 81.44a1.129 1.129 0 001.409-1.355L66.21 30.698a1.129 1.129 0 00-1.073-.858zm-.651 3.3L75.734 78.73l-45.104-13L64.486 33.14z" overflow="visible"/><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M46.914 47.313a1.129 1.129 0 00-1.076 1.399l6.054 24.531a1.129 1.129 0 001.88.543l18.222-17.563a1.129 1.129 0 00-.472-1.898l-24.277-6.968a1.129 1.129 0 00-.331-.044zm1.583 2.751l20.522 5.89L53.614 70.8l-5.117-20.736z" overflow="visible"/><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M40.902 22.809a1.129 1.129 0 00-.807.316L21.873 40.687a1.129 1.129 0 00.472 1.898l24.273 6.969a1.129 1.129 0 001.408-1.356l-6.051-24.53a1.129 1.129 0 00-1.073-.86zm-.65 3.3l5.114 20.736-20.517-5.89 15.403-14.847zM89.453 36.793a1.129 1.129 0 00-.806.316L70.423 54.67a1.129 1.129 0 00.472 1.899l24.274 6.968a1.129 1.129 0 001.408-1.356l-6.05-24.53a1.129 1.129 0 00-1.074-.859zm-.65 3.3l5.114 20.737L73.4 54.94l15.403-14.846zM52.944 71.864a1.129 1.129 0 00-.74.315L33.982 89.742a1.129 1.129 0 00.472 1.898l24.278 6.968a1.129 1.129 0 001.407-1.355l-6.055-24.531a1.129 1.129 0 00-1.14-.858zm-.582 3.3l5.118 20.737-20.522-5.89 15.404-14.846z" overflow="visible"/></g></svg>
    `,
    content: { type: 'ThreeJs1' },
    category: 'Basic',
  });
}

const products = (editor) => {
  editor.Components.addType('Products', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        script: function () {
          var swiper = new Swiper("#thumbs", {
            slidesPerView: 5,
            spaceBetween: 10,
            mousewheel: true,
            loop: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            breakpoints: {
              640: {
                slidesPerView: 6,
                direction: 'vertical',
              },
            },
          });

          var swiper2 = new Swiper(".mySwiper2", {
            mousewheel: true,
            effect: "fade",
            loop: true,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            thumbs: {
              swiper: swiper,
            },
          });

        },

        components: `
        <style>
          .swiper {
            width: 100%;
            height: 100%;
          }

          .swiper-slide {
            text-align: center;
            font-size: 18px;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .swiper-slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          body {
            background: #000;
            color: #000;
          }

          .swiper-container {
            display: flex;
          }
            
          .mySwiper2 {
            height: 600px;
            width: 100%;
          }

          .mySwiper {
            width: 100px;
            height: 300px;
            margin-right: 10px;
            box-sizing: border-box;
          }

          .mySwiper .swiper-slide {
            height: 75px !important;
            opacity: 0.4;
          }

          .mySwiper .swiper-slide-thumb-active {
            opacity: 1;
          }

          /* Responsive styles */
          @media (max-width: 767px) {
            .swiper-container {
              flex-direction: column-reverse;
            }

            .mySwiper {
              width: 100%;
              height: 80px;
              margin: 10px 0 0 0;
            }

            .mySwiper .swiper-slide {
              width: 25%;
              height: 100%;
            }

            .mySwiper2 {
              height: 350px;
            }
          }
        </style>
         <div class="container mx-auto"> 
            <div class="grid grid-cols-12 md:px-4 px-2">
              <div class="md:col-span-6 col-span-12 lg:flex">
                <div class="swiper mySwiper" id="thumbs">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide">
                      <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
                    </div>
                    <div class="swiper-slide">
                      <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                    </div>
                  </div>
                </div>

                <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff" class="swiper mySwiper2">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide">
                      <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
                    </div>
                    <div class="swiper-slide">
                      <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                    </div>
                  </div>
                  <div class="swiper-button-next"></div>
                  <div class="swiper-button-prev"></div>
                </div>
              </div>
            </div>
          </div>

        `,
      }
    }
  });

  editor.Blocks.add('Products', {
    label: `Products`,
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 640" x="0px" y="0px"><path d="M472,24H40A24.028,24.028,0,0,0,16,48V464a24.028,24.028,0,0,0,24,24H472a24.028,24.028,0,0,0,24-24V48A24.028,24.028,0,0,0,472,24ZM40,40H472a8.009,8.009,0,0,1,8,8V88H32V48A8.009,8.009,0,0,1,40,40ZM472,472H40a8.009,8.009,0,0,1-8-8V104H480V464A8.009,8.009,0,0,1,472,472Z"/><circle cx="120" cy="64" r="8"/><circle cx="88" cy="64" r="8"/><circle cx="56" cy="64" r="8"/><path d="M72,312H264a8,8,0,0,0,8-8V144a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8V304A8,8,0,0,0,72,312Zm107.406-31.207L200,253.333,232,296H188.53ZM169.87,296H102.13L136,239.549ZM80,152H256V296h-4l-45.6-60.8a8,8,0,0,0-12.8,0l-23.083,30.778L142.86,219.884a8,8,0,0,0-13.72,0L83.47,296H80Z"/><circle cx="176" cy="192" r="8"/><path d="M440,136H344a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z"/><path d="M312,184h96a8,8,0,0,0,0-16H312a8,8,0,0,0,0,16Z"/><path d="M312,216h48a8,8,0,0,0,0-16H312a8,8,0,0,0,0,16Z"/><path d="M440,200H408a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Z"/><path d="M344,328H328a24,24,0,0,0,0,48h16a24,24,0,0,0,0-48Zm0,32H328a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Z"/><path d="M312,312h96a8,8,0,0,0,8-8V272a8,8,0,0,0-8-8H312a8,8,0,0,0-8,8v32A8,8,0,0,0,312,312Zm88-16H384V280h16Zm-80-16h48v16H320Z"/><path d="M424,328H408a24,24,0,0,0,0,48h16a24,24,0,0,0,0-48Zm0,32H408a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Z"/><path d="M312,248h32a8,8,0,0,0,0-16H312a8,8,0,0,0,0,16Z"/><circle cx="312" cy="144" r="8"/><path d="M168,424H104a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"/><circle cx="72" cy="432" r="8"/><path d="M304,424H240a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"/><circle cx="208" cy="432" r="8"/><path d="M440,424H376a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"/><circle cx="344" cy="432" r="8"/><path d="M72,392H264a8,8,0,0,0,8-8V336a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v48A8,8,0,0,0,72,392Zm88-16H128V344h32Zm16-32h32v32H176Zm80,32H224V344h32ZM80,344h32v32H80Z"/></svg>
    `,
    content: { type: 'Products' },
    category: 'Basic',
  });
}

const test = (editor) => {
  editor.Components.addType('Three.Js', {
    model: {
      defaults: {
        droppable: false,
        resizable: true,
        copyable: false,
        traits: [
          {
            type: "text",
            name: "delay",
            placeholder: 'Nhập số khoảng thời gian chuyển slide (ms)',
            changeProp: true,
          },
        ],
        delay: 'https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj',
        'script-props': ['delay'],
        script: function (delay) {
          function main() {
            const canvas = document.querySelector('#c');
            const renderer = new THREE.WebGLRenderer({ canvas });

            const fov = 45;
            const aspect = 2;
            const near = 0.1;
            const far = 100;
            const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(0, 10, 20);

            const controls = new THREE.OrbitControls(camera, canvas);
            controls.target.set(0, 5, 0);
            controls.update();

            const scene = new THREE.Scene();
            scene.background = new THREE.Color('black');

            {
              const planeSize = 40;

              const loader = new THREE.TextureLoader();
              const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.magFilter = THREE.NearestFilter;
              const repeats = planeSize / 2;
              texture.repeat.set(repeats, repeats);

              const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
              const planeMat = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
              });
              const mesh = new THREE.Mesh(planeGeo, planeMat);
              mesh.rotation.x = Math.PI * -.5;
              scene.add(mesh);
            }

            {
              const skyColor = 0xB1E1FF;
              const groundColor = 0xB97A20;
              const intensity = 1;
              const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
              scene.add(light);
            }

            {
              const color = 0xFFFFFF;
              const intensity = 1;
              const light = new THREE.DirectionalLight(color, intensity);
              light.position.set(5, 10, 2);
              scene.add(light);
              scene.add(light.target);
            }
            const objLoader = new THREE.OBJLoader2();
            objLoader.loadMtl('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.mtl', null, (materials) => {
              objLoader.setMaterials(materials);
              objLoader.load(delay.delay, (event) => {
                const root = event.detail.loaderRootNode;
                scene.add(root);
                // console.log(root);
              });
            });
            function resizeRendererToDisplaySize(renderer) {
              const canvas = renderer.domElement;
              const width = canvas.clientWidth;
              const height = canvas.clientHeight;
              const needResize = canvas.width !== width || canvas.height !== height;
              if (needResize) {
                renderer.setSize(width, height, false);
              }
              return needResize;
            }

            function render() {

              if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
              }

              renderer.render(scene, camera);

              requestAnimationFrame(render);
            }

            requestAnimationFrame(render);
          }

          main();
        },

        content: `
        <style>
        #c{
          width: 100%;
          height: 100%;
        }
        </style>
        <canvas id="c"></canvas>
        `,
      }
    }
  });

  editor.Blocks.add('Three.Js', {
    label: `Three.Js`,
    media: `
    <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 218.207 218.207" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M214.31,27.276H3.897C1.743,27.276,0,29.019,0,31.172v27.276v77.931v50.655c0,2.154,1.743,3.897,3.897,3.897H214.31 c2.154,0,3.897-1.743,3.897-3.897v-50.655V58.448V31.172C218.207,29.019,216.464,27.276,214.31,27.276z M7.793,62.345h35.069 v70.138H7.793V62.345z M210.414,132.483h-11.69V62.345h11.69V132.483z M210.414,54.552h-15.586c-2.154,0-3.897,1.743-3.897,3.897 v77.931c0,2.154,1.743,3.897,3.897,3.897h15.586v42.862H7.793v-0.001v-42.862h38.966c2.154,0,3.897-1.743,3.897-3.897V58.448 c0-2.154-1.743-3.897-3.897-3.897H7.793V35.069h202.621V54.552z"></path> <circle cx="113" cy="163.655" r="7.793"></circle> <path d="M66.241,140.277h109.103c2.154,0,3.897-1.743,3.897-3.897V58.448c0-2.153-1.743-3.896-3.896-3.896H66.241 c-2.154,0-3.897,1.743-3.897,3.897v77.931C62.344,138.534,64.087,140.277,66.241,140.277z M70.138,62.345h101.31v70.138H70.138 V62.345z"></path> <rect x="66.241" y="159.759" width="11.69" height="7.793"></rect> <rect x="85.724" y="159.759" width="11.69" height="7.793"></rect> <rect x="128.586" y="159.759" width="11.69" height="7.793"></rect> <rect x="148.069" y="159.759" width="11.69" height="7.793"></rect> </g> </g> </g> </g></svg>
    `,
    content: { type: 'Three.Js' },
    category: 'Basic',
  });
}

export const Block = {
  model3d,
  imageLink,
  masonry,
  header,
  footer,
  user,
  socical,
  container,
  slider,
  imgSlider,
  threeJs,
  products,
  test
};