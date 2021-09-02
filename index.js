import Express, {request, response} from 'express';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import Stats from './handlers/Stats.js';
import CallResult from './handlers/CallResult.js';
import { onlyDigits } from './handlers/checking.js';
import uploadConfig from './handlers/upload.js';

export default () => {
  const app = new Express();

  app.set('view engine', 'pug');
  app.use('/uploads', Express.static('uploads'))
  app.use(bodyParser.urlencoded({ extended: true }));

  //главная страница с меню с включенными ссылками на маршруты
  app.get('/', (request, response) => {
    response.render('index');
  });

  //выводим форму для заполнения статов новыми данными
  app.get('/setHeroStats', (request, response) => {
    const form = [];
    response.render('forms/setstats', { form });
  })

  //здесь проверяем введенные данные 
  app.post('/setHeroStats', (request, response) => {
    const { name, strength, dexterity, intellect, isInvincible } = request.body;
        
    if (!onlyDigits(strength) || !onlyDigits(dexterity) || !onlyDigits(intellect) || name === '') {
      response.status(400).json(new CallResult('FAIL', 'invalid data type'));
    } else {
      const stats = new Stats(name, strength, dexterity, intellect, isInvincible);

      //и перезаписываем файл данных персонажа
      fs.writeFile('./data/statsOfHero.json', JSON.stringify(stats))
        .then(result => {
          const res = new CallResult('OK', 'data updated successfully');
          response.json(res);
        })
        .catch(err => {
          const res = new CallResult('FAIL', 'file write error');
          response.json(res);
        })
    }
  })

  //маршрут для вывода данных персонажа в json-файле
  app.get('/getHeroStats', (request, response) => {
    fs.readFile('./data/statsOfHero.json')
      .then(data => {
        const result = JSON.parse(data);
        response.send(result);
      })
      .catch(err => response.send('error of reading file'))
  })

  //форма загрузки аватарки
  app.get('/uploadHeroImage', (request, response) => {        
    response.render('forms/uploadimage');
  })

  app.post('/uploadHeroImage', uploadConfig.single('image'), (request, response) => {
    console.log(request.body);
    console.log(request.file);
    response.send('file was uploaded <p><a href="/"> back to main page');
  })

  //маршрут для отображения аватарки персонажа
  app.get('/getHeroImage', (request, response) => {
    response.render('forms/getimage');
  })

  return app;
}
