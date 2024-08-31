import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './App.css';
import BaseLayout from './pages/BaseLayout';
import ErrorPage from "./pages/Error";
import HomeScreen from "./pages/HomeScreen";
import ProfilePage from "./pages/Profile";
import PredictionResultsPage from "./pages/PredictionResults";
import UserHistoryPage from "./pages/UserHistory";

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout className="App"/>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomeScreen /> },
      {
        path: 'profile',
        element: <ProfilePage />,
        children: [
              {
                path: 'history',
                element: <UserHistoryPage />,
              }
            ],
      },
      {
        path: 'prediction',
        element: <PredictionResultsPage />,
      },
    ],
  },
]);




function App() {

    return <RouterProvider router={router} />;
}

export default App;
