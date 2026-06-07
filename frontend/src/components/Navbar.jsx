function Navbar() {
    return (
        <nav
            style={{
                display: "flex",
                gap: "20px",
                padding: "15px",
                borderBottom: "1px solid gray",
                marginBottom: "20px"
            }}
        >
            <a href="/">Home</a>

            <a href="/products">Products</a>

            <a href="/seller-portal">
                Seller Portal
            </a>

            <a href="/admin-portal">
                Admin Portal
            </a>

            <a href="/add-product">
                Add Product
            </a>

        </nav>
    );
}

export default Navbar;