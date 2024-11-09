import { Link } from 'react-router-dom';
import './PageError.css'
import LayoutPublic from '~/components/layout/Public/Layout';

const PageNotFound = () => {
    return (
        <LayoutPublic title="Không tìm thấy trang">
            <div className='page404'>
                <div className="wrapper">
                    <div className="container">
                        <div id="scene" className="scene" data-hover-only="false">
                            <div className="circle" data-depth="1.2" />
                            <div className="one" data-depth="0.9">
                                <div className="content">
                                    <span className="piece" />
                                    <span className="piece" />
                                    <span className="piece" />
                                </div>
                            </div>
                            <div className="two" data-depth="0.60">
                                <div className="content">
                                    <span className="piece" />
                                    <span className="piece" />
                                    <span className="piece" />
                                </div>
                            </div>
                            <div className="three" data-depth="0.40">
                                <div className="content">
                                    <span className="piece" />
                                    <span className="piece" />
                                    <span className="piece" />
                                </div>
                            </div>
                            <p className="p404" data-depth="0.50">404 </p>
                            <p className="p404" data-depth="0.10">404 </p>
                        </div>
                        <div className="text">
                            <article>
                                <p className='text-danger' style={{ fontSize: 30, marginBottom: 35 }}>Trang không tồn tại hoặc không tìm thấy !</p>
                                <Link to='/'>
                                    <button>Vui lòng trở về trang chủ</button>
                                </Link>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutPublic>
    );
};

export default PageNotFound;
