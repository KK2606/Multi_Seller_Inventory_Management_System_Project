function Product_Table({ seller }) {
    return (
        <div
            style={{
                marginTop: "20px",
                border: "1px solid gray",
                padding: "15px",
                borderRadius: "10px"
            }}
        >
            <h2>{seller.name}'s Products</h2>

            <p>
                Total Products: {seller.products.length}
            </p>

            <p>
                Total Quantity: {
                    seller.products.reduce(
                        (sum, product) => sum + product.qty,
                        0
                    )
                }
            </p>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px"
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                border: "1px solid gray",
                                padding: "10px"
                            }}
                        >
                            Product
                        </th>

                        <th
                            style={{
                                border: "1px solid gray",
                                padding: "10px"
                            }}
                        >
                            Quantity
                        </th>

                        <th
                            style={{
                                border: "1px solid gray",
                                padding: "10px"
                            }}
                        >
                            Price
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {seller.products.map((product) => (
                        <tr key={product.id}>
                            <td
                                style={{
                                    border: "1px solid gray",
                                    padding: "10px"
                                }}
                            >
                                {product.name}
                            </td>

                            <td
                                style={{
                                    border: "1px solid gray",
                                    padding: "10px"
                                }}
                            >
                                {product.qty}
                            </td>

                            <td
                                style={{
                                    border: "1px solid gray",
                                    padding: "10px"
                                }}
                            >
                                ₹{product.price}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Product_Table;