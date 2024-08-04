export const addQueryString = (
  queryName: string,
  queryData: string,
) => {
  const currentUrl = new URL(window.location.href);
  const currentParams = new URLSearchParams(currentUrl.search);
  currentParams.append(queryName, queryData);
  currentUrl.search = currentParams.toString();
  window.history.replaceState({}, "", currentUrl.toString());
};


export const deleteQueryString = (
  queryName: string,
  queryData?: string,
) => {
  const currentUrl = new URL(window.location.href);
  const currentParams = new URLSearchParams(currentUrl.search);

  if (queryName === "tags") {
    const values = currentParams.getAll(queryName);
    currentParams.delete(queryName);

    values.forEach(value => {
      if (value !== queryData) {
        currentParams.append(queryName, value);
      }
    });
  } else {
    currentParams.delete(queryName);
  }

  currentUrl.search = currentParams.toString();
  window.history.replaceState({}, "", currentUrl.toString());
};