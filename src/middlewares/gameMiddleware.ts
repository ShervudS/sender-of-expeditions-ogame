import { gameService } from "../games";

export const gameMiddleware = async () => {
  let timer = 0;

  await gameService(timer);

  async function task() {
    if (timer >= Date.now()) {
      await gameService(timer);
    }

    // Запускаем задачу через 10 минут
    setTimeout(task, 10 * 60 * 1000);
  }

  // Запускаем задачу
  task();
};
