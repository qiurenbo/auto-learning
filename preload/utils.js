const { ipcRenderer } = require("electron");

const goback = () => {
  window.history.back();
};

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

module.exports = { goback, sleep };
