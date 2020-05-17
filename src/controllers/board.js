import LoadMoreButtonComponent from "../components/load-more-button";
import TaskEditComponent from "../components/task-edit.js";
import TaskComponent from "../components/task.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks";
import SortComponent from "../components/sort";
import {remove, render, RenderPosition, replace} from "../utils/render";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape`) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const editButtonClickHandler = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const taskSubmitHandler = (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);
  taskEditComponent.setSubmitHandler(taskSubmitHandler);

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  tasks.slice(0, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  const loadMoreButtonClickHandler = () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  };

  loadMoreButtonComponent.setClickHandler(loadMoreButtonClickHandler);
  render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(this._container, tasks);
  }
}
