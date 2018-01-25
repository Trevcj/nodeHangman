var inquirer = require('inquirer');
var fs = require("fs");
var text = fs.readFileSync("./wordBank.txt");
var Word = require('./word.js');

var text = fs.readFileSync("./wordBank.txt").toString('utf-8');
var wordArr = text.split(",")
// console.log(wordArr);

var game = {
  wordBank: wordArr,
  guessesRemaining: 10,
  guessedLetters: [],
  display: 0,
  currentWord: null,
  startGame: function() {
    var that = this;
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "start",
      type: "confirm",
      message: "Would you like to start?"
    }]).then(function(answer) {
      if(answer.start){
        that.newGame();
      } else{
        console.log("");
        console.log("Okay.....then why are you here?");
      }
    });},
  
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Darn, I was hoping you didn't want to.");
      console.log('-------------------------------------');
      console.log("");
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum].toUpperCase());
      this.currentWord.formWord();
      
      console.log(this.currentWord.wordRender());
      console.log("");
      this.choose_a_Letter();
    } else{
      this.setGuesses();
      this.newGame();
    }
  },
  setGuesses: function() {
    this.guessesRemaining = 10;
  },
  choose_a_Letter : function(){
    var that = this;
     inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Guess a letter: ",
      validate: function(value) {
        if((value).length > 1){
          return false;
        } else{
          return true;
        }
      }
    }]).then(function(ltr) {
     
      var userLetter = (ltr.chosenLtr).toUpperCase();
      var guessedLetters = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(userLetter === that.guessedLetters[i]){
            guessedLetters = true;
          }
        }
        
        if(guessedLetters === false){
          that.guessedLetters.push(userLetter);

          var findLetter = that.currentWord.correctLetter(userLetter);
          
          if(findLetter === 0){
            console.log('Ha Ha Ha WRONG!!!');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);
            

            console.log('\n---------------------');
            console.log(that.currentWord.wordRender());
            console.log('\n---------------------');

            console.log("Letters guessed: " + that.guessedLetters);
          } else{
            console.log('Finally did something right.');
              
              if(that.currentWord.correctWord() === true){
                console.log(that.currentWord.wordRender());
                console.log("Congratulations......To me! I don't have to play with you anymore!");
                
              } else{
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n---------------------');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.choose_a_Letter();
          }else if(that.guessesRemaining === 0){
            console.log('YAY! Game over!');
            console.log('The word you were trying to guess was: ' + that.currentWord.word + ", really not that hard.");
          }
        } else{
            console.log("Already tried that one.....");
            that.choose_a_Letter();
          }
    });
  }
};

game.startGame();