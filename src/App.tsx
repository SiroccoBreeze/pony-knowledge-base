import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEditor from './pages/ArticleEditor';
import TechnicalIssues from './pages/TechnicalIssues';
import Documents from './pages/Documents';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/new" element={<ArticleEditor />} />
          <Route path="/articles/edit/:id" element={<ArticleEditor />} />
          <Route path="/issues" element={<TechnicalIssues />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;