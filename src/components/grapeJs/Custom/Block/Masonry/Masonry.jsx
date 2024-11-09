import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import { Button, Empty, Input, Modal, Select } from "antd";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Packery from "packery";
import Draggabilly from "draggabilly";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import { debounce } from "lodash";

import { baseURL } from "~/utils";

import "cropperjs/dist/cropper.css";
import "react-contexify/ReactContexify.css";
import "./Masonry.css";

import { masonryPageApi } from "~/apis/customPageApi";
import { fileApi } from "~/apis/fileApi";
import { pagesApi } from "~/apis/pagesApi";

import { handleSizeChange, calculateAspectRatio } from "./function";
import { useLocation } from "react-router-dom";
import { toastLoading, toastSuccess } from "~/components/toast";

const ImageCropper = () => {
  const location = useLocation();
  // Show Img
  const { show: showMenu } = useContextMenu({ id: "menu" });
  const [selectedImg, setSelectedImg] = useState(null);
  const [gridItems, setGridItems] = useState([]);

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [croppedImages, setCroppedImages] = useState([]);
  const [aspectRatios, setAspectRatios] = useState([]);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [lastImage, setLastImage] = useState(false);

  const [pages, setPages] = useState([]);

  const imageElement = useRef(null);
  const cropper = useRef(null);
  const inputFileRef = useRef(null);

  const pckryRef = useRef(null);
  const gridRef = useRef(null);
  const draggabilliesRef = useRef([]);

  const [isDraggable, setIsDraggable] = useState(false);

  const ratiosInfo = [
    { value: "1/1", label: "Left aligned", ratio: [1, 1] },
    { value: "1/2", label: "Center aligned", ratio: [1, 2] },
    { value: "1/3", label: "Center aligned", ratio: [1, 3] },
    { value: "2/1", label: "Center aligned", ratio: [2, 1] },
    { value: "2/3", label: "Center aligned", ratio: [2, 3] },
    { value: "3/1", label: "Center aligned", ratio: [3, 1] },
    { value: "3/2", label: "Right aligned", ratio: [3, 2] },
  ];

  const handleRightClick = (event, item) => {
    event.preventDefault();
    setSelectedImg(item);
    showMenu({
      event: event,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
    setCurrentImageIndex(0);
    setOpenModal(true);
    setLastImage(false);
    setCroppedImages([]);
  };

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setAspectRatio(calculateAspectRatio(naturalWidth, naturalHeight));
  };

  const handleCropNext = () => {
    if (cropper.current) {
      const croppedDataUrl = cropper.current.getCroppedCanvas().toDataURL();
      setCroppedImages([...croppedImages, croppedDataUrl]);
      setAspectRatios([...aspectRatios, `${aspectRatio[0]}/${aspectRatio[1]}`]);
      if (currentImageIndex < images.length - 1) {
        if (currentImageIndex === images.length - 2) {
          setLastImage(true);
        }
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  const handleCropBack = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setLastImage(false);
      setCroppedImages(croppedImages.slice(0, -1));
    }
  };

  const handleCropUpload = () => {
    const croppedDataUrl = cropper.current.getCroppedCanvas().toDataURL();
    setCroppedImages([...croppedImages, croppedDataUrl]);
    setAspectRatios([...aspectRatios, `${aspectRatio[0]}/${aspectRatio[1]}`]);
    setOpenModal(false);
    setTimeout(() => {
      setImages([]);
      setAspectRatios([]);
    }, 500);
  };

  const handleAutoCrop = () => {
    if (cropper.current) {
      cropper.current.setCropBoxData({
        top: 0,
        height: cropper.current.getCanvasData().height,
      });
      let cropData = cropper.current.getData();
      cropper.current.setData({ x: cropData.x / 2, y: cropData.y / 2 });
    }
  };

  const handleRemove = (id) => {
    if (selectedImg) {
      let elementToRemove = document.getElementById(id);
      pckryRef.current.remove(elementToRemove);
    }
  };

  const debouncedOrderItems = debounce(orderItems, 1000);
  const getItemElement = (imgSrc, aspectRatio, width) => {
    const item = document.createElement("div");
    const img = document.createElement("img");
    const idImg = `${Math.random().toString(36).substring(7)}`;
    img.src = imgSrc;
    item.style.aspectRatio = aspectRatio;
    item.id = idImg;
    item.className = `grid-item grid-item--width${width}`;
    item.appendChild(img);

    var items = { imgSrc, aspectRatio, width, idImg };

    img.addEventListener("contextmenu", (e) => {
      handleRightClick(e, items, 2);
    });
    return item;
  };

  function orderItems() {
    const itemOrderArray = [];
    pckryRef.current.getItemElements().forEach((itemElem, i) => {
      const orderDiv = itemElem.querySelector(".order-number");
      if (orderDiv) {
        orderDiv.textContent = i + 1;
      }

      const imgSrc = itemElem.querySelector("img").getAttribute("src");
      const idImg = itemElem.getAttribute("id");
      const widthClass = itemElem.classList[itemElem.classList.length - 1];
      const aspectRatioStyle = itemElem
        .getAttribute("style")
        .match(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)/);
      const aspectRatio = aspectRatioStyle
        ? `${aspectRatioStyle[1]}/${aspectRatioStyle[2]}`
        : "N/A";

      itemOrderArray.push({
        idImg: idImg,
        imgSrc: imgSrc,
        width: parseInt(widthClass.replace("grid-item--width", "")),
        aspectRatio: aspectRatio,
      });
    });
  }

  const createDraggableItem = (item, orderDiv) => {
    if (pckryRef.current) {
      const draggie = new Draggabilly(item);
      pckryRef.current.bindDraggabillyEvents(draggie);
      item.appendChild(orderDiv);
    }
  };

  const createItemAndBindEvents = (image, aspectRatio, width) => {
    const item = getItemElement(image, aspectRatio, width);
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-number";
    createDraggableItem(item, orderDiv);
    return item;
  };

  const updateMasonry = async () => {
    const itemOrderArray = [];
    await Promise.all(
      pckryRef.current.getItemElements().map(async (itemElem, i) => {
        const imgSrc = itemElem.querySelector("img").getAttribute("src");
        const idImg = itemElem.getAttribute("id");
        const widthClass = itemElem.classList[itemElem.classList.length - 1];
        const aspectRatioStyle = itemElem
          .getAttribute("style")
          .match(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)/);
        const aspectRatio = aspectRatioStyle
          ? `${aspectRatioStyle[1]}/${aspectRatioStyle[2]}`
          : "N/A";
        const link = itemElem?.querySelector("input")?.value;

        itemOrderArray.push({
          idImg: idImg,
          imgSrc: imgSrc,
          width: parseInt(widthClass.replace("grid-item--width", "")),
          aspectRatio: aspectRatio,
          link: link || "",
        });

        if (imgSrc.startsWith("data:image")) {
          try {
            const data = await fileApi.fileBase64({
              base64: imgSrc,
              folder: location.pathname.split("/").pop(),
            });
            itemOrderArray[i].imgSrc = `${baseURL}/uploads/${data.file}`;
          } catch (error) {
            console.error("Error converting base64 to URL:", error);
          }
        }
      })
    );

    toastLoading("mas", "Đang Cập Nhật...");
    masonryPageApi
      .updateMasonry(location.pathname.split("/").pop(), {
        img: itemOrderArray,
      })
      .then(() => {
        toastSuccess("mas", "Cập Nhật Thành Công");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          masonryPageApi
            .addMasonry(location.pathname.split("/").pop())
            .then(() => toastSuccess("Tạo mới thành công"));
        }
      });
  };

  const handleInputChange = (index, newValue) => {
    const newGridItems = [...gridItems];
    newGridItems[index].link = newValue;
    setGridItems(newGridItems);
  };

  const clearDragging = () => {
    draggabilliesRef.current = [];
  };

  const enableDragging = () => {
    pckryRef.current.getItemElements().forEach((itemElement, index) => {
      const draggabilly = new Draggabilly(itemElement);
      pckryRef.current.bindDraggabillyEvents(draggabilly);
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

  const toggleDraggable = () => {
    setIsDraggable(!isDraggable);
    if (!isDraggable) {
      clearDragging();
      enableDragging();
    } else {
      disableDragging();
    }
  };

  useEffect(() => {
    masonryPageApi
      .getSingleMasonry(location.pathname.split("/").pop())
      .then((data) => {
        if (data?.img) {
          setGridItems(data?.img);
        }
        setGridItems(data?.img);
      });
  }, []);

  useEffect(() => {
    pagesApi.get().then((data) => {
      setPages(data);
    });
  }, []);

  useEffect(() => {
    const packeryOptions = {
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer",
      percentPosition: false,
    };
    pckryRef.current = new Packery(gridRef.current, packeryOptions);

    pckryRef.current.getItemElements().forEach((itemElement) => {
      const orderId = itemElement.querySelector(".order-number");
      if (orderId) {
        return;
      }

      const orderDiv = document.createElement("div");
      orderDiv.className = "order-number";
      itemElement.appendChild(orderDiv);
    });

    pckryRef.current.on("layoutComplete", orderItems);
    pckryRef.current.on("dragItemPositioned", () => {
      orderItems();
      setTimeout(() => {}, 0);
    });
  }, [gridItems]);

  useEffect(() => {
    if (croppedImages.length > 0 && croppedImages.length === images.length) {
      const items = croppedImages.map((image, index) =>
        createItemAndBindEvents(
          image,
          aspectRatios[index],
          aspectRatios[index][0]
        )
      );
      items.forEach((item) => {
        gridRef.current.insertBefore(item, gridRef.current.firstChild);
      });
      pckryRef.current.on("layoutComplete", orderItems);
      pckryRef.current.prepended(items);
      pckryRef.current.on("dragItemPositioned", () => {
        debouncedOrderItems();
        setTimeout(() => {}, 0);
      });
    }
  }, [croppedImages]);

  useEffect(() => {
    if (images.length > 0 && imageElement.current) {
      if (cropper.current) {
        cropper.current.destroy();
      }

      cropper.current = new Cropper(imageElement.current, {
        aspectRatio: aspectRatio[0] / aspectRatio[1],
        viewMode: 1,
        zoomOnTouch: false,
        zoomOnWheel: false,
      });
    }

    return () => {
      if (cropper.current) {
        cropper.current.destroy();
      }
    };
  }, [currentImageIndex, aspectRatio]);

  return (
    <>
      <div className="!h-full">
        <div className="flex justify-center items-center gap-2 my-2">
          <Button onClick={() => inputFileRef.current.click()}>Thêm ảnh</Button>
          <Button type="primary" onClick={toggleDraggable}>
            {isDraggable ? "Chặn sắp xếp" : "Bật sắp xếp"}
          </Button>
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
            ref={inputFileRef}
          />

          {images.length > 0 && (
            <>
              <Button onClick={() => setOpenModal(true)}>
                <i className="fa-duotone fa-crop fs-5 me-2"></i>Xem Ảnh Crop
              </Button>

              <Modal
                title={
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="mb-0">Cắt ảnh theo tỉ lệ</h4>
                    <ToggleGroup.Root
                      className="ToggleGroup"
                      type="single"
                      value={`${aspectRatio[0]}/${aspectRatio[1]}`}
                      aria-label="Text alignment"
                    >
                      {ratiosInfo.map((item, index) => (
                        <ToggleGroup.Item
                          key={index}
                          className="ToggleGroupItem"
                          value={item.value}
                          aria-label={item.label}
                          onClick={() => setAspectRatio(item.ratio)}
                        >
                          {item.value}
                        </ToggleGroup.Item>
                      ))}
                    </ToggleGroup.Root>

                    <Button onClick={handleAutoCrop}>
                      <i className="fa-duotone fa-crop-simple fs-5 me-2"></i>Tự
                      động cắt ảnh
                    </Button>
                  </div>
                }
                centered
                open={openModal}
                width={1000}
                closeIcon={null}
                footer={[
                  <Button key="exit" danger onClick={() => setOpenModal(false)}>
                    {" "}
                    Thoát{" "}
                  </Button>,
                  <Button
                    key="back"
                    type="dashed"
                    onClick={handleCropBack}
                    disabled={currentImageIndex === 0}
                  >
                    Trở về
                  </Button>,
                  <Button
                    key="next"
                    type="dashed"
                    onClick={handleCropNext}
                    disabled={lastImage || images.length === 1}
                  >
                    Tiếp theo
                  </Button>,
                  <Button
                    key="upload"
                    type="primary"
                    onClick={handleCropUpload}
                    disabled={!(lastImage || images.length === 1)}
                  >
                    {" "}
                    Tải lên
                  </Button>,
                ]}
              >
                <div className="col-12 w-100 h-100">
                  <img
                    className="w-100"
                    style={{ height: "500px" }}
                    ref={imageElement}
                    src={images[currentImageIndex]}
                    alt="To be cropped"
                    onLoad={handleImageLoad}
                  />
                </div>
              </Modal>
            </>
          )}

          <Button
            onClick={() => {
              pckryRef.current.layout();
            }}
            type="primary"
          >
            Layout lại
          </Button>

          <Button
            onClick={() => {
              updateMasonry();
            }}
            type="primary"
          >
            Lưu thay đổi
          </Button>
        </div>

        <div style={{ height: 600, overflow: "scroll", paddingBottom: 50 }}>
          <div className="grid" ref={gridRef}>
            <div className="grid-sizer"></div>
            {gridItems?.map((item, index) => (
              <div
                key={index}
                id={item?._id}
                className={`grid-item grid-item--width${item.width}`}
                style={{ aspectRatio: item.aspectRatio }}
              >
                <img
                  className="relative"
                  src={item.imgSrc}
                  onContextMenu={(event) => handleRightClick(event, item)}
                />

                <Input
                  className="bg-dark text-white absolute bottom-0 end-0"
                  style={{ width: "100%" }}
                  value={item?.link}
                  id={item?.idImg}
                  placeholder="Nhập đường dẫn trang"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />

                {/* <Select
                                    showSearch
                                    value={item?.link}
                                    className='bg-dark text-white absolute bottom-0 end-0'
                                    style={{ width: '100%' }}
                                    placeholder='Chọn trang'
                                    options={pages?.newData?.map((page) => ({ label: page.name, value: page.slug }))}
                                    onChange={(value) => handleInputChange(index, value)}
                                >
                                </Select> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Menu id="menu">
        <Submenu label={`Thay đổi kích thước`}>
          <Item
            onClick={() => {
              handleSizeChange(
                selectedImg.aspectRatio,
                1,
                selectedImg,
                gridItems,
                setGridItems,
                pckryRef
              );
              setTimeout(() => {
                if (isDraggable) {
                  toggleDraggable();
                }
              }, 0);
            }}
          >
            Size 1
          </Item>
          <Item
            onClick={() => {
              handleSizeChange(
                selectedImg.aspectRatio,
                2,
                selectedImg,
                gridItems,
                setGridItems,
                pckryRef
              );
              setTimeout(() => {
                if (isDraggable) {
                  toggleDraggable();
                }
              }, 0);
            }}
          >
            Size 2
          </Item>
          <Item
            onClick={() => {
              handleSizeChange(
                selectedImg.aspectRatio,
                3,
                selectedImg,
                gridItems,
                setGridItems,
                pckryRef
              );
              setTimeout(() => {
                if (isDraggable) {
                  toggleDraggable();
                }
              }, 0);
            }}
          >
            Size 3
          </Item>
        </Submenu>
        <Separator />
        <Item>Aspect-Ratio: {selectedImg?.aspectRatio}</Item>
        <Separator />
        <Item
          onClick={() => {
            handleRemove(selectedImg?._id);
          }}
        >
          Xóa ảnh
        </Item>
      </Menu>
    </>
  );
};

export default ImageCropper;
