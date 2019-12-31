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
      const response = await LanguageService.getWordAtHead(
        req.app.get('db'),
        req.user.id,
      )
      // let score = await LanguageService.getTotalScore(
      //   req.app.get('db'),
      //   req.user.id,
      // )
      res.status(200)
      //TODO: This needs to look at the LANGUAGE table and get the id of the HEAD then go to the WORD table and present the word with that id
      res.json(response)
    } catch (error) {
      console.log('caught error')
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {

    // Expect in req.body "Guess" and "word ID" and "original"
    // Verifies that there is a guess in the request body
    if (!req.body.guess) {
      res.status(400).json({ error: `Missing 'guess' in request body` }).end()
    }
    else if (req.body.guess && req.body.word_id) {
      try {
        // TODO: get the word that matches the id and assign it to a local variable to compare
        const wordAtHead = await LanguageService.getLanguageWords(
          req.app.get('db'),
          req.body.word_id,
        )

        // Actions to take on a correct guess
        if (correctAnswer.translation === userAnswer.toLowerCase()) {

          // correct_count++
          // total_score ++
          // memory_value = memory_value + memory_value
          

          // sort local list by memory_value
          // updating the "next" property.
          // update the db list "next" values to match the local list

          const correctTotalScore = await LanguageService.updateTotalScoreCorrect(
            req.app.get('db'),
            req.language.id
          )
          //updated the correct count AND memory Value
          const correctCountIncrease = await LanguageService.updateCorrectCount(
            req.app.get('db'),
            req.body.word_id
          )

          res.status(200)
          res.json({ message: 'this is correct' })
        }
        else if (correctAnswer.translation !== userAnswer.toLowerCase()) {

          const inCorrectTotalScore = await LanguageService.updateTotalScoreIncorrect(
            req.app.get('db'),
            req.language.id
          )
          const inCorrectCountIncrease = await LanguageService.updateIncorrectCount(
            req.app.get('db'),
            req.body.word_id
          )
          res.status(200)
          res.json({ message: 'this is Incorrect' })
        }
      } catch (error) {
        next(error)
      }

    }
  })

module.exports = languageRouter
