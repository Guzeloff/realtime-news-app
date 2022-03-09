import React from "react";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from "moment";

function NewsCard(article) {
  let date = new Date(article.publishedAt);
  date = date.toISOString().split("T")[0];
  return (
    <div className="newsCard__single">
      <h3>{article.title}</h3>
      <a href={article.url} target="_blank">
        <img src={article.urlToImage} alt="image from trending news" />
      </a>
      <p
        dangerouslySetInnerHTML={{ __html: article.description }}
        className="newscard__desc"
      ></p>
      <a
        href={article.url}
        target="_blank"
        style={{ marginBottom: "15px", color: "#1976d2" }}
      >
        read more
      </a>
      <div className="newscard__end">
        <p style={{ textAlign: "center", fontSize: "15px", color: "#e91e63" }}>
          <CalendarTodayIcon fontSize="small" /> {moment(date).fromNow()}
        </p>
      </div>
    </div>
  );
}

export default NewsCard;
