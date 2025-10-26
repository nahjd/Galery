import Dashboard from "../Admin/Dashboard";
import AddPhoto from "../Admin/AddPhoto";
import EditUser from "../Admin/AdminEdit";
import Galery from "../Components/Galery";
import AdminLogin from "../Admin/AdminLogin";
import Navbar from "../Components/Navbar";

export const routes = [
  {
    path: "/",
    element: (
      <>
        <Navbar /> 
        <Galery />
      </>
    ),
  },
  {
    path: "/admin",
    children: [
      {
        path: "/admin/admin",
        element: <Dashboard />,
      },

      {
        path: "/admin/AddPhoto",
        element: <AddPhoto />,
      },

      {
        path: "/admin/edit/:id",
        element: <EditUser />,
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
    ],
  },
];