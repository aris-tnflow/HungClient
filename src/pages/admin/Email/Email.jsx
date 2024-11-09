import { useEffect, useRef, useState } from 'react'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import GrapeJs from '~/components/grapeJs/GrapeJs'
import pluginWebpage from 'grapesjs-preset-webpage';
import blockBasic from 'grapesjs-blocks-basic';
import pluginStyleBg from 'grapesjs-style-bg';

import pluginFlexbox from '~/components/grapeJs/Custom/Block/FlexBox/';
import pluginFlexrow from '~/components/grapeJs/Custom/Block/FlexRow';

import pluginCkeditor from 'grapesjs-plugin-ckeditor';

import { Block } from '~/components/grapeJs/Block/index';
import { Button, Modal } from 'antd';
import { toastError, toastLoading, toastSuccess } from '~/components/toast';

import grapesJSMJML from 'grapesjs-mjml'
import pluginsCustomCode from 'grapesjs-custom-code';

import tour2 from '~/assets/tours/email/2.png';
import { useParams } from 'react-router-dom';
import { emailApi } from '~/apis/emailAPi';

const EmailPage = () => {
    const params = useParams();

    const [email, setEmail] = useState();
    const [openSendEmail, setOpenSendEmail] = useState(false);
    const refs = [useRef(null), useRef(null)];

    const steps = [
        {
            title: 'Thiết kế Email!',
            description: 'Thiết kế email của bạn thông qua WebBuilder-Aris',
            target: () => refs[0].current,
        },
        {
            title: 'Ấn nút lưu!',
            description: 'Ấn nút lưu để lưu lại nội dung email của bạn.',
            cover: <img alt="tour.png" src={tour2} />,
        },
        {
            title: 'Gửi Email!',
            description: 'Ấn và chọn người nhận để gửi email!',
            target: () => refs[1].current,
        },
    ];

    const configGrapeJs = (editor) => {
        const blocksToRemove = [
            'video',
            'map',
            'video',
            'bootstrapIcon',
            'map',
            'model-3D',
            'Masonry',
            'quote',
            "link-block",
            'text-basic',
            'text-section',
            'column1',
            'column2',
            'column3',
            'column3-7',
        ];

        const buttonsToRemove = [
            'open-templates',
            'link-page',
            'export-template'
        ];

        const categoriesToClose = [
            "Extra",
            "Blog",
            "Layout",
            "Short Codes"
        ];

        const { models: categories } = editor.BlockManager.getCategories();

        blocksToRemove.forEach(block => editor.BlockManager.remove(block));
        buttonsToRemove.forEach(buttonId => { editor.Panels.removeButton('options', buttonId) });
        categories.forEach(category => categoriesToClose.includes(category.get?.('id')) && category.set('open', false));

        // const defaultContent = `
        // <mjml>
        //   <mj-body>
        //   </mj-body>
        // </mjml>`;
        // editor.setComponents(defaultContent)
    }

    const putPages = (pageEdit, page) => {
        toastLoading('email', 'Đang lưu nội dung Email!');
        emailApi
            .put({ id: params.id, edit: pageEdit, content: page })
            .then(() => {
                toastSuccess('email', 'Đã lưu nội dung Email!', 'Hãy chọn người nhận và gửi email!');
            })
            .catch(() => {
                toastError('email', 'Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
            });
    }

    const handleSendEmail = () => {
        if (email) {
            toastSuccess('', 'Gửi email thành công');
        } else {
            toastError('', 'Vui lòng nhập email', 'Chưa có nội dung email!');
        }
    }

    useEffect(() => {
        emailApi.sig({ id: params.id }).then(res => {
            setEmail(res);
        })
    }, [])

    return (
        <LayoutAdmin
            margin={0}
            header={'Email'}
            tours={steps}
            button={<Button ref={refs[1]} onClick={() => setOpenSendEmail(true)} type='primary'>Gửi email</Button>}
        >
            <div ref={refs[0]}>
                {email && (
                    <GrapeJs
                        data={email?.edit}
                        folder={`Email`}
                        configGrapeJs={configGrapeJs}
                        height='calc(100vh - 56px)'
                        plugins={[
                            blockBasic,
                            pluginsCustomCode,
                            Block.imageLink,
                            pluginWebpage,
                        ]}
                        savePage={putPages}
                    />
                )}
            </div>

            <Modal
                title="Chọn người nhận"
                centered
                open={openSendEmail}
                onOk={() => {
                    handleSendEmail();
                }}
                onCancel={() => setOpenSendEmail(false)}
            >
            </Modal>
        </LayoutAdmin>
    )
}

export default EmailPage