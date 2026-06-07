import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Update_Product() {
    const { id } = useParams();

    const [sellerKey, setSellerKey] = useState("");

    const [formData, setFormData] = useState({
        update_item_name: "",
        update_item_description: "",
        update_item_category: "",
        update_item_price: "",
        update_stock_qty: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                "/inventory/update-product",
                formData,
                {
                    params: {
                        ITEM_ID: id
                    },
                    headers: {
                        "SELLER-KEY": sellerKey
                    }
                }
            );

            console.log(response.data);

            alert(
                "Product Updated Successfully!"
            );
        }
        catch (error) {
            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Update Failed"
            );
        }
    };

    return (
        <div>
            <h1>Update Product</h1>

            <p>
                Product ID: {id}
            </p>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="update_item_name"
                    placeholder="New Product Name"
                    value={formData.update_item_name}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="update_item_description"
                    placeholder="New Description"
                    value={formData.update_item_description}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="update_item_category"
                    placeholder="New Category"
                    value={formData.update_item_category}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="update_item_price"
                    placeholder="New Price"
                    value={formData.update_item_price}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="update_stock_qty"
                    placeholder="New Stock Quantity"
                    value={formData.update_stock_qty}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Seller Key"
                    value={sellerKey}
                    onChange={(e) =>
                        setSellerKey(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Update Product
                </button>

            </form>
        </div>
    );
}

export default Update_Product;