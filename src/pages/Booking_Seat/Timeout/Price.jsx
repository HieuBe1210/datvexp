function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const Price = ({ price }) => {
  const formattedPrice = formatNumber(price) + " VNĐ";
  return (
    <>
      <h2>{formattedPrice}</h2>
    </>
  );
};
