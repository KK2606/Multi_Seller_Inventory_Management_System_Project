import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Add_Product from "./pages/Add_Product";

import Home from "./pages/Home";
import Products from "./pages/Products";
// import Seller_Portal from "./pages/Seller_Portal";
import Admin_Portal from "./pages/Admin_Portal";
import Update_Product from "./pages/Update_Product";
import Update_Seller from "./pages/Update_Seller";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        {/* <Route
          path="/seller-portal"
          element={<Seller_Portal />}
        /> */}

        <Route
          path="/admin-portal"
          element={<Admin_Portal />}
        />

        <Route
          path="/add-product"
          element={<Add_Product />}
        />

        <Route
          path="/update-product/:id"
          element={<Update_Product />}
        />
        <Route
          path="/update-seller/:sellerId"
          element={<Update_Seller />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;