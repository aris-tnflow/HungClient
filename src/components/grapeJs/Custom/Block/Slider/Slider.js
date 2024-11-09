// import React, { useState, useEffect } from 'react';
// import { Button, Modal, Checkbox } from 'antd';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';
// import * as Popover from '@radix-ui/react-popover';
// import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';

// import '../../../public/HomePage/HomePage.css'
// import './css/Slider.css';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// const Slider = () => {
//     const modelUrls = [
//         'https://mern3d.s3.ap-southeast-2.amazonaws.com/6645e8edebc1dd8e6e1cd314_original.glb',
//         'https://mern3d.s3.ap-southeast-2.amazonaws.com/6645e8d8ebc1dd8e6e1cd2f5_25.glb',
//     ];

//     const slides = [
//         {
//             title: '"Lossless Youths"',
//             img: 'https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         },
//         {
//             title: '"Estrange Bond"',
//             img: 'https://i.redd.it/tc0aqpv92pn21.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         },
//         {
//             title: '"The Gate Keeper"',
//             img: 'https://wharferj.files.wordpress.com/2015/11/bio_north.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         },
//         {
//             title: '"Last Trace Of Us"',
//             img: 'https://images7.alphacoders.com/878/878663.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         },
//         {
//             title: '"Urban Decay"',
//             img: 'https://theawesomer.com/photos/2017/07/simon_stalenhag_the_electric_state_6.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         },
//         {
//             title: '"The Migration"',
//             img: 'https://da.se/app/uploads/2015/09/simon-december1994.jpg',
//             desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.'
//         }
//     ];

//     const [currentUrl, setCurrentUrl] = useState(modelUrls[0]);
//     const [open, setOpen] = useState(false);

//     const switchSrc = (direction) => {
//         setCurrentUrl((prevUrl) => {
//             const currentIndex = modelUrls.indexOf(prevUrl);
//             let newIndex = currentIndex + direction;
//             if (newIndex < 0) {
//                 newIndex = modelUrls.length - 1;
//             } else if (newIndex >= modelUrls.length) {
//                 newIndex = 0;
//             }
//             return modelUrls[newIndex];
//         });
//     };

//     useEffect(() => {
//         const buttonUI = document.querySelector('.button_ui');
//         const slider = document.querySelector('.slider');

//         const activate = (e) => {
//             const items = document.querySelectorAll('.item');
//             if (e.target.closest('.arrow-next')) {
//                 slider.append(items[0]);
//             } else if (e.target.closest('.arrow-prev')) {
//                 slider.prepend(items[items.length - 1]);
//             }
//         };

//         const handleArrowClick = (e) => {
//             e.preventDefault();
//             const arrow = e.currentTarget;
//             if (!arrow.classList.contains('animate')) {
//                 arrow.classList.add('animate');
//                 setTimeout(() => {
//                     arrow.classList.remove('animate');
//                 }, 500);
//             }
//         };

//         buttonUI.addEventListener('click', activate);
//         document.querySelectorAll('.arrow-main').forEach(arrow => {
//             arrow.addEventListener('click', handleArrowClick);
//         });

//         return () => {
//             buttonUI.removeEventListener('click', activate);
//             document.querySelectorAll('.arrow-main').forEach(arrow => {
//                 arrow.removeEventListener('click', handleArrowClick);
//             });
//         };
//     }, []);

//     return (
//         <div className="col-12">
//             <div className="card">
//                 <div className="card-header flex justify-between items-center">
//                     <h4 className='mb-0'>Silder</h4>

//                     <div className="flex justify-center items-center gap-2">
//                         <Popover.Root>
//                             <Popover.Trigger asChild>
//                                 <button className="IconButton" aria-label="Silder">
//                                     <MixerHorizontalIcon />
//                                 </button>
//                             </Popover.Trigger>
//                             <Popover.Portal>
//                                 <Popover.Content className="PopoverContent" sideOffset={5}>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//                                         <p className="Text mb-0" style={{ marginBottom: 10 }}>
//                                             Slider
//                                         </p>
//                                         <fieldset className="Fieldset">
//                                             <label className="Label" htmlFor="width">
//                                                 Chuyển cảnh + 3D
//                                             </label>
//                                             <input className="Input" id="width" defaultValue="3s" />
//                                         </fieldset>

