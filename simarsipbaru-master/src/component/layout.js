import { Outlet } from "react-router-dom";
import Header from "./header";
import Bar from "./bar";

function Layout() {
    return (
<div className="content">
      <div className="row m-0">
      <div className="sidebar sticky-top col-md-2 col-2 d-flex flex-column align-items-center pt-5 m-0">
  <div className="d-flex flex-column align-items-center justify-content-center w-100">
    <Bar />
  </div>
</div>
        <div className="col-md-10 col-10">
          <Header />
          <Outlet />
        </div>
      </div>
</div>

    )
}

export default Layout;