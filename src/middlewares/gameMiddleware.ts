import { gameService } from "../games";

export const gameMiddleware = async () => {
  let timer: number = 0;
  // Время на повторный запуск задачи / через 5 минут
  const delay = 5 * 60 * 1000;

  timer = await gameService();

  async function task() {
    const date = Date.now();
    console.log(`Rest of timer >>`, timer - date);

    console.log("Time", timer, date, timer - date <= 0);
    if (timer - date <= 0) {
      timer = await gameService();
    }
    setTimeout(task, delay);
  }

  // Запускаем задачу
  task();
};
