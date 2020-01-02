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
      res.status(200)
      res.json(response)
    } catch (error) {
      console.log('caught error')
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    if (!req.body.guess) {
      res.status(400).json({ error: `Missing 'guess' in request body` }).end()
    }
    // if(!req.body.word_id){
    //   res.status(400).json({ error: `Missing 'word_id' in request body` }).end()
    // }

    else if (req.body.guess && req.body.word_id) {
      try {
        const wordToCheck = await LanguageService.getWordById(
          req.app.get('db'),
          req.body.word_id,
        )
        // Actions to take on a correct guess
        if (wordToCheck.translation === req.body.guess.toLowerCase()) {
          const correctTotalScore = await LanguageService.updateTotalScoreCorrect(
            req.app.get('db'),
            req.language.id
          )
          const getTotalScore = await LanguageService.getTotalScoreById(
            req.app.get('db'),
            req.user.id
          )
          let totalScore = getTotalScore.total_score;
          // This function also handles the memoryValue doubling.
          const correctCountIncrease = await LanguageService.updateCorrectCount(
            req.app.get('db'),
            req.body.word_id
          )
          const getCorrectCount = await LanguageService.getCorrectCountById(
            req.app.get('db'),
            req.body.word_id
          )
          let correctCount = getCorrectCount.correct_count;
          let incorrectCount = getCorrectCount.incorrect_count;

          const updatedHead = await LanguageService.getWordAtHead(
            req.app.get('db'),
            req.user.id
          )
          const test = await LanguageService.findWordAtPosition(
            req.app.get('db'),
            req.user.id
          );

          console.log('updated value', wordToCheck.memory_value);

          async function findWordAtPosition(mv, start) {
            let counter = mv;
            let nextWord = await LanguageService.getWordById(
              req.app.get('db'),
              start.id
            )
            let i = 0;
            while (i < counter) {
              if(!nextWord.next){
                return nextWord;
              }
              nextWord = await LanguageService.getWordById(
                req.app.get('db'),
                nextWord.next
              )
              i++;
            }
            return nextWord
          }

          console.log(findWordAtPosition(wordToCheck.memory_value, wordToCheck))

          // const changeHead = await LanguageService.changeHeadToNext(
          //   req.app.get('db'),
          //   wordToCheck.next,
          //   req.user.id
          // )
          let outputCorrectGuess = {
            'nextWord': updatedHead.nextWord,
            'wordCorrectCount': correctCount,
            'incorrectCount': incorrectCount,
            'totalScore': totalScore,
            'answer': wordToCheck.translation,
            'isCorrect': true
          }
          res.status(200)
          res.json(outputCorrectGuess).end()
        }
        //Actions to take on an Incorrect guess
        else if (wordToCheck.translation !== req.body.guess.toLowerCase()) {
          const inCorrectTotalScore = await LanguageService.updateTotalScoreIncorrect(
            req.app.get('db'),
            req.user.id
          )
          const inCorrectCountIncrease = await LanguageService.updateIncorrectCount(
            req.app.get('db'),
            req.body.word_id
          )
          const getTotalScore = await LanguageService.getTotalScoreById(
            req.app.get('db'),
            req.user.id
          )
          const getCorrectCount = await LanguageService.getCorrectCountById(
            req.app.get('db'),
            req.body.word_id
          )
          let correctCount = getCorrectCount.correct_count;
          let incorrectCount = getCorrectCount.incorrect_count;
          let totalScore = getTotalScore.total_score;

          let outputIncorrectGuess = {
            'nextWord': null,
            'wordCorrectCount': correctCount,
            'incorrectCount': incorrectCount,
            'totalScore': totalScore,
            'answer': wordToCheck.translation,
            'isCorrect': false
          }
          res.status(200)
          res.json(outputIncorrectGuess)
        }
      } catch (error) {
        next(error)
      }

    }
  })

module.exports = languageRouter
