import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import PageState from "../components/PageState";
import Product_Card from "../components/Product_Card";
import SearchInput from "../components/SearchInput";
import api, {
  asArray,
  getApiErrorMessage,
  isCanceledRequest,
} from "../services/api";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [actionSellerKey, setActionSellerKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchProducts = useCallback(async (query = "", options = {}) => {
    const { signal, silent = false } = options;

    if (silent) {
      setSearching(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = query
        ? await api.get("/inventory/search-products", {
            params: {
              ITEM_NAME: query,
            },
            signal,
          })
        : await api.get("/inventory/show-all-products", { signal });

      setProducts(asArray(response.data));
    } catch (apiError) {
      if (isCanceledRequest(apiError)) {
        return;
      }

      if (apiError.response?.status === 404) {
        setProducts([]);
        return;
      }

      setProducts([]);
      setError(getApiErrorMessage(apiError, "Failed to load products"));
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    const trimmedSearch = search.trim();
    const controller = new AbortController();
    const delay = trimmedSearch ? 350 : 0;
    const timeoutId = window.setTimeout(() => {
      fetchProducts(trimmedSearch, {
        signal: controller.signal,
        silent: Boolean(trimmedSearch),
      });
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchProducts, search]);

  const productCountText = useMemo(() => {
    if (loading) {
      return "Loading inventory";
    }

    if (search.trim()) {
      return `${products.length} result${products.length === 1 ? "" : "s"} for "${search.trim()}"`;
    }

    return `${products.length} product${products.length === 1 ? "" : "s"} available`;
  }, [loading, products.length, search]);

  const getSellerKeyForAction = useCallback(() => {
    const savedSellerKey = actionSellerKey.trim();

    if (savedSellerKey) {
      return savedSellerKey;
    }

    return window.prompt("Enter Seller Key")?.trim() || "";
  }, [actionSellerKey]);

  const deleteProduct = useCallback(async (itemId) => {
    const sellerKey = getSellerKeyForAction();

    if (!sellerKey) {
      toast.error("Seller key is required to delete a product");
      return;
    }

    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(itemId);

      await api.delete("/inventory/delete-product", {
        params: {
          DEL_ID: itemId,
        },
        headers: {
          "SELLER-KEY": sellerKey,
        },
      });

      toast.success("Product deleted successfully");
      await fetchProducts(search.trim(), { silent: true });
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError, "Failed to delete product"));
    } finally {
      setDeletingProductId(null);
    }
  }, [fetchProducts, getSellerKeyForAction, search]);

  const editProduct = useCallback((itemId) => {
    navigate(`/update-product/${itemId}`, {
      state: {
        sellerKey: actionSellerKey.trim(),
      },
    });
  }, [actionSellerKey, navigate]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventory Management</p>
          <h1>All Products</h1>
          <p>{productCountText}</p>
        </div>

        <Link className="button button--primary" to="/add-product">
          Add Product
        </Link>
      </header>

      <div className="card">
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            label="Search products"
            placeholder="Search by product name..."
            disabled={loading}
          />

          <label className="inline-field">
            <span>Seller key for actions</span>
            <input
              type="password"
              value={actionSellerKey}
              placeholder="Optional; used for update/delete"
              autoComplete="off"
              onChange={(event) => setActionSellerKey(event.target.value)}
            />
          </label>
        </div>

        {searching && <p className="form-card__hint">Searching inventory...</p>}
      </div>

      {loading && (
        <PageState
          title="Loading products"
          message="Fetching inventory from the backend."
          variant="loading"
        />
      )}

      {!loading && error && (
        <PageState
          title="Products unavailable"
          message={error}
          variant="error"
          action={
            <button
              type="button"
              className="button button--ghost"
              onClick={() => fetchProducts(search.trim())}
            >
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && products.length === 0 && (
        <PageState
          title="No products found"
          message={
            search.trim()
              ? "Try a different product name or clear the search."
              : "Inventory is empty. Add the first product to get moving."
          }
          action={
            search.trim() ? (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            ) : (
              <Link className="button button--primary" to="/add-product">
                Add Product
              </Link>
            )
          }
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <Product_Card
                  key={product.item_id}
                  product={product}
                  onEdit={editProduct}
                  onDelete={deleteProduct}
                  actionDisabled={deletingProductId === product.item_id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Products;
