const { ipcRenderer } = require("electron");

const isUnfinishedCourse = $course => {
  if (!$course) return false;
  if (
    $course
      .find("td")
      .eq(4)
      .text() !== "已学完"
  ) {
    return true;
  }
};

const getCourseClickButton = $course => {
  if (!$course) {
    throw new Error("course should be not null.");
  }
  return $course.find("td>a").first();
};

const getCourseName = $course => {
  return getCourseClickButton($course).text();
};
const gotoLessonsList = $course => {
  ipcRenderer.send(
    "log",
    "Course " + getCourseName($course) + " will be clicked."
  );

  // https://stackoverflow.com/questions/17105015/a-triggerclick-not-working/17105042
  getCourseClickButton($course)
    .get(0)
    .click();
};

const getUnfinishedCourse = () => {
  const $courses = $("tr").slice(1);

  for (let i = 0; i < $courses.length; i++) {
    const $course = $courses.eq(i);

    const courseName = getCourseName($course);
    console.log($course);
    console.log(courseName);
    if (isUnfinishedCourse($course)) {
      ipcRenderer.send(
        "log",
        "Course " + courseName + " will be learned right now."
      );
      return $course;
    } else {
      ipcRenderer.send(
        "log",
        "Course " + courseName + " has been already finished."
      );
    }
  }

  return null;
};

module.exports = { gotoLessonsList, getUnfinishedCourse };
