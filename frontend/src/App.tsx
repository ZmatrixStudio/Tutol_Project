import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Login/Login'; // Trang chủ của bạn

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ index chỉ hiển thị giao diện của nó */}
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </Router>
  );
}

export default App;