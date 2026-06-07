import { useState, useContext } from "react";
import api from "../services/api";
import { Seller_Context } from "../context/Seller_Context";


function Add_Product() {
    const [formData, setFormData] = useState({
        add_item_name: "",
        add_item_description: "",
        add_item_category: "",
        add_item_price: "",
        add_stock_qty: ""
    });

    const { sellerKey, setSellerKey } = useContext(Seller_Context);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/inventory/add-product",
                formData,
                {
                    headers: {
                        "SELLER-KEY": sellerKey
                    }
                }
            );

            console.log(response.data);

            alert("Product Added Successfully!");

            setFormData({
                add_item_name: "",
                add_item_description: "",
                add_item_category: "",
                add_item_price: "",
                add_stock_qty: ""
            });
        }
        catch (error) {
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);

            alert(
                JSON.stringify(error.response?.data)
            );
        }
    };

    return (
        <div>
            <h1>Add Product</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="add_item_name"
                    placeholder="Product Name"
                    value={formData.add_item_name}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="add_item_description"
                    placeholder="Description"
                    value={formData.add_item_description}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="add_item_category"
                    placeholder="Category"
                    value={formData.add_item_category}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="add_item_price"
                    placeholder="Price"
                    value={formData.add_item_price}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="add_stock_qty"
                    placeholder="Stock Quantity"
                    value={formData.add_stock_qty}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    placeholder="Seller Key"
                    value={sellerKey}
                    onChange={(e) =>
                        setSellerKey(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Add Product
                </button>

            </form>
        </div>
    );
}

export default Add_Product;