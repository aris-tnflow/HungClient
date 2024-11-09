
export const generateRandomKey = (length = 5) => {
    return Math.random().toString(36).substr(2, length);
}

export const deepCopyWithoutParent = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    let copy = Array.isArray(obj) ? [] : {};
    for (let i in obj) {
        if (i === 'parent') continue;
        if (obj[i] && typeof obj[i] === 'object') {
            copy[i] = deepCopyWithoutParent(obj[i]);
        } else {
            copy[i] = obj[i];
        }
    }
    return copy;
}

export const findLeafKeys = (data, targetKey, leafKeys = []) => {
    for (let node of data) {
        if (node.key === targetKey) {
            if (node.children && node.children.length > 0) {
                for (let child of node.children) {
                    if (child.isLeaf) {
                        leafKeys.push(child.key);
                    }
                }
            }
            return leafKeys;
        }
        if (node.children) {
            findLeafKeys(node.children, targetKey, leafKeys);
        }
    }
    return leafKeys;
};

export const selectAllFile = (treeData, selectKey, findLeafKeys, setSelectFiles) => {
    const leafKeys = findLeafKeys(treeData, selectKey);
    setSelectFiles(leafKeys)
}

export const addParentInfo = (data, parent = null) => {
    for (let node of data) {
        node.parent = parent;
        if (node.children) {
            addParentInfo(node.children, node);
        }
    }
};
