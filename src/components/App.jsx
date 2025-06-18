import Navbar from './Navbar'
import Footer from './Footer'
import Instructions from './Instructions'
import Actions from './Actions'

const App = () => {
  return (
    <main className="h-[100svh] bg-bk-1 text-wt-1 font-sans flex flex-col">
      <Navbar />

      <div
        className="h-[100%] overflow-y-auto overflow-x-hidden
          grid gap-4 p-4
          justify-center items-center
          lg:grid-cols-2"
      >
        <Instructions />
        <Actions />
      </div>

      <Footer />
    </main>
  )
}

export default App
