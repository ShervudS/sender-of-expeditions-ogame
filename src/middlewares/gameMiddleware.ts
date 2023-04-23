import { gameService } from "../games";

export const gameMiddleware = async () => {
  let timer: number = 0;

  timer = await gameService();

  async function task() {
    const date = Date.now();
    console.log(`different >>`, timer - date);

    if (timer - date <= 0) {
      timer = await gameService();
    }

    // Запускаем задачу через 10 минут
    setTimeout(task, 10 * 60 * 1000);
  }

  // Запускаем задачу
  task();
};