//                                         <p className="Text mb-0" style={{ marginTop: 10, marginBottom: 10 }}>
//                                             3D
//                                         </p>
//                                         <fieldset className="Fieldset">
//                                             <label className="Label" htmlFor="width">
//                                                 Shadow
//                                             </label>
//                                             <Checkbox>Hiển thị</Checkbox>
//                                         </fieldset>
//                                         <fieldset className="Fieldset">
//                                             <label className="Label" htmlFor="width">
//                                                 Animation
//                                             </label>
//                                             <Checkbox>Bật</Checkbox>
//                                         </fieldset>
//                                         <fieldset className="Fieldset">
//                                             <label className="Label" htmlFor="width">
//                                                 Zoom
//                                             </label>
//                                             <Checkbox>Bật</Checkbox>
//                                         </fieldset>
//                                     </div>
//                                     <Popover.Close className="PopoverClose" aria-label="Close">
//                                         <Cross2Icon />
//                                     </Popover.Close>
//                                     <Popover.Arrow className="PopoverArrow" />
//                                 </Popover.Content>
//                             </Popover.Portal>
//                         </Popover.Root>

//                         <Button onClick={() => setOpen(true)}><i className="fa-solid fa-upload fs-5 me-2"></i> Chỉnh sửa</Button>
//                         <Button type="primary">Lưu thay đổi</Button>
//                     </div>
//                 </div>

//                 <div className="card-body">
//                     <div className='w-100' style={{ height: "600px" }}>
//                         <div className="mainSlider position-relative">
//                             <ul className="slider">
//                                 {slides.map((slide, index) => (
//                                     <li key={index} className="item" style={{ backgroundImage: `url(${slide.img})` }}>
//                                         <div className="text-homepage">
//                                             <h2 className="title">{slide.title}</h2>
//                                             <p className="description">{slide.desc}</p>
//                                             <button>Read More</button>
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>

//                             <div className="modelReview">
//                                 <model-viewer
//                                     style={{ width: '100%', height: '100%' }}
//                                     loading="eager"
//                                     src={currentUrl}
//                                     disable-tap
//                                     shadow-intensity={1}
//                                     autoPlay
//                                     interaction-prompt="none"
//                                     auto-rotate
//                                     auto-rotate-delay={1000}
//                                     rotation-per-second="40deg"
//                                     pan-sensitivity={0}
//                                     camera-controls
//                                     touch-action="pan-y"
//                                 />
//                             </div>

//                             <nav className="nav">
//                                 <div className="button_ui">
//                                     <div className="arrow-main arrow-prev" onClick={() => switchSrc(-1)}>
//                                         <span className="arrow-span" />
//                                         <svg className="arrow-svg">
//                                             <circle cx={22} cy={22} r={21} stroke="white" strokeWidth={2} />
//                                         </svg>
//                                     </div>
//                                     <div className="arrow-main arrow-next" onClick={() => switchSrc(1)}>
//                                         <span className="arrow-span" />
//                                         <svg className="arrow-svg">
//                                             <circle cx={22} cy={22} r={21} stroke="white" strokeWidth={2} />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </nav>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Modal
//                 centered
//                 open={open}
//                 onOk={() => setOpen(false)}
//                 onCancel={() => setOpen(false)}
//                 okText='Lưu thay đổi'
//                 cancelText='Hủy'
//                 width={1200}
//                 closeIcon={null}
//             >
//                 <div className="row">
//                     <div className="col-md-6">
//                         <div className="flex">
//                             <h4>Danh sách ảnh</h4>
//                             <Button className="ms-auto"><i className="fa-solid fa-upload fs-5 me-2"></i> Thêm ảnh</Button>
//                         </div>

//                         <Swiper
//                             pagination={{
//                                 type: 'fraction',
//                             }}
//                             navigation={true}
//                             modules={[Pagination, Navigation]}
//                             className="mySwiper"
//                         >
//                             {slides.map((slide, index) => (
//                                 <SwiperSlide key={index}>
//                                     <img src={`${slide.img}`} alt="" />
//                                 </SwiperSlide>
//                             ))}
//                         </Swiper>

//                     </div>

//                     <div className="col-md-6">
//                         <div className="flex">
//                             <h4>Danh sách 3D</h4>
//                             <Button className="ms-auto"><i className="fa-solid fa-upload fs-5 me-2"></i> Thêm file 3D</Button>
//                         </div>

//                         <div className="w-100 bg-dark" style={{ height: "500px" }} >
//                             <model-viewer
//                                 style={{ width: '100%', height: '100%' }}
//                                 loading="eager"
//                                 src={currentUrl}
//                                 disable-tap
//                                 shadow-intensity={1}
//                                 autoPlay
//                                 interaction-prompt="none"
//                                 auto-rotate
//                                 auto-rotate-delay={1000}
//                                 rotation-per-second="40deg"
//                                 pan-sensitivity={0}
//                                 camera-controls
//                                 touch-action="pan-y"
//                             />

//                             <div className="text-center mt-2">
//                                 <p>1 / 2</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     )
// }

// export default Slider


import React from 'react'

const Slider = () => {
    return (
        <div>Slider</div>
    )
}

export default Slider