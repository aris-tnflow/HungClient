import { Col, Row, Skeleton, Typography } from 'antd'
import React from 'react'
import './GrapeJs.css'
const SkeletonGrapeJs = () => {
    return (
        <>
            <div className="gjs-one-bg" style={{ height: 40 }}>
                <Row>
                    <Col className='overflow-hidden' span={20}>
                        <div className='flex justify-between items-center p-2 border' style={{ height: 40 }}>
                            <Skeleton.Input active={true} size={'default'} style={{ height: 25 }} />
                            <Skeleton.Input className='float-right' active={true} size={'default'} style={{ height: 25 }} />
                        </div>
                        <div className="bg-white flex justify-center items-center" style={{ height: 'calc(100vh - 100px)' }}>
                            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                                <div className="wheel" />
                                <div className="hamster">
                                    <div className="hamster__body">
                                        <div className="hamster__head">
                                            <div className="hamster__ear" />
                                            <div className="hamster__eye" />
                                            <div className="hamster__nose" />
                                        </div>
                                        <div className="hamster__limb hamster__limb--fr" />
                                        <div className="hamster__limb hamster__limb--fl" />
                                        <div className="hamster__limb hamster__limb--br" />
                                        <div className="hamster__limb hamster__limb--bl" />
                                        <div className="hamster__tail" />
                                    </div>
                                </div>
                                <div className="spoke" />
                            </div>
                        </div>
                    </Col>
                    <Col className='border gjs-one-bg overflow-hidden' span={4} style={{ height: 'calc(100vh - 56px)' }}>
                        <div className='flex justify-center items-center p-2 border-b' style={{ height: 38 }}>
                            <Skeleton.Button active={true} block={true} style={{ height: 25 }} />
                        </div>
                        <div className='flex justify-center items-center p-2 border-b' style={{ height: 38 }}>
                            <Skeleton.Button active={true} block={true} style={{ height: 25 }} />
                        </div>
                        <Row className='p-2' gutter={[12, 12]}>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                            <Col span={12}>
                                <Skeleton.Image active={true} style={{ width: '100%' }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default SkeletonGrapeJs