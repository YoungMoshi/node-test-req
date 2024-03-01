const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware для парсинга JSON в теле запроса
app.use(express.json());

// Обработчик POST-запроса для обновления свойства signal в JSON-файле пользователя
app.post('/updateUserSignal', (req, res) => {
  // Проверяем, есть ли userid в теле запроса
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).send('UserId is required');
  }

  // Путь к JSON-файлу пользователя
  const userFilePath = path.join(__dirname, 'userdata', `${userId}.json`);

  // Проверяем, существует ли файл пользователя
  if (!fs.existsSync(userFilePath)) {
    return res.status(404).send('User not found');
  }

  // Читаем JSON-файл пользователя
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user data');
    }

    // Парсим JSON
    const userData = JSON.parse(data);

    // Обновляем свойство signal на true
    userData.signal = true;

    // Записываем обновленные данные обратно в файл
    fs.writeFile(userFilePath, JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(500).send('Error updating user data');
      }
      console.log("updated!");
      return res.status(200).send('User signal updated successfully');
    });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
