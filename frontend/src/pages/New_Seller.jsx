import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import PageState from "../components/PageState";
import SellerForm from "../components/SellerForm";
import SearchInput from "../components/SearchInput";
import api, { asArray, getApiErrorMessage } from "../services/api";

const initialFormData = {
  add_seller_name: "",
  add_seller_email: "",
  add_seller_key: "",
};

const sellerFields = [
  {
    name: "add_seller_name",
    label: "Seller Name",
    placeholder: "Enter the seller's name",
    required: true,
  },
  {
    name: "add_seller_email",
    label: "Seller Email",
    placeholder: "Enter the seller's email",
    type: "email",
    required: true,
  },
  {
    name: "add_seller_key",
    label: "Seller Key",
    placeholder: "Enter the seller's key",
    type: "password",
    required: true,
  },
];

function New_Seller() {
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
    const missingRequiredField = sellerFields.find(
      (field) => field.required && !String(formData[field.name]).trim()
    );

    if (missingRequiredField) {
      toast.error(`${missingRequiredField.label} is required`);
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
      add_seller_name: formData.add_seller_name.trim(),
      add_seller_email: formData.add_seller_email.trim(),
      add_seller_key: formData.add_seller_key.trim(),
    };

    try {
      setSubmitting(true);

      await api.post("/seller/new-seller-signup", payload);

      toast.success("New seller added successfully");
      setFormData(initialFormData);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add new seller"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Seller Management</p>
          <h1>Add New Seller</h1>
          <p>
            Create a new seller account by providing a name, email, and unique
            seller key.
          </p>
        </div>
      </header>

      <SellerForm
        fields={sellerFields}
        formData={formData}
        onFieldChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Add Seller"
        submitting={submitting}
        helperText="Fields marked with * are required before the seller can be created."
      />
    </section>
  );
}

export default New_Seller;