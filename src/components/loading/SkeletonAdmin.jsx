import { Layout, Skeleton, theme } from 'antd'
import React from 'react'
import { useMediaQuery } from 'react-responsive';

const SkeletonSuspense = () => {
    const { Header, Sider, Content } = Layout;
    const { token: { colorBgContainer } } = theme.useToken();
    const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

    return (
        <Layout className='overflow-hidden'>
            {!isMobile &&
                <>
                    <Sider
                        style={{ backgroundColor: colorBgContainer }}
                        className='sider-bar-admin overflow-hidden vh-full p-2'
                        trigger={null}
                        collapsible
                        collapsed={true}
                    >
                        <Skeleton
                            title={false}
                            paragraph={{ rows: 30, width: '100%' }}
                            active />
                    </Sider>
                </>
            }

            <Layout className='overflow-hidden'>
                <Header className={`flex justify-between px-6`} style={{ height: '56px', background: colorBgContainer, }}>
                    {isMobile && <Skeleton.Button style={{ marginTop: 10 }} active />}
                    <Skeleton.Input style={{ marginTop: 10 }} active />
                    <Skeleton.Input className='float-end' style={{ marginTop: 10 }} active />
                </Header>

                <Content
                    style={{
                        margin: '24px',
                    }}
                >
                    <Skeleton
                        title={false}
                        paragraph={{ rows: 30, width: '100%' }}
                        active
                    />
                </Content>
            </Layout>
        </Layout>
    )
}

export default SkeletonSuspense