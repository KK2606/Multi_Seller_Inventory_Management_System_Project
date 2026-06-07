function Seller_Card({ seller, onViewProducts }) {
    return (
        <div
            style={{
                border: "1px solid gray",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "10px"
            }}
        >
            <h3>{seller.name}</h3>

            <p>
                Seller Key: {seller.seller_key}
            </p>

            <p>
                Products: {seller.products.length}
            </p>

            <button
                onClick={() => onViewProducts(seller)}
            >
                View Products
            </button>
        </div>
    );
}

export default Seller_Card;