import type { Editor } from "grapesjs";
import { PluginOptions } from ".";

export default (editor: Editor, opt: PluginOptions = {}) => {
  const bm = editor.BlockManager;
  const stylePrefix = opt.stylePrefix;
  const clsRow = `${stylePrefix}row-aris`;
  const clsCell = `${stylePrefix}cell-aris`;
  const labelRow = opt.labelRow;
  const labelCell = opt.labelColumn;

  const attrsToString = (attrs: Record<string, any>) => {
    const result = [];

    for (let key in attrs) {
      let value = attrs[key];
      const toParse = value instanceof Array || value instanceof Object;
      value = toParse ? JSON.stringify(value) : value;
      result.push(`${key}=${toParse ? `${value}` : `"${value}"`}`);
    }

    return result.length ? `${result.join(" ")}` : "";
  };

  const keyWidth = "flex-basis";
  const step = 3;
  const minDim = 1;
  const currentUnit = 1;
  const resizerBtm = {
    tl: 0,
    tc: 0,
    tr: 0,
    cl: 0,
    cr: 0,
    bl: 0,
    br: 0,
    minDim,
  };
  const resizerAll = {
    ...resizerBtm,
    cr: 1,
    cl: 1,
    bc: 1,
    keyWidth,
    currentUnit,
    minDim,
    step,
    onMove: (
      el: HTMLElement,
      pos: { left: number; right: number },
      { resizer }: { resizer: string }
    ) => {
      const row = el.parentElement;
      if (!row) return;

      const cells = Array.from(row.children) as HTMLElement[];
      const index = cells.indexOf(el);
      const isFirst = index === 0;
      const isLast = index === cells.length - 1;

      if (resizer === "cr" && !isLast) {
        // Resizing right
        const nextCell = cells[index + 1];
        const currentWidth = el.offsetWidth;
        const nextWidth = nextCell.offsetWidth;
        const deltaWidth = pos.right;

        el.style.width = `${currentWidth + deltaWidth}px`;
        nextCell.style.width = `${nextWidth - deltaWidth}px`;
      } else if (resizer === "cl" && !isFirst) {
        // Resizing left
        const prevCell = cells[index - 1];
        const currentWidth = el.offsetWidth;
        const prevWidth = prevCell.offsetWidth;
        const deltaWidth = pos.left;

        el.style.width = `${currentWidth - deltaWidth}px`;
        prevCell.style.width = `${prevWidth + deltaWidth}px`;
      }
    },
  };

  const rowAttr = {
    class: clsRow,
    "data-gjs-droppable": `.${clsCell}`,
    "data-gjs-resizable": resizerBtm,
    "data-gjs-custom-name": labelRow,
  };

  const colAttr = {
    class: clsCell,
    "data-gjs-draggable": `.${clsRow}`,
    "data-gjs-resizable": resizerAll,
    "data-gjs-custom-name": labelCell,
    "data-gjs-unstylable": ["width"],
    "data-gjs-stylable-require": ["flex-basis"],
  };

  const privateCls = [`.${clsRow}`, `.${clsCell}`];
  editor.on(
    "selector:add",
    (selector) =>
      privateCls.indexOf(selector.getFullName()) >= 0 &&
      selector.set("private", 1)
  );

  editor.on("block:drag:stop", (component) => {
    const parent = component?.parent();
    if (parent && parent.getClasses().includes(clsCell)) {
      component.setStyle({
        width: "100%",
        display: "block",
        padding: "0",
        "min-height": "55px",
        "max-height": "100%",
        "max-width": "100%",
      });
    }
  });

  const label = "Flexbox";
  const category = "Basic";
  const attrsRow = attrsToString(rowAttr);
  const attrsCell = attrsToString(colAttr);
  const styleRow = `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
      gap: 10px;
      min-height: 75px;
    }
    @media (max-width: 768px) {
      .${clsRow} {
        flex-direction: column;
      }
    }
    @media (max-width: 480px) {
      .${clsRow} {
        height: auto;
      }
    }
  `;
  const styleClm = `
    .${clsCell} {
      min-height: 55px;
      flex-grow: 1;
      flex-basis: 100%;
    }
  `;

  bm.add("flexbox", {
    label,
    category,
    media: `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 19.9V4.1C10.5 2.6 9.86 2 8.27 2H4.23C2.64 2 2 2.6 2 4.1V19.9C2 21.4 2.64 22 4.23 22H8.27C9.86 22 10.5 21.4 10.5 19.9Z" stroke="#ffffff" stroke-width="0.00024000000000000003" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 19.9V4.1C22 2.6 21.36 2 19.77 2H15.73C14.14 2 13.5 2.6 13.5 4.1V19.9C13.5 21.4 14.14 22 15.73 22H19.77C21.36 22 22 21.4 22 19.9Z" stroke="#ffffff" stroke-width="0.00024000000000000003" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    `,
    attributes: { class: "gjs-fonts gjs-f-b2" },
    content: `
      <div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      <style>
        ${styleRow}
        ${styleClm}
      </style>
    `,
    ...opt.flexboxBlock,
  });
};
