import Sidebar from '../components/SideBar'
import Navbar from '../components/Navbar'


 function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
