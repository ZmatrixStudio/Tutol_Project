import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login'; // Trang chủ của bạn

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ index chỉ hiển thị giao diện của nó */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;