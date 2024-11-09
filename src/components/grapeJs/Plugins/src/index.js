import loadComponents from './components'
import loadBlocks from './blocks'
import en from './locale/en'

export default (editor, opts = {}) => {
  const options = {
    label: 'Margin Menu',
    name: 'Margin Menu',
    category: "Basic",
    media: `
    <svg fill="#ffffff" viewBox="0 0 100 100" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M31,34H69a1,1,0,0,0,1-1V29a1,1,0,0,0-1-1H31a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1m41,6H28a4,4,0,0,1-4-4V26a4,4,0,0,1,4-4H72a4,4,0,0,1,4,4V36a4,4,0,0,1-4,4" fill-rule="evenodd"></path><path d="M31,72H69a1,1,0,0,0,1-1V67a1,1,0,0,0-1-1H31a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1m41,6H28a4,4,0,0,1-4-4V64a4,4,0,0,1,4-4H72a4,4,0,0,1,4,4V74a4,4,0,0,1-4,4" fill-rule="evenodd"></path><path d="M77,54H67a3,3,0,0,1-3-3V49a3,3,0,0,1,3-3H77a3,3,0,0,1,3,3v2a3,3,0,0,1-3,3" fill-rule="evenodd"></path><path d="M55,54H45a3,3,0,0,1-3-3V49a3,3,0,0,1,3-3H55a3,3,0,0,1,3,3v2a3,3,0,0,1-3,3" fill-rule="evenodd"></path><path d="M33,54H23a3,3,0,0,1-3-3V49a3,3,0,0,1,3-3H33a3,3,0,0,1,3,3v2a3,3,0,0,1-3,3" fill-rule="evenodd"></path></g></svg>
    `,
  };

  for (let name in options) {
    if (!(name in opts)) opts[name] = options[name]
  }

  loadBlocks(editor, options)
  loadComponents(editor, options)

  editor.I18n && editor.I18n.addMessages({
    en,
    ...options.i18n,
  });
}
