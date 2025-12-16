import { useState, useEffect } from "react";

// --- 1. Counter komponenti (Counter.jsx dan) ---
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Hisob: {count}</h2>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
        </div>
    );
}

// --- 2. DarkLight komponenti (DarkLight.jsx dan) ---
function ThemeToggle() {
    const [dark, setDark] = useState(false);

    return (
        <div
            style={{
                backgroundColor: dark ? "#111" : "#fff",
                color: dark ? "#fff" : "#000",
                minHeight: "30vh",
                padding: "20px",
                marginTop: "20px"
            }}
        >
            <h2>{dark ? "🌙 Dark Mode" : "☀️ Light Mode"}</h2>

            <button onClick={() => setDark(!dark)}>
                Fonni almashtirish
            </button>
        </div>
    );
}

// --- 3. Kontakt forma komponenti (ContactForm.jsx dan) ---
function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        alert(`Ism: ${name}\nEmail: ${email}`);
    }

    return (
        <form onSubmit={handleSubmit} style={{ padding: "20px", border: "1px solid #ccc", marginBottom: "20px" }}>
            <h2>📨 Kontakt forma</h2>

            <input
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <button type="submit">Yuborish</button>
        </form>
    );
}

// --- 4. API yuklash komponenti (Apiloading.jsx dan) ---
function ApiLoading() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("https://jsonplaceholder.typicode.com/users");
                if (!res.ok) throw new Error("Serverdan javob kelmadi");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    if (loading) return <p style={{ padding: "20px" }}>⏳ Yuklanmoqda...</p>;
    if (error) return <p style={{ padding: "20px" }}>❌ Xatolik: {error}</p>;

    return (
        <div style={{ padding: "20px", marginTop: "20px" }}>
            <h2>👥 Foydalanuvchilar royxati</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            width: "200px",
                            boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>{user.name}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Website:</strong> {user.website}</p>
                        <p><strong>Company:</strong> {user.company.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 5. Mahsulot qidirish komponenti (searchfilter.jsx dan) ---
function ProductSearch() {
    const [search, setSearch] = useState("");

    const products = [
        { id: 1, name: "iPhone 14" },
        { id: 2, name: "Samsung Galaxy" },
        { id: 3, name: "Redmi Note 12" },
        { id: 4, name: "MacBook Pro" },
        { id: 5, name: "HP Laptop" },
    ];

    // 🔍 Filter orqali qidiruv
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "20px", marginTop: "20px", border: "1px solid #ccc" }}>
            <h2>🔍 Mahsulot qidirish</h2>

            {/* Input */}
            <input
                type="text"
                placeholder="Mahsulot nomini yozing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Ro‘yxat */}
            <ul>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <li key={product.id}>{product.name}</li>
                    ))
                ) : (
                    <p>❌ Mahsulot topilmadi</p>
                )}
            </ul>
        </div>
    );
}


// --- ASOSIY APP KOMPONENTI (App.jsx) ---
function App() {

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>🚀 React Dasturlash Misollari</h1>
            <hr />

            <div style={{ padding: "20px", border: "1px solid #ccc", marginBottom: "20px" }}>
                <h2>1. Counter Ilovasi</h2>
                <Counter />
            </div>

            <ContactForm />

            <ThemeToggle />

            <ProductSearch />

            <ApiLoading />

        </div>
    );
}

export default App;