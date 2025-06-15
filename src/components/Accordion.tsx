import { useState } from "react";
import { fetchUserRepos } from "../store/reducers/repo";
import { useAppDispatch, useAppSelector, type RootState } from "../store/store";
import ListItemCard from "./ListItemCard";
import ReposContent from "./ReposContent";
import ErrorState from "./ErrorState";
import { fetchUsers } from "../store/reducers/user";

const Accordion = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const repo = useAppSelector((state: RootState) => state.repo);
  const { data, userSearch, loading, error } = user;

  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (!userSearch) return null;

  if (error) {
    return (
      <ErrorState
        title="Users"
        error={error}
        onRetry={() => dispatch(fetchUsers(userSearch))}
      />
    );
  }

  if (data.items.length === 0 && !loading) {
    return <div className="text-center py-4">No data found.</div>;
  }

  const onSelectUser = (name: string) => {
    if (expandedUser === name) {
      setExpandedUser(null);
    } else {
      setExpandedUser(name);

      if (!repo.userRepos[name]) {
        dispatch(fetchUserRepos(name));
      }
    }
  };

  return (
    <div className="space-y-2 bg-white rounded-lg shadow-md px-4 relative">
      <div className="sticky top-0 z-10 bg-white py-4">
        Showing users for "{userSearch}"
      </div>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-8 bg-gray-300 rounded-md mb-2" />
          ))
        : data?.items?.map((item) => {
            return (
              <ListItemCard
                key={item.id}
                onClick={onSelectUser}
                title={item.login}
                className={"bg-gray-300 transition ease-in-out duration-500"}
                rightIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`lucide lucide-chevron-down transform transition-transform duration-300 ease-in-out ${
                      expandedUser === item.login ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                }
              >
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedUser === item.login
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ReposContent username={item.login} />
                </div>
              </ListItemCard>
            );
          })}
    </div>
  );
};

export default Accordion;
