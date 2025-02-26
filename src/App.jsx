import Footer from "./comp/Footer"
import Table from "./comp/Table"
import TableTwo from "./comp/TableTwo"
import TableWithFileUpload from "./comp/TableWithFileUpload"
// import TableTwo from "./comp/TableTwo"

function App() {

  return (
    <>
      {/* <Table></Table> */}
      {/* <TableTwo /> */}
      <div className="h-screen">
        <TableWithFileUpload />
      </div>

      <Footer />
    </>
  )
}

export default App
