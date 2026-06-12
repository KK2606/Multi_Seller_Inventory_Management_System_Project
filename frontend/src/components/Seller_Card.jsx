function Seller_Card({
  seller,
  selected = false,
  onViewProducts,
  onEdit,
  onDelete,
  actionDisabled = false,
}) {
  const products = Array.isArray(seller.products) ? seller.products : [];
  const sellerId = seller.seller_id ?? seller.id;
  const sellerName = seller.seller_name ?? seller.name ?? "Unnamed seller";
  const sellerEmail = seller.seller_email ?? seller.email ?? "No email";

  return (
    <div className={`seller-card ${selected ? "seller-card--selected" : ""}`}>
      <div>
        <p className="eyebrow">Seller #{sellerId}</p>
        <h3>{sellerName}</h3>
        <p>{sellerEmail}</p>
      </div>

      <div className="seller-card__meta">
        <span>{products.length} products</span>
        <span>Key: {seller.seller_key || "—"}</span>
      </div>

      <div className="row-actions">
        {onViewProducts && (
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={() => onViewProducts(seller)}
          >
            View Products
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            className="button button--ghost button--small"
            disabled={actionDisabled}
            onClick={() => onEdit(seller)}
          >
            Update
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="button button--danger button--small"
            disabled={actionDisabled}
            onClick={() => onDelete(seller)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Seller_Card;
