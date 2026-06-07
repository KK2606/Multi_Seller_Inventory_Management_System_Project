import { useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

function Update_Seller() {

    const { sellerId } =
        useParams();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const sellerKey =
        location.state?.sellerKey;

    const [sellerName,
        setSellerName] =
        useState("");

    const [sellerEmail,
        setSellerEmail] =
        useState("");

    const [newSellerKey,
        setNewSellerKey] =
        useState("");

    const handleUpdate =
        async (e) => {

            e.preventDefault();

            try {

                await api.put(
                    "/seller/update-seller",
                    {
                        update_seller_name:
                            sellerName || null,

                        update_seller_email:
                            sellerEmail || null,

                        update_seller_key:
                            newSellerKey || null
                    },
                    {
                        params: {
                            SELLER_ID:
                                sellerId
                        },

                        headers: {
                            "SELLER-KEY":
                                sellerKey
                        }
                    }
                );

                alert(
                    "Seller Updated Successfully"
                );

                navigate(
                    "/admin"
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

            <h1>
                Update Seller
            </h1>

            <form
                onSubmit={
                    handleUpdate
                }
            >

                <input
                    type="text"
                    placeholder="Seller Name"
                    value={sellerName}
                    onChange={(e) =>
                        setSellerName(
                            e.target.value
                        )
                    }
                />

                <br />
                <br />

                <input
                    type="email"
                    placeholder="Seller Email"
                    value={sellerEmail}
                    onChange={(e) =>
                        setSellerEmail(
                            e.target.value
                        )
                    }
                />

                <br />
                <br />

                <input
                    type="text"
                    placeholder="New Seller Key"
                    value={newSellerKey}
                    onChange={(e) =>
                        setNewSellerKey(
                            e.target.value
                        )
                    }
                />

                <br />
                <br />

                <button
                    type="submit"
                >
                    Update Seller
                </button>

            </form>

        </div>
    );
}

export default Update_Seller;