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
  getNextWord(db, language_id, user_id){
    return db       
      .select(
      'original as nextWord',
      'total_score as totalScore',
      'correct_count as wordCorrectCount',
      'incorrect_count as wordIncorrectCount'
      )
      .from('word')
      .join('language', `word.language_id` , '=', `language.user_id`)
      .where({language_id: user_id})
  },
  // This is supposed to update the Users Total Score 
  // TODO:  id is being hard coded. Find a way to make that flexible
  updateTotalScoreCorrect(db, language_id){
    return db.raw(`UPDATE language SET total_score = total_score + 1 WHERE user_id = ? `,[language_id])
  },  
  updateTotalScoreIncorrect(db, language_id){
    return db.raw(`UPDATE language SET total_score = total_score - 1 WHERE user_id = ? `,[language_id])
  },
  // Updating the correct count on the words table
  //TODO id is still hard coded
  updateCorrectCount(db, word_id){
    return db.raw(`UPDATE word SET correct_count = correct_count + 1 , memory_value = memory_value + memory_value WHERE id = ?`,[word_id])
  },
  updateIncorrectCount(db, word_id){
    return db.raw(`UPDATE word SET incorrect_count = incorrect_count - 1 , memory_value = 1 WHERE id = ?`,[word_id])
  },
}

module.exports = LanguageService
