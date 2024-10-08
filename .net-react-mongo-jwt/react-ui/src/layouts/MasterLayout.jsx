import { NavLink, Outlet } from "react-router-dom";

function MasterLayout() {
  return (
    <div className="bg-light">
      <div className="d-flex flex-column vh-100">
        <header className="bg-white shadow p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h5 fw-bold">Header</h1>
            </div>
            <div>
              <button className="btn btn-dark">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="d-flex flex-grow-1 overflow-hidden">
          <aside className="bg-dark text-light flex-shrink-0 overflow-auto" style={{ width: '200px' }}>
            <div className="p-3">
              <ul className="mt-3 list-unstyled">
                <li className="py-2">
                  <NavLink
                    to="/"
                    className="d-block px-3 py-2 text-decoration-none text-light"
                    
                  >
                    Home
                  </NavLink>
                </li>
                <li className="py-2">
                  <NavLink
                    to="/dashboard"
                    className="d-block px-3 py-2 text-decoration-none text-light"
                    
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="py-2">
                  <NavLink
                    to="/user"
                    className="d-block px-3 py-2 text-decoration-none text-light"
                    
                  >
                    User
                  </NavLink>
                </li>
              </ul>
            </div>
          </aside>

          <main className="flex-grow-1 overflow-auto p-3">
            <div className="bg-white shadow rounded p-3">
              <h2 className="h6 fw-semibold mb-3">Content Area</h2>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MasterLayout;
