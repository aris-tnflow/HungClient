export default (editor, opts = {}) => {
  const domc = editor.Components;

  const html = `
  <div class name="section">
  </div>
  `

  const css = `
  `

  domc.addType(opts.name, {
    model: {
      defaults: {
        resizable: true,
        droppable: true,
        copyable: true,

        progressType: 'bullets',
        'script-props': ['progressType'],

        components: `
          <style>
            ${css}
          </style>

          ${html}
        `,
        script: function (props) {
          // console.log(props);
        },

        style: {
          "height": "95",
        }
      },
    },
  });
};

// export default (editor, opts = {}) => {
//   const domc = editor.Components;

//   const html = `
//   <div class="swiper mySwiper">
//     <div class="swiper-wrapper">
//       <div class="swiper-slide"></div>
//       <div class="swiper-slide"></div>
//     </div>
//     <div class="swiper-button-next"></div>
//     <div class="swiper-button-prev"></div>
//     <div class="swiper-pagination"></div>
//   </div>
//   `
//   const css = `
//     html,
//     body {
//       position: relative;
//       height: 100%;
//     }

//     body {
//       background: #eee;
//       font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
//       font-size: 14px;
//       color: #000;
//       margin: 0;
//       padding: 0;
//     }

//     .swiper {
//       width: 100%;
//       height: 100%;
//     }

//     .swiper-slide {
//       text-align: center;
//       font-size: 18px;
//       background: #fff;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }

//     .swiper-slide img {
//       display: block;
//       width: 100%;
//       height: 100%;
//       object-fit: cover;
//     }
//   `

//   domc.addType(opts.name, {
//     model: {
//       defaults: {
//         resizable: true,
//         droppable: true,
//         copyable: true,

//         progressType: 'bullets',
//         'script-props': ['progressType'],

//         components: `
//           <style>
//             ${css}
//           </style>

//           ${html}
//         `,

//         traits: [
//           {
//             type: 'select',
//             name: 'progressType',
//             label: 'Progress Type',
//             changeProp: 1,
//             options: [
//               { value: "bullets", name: 'Bullets' },
//               { value: "fraction", name: 'Fraction' },
//               { value: "progressbar", name: 'Progressbar' },
//             ],
//           },
//           {
//             type: 'button',
//             text: 'Add Slider',
//             full: true,
//             command: (editor) => {
//               const component = editor.getSelected();
//               const wrapper = component.find('.swiper-wrapper')[0];
//               const slideCount = wrapper.components().length;
//               wrapper.append(`<div class="swiper-slide">${slideCount + 1}</div>`);
//               editor.trigger('component:update');
//               component.view.updateScript();
//             },
//           },
//         ],

//         script: function (props) {
//           const { progressType } = props;
//           const el = this;

//           console.log('progressType', progressType);

//           let swiper;

//           function initSwiper() {
//             if (swiper) {
//               swiper.destroy(true, true);
//             }

//             // eslint-disable-next-line no-undef
//             swiper = new Swiper(el.querySelector(".mySwiper"), {
//               pagination: {
//                 el: ".swiper-pagination",
//                 type: progressType,
//               },
//               navigation: {
//                 nextEl: ".swiper-button-next",
//                 prevEl: ".swiper-button-prev",
//               },
//             });
//           }

//           initSwiper();

//           const observer = new MutationObserver((mutations) => {
//             mutations.forEach((mutation) => {
//               if (mutation.type === 'childList') {
//                 initSwiper();
//               }
//             });
//           });

//           observer.observe(el.querySelector('.swiper-wrapper'), { childList: true });
//         },

//         style: {
//           "height": "80vh",
//         }
//       },

//       initialize(props, opts) {
//         const model = this;
//         this.on('component:clone', (component) => {
//           setTimeout(() => {
//             component.view.updateScript();
//           }, 0);
//         });
//       },
//     },

//     view: {
//       onRender() {
//         const model = this.model;
//         model.trigger('component:mount');
//       },
//     },
//   });

//   editor.on('component:clone', (component) => {
//     if (component.get('type') === opts.name) {
//       setTimeout(() => {
//         component.view.updateScript();
//       }, 0);
//     }
//   });
// };