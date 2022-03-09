import { useEffect, useState } from "react";
import { getEverything, getTopHeadlines } from "./api/apiCalls";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Pagination from "@mui/material/Pagination";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import NewsCard from "./components/NewsCard";
import Alert from "@mui/material/Alert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const source = [
  {
    name: "Greece",
    code: "gr",
  },
  {
    name: "Netherlands",
    code: "nl",
  },
  {
    name: "Australia",
    code: "au",
  },
  {
    name: "Belgium",
    code: "be",
  },
  {
    name: "United Kingdom",
    code: "gb",
  },
  {
    name: "United States",
    code: "us",
  },
  {
    name: "Serbija",
    code: "rs",
  },
];

function App() {
  const [articles, setArticles] = useState(null);
  const [phrases, setPhrases] = useState("");
  const [sources, setSources] = useState([]);
  const [singleSource, setSingleSource] = useState([]);
  const [sort, setSort] = useState("popularity");
  const [language, setLanguage] = useState("en");
  const [dateFrom, setDateFrom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topheadlines, setTopheadlines] = useState(false);
  const [phraseNone, setphraseNone] = useState("");
  const [page, setPage] = useState(0);
  const [alert, setAlert] = useState(false);
  const [initial, setInitial] = useState(false);

  useEffect(() => {
    getHeadlines();
    setInitial(true);
  }, []);

  const getHeadlines = async () => {
    const data = await getTopHeadlines();
    setArticles(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let params = {};

    if (phrases === "") {
      setAlert(true);
      return;
    }
    if (phrases !== "") {
      let phrase = { q: phrases };
      params = { ...params, ...phrase };
    }

    // if (sources.length > 0) {
    //   let source = { sources: sources.toString() };
    //   params = { ...params, ...source };
    // }

    params = { ...params, ...{ language: language } };
    params = { ...params, ...{ sortBy: sort } };
    if (dateFrom !== null) {
      params = { ...params, ...{ from: dateFrom } };
    }
    params = { ...params, ...{ page: page + 1 } };
    console.log(params);
    setPage(page + 1);
    setLoading(true);
    const data = await getEverything(params);
    setArticles(data);
    setAlert(false);
    setLoading(false);
    setphraseNone(phrases);

    // setSources(singleSource.toString());
  };

  const handlePhrases = (e) => {
    let phrase = e.target.value;
    phrase = phrase.replace(/\s+/g, " ").trim();
    phrase = phrase.split(" ").join("+");
    setPhrases(phrase);
  };

  const handleDate = (dateFrom) => {
    setDateFrom(dateFrom.toISOString().split("T")[0]);
  };

  // const handleSource = (e) => {
  //   const {
  //     target: { value },
  //   } = e;
  //   setSingleSource(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );

  //   setSources(singleSource);
  // };

  const handleMore = (e) => {
    handleSubmit(e);
  };

  return (
    <div className="container">
      <div className="searchfields__container">
        <h2>RealTime News - TOP HEADLINES</h2>
        <form>
          <TextField
            label="Phrases"
            variant="standard"
            placeholder="eg. elonmusk bitcoin doge"
            helperText="You can search multiple phrases at once, separated with space"
            onChange={handlePhrases}
            sx={{ m: 1, width: 300 }}
            required
          />
          {/* <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            Coutry news source
          </InputLabel>
          <Select
            multiple
            value={singleSource}
            onChange={handleSource}
            input={<OutlinedInput label="Source" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {source.map((source) => (
              <MenuItem key={source.name} value={source.code}>
                <Checkbox checked={singleSource.indexOf(source.code) > -1} />
                <ListItemText primary={source.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => setSort(e.target.value)}
              defaultValue
              required
            >
              <MenuItem value={"popularity"}>Popularity</MenuItem>
              <MenuItem value={"relevancy"}>Relevancy</MenuItem>
              <MenuItem value={"publishedAt"}>PublishedAt</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>News language</InputLabel>
            <Select
              value={language}
              label="News language"
              onChange={(e) => setLanguage(e.target.value)}
              defaultValue
              required
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"fr"}>France</MenuItem>
              <MenuItem value={"es"}>Spain</MenuItem>
              <MenuItem value={"de"}>German</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ m: 1, width: 300 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date from"
                inputFormat="yyyy/MM/dd"
                value={dateFrom}
                onChange={handleDate}
                renderInput={(params) => <TextField {...params} />}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch onChange={(e) => setTopheadlines(e.target.checked)} />
              }
              label="TOP HEADLINES"
            />
          </FormGroup>
          <Button
            sx={{ m: 1, width: 150 }}
            color="primary"
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            Search news
          </Button>
          {alert && (
            <Alert severity="error">
              Your search is too broad, please add at least one phrase
            </Alert>
          )}
        </form>
      </div>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {dateFrom === null && articles !== null && (
            <>
              <p className="lasttwo">news in the last 3 days</p>
              <p className="lasttwo" style={{ color: "#80808087" }}>
                If you want specific date please select from date field
              </p>
            </>
          )}
          <div className="newsCard__wrapper">
            <div className="newsCard__container">
              {articles !== null &&
                articles.articles.map((article, i) => (
                  <NewsCard key={i} {...article} />
                ))}
              {articles !== null && articles.articles.length === 0 && (
                <p>There are no news for {phraseNone} on this date.</p>
              )}
            </div>

            {articles !== null && (
              <Button
                className="loadmore__btn"
                variant="outlined"
                color="secondary"
                onClick={handleMore}
              >
                Load more articles
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
