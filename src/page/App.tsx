import Accordion from "../components/Accordion";
import Search from "../components/Search";

function App() {
  return (
    <div className="w-full xl:pt-20 pt-5 h-screen bg-gray-300 ">
      <div className="md:w-1/2 xl:w-1/3 w-full md:mx-auto px-2 h-4/5 flex flex-col overflow-hidden my-auto rounded-md bg-white p-2">
        <Search />
        <div className="flex-1 overflow-y-auto">
          <Accordion />
        </div>
      </div>
    </div>
  );
}

export default App;
