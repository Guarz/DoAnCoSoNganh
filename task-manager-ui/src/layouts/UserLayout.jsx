import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useState } from "react";

// Nhớ import đúng đường dẫn file UserLayout của bạn nha
import UserLayout from "./UserLayout"; 
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  return (
    <Router>
      <Routes>

        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/user/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" />}
          />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;