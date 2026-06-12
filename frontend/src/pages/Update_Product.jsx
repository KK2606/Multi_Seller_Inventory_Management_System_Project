import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import api, { getApiErrorMessage } from "../services/api";

const initialFormData = {
  update_item_name: "",
  update_item_description: "",
  update_item_category: "",
  update_item_price: "",
  update_stock_qty: "",
};

const productFields = [
  {
    name: "update_item_name",
    label: "Product Name",
    placeholder: "Enter new product name",
  },
  {
    name: "update_item_category",
    label: "Category",
    placeholder: "Enter new category",
  },
  {
    name: "update_item_description",
    label: "Description",
    placeholder: "Enter new description",
    multiline: true,
  },
  {
    name: "update_item_price",
    label: "Price",
    placeholder: "Enter new price",
    type: "number",
    min: "0",
    step: "0.01",
  },
  {
    name: "update_stock_qty",
    label: "Stock Quantity",
    placeholder: "Enter new stock quantity",
    type: "number",
    min: "0",
    step: "1",
  },
];

function Update_Product() {
  const { id } = useParams();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/products";
  const [sellerKey, setSellerKey] = useState(location.state?.sellerKey || "");
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const hasUpdateValue = Object.values(formData).some((value) =>
      String(value).trim()
    );

    if (!sellerKey.trim()) {
      toast.error("Seller key is required");
      return false;
    }

    if (!hasUpdateValue) {
      toast.error("Enter at least one product field to update");
      return false;
    }

    const price = Number(formData.update_item_price);
    const stockQuantity = Number(formData.update_stock_qty);

    if (
      formData.update_item_price &&
      (!Number.isFinite(price) || price < 0)
    ) {
      toast.error("Price must be a valid non-negative number");
      return false;
    }

    if (
      formData.update_stock_qty &&
      (!Number.isFinite(stockQuantity) || stockQuantity < 0)
    ) {
      toast.error("Stock quantity must be a valid non-negative number");
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    update_item_name: formData.update_item_name.trim() || null,
    update_item_description: formData.update_item_description.trim() || null,
    update_item_category: formData.update_item_category.trim() || null,
    update_item_price: formData.update_item_price
      ? Number(formData.update_item_price)
      : null,
    update_stock_qty: formData.update_stock_qty
      ? Number(formData.update_stock_qty)
      : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      await api.put("/inventory/update-product", buildPayload(), {
        params: {
          ITEM_ID: id,
        },
        headers: {
          "SELLER-KEY": sellerKey.trim(),
        },
      });

      toast.success("Product updated successfully");
      setFormData(initialFormData);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Update failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventory Management</p>
          <h1>Update Product</h1>
          <p>Product ID: {id}</p>
        </div>

        <Link className="button button--ghost" to={returnTo}>
          Back
        </Link>
      </header>

      <ProductForm
        fields={productFields}
        formData={formData}
        sellerKey={sellerKey}
        onFieldChange={handleChange}
        onSellerKeyChange={setSellerKey}
        onSubmit={handleSubmit}
        submitLabel="Update Product"
        submitting={submitting}
        helperText="Only fill fields that should change. Blank fields are sent as unchanged values."
      />
    </section>
  );
}

export default Update_Product;
