import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Search from './components/Search.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from './components/Main.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SingleRestaurant from './components/SingleRestaurant.jsx';
import SearchList from './components/SearchList.jsx';
import Footer from './components/footer.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      tenSearchResults: [],
      restaurant: [],
      priceFilterOne: true,
      priceFilterTwo: true,
      priceFilterThree: true,
      priceFilterFour: true,
    };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleSearchListClick = this.handleSearchListClick.bind(this);
    this.selectRestaurant = this.selectRestaurant.bind(this);
    this.handlePriceFilterClick = this.handlePriceFilterClick.bind(this);
  }

  handleSearchInputChange(e) {
    this.setState({ searchInput: e.target.value });
    console.log(e.target.value);
  }

  handleSearchButtonClick() {
    const _this = this;
    let prices = [
      this.state.priceFilterOne ? '1' : '',
      this.state.priceFilterTwo ? '2' : '',
      this.state.priceFilterThree ? '3' : '',
      this.state.priceFilterFour ? '4' : '',
    ].filter(item => item !== '').join(', ');
    prices = prices === '' ? '1, 2, 3, 4' : prices;

    console.log(`doing axios call with search input: ${this.state.searchInput} and prices ${prices}`);
    axios.get(`/search/${this.state.searchInput}/${prices}`)
      .then((response) => {
        _this.setState({ tenSearchResults: response.data });
        console.log('the top 10 search results: ', _this.state.tenSearchResults);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSearchListClick(entry) {
    console.log('you just clicked ', entry);
    this.setState({
      restaurant: entry,
    });
  }

  selectRestaurant(restaurant) {
    console.log('selected: ', restaurant);
    this.setState({
      restaurant: restaurant,
    });
  }

  handlePriceFilterClick(price) {
    if (price === '$') { this.setState({ priceFilterOne: !this.state.priceFilterOne }, () => this.handleSearchButtonClick()); }
    if (price === '$$') { this.setState({ priceFilterTwo: !this.state.priceFilterTwo }, () => this.handleSearchButtonClick()); }
    if (price === '$$$') { this.setState({ priceFilterThree: !this.state.priceFilterThree }, () => this.handleSearchButtonClick()); }
    if (price === '$$$$') { this.setState({ priceFilterFour: !this.state.priceFilterFour }, () => this.handleSearchButtonClick()); }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <TopNavbar />
          </div>
          <Route path="/" render={() => (
            <Search
              searchInput={this.state.searchInput}
              priceFilterOne={this.state.priceFilterOne}
              priceFilterTwo={this.state.priceFilterTwo}
              priceFilterThree={this.state.priceFilterThree}
              priceFilterFour={this.state.priceFilterFour}
              handleSearchInputChange={this.handleSearchInputChange}
              handleSearchButtonClick={this.handleSearchButtonClick}
              handlePriceFilterClick={this.handlePriceFilterClick}
            />
          </div>
          <Route exact={true} path="/" render={() => <Main selectRestaurant={this.selectRestaurant} />} />
          <Route path="/restaurant" render={() => <SingleRestaurant restaurant={this.state.restaurant} />} />
          <Route path="/searchList" render={() => <SearchList tenSearchResults={this.state.tenSearchResults} handleSearchListClick={this.handleSearchListClick} />} />
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>
  , document.getElementById('app'),
);
