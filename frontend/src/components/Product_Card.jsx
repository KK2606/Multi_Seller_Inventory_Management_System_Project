import { memo } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function Product_Card({
  product,
  onDelete,
  onEdit,
  actionDisabled = false,
}) {
  const productId = product.item_id;
  const isInStock = product.in_stock ?? Number(product.item_stock_qty) > 0;

  return (
    <tr>
      <td data-label="ID">{productId}</td>
      <td data-label="Name">{product.item_name || "Unnamed product"}</td>
      <td data-label="Description">{product.item_description || "—"}</td>
      <td data-label="Category">{product.item_category || "—"}</td>
      <td data-label="Price">
        {currencyFormatter.format(Number(product.item_price) || 0)}
      </td>
      <td data-label="Stock">{product.item_stock_qty ?? 0}</td>
      <td data-label="Status">
        <span className={`status-pill ${isInStock ? "is-success" : "is-muted"}`}>
          {isInStock ? "In stock" : "Out of stock"}
        </span>
      </td>

      <td data-label="Update">
        <button
          type="button"
          className="button button--ghost button--small"
          disabled={actionDisabled}
          onClick={() => onEdit(productId)}
        >
          Update
        </button>
      </td>

      <td data-label="Delete">
        <button
          type="button"
          className="button button--danger button--small"
          disabled={actionDisabled}
          onClick={() => onDelete(productId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default memo(Product_Card);
