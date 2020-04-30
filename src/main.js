import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortingTemplate} from "./components/sorting";
import {createFilterTemplate} from "./components/filter";
import {createTaskTemplate} from "./components/task";
import {createTaskEditTemplate} from "./components/task-edit";
import {createLoadMoreButtonTemplate} from "./components/load-more-button";
import {createBoardTemplate} from "./components/board";
import {generateFilters} from "./mock/filter";


const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createSortingTemplate(), `afterbegin`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate());
}

render(boardElement, createLoadMoreButtonTemplate());
