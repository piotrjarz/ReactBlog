import './App.css';
import AppRouting from './components/AppRouting';
import WebNav from "./pages/shared/Nav"
import Footer from './pages/shared/Footer';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <WebNav/>
      <AppRouting/>
      <Footer/>
    </div>
  );
}

export default App;
