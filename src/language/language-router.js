const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

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
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    if (!req.body.guess) {
      res.status(400).json({ error: `Missing 'guess' in request body` })
    }

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
          const getIncorrectCount = await LanguageService.getIncorrectCountById(
            req.app.get('db'),
            req.body.word_id
          )
          let correctCount = getCorrectCount.correct_count;
          let incorrectCount = getIncorrectCount.incorrect_count;



          const moveWordToPosition = async function (mv, start) {
            try {
              let counter = mv;
              let originalWord = await LanguageService.getWordById(
                req.app.get('db'),
                start.id
              )
              let insertAfter = await LanguageService.getWordById(
                req.app.get('db'),
                start.id
              )
              let i = 0;
              while (i < counter + 1) {
                if (!insertAfter.next) {
                  return insertAfter;
                }
                insertAfter = await LanguageService.getWordById(
                  req.app.get('db'),
                  insertAfter.next
                )
                i++;
              }

              let tempNext = insertAfter.next
              insertAfter.next = originalWord.id
              const change01 = await LanguageService.changeNextOfWord(
                req.app.get('db'),
                originalWord.id,
                tempNext
              )
              const change02 = await LanguageService.changeNextOfWord(
                req.app.get('db'),
                insertAfter.id,
                originalWord.id
              )
            } catch (error) {
              next(error);
            }

          }

          const move02 = await moveWordToPosition(wordToCheck.memory_value, wordToCheck);

          const changeHead = await LanguageService.changeHeadToNext(
            req.app.get('db'),
            wordToCheck.next,
            req.user.id
          )

          const updatedHead = await LanguageService.getWordAtHead(
            req.app.get('db'),
            req.user.id
          )
          
          let outputCorrectGuess = {
            'nextWord': updatedHead.nextWord,
            'wordCorrectCount': correctCount,
            'wordIncorrectCount': incorrectCount,
            'totalScore': totalScore,
            'answer': wordToCheck.translation,
            'isCorrect': true
          }
          res.status(200)
          res.json(outputCorrectGuess)
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
          const getIncorrectCount = await LanguageService.getIncorrectCountById(
            req.app.get('db'),
            req.body.word_id
          )
          let correctCount = getCorrectCount.correct_count;
          let incorrectCount = getIncorrectCount.incorrect_count;
          let totalScore = getTotalScore.total_score;


          const moveWordToPosition = async function (mv, start) {
            try {
              let counter = mv;
              let originalWord = await LanguageService.getWordById(
                req.app.get('db'),
                start.id
              )
              let insertAfter = await LanguageService.getWordById(
                req.app.get('db'),
                start.next
              )

              let tempNext = insertAfter.next
              insertAfter.next = originalWord.id
              const change01 = await LanguageService.changeNextOfWord(
                req.app.get('db'),
                originalWord.id,
                tempNext
              )
              const change02 = await LanguageService.changeNextOfWord(
                req.app.get('db'),
                insertAfter.id,
                originalWord.id
              )
            } catch (error) {
              next(error);
            }
          }
          const moveWord = await moveWordToPosition(wordToCheck.memory_value, wordToCheck);

          const changeHead = await LanguageService.changeHeadToNext(
            req.app.get('db'),
            wordToCheck.next,
            req.user.id
          )
          const updatedHead = await LanguageService.getWordAtHead(
            req.app.get('db'),
            req.user.id
          )
          if(totalScore < 0){
            totalScore = 0
            }
          let outputIncorrectGuess = {
            'nextWord': updatedHead.nextWord,
            'totalScore': totalScore,
            'wordCorrectCount': correctCount,
            'wordIncorrectCount': incorrectCount,
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


// expected {
//   nextWord: 'original 2',
//   totalScore: 0,
//   wordCorrectCount: 0,
//   wordIncorrectCount: 0,
//   answer: 'translation 1',
//   isCorrect: false
// }  
// got {
//   nextWord: 'original 2',
//   totalScore: 0,
//   wordCorrectCount: 0,
//   wordIncorrectCount: 1,
//   answer: 'translation 1',
//   isCorrect: false
// }