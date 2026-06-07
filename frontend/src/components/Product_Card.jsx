import { memo } from "react";

function Product_Card({
    product,
    onDelete,
    onEdit
}) {
    console.log(
        "Rendering:",
        product.item_name
    );

    return (
        <tr>
            <td>{product.item_id}</td>
            <td>{product.item_name}</td>
            <td>{product.item_category}</td>
            <td>₹{product.item_price}</td>

            <td>
                <button
                    onClick={() =>
                        onEdit(product.item_id)
                    }
                >
                    Edit
                </button>
            </td>

            <td>
                <button
                    onClick={() =>
                        onDelete(product.item_id)
                    }
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default memo(Product_Card);