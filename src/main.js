import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import TasksModel from "./models/tasks";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render, RenderPosition} from "./utils/render";

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMenuComponent = new SiteMenuComponent();
const filterComponent = new FilterComponent(filters);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteMainElement, filterComponent, RenderPosition.BEFOREEND);
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
