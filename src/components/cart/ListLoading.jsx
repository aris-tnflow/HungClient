import { Card, Col, Row, Skeleton } from 'antd'
import React from 'react'

const ListLoading = ({ active, quantity = 1 }) => {
    return (
        <>
            <Row gutter={[18, 18]}>
                {[...Array(quantity)].map((_, index) => (
                    <Col key={index} span={24}>
                        <Card>
                            <div className="flex gap-2 justify-between items-center">
                                <Skeleton.Image className='!size-20' active={active} />
                                <div className="flex flex-1 flex-col gap-2">
                                    <Skeleton.Input className="!w-full" active={active} />
                                    <Skeleton.Input className="!w-full" active={active} />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default ListLoading