import { Tag } from "antd";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const FormatPrice = (data) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(data);
};

export const FormatPerCennt = (data) => {
  return `${data}%`;
};

export const FormatDay = (data) => {
  const formattedDate = format(new Date(data), "dd-MM-yyyy", { locale: vi });
  return formattedDate;
};

export const FormatDayTimeWithHour = (data) => {
  const formattedDateTime = format(new Date(data), "dd-MM-yyyy / HH:mm:ss", {
    locale: vi,
  });
  return formattedDateTime;
};

export const FormatDayTime = (data) => {
  let timeAgo = formatDistanceToNow(new Date(data), {
    locale: vi,
    addSuffix: true,
  });
  timeAgo = timeAgo.replace("khoảng ", "").replace("dưới", "");
  return timeAgo;
};

export const FormatPriceSale = (price, sale) => {
  return (price - (price * sale) / 100).toFixed(0);
};

export const FormatPriceSaleCart = (carts) => {
  const total = carts.reduce(
    (total, item) => total + item.price * (1 - item.sale / 100),
    0
  );
  return total;
};

export const FormatPriceDiscount = (carts) => {
  const total = carts.reduce(
    (total, item) => total + (item.price * item.sale) / 100,
    0
  );
  return total;
};

export const FormatPriceTotalCart = (carts) => {
  const total = carts.reduce((total, item) => total + item.price, 0);
  return total;
};

export const FormatTag = ({ keywords }) => {
  const TagColors = [
    "geekblue",
    "blue",
    "cyan",
    "green",
    "lime",
    "purple",
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
  ];
  return (
    <>
      {keywords?.map((item, index) => (
        <Tag
          className="my-1"
          color={TagColors[index % TagColors.length]}
          key={index}
        >
          {item}
        </Tag>
      ))}
    </>
  );
};

export const FindNameById = (id, data, type) => {
  const item = data.find((item) => item._id === id);
  return item ? item[type] : null;
};
