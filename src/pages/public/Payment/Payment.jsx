import { Collapse, Tabs } from 'antd';
import React from 'react'

const Payment = () => {
    return (
        <section>
            <Tabs
                defaultActiveKey="1"
                centered
                type="card"
                items={
                    [
                        {
                            key: 'ElectronicWallet',
                            label: 'Ví điện tử',
                            children:
                                <>
                                    <Collapse
                                        items={[
                                            {
                                                key: 'momo',
                                                label: 'Ví điện tử MoMo',
                                                children:
                                                    <>
                                                        123
                                                    </>
                                                ,
                                            },
                                            {
                                                key: 'zalopay',
                                                label: 'Ví điện tử ZaloPay',
                                                children:
                                                    <>
                                                        123
                                                    </>
                                                ,
                                            },
                                        ]}
                                        bordered={false}
                                        defaultActiveKey={['momo']}

                                    />
                                </>
                            ,
                        },
                        {
                            key: 'BankAccount',
                            label: 'Tài khoản ngân hàng',
                            children:
                                <>

                                </>
                            ,
                        },
                        {
                            key: '3',
                            label: 'Thẻ Visa/MasterCard',
                            children:
                                <>

                                </>
                            ,
                        },
                    ]
                }
            />
        </section>
    )
}

export default Payment