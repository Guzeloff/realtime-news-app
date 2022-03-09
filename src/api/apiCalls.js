import axios from "axios";

const BASE_URL = "https://newsapi.org/v2/everything";
const BASE_URL_TOP = "https://newsapi.org/v2/top-headlines?country=us";

export const getEverything = async (params) => {
  let date = new Date();
  let yesterday = date - 1000 * 60 * 60 * 24 * 2; // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
  yesterday = new Date(yesterday).toISOString().split("T")[0];
  let today = new Date().toISOString().split("T")[0];

  if (!("from" in params)) {
    // if from not specified, show news from last 2days
    params = { ...params, ...{ from: yesterday } };
  }
  params = { ...params, ...{ to: today } };
  try {
    let res = await axios.get(BASE_URL, {
      params,
      headers: { Authorization: API_KEY },
    });

    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const getTopHeadlines = async () => {
  try {
    let res = await axios.get(BASE_URL_TOP, {
      headers: { Authorization: API_KEY },
    });

    return res.data;
  } catch (error) {
    return error.message;
  }
};
