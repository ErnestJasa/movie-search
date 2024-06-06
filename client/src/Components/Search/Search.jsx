import "./Search.css";
function Search({ setSearch, handleSearch }) {
  return (
    <div className=" pt-44 pb-10 text-center ">
      <div className="search inline-block rounded-xl ">
        <form action="">
          <input
            className="  p-3 sm:w-[350px] md:w-[550px] rounded-l-xl search-input "
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
          <button
            type="submit"
            className=" bg-lime-600  rounded-r-xl p-3 lg:px-4 search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
export default Search;
