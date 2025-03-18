import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';

const router = createBrowserRouter([
  {
    path: import.meta.env.APP_BASE_URL,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'add-user',
        element: <AddUser />,
      },
      {
        path: 'edit-user/:id',
        element: <EditUser />,
      },
      // Add more routes here as needed
    ],
  },
]);

export default router;
