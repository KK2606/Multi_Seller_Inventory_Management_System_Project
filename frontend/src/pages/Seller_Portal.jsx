import { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import PageState from "../components/PageState";
import Product_Table from "../components/Product_Table";
import SearchInput from "../components/SearchInput";
import api, { asArray, getApiErrorMessage } from "../services/api";
import { Seller_Context } from "../context/sellerContext";

function Seller_Portal() {
  const navigate = useNavigate();
  const { sellerKey, setSellerKey } = useContext(Seller_Context);
  const [sellerDashboard, setSellerDashboard] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");

  const products = useMemo(
    () => asArray(sellerDashboard?.products),
    [sellerDashboard]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = productSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [
        product.item_id,
        product.item_name,
        product.item_category,
        product.item_description,
        product.item_stock_qty,
        product.item_price,
      ]
        .filter((value) => value !== undefined && value !== null)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [productSearch, products]);

  const loadSellerDashboard = async () => {
    const trimmedSellerKey = sellerKey.trim();

    if (!trimmedSellerKey) {
      toast.error("Seller key is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/seller/seller-dashboard", {
        headers: {
          "SELLER-KEY": trimmedSellerKey,
        },
      });

      setSellerDashboard(response.data);
      setLoaded(true);
      toast.success("Welcome, " + (response.data.seller_name || "seller") + "!");

    } catch (apiError) {
      const message = getApiErrorMessage(
        apiError,
        "Failed to load seller dashboard"
      );
      
      setSellerDashboard(null);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSubmit = (event) => {
    event.preventDefault();
    loadSellerDashboard();
  };

  const addProduct = () => {
    if (!sellerDashboard) {
      return;
    }

    navigate(`/add-product`, {
      state: {
        sellerKey: sellerKey.trim(),
        returnTo: "/seller-portal",
      },
    });
  };

  const editSeller = () => {
    if (!sellerDashboard) {
      return;
    }

    navigate(`/update-seller/${sellerDashboard.seller_id}`, {
      state: {
        sellerKey: sellerKey.trim(),
        returnTo: "/seller-portal",
      },
    });
  };

  const deleteSeller = async () => {
    if (!sellerDashboard) {
      return;
    }

    if (products.length > 0) {
      toast.error("Delete all products before deleting the seller profile");
      return;
    }

    const confirmed = window.confirm(
      "Delete your seller profile? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyAction("seller-delete");

      await api.delete("/seller/delete-seller", {
        params: {
          DEL_ID: sellerDashboard.seller_id,
        },
        headers: {
          "SELLER-KEY": sellerKey.trim(),
        },
      });

      toast.success("Seller profile deleted successfully");
      setSellerDashboard(null);
      setLoaded(false);
      setProductSearch("");
      setSellerKey("");
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Failed to delete seller"));
    } finally {
      setBusyAction("");
    }
  };

  const editProduct = (productId) => {
    navigate(`/update-product/${productId}`, {
      state: {
        sellerKey: sellerKey.trim(),
        returnTo: "/seller-portal",
      },
    });
  };

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this product from your inventory?");

    if (!confirmed) {
      return;
    }

    try {
      setBusyAction(`product-${productId}`);

      await api.delete("/inventory/delete-product", {
        params: {
          DEL_ID: productId,
        },
        headers: {
          "SELLER-KEY": sellerKey.trim(),
        },
      });

      setSellerDashboard((currentDashboard) => ({
        ...currentDashboard,
        products: asArray(currentDashboard?.products).filter(
          (product) => product.item_id !== productId
        ),
      }));

      toast.success("Product deleted successfully");
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Failed to delete product"));
    } finally {
      setBusyAction("");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Seller Management</p>
          <h1>Seller Portal</h1>
          <p>
            Enter your seller key to view only your seller profile and your own
            products.
          </p>
        </div>
      </header>

      <form className="card toolbar" onSubmit={handleLoadSubmit}>
        <label className="inline-field">
          <span>Seller Key</span>
          <input
            type="password"
            value={sellerKey}
            placeholder="Enter your seller key"
            autoComplete="off"
            onChange={(event) => setSellerKey(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load My Dashboard"}
        </button>
      </form>

      {loading && (
        <PageState
          title="Loading seller dashboard"
          message="Fetching seller details and owned products."
          variant="loading"
        />
      )}

      {!loading && error && (
        <PageState
          title="Seller dashboard unavailable"
          message={error}
          variant="error"
          action={
            <button
              type="button"
              className="button button--ghost"
              onClick={loadSellerDashboard}
            >
              Retry
            </button>
          }
        />
      )}

      {!loading && !loaded && !error && (
        <PageState
          title="Seller key required"
          message="Your dashboard stays private until a valid seller key is provided."
        />
      )}

      {!loading && loaded && sellerDashboard && !error && (
        <>
          <div className="stats-grid">
            <article className="card">
              <span>Seller ID</span>
              <strong>{sellerDashboard.seller_id}</strong>
            </article>

            <article className="card">
              <span>Owned Products</span>
              <strong>{products.length}</strong>
            </article>

            <article className="card">
              <span>Out of Stock Products</span>
              <strong>{products.filter((p) => p.item_stock_qty === 0).length}</strong>
            </article>
          </div>

          <article className="seller-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">My Seller Profile</p>
                <h2>{sellerDashboard.seller_name || "Unnamed seller"}</h2>
                <p>{sellerDashboard.seller_email || "No email provided"}</p>
                <p>Seller Key: {sellerDashboard.seller_key || "—"}</p>
              </div>

              <div className="row-actions">
                <button
                  type="button"
                  className="button button--primary button--small"
                  disabled={Boolean(busyAction)}
                  onClick={addProduct}
                >
                  Add New Product
                </button>
                <button
                  type="button"
                  className="button button--ghost button--small"
                  disabled={Boolean(busyAction)}
                  onClick={editSeller}
                >
                  Update Profile
                </button>

                <button
                  type="button"
                  className="button button--danger button--small"
                  disabled={Boolean(busyAction)}
                  onClick={deleteSeller}
                >
                  Delete Profile
                </button>
              </div>
            </div>

            {products.length > 0 && (
              <p className="form-card__hint">
                Note: All owned products must be deleted before deleting your seller profile.
              </p>
            )}
          </article>

          <div className="card">
            <div className="toolbar">
              <SearchInput
                value={productSearch}
                onChange={setProductSearch}
                label="Search my products"
                placeholder="Search by product name, ID, stock, or price..."
              />
            </div>
          </div>

          <Product_Table
            products={filteredProducts}
            showActions
            actionDisabled={Boolean(busyAction)}
            emptyMessage={
              productSearch.trim()
                ? "No owned products match this search."
                : "You have not added products yet."
            }
            onEdit={editProduct}
            onDelete={deleteProduct}
          />
        </>
      )}
    </section>
  );
}

export default Seller_Portal;
