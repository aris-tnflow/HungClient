import { Col, Row } from "antd";
import React, { lazy, Suspense } from 'react';
const CardCourse = lazy(() => import('~/components/course/CardCourse'));
const SkeletonCourse = ({ loading, quantity }) => {
  return (
    <Row gutter={[18, 18]}>
      {[...Array(quantity)].map((_, index) => (
        <Col
          key={index}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
          xl={{ span: 6 }}
          span={24}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <CardCourse loading={loading} />
          </Suspense>
        </Col>
      ))}
    </Row>
  );
};

export default SkeletonCourse;
