import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CurrentUser from "./pages/CurrentUser";
import UploadVideo from "./pages/UploadVideo";
import Header from "./components/Header";
import { AppContextProvider, useAppContext } from "./contexts/AppContext"; // Adjust the import path as needed
import Register from "./pages/Register";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
      
      <Router>
        <Routes>
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/currentUser" element={<CurrentUser />} />
          {isLoggedIn && (
        <Route path="/uploadVideo" element={<>
          <Header />
        <UploadVideo />
        </>} />
      )}
        </Routes>
      </Router>
  );
};

export default App;
