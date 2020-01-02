const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getWordAtHead(db, user_id) {
    let head = db.select('head')
      .from('language')
      .where({ 'user_id': user_id })
    return db
      .select(
        'original AS nextWord',
        'total_score AS totalScore',
        'correct_count AS wordCorrectCount',
        'incorrect_count AS wordIncorrectCount',
      )
      .from('word')
      .join('language', `word.language_id`, '=', `language.user_id`)
      .where({ language_id: user_id, 'word.id': head })
      .first()
  },
  getWordById(db, word_id) {
    return db
      .select(
        'id',
        'original',
        'translation',
        'memory_value',
        'next'
      )
      .from('word')
      .where({ id: word_id })
      .first()
  },

  // This is supposed to update the Users Total Score
  updateTotalScoreCorrect(db, language_id) {
    return db.raw(`UPDATE language SET total_score = total_score + 1 WHERE user_id = ? `, [language_id])
  },
  updateTotalScoreIncorrect(db, language_id) {
    return db.raw(`UPDATE language SET total_score = total_score - 1 WHERE user_id = ? `, [language_id])
  },
  // Updating the correct count and memory value on the words table
  updateCorrectCount(db, word_id) {
    return db.raw(`UPDATE word SET correct_count = correct_count + 1 , memory_value = memory_value + memory_value WHERE id = ?`, [word_id])
  },
  updateIncorrectCount(db, word_id) {
    return db.raw(`UPDATE word SET incorrect_count = incorrect_count + 1 , memory_value = 1 WHERE id = ?`, [word_id])
  },
  getTotalScoreById(db, user_id) {
    return db
      .select('total_score').from('language').where({ 'user_id': user_id }).first()
  },
  getCorrectCountById(db, word_id) {
    return db
      .select('correct_count').from('word').where({ 'id': word_id }).first()
  },
  getIncorrectCountById(db, word_id) {
    return db
      .select('incorrect_count').from('word').where({ 'id': word_id }).first()
  },
  changeHeadToNext(db, next, user_id) {
    return db('language')
      .where({ 'user_id': user_id })
      .update({ 'head': next })
  },
  changeNextOfWord(db, word_id, next){
    return db('word')
      .where({'id': word_id})
      .update({'next': next})
  }
  // findWordAtPosition(db, user_id) {
  //   let currNode = db.select('head')
  //     .from('language')
  //     .where({ 'user_id': user_id })
  //   let userWords = db
  //     .select(
  //       'word.id',
  //       'translation',
  //       'memory_value',
  //       'head',
  //       'next'
  //     )
  //     .from('word')
  //     .join('language', `word.language_id`, '=', `language.user_id`)
  //     .where({ language_id: user_id })
  //   return userWords;
  // }
}

module.exports = LanguageService
