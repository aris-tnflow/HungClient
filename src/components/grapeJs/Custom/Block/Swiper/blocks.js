export default (editor, opts = {}) => {
  const bm = editor.Blocks;
  bm.add(opts.name, {
    ...opts,
    content: {
      type: opts.name,
    },
  });
}
