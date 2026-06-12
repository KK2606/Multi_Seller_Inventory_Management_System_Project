import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import api, { getApiErrorMessage } from "../services/api";
import { Seller_Context } from "../context/sellerContext";

function Update_Seller() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/seller-portal";
  const { setSellerKey: setContextSellerKey } = useContext(Seller_Context);
  const [sellerKey, setSellerKey] = useState(location.state?.sellerKey || "");
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [newSellerKey, setNewSellerKey] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const hasUpdateValue =
      sellerName.trim() || sellerEmail.trim() || newSellerKey.trim();

    if (!sellerKey.trim()) {
      toast.error("Current seller key is required");
      return false;
    }

    if (!hasUpdateValue) {
      toast.error("Enter at least one seller field to update");
      return false;
    }

    if (sellerEmail.trim() && !sellerEmail.includes("@")) {
      toast.error("Enter a valid seller email");
      return false;
    }

    return true;
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      await api.put(
        "/seller/update-seller",
        {
          update_seller_name: sellerName.trim() || null,
          update_seller_email: sellerEmail.trim() || null,
          update_seller_key: newSellerKey.trim() || null,
        },
        {
          params: {
            SELLER_ID: sellerId,
          },
          headers: {
            "SELLER-KEY": sellerKey.trim(),
          },
        }
      );

      toast.success("Seller updated successfully");
      setContextSellerKey(newSellerKey.trim() || sellerKey.trim());
      navigate(returnTo);
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Update failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Seller Management</p>
          <h1>Update Seller</h1>
          <p>Seller ID: {sellerId}</p>
        </div>

        <Link className="button button--ghost" to={returnTo}>
          Back
        </Link>
      </header>

      <form className="form-card" onSubmit={handleUpdate} noValidate>
        <p className="form-card__hint">
          Fill only the seller fields that should change. The current seller key
          is required for authorization.
        </p>

        <div className="form-grid">
          <label className="field">
            <span>
              Current Seller Key<em aria-hidden="true"> *</em>
            </span>
            <input
              type="password"
              value={sellerKey}
              placeholder="Enter current seller key"
              autoComplete="off"
              onChange={(event) => setSellerKey(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Seller Name</span>
            <input
              type="text"
              value={sellerName}
              placeholder="Enter new seller name"
              onChange={(event) => setSellerName(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Seller Email</span>
            <input
              type="email"
              value={sellerEmail}
              placeholder="Enter new seller email"
              onChange={(event) => setSellerEmail(event.target.value)}
            />
          </label>

          <label className="field">
            <span>New Seller Key</span>
            <input
              type="password"
              value={newSellerKey}
              placeholder="Enter new seller key"
              autoComplete="new-password"
              onChange={(event) => setNewSellerKey(event.target.value)}
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Update Seller"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Update_Seller;
