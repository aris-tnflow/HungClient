import React, { useEffect, useRef, useState } from 'react';
import Packery from 'packery';
import Draggabilly from 'draggabilly';
import { Menu, Item, Separator, Submenu, useContextMenu } from "react-contexify";
import { Button, Input } from 'antd';

import { handleSizeChange } from './function';

import { masonryPageApi } from '~/apis/customPageApi';

import 'react-contexify/ReactContexify.css';
import './Masonry.css';

const Masonry = () => {
    const { show: showMenu } = useContextMenu({ id: "menu" });

    const packeryRef = useRef(null);
    const gridRef = useRef(null);
    const draggabilliesRef = useRef([]);

    const [gridItems, setGridItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDraggable, setIsDraggable] = useState(false);

    const handleRightClick = (event, item) => {
        event.preventDefault();
        setSelectedImage(item);
        showMenu({
            event: event,
        });
    };

    const handleRemove = (id) => {
        if (selectedImage) {
            let elementToRemove = document.getElementById(id);
            packeryRef.current.remove(elementToRemove);
            packeryRef.current.layout();
        }
    };

    const fetchData = () => {
        masonryPageApi.getSingleMasonry(location.pathname.split('/').pop())
            .then(data => {
                if (data?.img) {
                    setGridItems(data?.img);
                    setLoading(false);
                }
            })
    }

    function orderItems() {
        const itemOrderArray = [];
        packeryRef.current.getItemElements().forEach((itemElement, index) => {
            const orderDiv = itemElement.querySelector('.order-number');
            if (orderDiv) {
                orderDiv.textContent = index + 1;
            }

            const imageSrc = itemElement.querySelector('img').getAttribute('src');
            const imageId = itemElement.getAttribute('id');
            const widthClass = itemElement.classList[itemElement.classList.length - 1];
            const aspectRatioStyle = itemElement.getAttribute('style').match(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)/);
            const aspectRatio = aspectRatioStyle ? `${aspectRatioStyle[1]}/${aspectRatioStyle[2]}` : 'N/A';

            itemOrderArray.push({
                imageId: imageId,
                imageSrc: imageSrc,
                width: parseInt(widthClass.replace('grid-item--width', '')),
                aspectRatio: aspectRatio
            });
        });
    }

    const toggleDraggable = () => {
        setIsDraggable(!isDraggable);
        if (!isDraggable) {
            clearDragging();
            enableDragging();
            packeryRef.current.layout();
        } else {
            disableDragging();
        }
    };

    const clearDragging = () => {
        draggabilliesRef.current = [];
    };

    const enableDragging = () => {
        packeryRef.current.getItemElements().forEach((itemElement, index) => {
            const draggabilly = new Draggabilly(itemElement);
            packeryRef.current.bindDraggabillyEvents(draggabilly);
            draggabilliesRef.current[index] = draggabilly;
        });
    };

    const disableDragging = () => {
        draggabilliesRef.current.forEach((draggabilly) => {
            if (draggabilly) {
                draggabilly.disable();
            }
        });
    };

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        const packeryOptions = {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: false,
        };
        packeryRef.current = new Packery(gridRef.current, packeryOptions);

        packeryRef.current.getItemElements().forEach((itemElement) => {
            const orderId = itemElement.querySelector('.order-number');
            if (orderId) {
                return;
            }

            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-number';
            itemElement.appendChild(orderDiv);
        });

        packeryRef.current.on('layoutComplete', orderItems);
        packeryRef.current.on('dragItemPositioned', () => {
            orderItems();
            setTimeout(() => {
                packeryRef.current.layout();
            }, 0);
        });
    }, [gridItems]);

    return (
        <React.Fragment>
            <div className="flex justify-center gap-3 my-3">
                <Button type="primary">Thêm ảnh</Button>
                <Button type="primary" onClick={toggleDraggable}>
                    {isDraggable ? 'Chặn sắp xếp' : 'Bật sắp xếp'}
                </Button>
                <Button type="primary">Lưu thay đổi</Button>
            </div>

            <div className="grid" ref={gridRef}>
                {!loading &&
                    <React.Fragment>
                        <div className="grid-sizer"></div>
                        {gridItems?.map((item, index) => (
                            <div
                                key={index}
                                id={item?.idImg}
                                className={`grid-item grid-item--width${item.width}`}
                                style={{ aspectRatio: item.aspectRatio }}
                            >
                                <img
                                    className='relative'
                                    src={item.imgSrc}
                                    onContextMenu={(event) => handleRightClick(event, item)}
                                />

                                <Input
                                    className='bg-dark text-white absolute bottom-0 end-0'
                                    style={{ width: '100%' }}
                                    value={item?.link}
                                    id={item?.idImg}
                                    placeholder='Nhập đường dẫn trang'
                                />
                            </div>
                        ))}
                    </React.Fragment>
                }
            </div>

            <Menu id="menu">
                <Submenu label={`Thay đổi kích thước`}>
                    <Item onClick={() => {
                        handleSizeChange(selectedImage.aspectRatio, 1, selectedImage, gridItems, setGridItems, packeryRef);
                        setTimeout(() => {
                            if (isDraggable) {
                                toggleDraggable();
                            }
                            packeryRef.current.layout();
                        }, 0)
                    }}>
                        Size 1
                    </Item>
                    <Item onClick={() => {
                        handleSizeChange(selectedImage.aspectRatio, 2, selectedImage, gridItems, setGridItems, packeryRef);
                        setTimeout(() => {
                            if (isDraggable) {
                                toggleDraggable();
                            }
                            packeryRef.current.layout();
                        }, 0)
                    }}>
                        Size 2
                    </Item>
                    <Item onClick={() => {
                        handleSizeChange(selectedImage.aspectRatio, 3, selectedImage, gridItems, setGridItems, packeryRef);
                        setTimeout(() => {
                            if (isDraggable) {
                                toggleDraggable();
                            }
                            packeryRef.current.layout();
                        }, 0)
                    }}>
                        Size 3
                    </Item>
                </Submenu>
                <Separator />
                <Item>Aspect-Ratio: {selectedImage?.aspectRatio}</Item>
                <Separator />
                <Item onClick={() => {
                    handleRemove(selectedImage?.idImg);
                }}>
                    Xóa ảnh
                </Item>
            </Menu>
        </React.Fragment>
    )
}

export default Masonry;