import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Admin_Portal() {

    const navigate =
        useNavigate();

    const [adminKey, setAdminKey] =
        useState("");

    const [sellers, setSellers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const loadDashboard = async () => {

        if (!adminKey.trim()) {
            alert(
                "Please Enter Admin Key"
            );
            return;
        }

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/admin/all-sellers-with-products",
                    {
                        headers: {
                            "Admin-Key": adminKey
                        }
                    }
                );

            setSellers(response.data);

        }
        catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed To Load Dashboard"
            );
        }
        finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (
        productId,
        sellerKey
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                "/inventory/delete-product",
                {
                    params: {
                        DEL_ID: productId
                    },
                    headers: {
                        "SELLER-KEY": sellerKey
                    }
                }
            );

            alert(
                "Product Deleted Successfully"
            );

            loadDashboard();

        }
        catch (error) {

            console.error(error);

            console.log(
                error.response
            );

            console.log(
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Delete Failed"
            );
        }
    };

    const deleteSeller = async (
        sellerId,
        sellerKey
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this seller?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                "/seller/delete-seller",
                {
                    params: {
                        DEL_ID: sellerId
                    },
                    headers: {
                        "SELLER-KEY": sellerKey
                    }
                }
            );

            alert(
                "Seller Deleted Successfully"
            );

            loadDashboard();

        }
        catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Delete Failed"
            );
        }
    };

    const totalProducts =
        sellers.reduce(
            (total, seller) =>
                total + seller.products.length,
            0
        );

    return (
        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Admin Portal
            </h1>

            <div
                style={{
                    marginBottom: "20px"
                }}
            >

                <input
                    type="text"
                    placeholder="Enter Admin Key"
                    value={adminKey}
                    onChange={(e) =>
                        setAdminKey(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                        width: "250px"
                    }}
                />

                <button
                    onClick={loadDashboard}
                    style={{
                        marginLeft: "10px",
                        padding: "10px"
                    }}
                >
                    Load Dashboard
                </button>

            </div>

            {
                loading &&
                <h2>
                    Loading...
                </h2>
            }

            {
                sellers.length > 0 && (
                    <div>

                        <h2>
                            Total Sellers:
                            {" "}
                            {sellers.length}
                        </h2>

                        <h2>
                            Total Products:
                            {" "}
                            {totalProducts}
                        </h2>

                    </div>
                )
            }

            {
                sellers.map((seller) => (

                    <div
                        key={seller.seller_id}
                        style={{
                            border: "1px solid gray",
                            borderRadius: "10px",
                            padding: "15px",
                            marginBottom: "20px"
                        }}
                    >

                        <h2>
                            {seller.seller_name}
                        </h2>

                        <p>
                            <strong>
                                Seller ID:
                            </strong>
                            {" "}
                            {seller.seller_id}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>
                            {" "}
                            {seller.seller_email}
                        </p>
                        <p>
                            <strong>
                                Seller Key:
                            </strong>
                            {" "}
                            {seller.seller_key}
                        </p>
                        <div
                            style={{
                                marginBottom: "15px"
                            }}
                        >
                            <button
                                onClick={() =>
                                    navigate(
                                        `/update-seller/${seller.seller_id}`,
                                        {
                                            state: {
                                                sellerKey:
                                                    seller.seller_key
                                            }
                                        }
                                    )
                                }
                            >
                                Update Seller
                            </button>
                            <button
                                style={{
                                    marginLeft: "10px"
                                }}
                                onClick={() =>
                                    deleteSeller(
                                        seller.seller_id,
                                        seller.seller_key
                                    )
                                }
                            >
                                Delete Seller
                            </button>

                        </div>
                        <h3>
                            Products
                        </h3>

                        {
                            seller.products.length === 0
                                ? (
                                    <p>
                                        No Products Found
                                    </p>
                                )
                                : (
                                    seller.products.map(
                                        (product) => (

                                            <div
                                                key={
                                                    product.item_id
                                                }
                                                style={{
                                                    marginLeft: "20px",
                                                    borderBottom:
                                                        "1px solid lightgray",
                                                    marginBottom: "10px",
                                                    paddingBottom: "10px"
                                                }}
                                            >

                                                <p>
                                                    <strong>
                                                        Product ID:
                                                    </strong>
                                                    {" "}
                                                    {product.item_id}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Name:
                                                    </strong>
                                                    {" "}
                                                    {product.item_name}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Stock:
                                                    </strong>
                                                    {" "}
                                                    {product.item_stock_qty}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Price:
                                                    </strong>
                                                    {" "}
                                                    ₹
                                                    {product.item_price}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/update-product/${product.item_id}`,
                                                            {
                                                                state: {
                                                                    sellerKey:
                                                                        seller.seller_key
                                                                }
                                                            }
                                                        )
                                                    }
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    style={{
                                                        marginLeft:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product.item_id,
                                                            seller.seller_key
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        )
                                    )
                                )
                        }

                    </div>

                ))
            }

        </div>
    );
}


export default Admin_Portal;