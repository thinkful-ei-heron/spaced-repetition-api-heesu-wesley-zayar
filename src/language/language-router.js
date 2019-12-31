const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const LinkedList = require('../util/linkedListClass');

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const response = await LanguageService.getNextWord(
        req.app.get('db'),
        req.language.id,
        req.user.id,
      )
      res.status(200)
      res.json(response[0])
    } catch (error) {
      console.log('caught error')
      next(error)
    }
  })



// using word_id: 18, hoodie, capucha as test input
languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {

    // Expect in req.body "Guess" and "word ID"
    //Verifies that there is a guess in the request body
    if (!req.body.guess) {
      res.status(400).json({ error: `Missing 'guess' in request body` }).end()
    }
    else if (req.body.guess && req.body.word_id) {
      try {
        const listItems = await LanguageService.getLanguageWords(
          req.app.get('db'),
          req.language.id,
        )
        let listOfWords = new LinkedList.LinkedList();
        for (let i = 0; i < listItems.length; i++) {
          listOfWords.insertFirst(listItems[i]);
        }
        // find in the linked list (word ID)
        let correctAnswer = listOfWords.find('original', req.body.original);
        let userAnswer = req.body.guess;
        // Compare this to the correct value in the database
        if (correctAnswer.translation === userAnswer.toLowerCase()) {
          console.log('thats correct!')
          const correctTotalScore = await LanguageService.updateTotalScoreCorrect(
            req.app.get('db'),
          )
          const correctCountIncrease = await LanguageService.updateCorrectCount(
            req.app.get('db'),
          )
          res.status(200)
          res.json({message: 'this is correct'})
        }

        // update correct and incorrect
        // update total
        // response 

      } catch (error) {
        next(error)
      }

    }
  })

module.exports = languageRouter
