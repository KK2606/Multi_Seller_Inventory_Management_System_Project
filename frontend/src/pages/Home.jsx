import { Link } from "react-router-dom";

const highlights = [
    {
        title: "Inventory Control",
        text: "Browse product availability, pricing, stock levels, and seller-linked items.",
    },
    {
        title: "Seller Management",
        text: "Load seller records, search quickly, and jump into seller updates.",
    },
    {
        title: "Admin Overview",
        text: "Review seller and product totals from one operational dashboard.",
    },
];

function Home() {
    return (
        <section className="page hero-page">
            <div className="hero-card">
                <p className="eyebrow">Multi Seller Inventory System</p>
                <h1>Where 📦inventory behaves, 🤝sellers cooperate, and 🧙‍♂️admins rule the realm.</h1>
                <p className="hero-card__text">
                    Powered by 3:00 AM coffee ☕, CRUD operations ⚙️, questionable admin authority and life choices 🎲.
                </p>

                <div className="hero-card__actions">
                    <Link className="button button--primary" to="/products">
                        View Products
                    </Link>
                    <Link className="button button--ghost" to="/admin-portal">
                        Open Admin Portal
                    </Link>
                </div>
            </div>

            <div className="feature-grid">
                {highlights.map((highlight) => (
                    <article className="feature-card" key={highlight.title}>
                        <h2>{highlight.title}</h2>
                        <p>{highlight.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Home;
