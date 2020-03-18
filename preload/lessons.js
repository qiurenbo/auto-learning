const { ipcRenderer } = require("electron");
const { sleep } = require("./utils");

const isUnfinishedLesson = $lesson => {
  if (!$lesson) return false;
  if (
    $lesson
      .find("td")
      .eq(4)
      .text() !== "已学完"
  ) {
    return true;
  }
};

const getLessonClickButton = $lesson => {
  if (!$lesson) {
    throw new Error("lesson should be not null.");
  }
  return $lesson.find("td > a").first();
};

const getLessonName = $lesson => {
  return getLessonClickButton($lesson).text();
};

const gotoLessonsLearningPage = $lesson => {
  ipcRenderer.send(
    "log",
    "Lesson " + getLessonName($lesson) + " will be clicked."
  );

  // https://stackoverflow.com/questions/17105015/a-triggerclick-not-working/17105042
  getLessonClickButton($lesson)
    .get(0)
    .click();
};

const autoWatchVideo = async $lesson => {
  // Remove blur and focus
  ipcRenderer.send("killBlurFocus", "kill blur and focus");

  await sleep(5000);

  ipcRenderer.send("log", "Lesson has been finished.");
};

const getUnfinishedLesson = () => {
  const $lessons = $("tr").slice(1);

  for (let i = 0; i < $lessons.length; i++) {
    const $lesson = $lessons.eq(i);

    const lessonName = getLessonName($lesson);
    console.log($lesson);
    console.log(lessonName);
    if (isUnfinishedLesson($lesson)) {
      ipcRenderer.send("log", "Lesson " + lessonName + " is unfinished.");
      return $lesson;
    } else {
      ipcRenderer.send(
        "log",
        "Lesson " + lessonName + " has been already finished."
      );
    }
  }

  return null;
};

module.exports = {
  gotoLessonsLearningPage,
  getUnfinishedLesson,
  autoWatchVideo
};
