import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get(
                "/inventory/show-all-products"
            );

            setProducts(response.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const searchProducts = async (name) => {
        try {
            const response = await api.get(
                "/inventory/search-products",
                {
                    params: {
                        ITEM_NAME: name
                    }
                }
            );

            setProducts(response.data);
        }
        catch (error) {
            if (error.response?.status === 404) {
                setProducts([]);
                return;
            }

            console.error(error);
        }
    };

    const deleteProduct = async (itemId) => {
        const sellerKey = prompt(
            "Enter Seller Key"
        );

        if (!sellerKey) {
            return;
        }

        try {
            await api.delete(
                "/inventory/delete-product",
                {
                    params: {
                        DEL_ID: itemId
                    },
                    headers: {
                        "SELLER-KEY": sellerKey
                    }
                }
            );

            alert(
                "Product Deleted Successfully"
            );

            loadProducts();
        }
        catch (error) {
            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed To Delete Product"
            );
        }
    };

    if (loading) {
        return <h2>Loading Products...</h2>;
    }

    return (
        <div>
            <h1>All Products</h1>

            <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={(e) => {
                    const value = e.target.value;

                    setSearch(value);

                    if (value.trim() === "") {
                        loadProducts();
                    }
                    else {
                        searchProducts(value);
                    }
                }}
                style={{
                    padding: "10px",
                    width: "300px",
                    marginBottom: "20px"
                }}
            />

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Available</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.item_id}>
                            <td>{product.item_id}</td>

                            <td>{product.item_name}</td>

                            <td>
                                {product.item_description}
                            </td>

                            <td>
                                {product.item_category}
                            </td>

                            <td>
                                ₹{product.item_price}
                            </td>

                            <td>
                                {product.item_stock_qty}
                            </td>

                            <td>
                                {product.in_stock
                                    ? "IN STOCK"
                                    : "OUT OF STOCK"}
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/update-product/${product.item_id}`
                                        )
                                    }
                                >
                                    Update
                                </button>
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        deleteProduct(
                                            product.item_id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;