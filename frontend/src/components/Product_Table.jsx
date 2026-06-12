const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function Product_Table({
  products = [],
  onEdit,
  onDelete,
  showActions = false,
  actionDisabled = false,
  emptyMessage = "No products found.",
}) {
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return <div className="empty-inline">{emptyMessage}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {safeProducts.map((product) => {
            const productId = product.item_id ?? product.id;
            const productName = product.item_name ?? product.name;
            const category = product.item_category ?? "—";
            const quantity = product.item_stock_qty ?? product.qty ?? 0;
            const price = product.item_price ?? product.price ?? 0;

            return (
              <tr key={productId}>
                <td data-label="ID">{productId}</td>
                <td data-label="Product">{productName || "Unnamed product"}</td>
                <td data-label="Category">{category}</td>
                <td data-label="Quantity">{quantity}</td>
                <td data-label="Price">
                  {currencyFormatter.format(Number(price) || 0)}
                </td>

                {showActions && (
                  <td data-label="Actions">
                    <div className="row-actions">
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        disabled={actionDisabled}
                        onClick={() => onEdit(productId)}
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        className="button button--danger button--small"
                        disabled={actionDisabled}
                        onClick={() => onDelete(productId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Product_Table;
