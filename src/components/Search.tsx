import { useState } from "react";
import { fetchUsers, setUserSearch } from "../store/reducers/user";
import { useAppDispatch } from "../store/store";

const Search = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a search Type something to search.");
      return;
    }

    setError("");
    dispatch(setUserSearch(query));
    dispatch(fetchUsers(query));
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full h-12 rounded-md p-2 ${
            error ? "bg-red-100 border border-red-500" : "bg-gray-200"
          }`}
          placeholder="Search repositories..."
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 h-12 mt-2 text-white rounded-md"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
