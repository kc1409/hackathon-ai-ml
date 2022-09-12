const express = require("express");
const natural = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopWord = require("stopword");

const router = express.Router();

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

router.post("/sentiment-analyzer", function (req, res, next) {
  const { review } = req.body;
  const processedReview = review.toLowerCase().replace(/[^a-zA-Z\s]+/g, "");

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(processedReview);

  tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
  });

  const filteredReview = stopWord.removeStopwords(tokenizedReview);

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  const analysis = analyzer.getSentiment(filteredReview);

  res.status(200).json({ analysis });
});

module.exports = router;
