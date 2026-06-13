import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import PageState from "./components/PageState";
import Add_Product from "./pages/Add_Product";
import Admin_Portal from "./pages/Admin_Portal";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Seller_Portal from "./pages/Seller_Portal";
import Update_Product from "./pages/Update_Product";
import Update_Seller from "./pages/Update_Seller";
import New_Seller from "./pages/New_Seller";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/seller-portal" element={<Seller_Portal />} />
          <Route path="/admin-portal" element={<Admin_Portal />} />
          <Route path="/add-product" element={<Add_Product />} />
          <Route path="/update-product/:id" element={<Update_Product />} />
          <Route path="/update-seller/:sellerId" element={<Update_Seller />} />
          <Route path="/new-seller-signup" element={<New_Seller />} />
          <Route
            path="*"
            element={
              <PageState
                title="Page not found"
                message="That route does not exist in this inventory app."
                variant="error"
              />
            }
          />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: "14px",
            fontWeight: 600,
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
