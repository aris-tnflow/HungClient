const openPage = (editor, path) => {
    editor.Panels.addButton('options', [
        {
            id: 'link-page',
            className: 'fa fa-link',
            attributes: { title: 'Link' },
            command: 'open-new-page',
            active: false,
            togglable: false,
        }
    ]);

    editor.Commands.add('open-new-page', {
        run(editor, sender) {
            if (path == "trang-chu") {
                window.open(`/`, '_blank');
            } else {
                window.open(`/${path}`, '_blank');
            }
        }
    });
}
const openCode = (editor) => {
    editor.Panels.addButton('views', [
        {
            id: 'open-code',
            attributes: { title: 'Open Code' },
            className: 'fa fa-file-code-o',
            command: 'open-code',
            togglable: false,
        }
    ]);
}

const openGoogleFont = (editor) => {
    editor.Panels.addButton('options', [
        {
            id: 'google-fonts',
            className: 'fa-solid fa-font-case',
            attributes: { title: 'Cài đặt kiểu chữ' },
            command: 'open-fonts',
            active: false,
        }
    ]);
}

export const Panels = {
    openPage,
    openCode,
    openGoogleFont
}

