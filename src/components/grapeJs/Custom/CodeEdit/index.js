import commands from './commands';

export default (editor, opts = {}) => {
    const options = {
        ...{
            panelId: 'views-container',
            appendTo: '',
            openState: {
                cv: '65%',
                pn: '35%'
            },
            closedState: {
                cv: '85%',
                pn: '15%'
            },
            codeViewOptions: {},
            preserveWidth: false,
            editJs: false,
            clearData: false,
            cleanCssBtn: true,
            htmlBtnText: 'Cập nhập',
            cssBtnText: 'Cập nhập',
            cleanCssBtnText: 'Xóa'
        },
        ...opts
    };
    commands(editor, options);
};