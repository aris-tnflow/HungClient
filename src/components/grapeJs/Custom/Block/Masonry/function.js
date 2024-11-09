export const handleSizeChange = (aspect, size, selectedImg, gridItems, setGridItems) => {
    if (selectedImg) {
        const sizeChangeMap = {
            "1/1": [1, 2, 3],
            "1/2": [1, 2, 3],
            "2/1": [2, 4, 6],
            "2/3": [2, 4, 6],
            "3/1": [3, 6, 9],
            "3/2": [3, 6, 9]
        };

        const updatedItems = gridItems.map(item => {
            if (item === selectedImg) {
                const sizeChange = sizeChangeMap[aspect][size - 1];
                return { ...item, width: sizeChange };
            }
            return item;
        });
        setGridItems(updatedItems);
    }
};

export const calculateAspectRatio = (width, height) => {
    const ratios = [
        { value: 1, string: [1, 1] },
        { value: 1 / 2, string: [1, 2] },
        { value: 1 / 3, string: [1, 3] },
        { value: 2, string: [2, 1] },
        { value: 2 / 3, string: [2, 3] },
        { value: 3, string: [3, 1] },
        { value: 3 / 2, string: [3, 2] },
    ];

    const imageRatio = width / height;
    let bestRatio = ratios[0];
    let minDifference = Math.abs(imageRatio - bestRatio.value);

    for (let i = 1; i < ratios.length; i++) {
        const difference = Math.abs(imageRatio - ratios[i].value);
        if (difference < minDifference) {
            minDifference = difference;
            bestRatio = ratios[i];
        }
    }
    return bestRatio.string;
};
