import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutAdmin from '~/components/layout/Admin/Layout'
import GrapeJs from '~/components/grapeJs/GrapeJs'

import pluginWebpage from 'grapesjs-preset-webpage';
import blockBasic from 'grapesjs-blocks-basic';
import pluginEditImage from '~/components/grapeJs/Custom/ImageEdit';
import pluginStyleBg from 'grapesjs-style-bg';
import pluginTailwind from 'grapesjs-tailwind';
import pluginTemplates from 'grapesjs-templates';
import pluginFont from '@silexlabs/grapesjs-fonts';
import pluginCkeditor from 'grapesjs-plugin-ckeditor';
import pluginSwiper from '~/components/grapeJs/Custom/Block/Swiper';

import pluginFlexbox from '~/components/grapeJs/Custom/Block/FlexBox/';
import pluginFlexrow from '~/components/grapeJs/Custom/Block/FlexRow';
import BlockUser from '~/components/grapeJs/Custom/BlockUser';
import testBlock from '~/components/grapeJs/Plugins/src/index';

import { Block } from '~/components/grapeJs/Block';
import { Styles } from '~/components/grapeJs/Style';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '~/utils';
import { getPluginsApi } from '~/redux/slices/Data/pluginsSlice';
import { courseChildrenApi } from '~/apis/courseApi';
import { toastError, toastSuccess } from '~/components/toast';
import { Button } from 'antd';
import { TbArrowBack } from 'react-icons/tb';
import { getPluginsScriptApi } from '~/redux/slices/Data/pluginsScriptSlice';

const PageCourse = () => {
    const slug = useParams()
    const dispatch = useDispatch();
    const nameCourse = localStorage.getItem('name-course')
    const { pluginsScript, loading: loadingscript } = useSelector((state) => state.pluginsScript);
    const [data, setData] = useState()

    const handleGetPages = () => {
        courseChildrenApi
            .getChildrenPage(slug)
            .then((res) => {
                setData(res.data)
            })
            .catch(() => toastError('data', 'Lỗi lấy bài viết'))
    }

    const handlePutPages = (pageEdit, page) => {
        courseChildrenApi
            .putChildren({ id: slug?.id, childId: slug?.childId, edit: pageEdit, content: page })
            .then(() => toastSuccess('data', 'Đã lưu bài viết'))
            .catch(() => toastError('data', 'Lỗi lưu bài viết'))
    }

    const { plugins, loading: loadingPlugins } = useSelector((state) => state.plugins);
    const dataPlugins = useMemo(() =>
        plugins?.newData?.map((groupPage) => ({
            id: groupPage.id,
            src: `${baseURL}/uploads/${groupPage.src}`,
        })),
        [plugins]
    );

    const configGrapeJs = (editor) => {
        editor.Panels.addButton('options', [
            {
                id: 'google-fonts',
                className: 'fa fa-font',
                attributes: { title: 'Cài đặt kiểu chữ' },
                command: 'open-fonts',
                togglable: true,
                visible: true,
            }
        ]);

        const blocksToRemove = [
            // 'video',
            // 'map',
            // 'model-3D',
            'bootstrapIcon',
            'link',
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
            // 'gjs-open-import-webpage',
            'open-templates',
            'link-page',
            // 'export-template'
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
    }

    useEffect(() => {
        if (loadingPlugins === true) {
            dispatch(getPluginsApi());
        }
    }, []);

    useEffect(() => {
        if (loadingscript === true) {
            dispatch(getPluginsScriptApi());
        }
    }, []);

    useEffect(() => {
        handleGetPages()
    }, []);

    return (
        <LayoutAdmin margin={0}
            header={'Bài viết Bài Học'}
        >
            {data && (
                <GrapeJs
                    data={data?.edit || ''}
                    configGrapeJs={configGrapeJs}
                    height='calc(100vh - 56px)'
                    folder={nameCourse}
                    pluginss={dataPlugins}
                    canvas={pluginsScript[0]}
                    plugins={[
                        pluginWebpage,
                        blockBasic,
                        pluginEditImage,
                        pluginCkeditor,
                        pluginStyleBg,
                        pluginTailwind,
                        pluginTemplates,
                        pluginFont,
                        pluginFlexbox,
                        pluginFlexrow,
                        Block.model3d,
                        Block.imageLink,
                        Block.masonry,
                        BlockUser,
                        Styles.customType,
                        Styles.customTypeSelect,
                        pluginSwiper,
                        testBlock,
                    ]}
                    pluginsOpts={{
                        [pluginFont]: {
                            api_key: "AIzaSyAdJTYSLPlKz4w5Iqyy-JAF2o8uQKd1FKc"
                        },
                        [pluginCkeditor]: {
                            options: {
                                extraPlugins: 'dialogui,sharedspace,justify,colorbutton,panelbutton,font',
                                language: 'vi',
                                toolbarGroups: [
                                    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                                    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                                    { name: 'links', groups: ['links'] },
                                    { name: 'insert', groups: ['insert'] },
                                    '/',
                                    { name: 'styles', groups: ['styles'] },
                                    { name: 'colors', groups: ['colors'] },
                                    { name: 'tools', groups: ['tools'] },
                                    { name: 'others', groups: ['others'] },
                                ],
                            },
                            position: 'center',
                        }
                    }}
                    savePage={handlePutPages}
                />
            )}
        </LayoutAdmin>
    )
}

export default PageCourse