import BikeComputerPage from "./pages/BikeComputerPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BikeComputerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
