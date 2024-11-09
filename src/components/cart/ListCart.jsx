import { Typography } from "antd";
import { FormatPrice, FormatPriceSale } from "../table/Format";
import { removeFromCart } from "~/redux/slices/cartSlice";
import { toastSuccess } from "../toast";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { baseURL } from "~/utils";
import { removeFromCartDetail } from "~/redux/slices/cartDetailSlice";

const ListCart = ({ carts }) => {
  const dispatch = useDispatch();
  return (
    <>
      {carts?.map((item, index) => (
        <li key={index} className="product-list-item fadeIn">
          <div className="product-img-wrapper">
            <NavLink to={`/course/${item.slug}`}>
              <img
                className="!w-30 !h-24 product-image"
                src={item.img ? `${baseURL}/uploads/${item.img}` : `/empty.png`}
              />
            </NavLink>
          </div>

          <div className="product-list-itemContent">
            <div className="product-info">
              <Typography.Paragraph
                className="!mb-2 name-price"
                suffix="..."
                ellipsis={{ rows: 1 }}
                strong
              >
                {item.name}
              </Typography.Paragraph>
              <div className="flex  items-center gap-2">
                {item.sale > 0 && (
                  <Typography.Text
                    delete
                    className="!mb-0 text-xs items-sale-pro"
                  >
                    {FormatPrice(item.price)}
                  </Typography.Text>
                )}
                <Typography.Text className="!mb-0" type="danger" strong>
                  {FormatPrice(FormatPriceSale(item.price, item.sale))}
                </Typography.Text>
              </div>
            </div>
          </div>

          <button
            className="delete-button"
            onClick={() => {
              dispatch(removeFromCart(item._id));
              setTimeout(() => {
                dispatch(removeFromCartDetail(item._id));
              }, 0);
              toastSuccess(
                item.name,
                "Xóa khỏi giỏ hàng thành công",
                `${item.name} đã được xóa khỏi giỏ hàng`
              );
            }}
          >
            <svg className="delete-svgIcon" viewBox="0 0 448 512">
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </button>
        </li>
      ))}
    </>
  );
};

export default ListCart;
