import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ThemeToggle from "./Components/Theme.component";
import MainPage from "./Routes/index.route";
import LoginPage from "./Routes/Login.route";
import NotFoundPage from "./Routes/NotFound.route";

function App(): JSX.Element {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}


export default App;
