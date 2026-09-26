import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ThemeToggle from "./Components/Theme.component";
import AssigmentPage from "./Routes/Assignment.route";
import MainPage from "./Routes/index.route";
import LoginPage from "./Routes/Login.route";
import NotFoundPage from "./Routes/NotFound.route";
import StudentPage from "./Routes/Student.route";
import PrivateNoteRoute from "./Routes/PrivateNote.route";

function App(): JSX.Element {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/classes/:classId" element={<AssigmentPage />} />
        <Route path="/students" element={<StudentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assignments/:id/private-note" element={<PrivateNoteRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
