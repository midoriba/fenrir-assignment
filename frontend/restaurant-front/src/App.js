import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import SearchPage from './components/SearchPage';
import ListPage from './components/Listpage'
import Header from "./components/Header";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path={"/"} element={<SearchPage />} />
          <Route path={"/result"} element={<ListPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
