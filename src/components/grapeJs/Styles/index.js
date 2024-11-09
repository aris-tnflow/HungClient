const Animation = (editor) => {
    editor.StyleManager.addType('aris', {
        create({ component, props, change }) {
            const el = document.createElement('div');
            el.innerHTML = `<input type="range" class="my-input" min="${props.min}" max="${props.max}"/>`;
            const inputEl = el.querySelector('.my-input');

            inputEl.addEventListener('change', event => change({ event })); // `change` will trigger the emit
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

export const Styles = {
    Animation
};