import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
