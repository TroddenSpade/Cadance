import { faCommon, faLevelTitles, faMetadata } from './common';
import { GUIDE_FA } from '../../data/guides';
import { faMeta } from './meta';
import { faDashboard } from './dashboard';
import { faCourses } from './courses';
import { faLesson } from './lesson';
import { faPractice } from './practice';
import { faTrainer } from './trainer';
import { faTools } from './tools';
import { faRepertoire } from './repertoire';
import { faMetronome } from './metronome';
import { faTuner } from './tuner';
import { faSettings } from './settings';
import { faExerciseUi } from './exercises';
import { faExercisePrompts, faExercisePromptsPartTwo } from './exercisePrompts';
import { faMusicTerms } from './music';
import faLevels from './content/levels.json';
import faCoursesContent from './content/courses.json';
import faLessonsContent from './content/lessons.json';
import faExerciseContent from './content/exercises.json';
import faSkills from './content/skills.json';
import sec01 from './content/sections/sec-01.json';
import sec02 from './content/sections/sec-02.json';
import sec03 from './content/sections/sec-03.json';
import sec04 from './content/sections/sec-04.json';
import sec05 from './content/sections/sec-05.json';
import sec06 from './content/sections/sec-06.json';
import sec07 from './content/sections/sec-07.json';
import sec08 from './content/sections/sec-08.json';
import sec09 from './content/sections/sec-09.json';
import sec10 from './content/sections/sec-10.json';
import sec11 from './content/sections/sec-11.json';
import sec12 from './content/sections/sec-12.json';
import sec13 from './content/sections/sec-13.json';
import sec14 from './content/sections/sec-14.json';
import sec15 from './content/sections/sec-15.json';
import demo01 from './content/demos/demo-01.json';
import demo02 from './content/demos/demo-02.json';
import demo03 from './content/demos/demo-03.json';
import demo04 from './content/demos/demo-04.json';
import demo05 from './content/demos/demo-05.json';
import demo06 from './content/demos/demo-06.json';
import demo07 from './content/demos/demo-07.json';
import demo08 from './content/demos/demo-08.json';
import demo09 from './content/demos/demo-09.json';
import demo10 from './content/demos/demo-10.json';
import demo11 from './content/demos/demo-11.json';
import demo12 from './content/demos/demo-12.json';
import demo13 from './content/demos/demo-13.json';
import demo14 from './content/demos/demo-14.json';

/** Every Persian string, keyed by the exact English display text. */
export const fa: Record<string, string> = {
  ...faCommon,
  ...faLevelTitles,
  ...faMetadata,
  ...faMeta,
  ...faDashboard,
  ...faCourses,
  ...faLesson,
  ...faPractice,
  ...faTrainer,
  ...faTools,
  ...faRepertoire,
  ...faMetronome,
  ...faTuner,
  ...faSettings,
  ...faExerciseUi,
  ...faExercisePrompts,
  ...faExercisePromptsPartTwo,
  ...faMusicTerms,
  ...GUIDE_FA,
  ...faLevels,
  ...faCoursesContent,
  ...faLessonsContent,
  ...faExerciseContent,
  ...faSkills,
  ...sec01,
  ...sec02,
  ...sec03,
  ...sec04,
  ...sec05,
  ...sec06,
  ...sec07,
  ...sec08,
  ...sec09,
  ...sec10,
  ...sec11,
  ...sec12,
  ...sec13,
  ...sec14,
  ...sec15,
  ...demo01,
  ...demo02,
  ...demo03,
  ...demo04,
  ...demo05,
  ...demo06,
  ...demo07,
  ...demo08,
  ...demo09,
  ...demo10,
  ...demo11,
  ...demo12,
  ...demo13,
  ...demo14,
};
