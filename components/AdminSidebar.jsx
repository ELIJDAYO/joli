import Link from "next/link";

const AdminSidebar = ({ CurrentPage }) => {
    return (
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard" className={CurrentPage == "Dashboard" ? "font-bold" : ""}>Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders" className={CurrentPage == "Orders" ? "font-bold" : ""}>Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" className={CurrentPage == "Products" ? "font-bold" : ""}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className={CurrentPage == "Users" ? "font-bold" : ""}>Users</Link>
            </li>
            <li>
              <Link href="/admin/auyf89h2hqqfryhaidjs8ayfca0f0123ASD9fasfnCoFIAso0iahdfw874ehiufhnasUHSUAHPUFDAGHF7gafdhsaBFDayuOFS8GAHSFYUgvwao37rfgASFgcAUISFh984798y389YUsyh98PGFHSUgg3r7fpgGAGHUDFh9p83yhfa">
                Contentful Data Loader</Link>
            </li>
          </ul>
        </div>
    );
}

export default AdminSidebar;