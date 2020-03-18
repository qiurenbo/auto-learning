const { ipcRenderer } = require("electron");
const { getUnfinishedCourse, gotoLessonsList } = require("./courses");
const {
  gotoLessonsLearningPage,
  getUnfinishedLesson,
  autoWatchVideo
} = require("./lessons");
const { goback, sleep } = require("./utils");

ipcRenderer.send("log", "current url:" + location.href);

const importJquery = () => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
  document.getElementsByTagName("head")[0].appendChild(script);
};

window.onload = async function() {
  // Use Jquery
  importJquery();

  if ("http://zy.jxkp.net/Person" === location.href) {
    ipcRenderer.send("log", "Loging successfully");

    const $course = getUnfinishedCourse();
    if ($course) {
      gotoLessonsList($course);
      ipcRenderer.send("log", "Go into Lessons.");
    }
  } else if (location.href.search("http://zy.jxkp.net/Person/MyKjs") !== -1) {
    ipcRenderer.send("log", "Now find unfinished Lessons.");
    const $lesson = getUnfinishedLesson();
    console.log($lesson);
    if ($lesson) {
      gotoLessonsLearningPage($lesson);
    } else {
      ipcRenderer.send(
        "log",
        "All Lessons have been learned. Now go back to courses list."
      );
      goback();
    }
  } else if (location.href.search("http://zy.jxkp.net/Person/Play") !== -1) {
    await autoWatchVideo();
    ipcRenderer.send("log", "Finish lesson, now go back to lessons list.");
    goback();
  }
};
