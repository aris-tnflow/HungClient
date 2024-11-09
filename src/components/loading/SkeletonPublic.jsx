import { Spin } from 'antd'
const SkeletonSuspense = () => {
    return (
        <>
            <Spin spinning={true} fullscreen />
        </>
    )
}

export default SkeletonSuspense