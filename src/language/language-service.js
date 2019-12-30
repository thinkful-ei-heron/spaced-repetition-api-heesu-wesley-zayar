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
  }
}

module.exports = LanguageService
