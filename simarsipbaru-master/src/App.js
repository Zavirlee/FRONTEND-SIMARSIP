import "./App.css";
import "react-tooltip/dist/react-tooltip.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { Tambah } from "./pages/tambah";
import { Tabel } from "./pages/tabel";
import { User } from "./pages/user";
import Layout from "./component/layout";
import { Category } from "./pages/category";
import { Detail } from "./pages/detailarsip";
import { TambahUser } from "./pages/tambahuser";
import { Update } from "./pages/updatearsip";
import { UpdateUser } from "./pages/updateuser";
import { Profile } from "./pages/profile";
import { Terbaru } from "./pages/terbaru";
import { Catalog } from "./pages/catalog";
import { Pimpinan } from "./pages/pimpinan";
import Layoutpim from "./component/layoutpim";
import { PageNotFound } from "./pages/404";
import Cookies from "js-cookie";
import { MasterTabel } from "./master/mastertabel";
import { DetailTabel } from "./master/detailtabel";
import { TambahData } from "./master/tambahdata";
import { EditData } from "./master/editdata";

function App() {
  function checkRole(desiredRole, path) {
    const userRole = Cookies.get("role");

    if(path==="/dashboard"){
      if(userRole === "pimpinan"){
        return <Navigate to="/pimpinan" />;
      } else {
        return <Layout/>
      }
    } else if(path==="/pimpinan"){
      if(userRole === "operator"){
        return <Navigate to="/dashboard" />;
      }else {
        return <Layoutpim/>
      }
    }
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />

        <Route path="/login" element={<Login />} />

        {/* Routes for admin */}
        {/* <Route path="/admin" element={<Layout />}> */}
      <Route path="/dashboard" element={checkRole("admin", "/dashboard")}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/tambah" element={<Tambah />} />
          <Route path="/dashboard/user" element={<User />} />
          <Route path="/dashboard/tabel" element={<Tabel />} />
          <Route path="/dashboard/tabel/detail/:archive_id" element={<Detail />} />
          <Route path="/dashboard/terbaru" element={<Terbaru />} />
          <Route
            path="/dashboard/terbaru/detail/:archive_id"
            element={<Detail />}
          />
          <Route path="/dashboard/updatearsip/:archive_id" element={<Update />} />
          <Route path="/dashboard/updateuser/:user_id" element={<UpdateUser />} />
          <Route path="/dashboard/user/tambahuser" element={<TambahUser />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route
            path="/dashboard/category/:archive_catalog_id"
            element={<Catalog />}
          />
          <Route
            path="/dashboard/category/detail/:archive_id"
            element={<Detail />}
          />
          <Route path="/dashboard/master" element={<MasterTabel />} />
          <Route path="/dashboard/master/detailtabel/:id" element={<DetailTabel/>} />
          <Route path="/dashboard/master/tambahdata/:id" element={<TambahData/>} />
          <Route path="/dashboard/master/editdata/:id1/:id2/:id3" element={<EditData/>} />
        </Route>



        <Route path="/pimpinan" element={checkRole("pimpinan", "/pimpinan")} >
          <Route index element={<Pimpinan />} />
          <Route path="/pimpinan/tabel" element={<Tabel />} />
          <Route
            path="/pimpinan/tabel/detail/:archive_id"
            element={<Detail />}
          />
          <Route path="/pimpinan/terbaru" element={<Terbaru />} />
          <Route
            path="/pimpinan/terbaru/detail/:archive_id"
            element={<Detail />}
          />
          <Route path="/pimpinan/category" element={<Category />} />
          <Route
            path="/pimpinan/category/:archive_catalog_id"
            element={<Catalog />}
          />
          <Route
            path="/pimpinan/category/detail/:archive_id"
            element={<Detail />}
          />
          <Route
            path="/pimpinan/updateuser/:user_id"
            element={<UpdateUser />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
