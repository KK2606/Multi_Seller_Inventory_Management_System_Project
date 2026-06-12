import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import PageState from "../components/PageState";
import Product_Table from "../components/Product_Table";
import SearchInput from "../components/SearchInput";
import api, { asArray, getApiErrorMessage } from "../services/api";

function Admin_Portal() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");

  const loadDashboard = useCallback(async () => {
    const trimmedAdminKey = adminKey.trim();

    if (!trimmedAdminKey) {
      toast.error("Please enter admin key");
      return;
    }

    try {
      setLoading(true);
      setAdminKey("")
      setError("");

      const response = await api.get("/admin/admin_dashboard", {
        headers: {
          "Admin-Key": trimmedAdminKey,
        },
      });

      setSellers(asArray(response.data));
      setDashboardLoaded(true);
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Failed to load dashboard");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const totalProducts = useMemo(
    () =>
      sellers.reduce(
        (total, seller) => total + asArray(seller.products).length,
        0
      ),
    [sellers]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSellers = useMemo(() => {
    if (!normalizedSearch) {
      return sellers;
    }

    return sellers.filter((seller) => {
      const productsText = asArray(seller.products)
        .map((product) =>
          [
            product.item_id,
            product.item_name,
            product.item_category,
            product.item_description,
          ]
            .filter(Boolean)
            .join(" ")
        )
        .join(" ");

      const searchableText = [
        seller.seller_id,
        seller.seller_name,
        seller.seller_email,
        seller.seller_key,
        productsText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch, sellers]);

  const handleDashboardSubmit = (event) => {
    event.preventDefault();
    loadDashboard();
  };

  const deleteProduct = async (productId, sellerId, sellerKey) => {
    if (!sellerKey) {
      toast.error("Seller key is missing for this product");
      return;
    }

    const confirmed = window.confirm("Delete this product?");

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
          "SELLER-KEY": sellerKey,
        },
      });

      setSellers((currentSellers) =>
        currentSellers.map((seller) =>
          seller.seller_id === sellerId
            ? {
              ...seller,
              products: asArray(seller.products).filter(
                (product) => product.item_id !== productId
              ),
            }
            : seller
        )
      );

      toast.success("Product deleted successfully");
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Delete failed"));
    } finally {
      setBusyAction("");
    }
  };

  const deleteSeller = async (sellerId, sellerKey) => {
    if (!sellerKey) {
      toast.error("Seller key is missing for this seller");
      return;
    }

    const confirmed = window.confirm("Delete this seller?");

    if (!confirmed) {
      return;
    }

    try {
      setBusyAction(`seller-${sellerId}`);

      await api.delete("/seller/delete-seller", {
        params: {
          DEL_ID: sellerId,
        },
        headers: {
          "SELLER-KEY": sellerKey,
        },
      });

      setSellers((currentSellers) =>
        currentSellers.filter((seller) => seller.seller_id !== sellerId)
      );

      toast.success("Seller deleted successfully");
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Delete failed"));
    } finally {
      setBusyAction("");
    }
  };

  const editSeller = (seller) => {
    navigate(`/update-seller/${seller.seller_id}`, {
      state: {
        sellerKey: seller.seller_key,
      },
    });
  };

  const editProduct = (productId, sellerKey) => {
    navigate(`/update-product/${productId}`, {
      state: {
        sellerKey,
      },
    });
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin Portal</p>
          <h1>Dashboard</h1>
          <p>
            Load all sellers with their products, then manage seller and product
            records without leaving the page.
          </p>
        </div>
      </header>

      <form className="card toolbar" onSubmit={handleDashboardSubmit}>
        <label className="inline-field">
          <span>Admin Key</span>
          <input
            type="password"
            value={adminKey}
            placeholder="Enter admin key"
            autoComplete="off"
            onChange={(event) => setAdminKey(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Dashboard"}
        </button>
      </form>

      {dashboardLoaded && (
        <>
          <div className="stats-grid">
            <article className="card">
              <span>Total Sellers</span>
              <strong>{sellers.length}</strong>
            </article>

            <article className="card">
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
            </article>

            <article className="card">
              <span>Visible Results</span>
              <strong>{filteredSellers.length}</strong>
            </article>
          </div>

          <div className="card">
            <SearchInput
              value={search}
              onChange={setSearch}
              label="Search dashboard"
              placeholder="Search sellers, keys, products, categories..."
            />
          </div>
        </>
      )}

      {loading && (
        <PageState
          title="Loading dashboard"
          message="Fetching seller and product data from the admin API."
          variant="loading"
        />
      )}

      {!loading && error && (
        <PageState
          title="Dashboard unavailable"
          message={error}
          variant="error"
          action={
            <button
              type="button"
              className="button button--ghost"
              onClick={loadDashboard}
            >
              Retry
            </button>
          }
        />
      )}

      {!loading && dashboardLoaded && !error && filteredSellers.length === 0 && (
        <PageState
          title="No sellers found"
          message={
            search.trim()
              ? "No sellers or products match this search."
              : "The admin dashboard returned no sellers."
          }
          action={
            search.trim() && (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )
          }
        />
      )}

      {!loading &&
        dashboardLoaded &&
        !error &&
        filteredSellers.map((seller) => {
          const products = asArray(seller.products);

          return (
            <article className="seller-panel" key={seller.seller_id}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Seller #{seller.seller_id}</p>
                  <h2>{seller.seller_name || "Unnamed seller"}</h2>
                  <p>{seller.seller_email || "No email provided"}</p>
                  <p>Seller Key: {seller.seller_key || "—"}</p>
                </div>

                <div className="row-actions">
                  <button
                    type="button"
                    className="button button--ghost button--small"
                    disabled={busyAction === `seller-${seller.seller_id}`}
                    onClick={() => editSeller(seller)}
                  >
                    Update Seller
                  </button>

                  <button
                    type="button"
                    className="button button--danger button--small"
                    disabled={busyAction === `seller-${seller.seller_id}`}
                    onClick={() =>
                      deleteSeller(seller.seller_id, seller.seller_key)
                    }
                  >
                    Delete Seller
                  </button>
                </div>
              </div>

              <Product_Table
                products={products}
                showActions
                actionDisabled={Boolean(busyAction)}
                emptyMessage="This seller has no products yet."
                onEdit={(productId) => editProduct(productId, seller.seller_key)}
                onDelete={(productId) =>
                  deleteProduct(productId, seller.seller_id, seller.seller_key)
                }
              />
            </article>
          );
        })}
    </section>
  );
}

export default Admin_Portal;
