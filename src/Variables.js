console.log("process.env.PUBLIC_URL", process.env);

export const variables = {
  API_URL: process.env.REACT_APP_BACKEND_URL, // URL of the backend
  MAIN_COLOR: "#ffd966",
  COLORS: [
    // Colors for the color picker
    { name: "Default", value: "#ffd966" },
    { name: "Blue", value: "#4ca6d8" },
    { name: "Green", value: "#3aa15e" },
    { name: "Red", value: "#d84d42" },
    { name: "Purple", value: "#8b5e9e" },
    { name: "Gray", value: "#eee" },
  ],
  CATEGORIES: [
    // Make sure the values match the backend and are the same words
    { name: "Todo", value: "todo", color: "#ffd966" },
    { name: "Doing", value: "doing", color: "#4ca6d8" },
    { name: "Done", value: "done", color: "#3aa15e" },
  ],
};
