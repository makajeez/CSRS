import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "../features/navigation/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;