import qs from 'qs';
import { createBrowserHistory as createHistory } from 'history';

const addQuery = (history) => {
  const location = history.location;
  history.location = {
    ...location,
    query: qs.parse(location.search, {
      ignoreQueryPrefix: true,
    }),
  };
};

const history = createHistory();

addQuery(history);

export const unlisten = history.listen(() => {
  addQuery(history);
});

export default history;