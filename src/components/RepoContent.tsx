import { fetchUserRepos, type GitHubRepo } from "../store/reducers/repo";
import { useAppDispatch, useAppSelector } from "../store/store";
import ErrorState from "./ErrorState";
import ListItemCard from "./ListItemCard";

const LoadingState = () => (
  <div className="flex items-center justify-center py-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">Loading repositories...</span>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <p className="text-gray-500">{message}</p>
);

const RepoItem = ({ repo }: { repo: GitHubRepo }) => (
  <ListItemCard
    title={repo.name}
    rightIcon={
      <div className="flex items-center gap-2">
        <p>{repo.stargazers_count}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-star-icon lucide-star"
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      </div>
    }
    className="bg-gray-200 cursor-text"
  />
);

const ReposContent = ({ username }: { username: string }) => {
  const dispatch = useAppDispatch();
  const { userRepos, loadingRepo, errorRepo } = useAppSelector(
    (state) => state.repo
  );

  const isLoading = loadingRepo && !userRepos[username];
  const hasError = errorRepo;
  const isEmpty = userRepos[username]?.length === 0;
  const hasRepos = userRepos[username]?.length > 0;

  return (
    <div className="mt-2 ml-4">
      {isLoading && <LoadingState />}
      {hasError && (
        <ErrorState
          onRetry={() => dispatch(fetchUserRepos(username))}
          title={"repositories"}
          error={errorRepo}
        />
      )}
      {isEmpty && <EmptyState message="No repos found." />}
      {hasRepos && (
        <div className="space-y-2">
          {userRepos[username].map((repo: GitHubRepo) => (
            <RepoItem key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReposContent;
