import React from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa';
import { FaStarHalfStroke } from 'react-icons/fa6';

const Star = ({ star }) => {
    const stars = [];
    const fullStars = Math.floor(star);
    const halfStar = star % 1 >= 0.5 ? true : false;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} />);
    }
    if (halfStar) {
        stars.push(<FaStarHalfStroke key="half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return (
        <div className="evaluate flex gap-1" style={{ color: "#ffce3d", fontSize: 16 }}>
            {stars}
        </div>
    );
};

export default Star