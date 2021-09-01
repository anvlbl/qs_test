import Express, {request, response} from 'express';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import Stats from './handlers/Stats.js';
import CallResult from './handlers/CallResult.js';
import { onlyDigits } from './handlers/checking.js';

const stats = {};

export default () => {
    const app = new Express();

    app.set('view engine', 'pug');
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (request, response) => {
        response.render('index');
    });

    //выводим форму для заполения статов новыми данными
    app.get('/setHeroStats', (request, response) => {
        const form = [];
        response.render('forms/setstats', { form });
    })

    app.post('/setHeroStats', (request, response) => {
        const { name, strength, dexterity, intellect, isInvincible } = request.body;

        //проверку имени делать не стал, т.к. вводимые данные - строка по умолчанию
        if (!onlyDigits(strength) || !onlyDigits(dexterity) || !onlyDigits(intellect) || name === '') {
            response.status(400).json(new CallResult('FAIL', 'invalid data type'));
        } else {
        const stats = new Stats(name, strength, dexterity, intellect, isInvincible);

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

    app.get('/getHeroStats', (request, response) => {
        fs.readFile('./data/statsOfHero.json')
          .then(data => {
              const result = JSON.parse(data);
              response.send(result);
          })
          .catch(err => response.send('error of reading file'))
    })

    app.get('/uploadHeroImage', (request, response) => {        
        response.render('forms/uploadimage');
    })

    return app;
}
