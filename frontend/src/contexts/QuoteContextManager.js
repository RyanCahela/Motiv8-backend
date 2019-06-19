import React from 'react';
import QuoteDisplay from '../components/QuoteDisplay';
import QuoteControls from '../components/QuoteControls';
import fontPairings from '../fonts/fontPairings';
import quotes from '../quotes/quotes';
import IteratorServices from '../services/IteratorServices';

const QuoteContext = React.createContext();

class QuoteContextManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      quotes: [...quotes],
      currentQuote: '',
      backgroundImageUrls: [],
      fontPairings: [...fontPairings],
      backgroundImageUrl: '',
      fontPair: {},
      previousBackgroundImageUrl: '',
      previousFontPair: {},
      keepBackground: false,
      keepFonts: false,
      keepQuote: false,
    }

    this.handleRandomize = this.handleRandomize.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleCheckboxCheck = this.handleCheckboxCheck.bind(this);
  }


  componentDidMount() {
    this.getBackgroundImages(30)
      .then()
    this.fontPairItObj = IteratorServices.createIterator(this.state.fontPairings);
    this.quoteItObj = IteratorServices.createIterator(this.state.quotes);
  }
  
  handleRandomize() {
    if(!this.state.keepBackground) {
      this.iterateBackgroundUrl(this.backgroundUrlItObj.next());
    }
    if(!this.state.keepFonts) {
      this.iterateFontPairing(this.fontPairItObj.next());
    }
    if(!this.state.keepQuote) {
      this.iterateQuote(this.quoteItObj.next());
    }
  }
  
  handleUndo() {
    if(!this.state.keepBackground) {
      this.setState((currentState) => {
        return {
          backgroundImageUrl: currentState.previousBackgroundImageUrl,
          previousBackgroundImageUrl: currentState.backgroundImageUrl
        }
      })
    }

    if(!this.state.keepFonts) {
      this.setState((currentState) => {
        return {
          fontPair: currentState.previousFontPair,
          previousFontPair: currentState.fontPair
        }
      })
    }

    if(!this.state.keepQuote) {
      this.setState((currentState) => {
        return {
          currentQuote: currentState.previousQuote,
          previousQuote: currentState.currentQuote
        }
      })
    }
  }

  handleSaveQuote() {
    //TODO sends current quote config to favorites db table.
  }

  handleCheckboxCheck(e) {
    switch(e.target.id) {
      case 'keep-quote-checkbox':
        this.setState((currentState) => {
          return {
            keepQuote: !currentState.keepQuote
          }
        });
        break;
      case 'keep-fonts-checkbox':
        this.setState((currentState) => {
          return {
            keepFonts: !currentState.keepFonts
          }
        });
        break;
      case 'keep-background-checkbox':
        this.setState((currentState) => {
          return {
            keepBackground: !currentState.keepBackground
          }
        })
        break;
      default:
        console.log('Something went wrong with the switch');
    }
  }
  
  //HELPER FUNCTIONS
  getBackgroundImages(numberOfImages) {
    if(numberOfImages > 30) {
      numberOfImages = 30;
    }
    fetch(`https://api.unsplash.com/photos/random?count=${numberOfImages}`, {
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_API_KEY}`
      }
    })
    .then(res => res.json())
    .then(resJson => {
      this.setState({
        backgroundImageUrls: resJson,
      },
      //runs after setState
      () => {
        this.backgroundUrlItObj = IteratorServices.createIterator(this.state.backgroundImageUrls)
        this.handleRandomize();
      })
    });
  }
  
  iterateBackgroundUrl({value, done}) {
    if(!done) {
      this.setState((currentState) => {
        return {
          backgroundImageUrl: value.urls.regular,
          previousBackgroundImageUrl: currentState.backgroundImageUrl
        }
      })
    }
    //create new iterator when old one runs out
    else {
      this.getBackgroundImages(30)
    }
  }
  
  iterateFontPairing({value, done}) {
    if(!done) {
      this.setState((currentState) => {
        return {
          fontPair: value,
          previousFontPair: currentState.fontPair 
        }
      })
    }
    else {
      //if iterator done create new iterator then call the first value on it.
      this.fontPairItObj = IteratorServices.createIterator(this.state.fontPairings);
      this.iterateFontPairing(this.fontPairItObj.next());
    }
  }
  
  iterateQuote({value, done}) {
    if(!done) {
      this.setState(currentState => {
        return {
          currentQuote: value,
          previousQuote: currentState.currentQuote
        }
      })
    }
    else {
      this.quoteItObj = IteratorServices.createIterator(this.state.quotes);
      this.iterateQuote(this.quoteItObj.next());
    }
  }

  render() {

    const quoteContext = {
      state: this.state,
      methods: {
        handleCheckboxCheck: this.handleCheckboxCheck,
        handleRandomize: this.handleRandomize,
        handleUndo: this.handleUndo,
        handleSaveQuote: this.handleSaveQuote
      }
    }

        
    return (
      <QuoteContext.Provider value={quoteContext}>
        {this.props.children}
      </QuoteContext.Provider>
    );
  }
}
export { QuoteContext , QuoteContextManager };