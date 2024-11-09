const customType = (editor) => {
    editor.StyleManager.addType('aris-custom-prop', {
        create({ props, change }) {
            const el = document.createElement('div');
            el.innerHTML = `<input type="range" class="my-input" min="${props.min}" max="${props.max}"/>`;
            const inputEl = el.querySelector('.my-input');
            inputEl.addEventListener('change', event => change({ event }));
            inputEl.addEventListener('input', event => change({ event, partial: true }));
            return el;
        },
        emit({ props, updateStyle }, { event, partial }) {
            const { value } = event.target;
            updateStyle(`${value}px`, { partial });
        },
        update({ value, el }) {
            el.querySelector('.my-input').value = parseInt(value, 10);
        },
        destroy() {
        },
    });
};

const customTypeSelect = (editor) => {
    editor.StyleManager.addType('aris-custom-select', {
        create({ props, change }) {
            const el = document.createElement('div');
            el.classList = 'gjs-field gjs-select';
            const selectEl = document.createElement('select');
            selectEl.className = 'my-select';

            if (props.options && Array.isArray(props.options)) {
                props.options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option.value;
                    optionEl.text = option.name;

                    // Đặt giá trị mặc định nếu trùng với giá trị default
                    if (props.default && props.default === option.value) {
                        optionEl.selected = true;
                    }

                    selectEl.appendChild(optionEl);
                });
            }

            selectEl.addEventListener('change', event => change({ event })); // Trigger 'change' event
            el.appendChild(selectEl);
            return el;
        },
        emit({ props, updateStyle }, { event }) {
            const { value } = event.target;
            updateStyle(value);
        },
        update({ value, el }) {
            const selectEl = el.querySelector('.my-select');
            if (selectEl) selectEl.value = value;
        },
        destroy() {
            // Xử lý logic dọn dẹp (nếu cần)
        }
    });
};


export const Styles = {
    customType,
    customTypeSelect
}