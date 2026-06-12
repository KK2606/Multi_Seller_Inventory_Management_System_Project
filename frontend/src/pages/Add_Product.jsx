import { useContext, useState } from "react";
import toast from "react-hot-toast";

import ProductForm from "../components/ProductForm";
import api, { getApiErrorMessage } from "../services/api";
import { Seller_Context } from "../context/sellerContext";

const initialFormData = {
  add_item_name: "",
  add_item_description: "",
  add_item_category: "",
  add_item_price: "",
  add_stock_qty: "",
};

const productFields = [
  {
    name: "add_item_name",
    label: "Product Name",
    placeholder: "Enter product name",
    required: true,
  },
  {
    name: "add_item_category",
    label: "Category",
    placeholder: "Enter category",
    required: true,
  },
  {
    name: "add_item_description",
    label: "Description",
    placeholder: "Describe this product",
    multiline: true,
  },
  {
    name: "add_item_price",
    label: "Price",
    placeholder: "Enter price",
    type: "number",
    min: "0",
    step: "0.01",
    required: true,
  },
  {
    name: "add_stock_qty",
    label: "Stock Quantity",
    placeholder: "Enter stock quantity",
    type: "number",
    min: "0",
    step: "1",
    required: true,
  },
];

function Add_Product() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const { sellerKey, setSellerKey } = useContext(Seller_Context);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const missingRequiredField = productFields.find(
      (field) => field.required && !String(formData[field.name]).trim()
    );

    if (missingRequiredField) {
      toast.error(`${missingRequiredField.label} is required`);
      return false;
    }

    if (!sellerKey.trim()) {
      toast.error("Seller key is required");
      return false;
    }

    const price = Number(formData.add_item_price);
    const stockQuantity = Number(formData.add_stock_qty);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Price must be a valid non-negative number");
      return false;
    }

    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      toast.error("Stock quantity must be a valid non-negative number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      add_item_name: formData.add_item_name.trim(),
      add_item_description: formData.add_item_description.trim(),
      add_item_category: formData.add_item_category.trim(),
      add_item_price: Number(formData.add_item_price),
      add_stock_qty: Number(formData.add_stock_qty),
    };

    try {
      setSubmitting(true);

      await api.post("/inventory/add-product", payload, {
        headers: {
          "SELLER-KEY": sellerKey.trim(),
        },
      });

      toast.success("Product added successfully");
      setFormData(initialFormData);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventory Management</p>
          <h1>Add Product</h1>
          <p>
            Create a new inventory item using the existing seller-key protected
            API flow.
          </p>
        </div>
      </header>

      <ProductForm
        fields={productFields}
        formData={formData}
        sellerKey={sellerKey}
        onFieldChange={handleChange}
        onSellerKeyChange={setSellerKey}
        onSubmit={handleSubmit}
        submitLabel="Add Product"
        submitting={submitting}
        helperText="Fields marked with * are required before the product can be submitted."
      />
    </section>
  );
}

export default Add_Product;
