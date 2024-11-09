
export const formatMasonryHTML = (data) => {
    return data.img.map((item, index) => (
        `<div key="${index}" id="${item.idImg}" class="grid-item grid-item--width${item.width}" style="aspect-ratio: ${item.aspectRatio};">
            <a class="w-full h-full" href="${item.link || '#'}">
                <img class="w-full h-full" src="${item.imgSrc}" />
            </a>
        </div>`
    )).join('');
};

export const convertBytes = (bytes) => {
    if (bytes >= 1024 * 1024 * 1024) {
        const gigabytes = bytes / (1024 * 1024 * 1024);
        return gigabytes.toFixed(2) + ' GB';
    } else {
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2) + ' MB';
    }
}

export const convertBytesNo = (bytes) => {
    if (bytes >= 1024 * 1024 * 1024) {
        const gigabytes = bytes / (1024 * 1024 * 1024);
        return gigabytes.toFixed(2);
    } else {
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2);
    }
}

