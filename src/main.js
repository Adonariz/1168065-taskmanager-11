import BoardComponent from "./components/board.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import TaskEditComponent from "./components/task-edit.js";
import TaskComponent from "./components/task.js";
import TasksComponent from "./components/tasks.js";
import NoTasksComponent from "./components/no-tasks";
import SiteMenuComponent from "./components/site-menu.js";
import SortComponent from "./components/sort.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape`) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};


const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  tasks.slice(0, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  const onLoadMoreButtonClick = () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  };

  loadMoreButtonComponent.getElement().addEventListener(`click`, onLoadMoreButtonClick);
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
};

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const boardComponent = new BoardComponent();
const siteMenuComponent = new SiteMenuComponent();
const filterComponent = new FilterComponent(filters);

render(siteHeaderElement, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, filterComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
