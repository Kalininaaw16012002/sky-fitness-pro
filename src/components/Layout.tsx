import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-layout">
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <h1>SkyFitnessPro Header</h1>
      </header>
      
      <main >
        <Outlet />
      </main>

      <footer>
         SkyFitnessPro
      </footer>
    </div>
  )
}