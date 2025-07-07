import Header from "../components/Header"
import Landing from "../components/Landing"
import Outstanding from "../components/Outstanding"


const Home = () => {
  return (
    <div className="w-full h-full flex flex-col  bg-gray-100">
      <Header />
      <Landing />
      <Outstanding />
    </div>
  )
}

export default Home