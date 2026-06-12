import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/seller-portal", label: "Seller Portal" },
  { to: "/admin-portal", label: "Admin Portal" },
  { to: "/add-product", label: "Add Product" },
];

function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary navigation">
      <NavLink className="navbar__brand" to="/">
        Inventory System
      </NavLink>

      <div className="navbar__links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
