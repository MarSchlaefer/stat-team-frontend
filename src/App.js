import React, { Component } from 'react';
import './App.css';
import SignIn from './components/signIn'
import Client from './components/client/client'
import Admin from './components/admin/admin'

class App extends Component {

  constructor() {
    super()
    this.state = {
      game: [],
      signIn: "",
      keyPress: "",
      currentPlays: [],
      possession: "H",
      period: "Period 1",
      intervalId: 0,
      minutes: 20,
      seconds: 0
    }
  }

  componentDidMount() {
    this.getGame()
  }

  render() {
    const minutes = this.formatNum(this.state.minutes)
    const seconds = this.formatNum(this.state.seconds)
    return (
      <div className="App">
        {this.renderContent(minutes, seconds)}
      </div>
    );
  }

  renderContent = (minutes, seconds) => {
    if (this.state.signIn === "admin") {
      return <div className="employee">
        <Admin
          resetTimer={this.resetTimer}
          startClicked={this.startClicked}
          period={this.state.period}
          possession={this.state.possession}
          minutes={minutes}
          seconds={seconds}
          gameDetails={this.state.game}
          editGameDetails={this.getGame}
          currentPlay={this.currentPlay}
          currentPlays={this.state.currentPlays}
          changePossession={this.changePossession}
          changePeriod={this.changePeriod}
          />
      </div>
    } else if (this.state.signIn === "client"){
      return <div className="client">
        <Client
          period={this.state.period}
          possession={this.state.possession}
          minutes={minutes}
          seconds={seconds}
          gameDetails={this.state.game}
          currentPlays={this.state.currentPlays}
          />
      </div>
    } else {
      return <div className="sign-in">
        <SignIn handleSignIn={this.handleSignIn}/>
      </div>
    }
  }


  getGame = () => {
    fetch('http://localhost:3000/games')
    .then(response => response.json())
    .then(json => {
      console.log(json)
      this.setState({
        game: json
      })
    })
  }

  currentPlay = (playObj) => {
    this.setState(currentState => ({
      currentPlays: [playObj, ...currentState.currentPlays]
    }), () => console.log(this.state.currentPlays, "state currentplays"))
  }

  handleSignIn = (username) => {
    this.setState({
      signIn: username
    })
  }

  formatNum = timerNum => {
    return timerNum.toString().length === 1 ? "0" + timerNum.toString() : timerNum.toString()
  }

  startClicked = () => {
    if (this.state.intervalId === 0) {
      return this.startTimer()
    } else {
      return this.pauseTimer()
    }
  }

  startTimer = () => {
    const intervalId = setInterval(this.decrimentTimer, 1000)
    this.setState({ intervalId })
  }

  pauseTimer = () => {
    clearInterval(this.state.intervalId)
    this.setState({
      intervalId: 0
    })
  }

  decrimentTimer = () => {
    let minutes = this.state.minutes
    let seconds

    if (this.state.seconds === 0) {
      if (this.state.minutes === 0) {
        clearInterval(this.state.intervalId)
        minutes = 0
        seconds = 0
        this.resetTimer()
      } else {
        minutes = this.state.minutes - 1
        seconds = 59
      }
    } else {
      seconds = this.state.seconds - 1
    }
    this.setState({ minutes, seconds})
  }

  resetTimer = () => {
    this.setState({
      intervalId: 0,
      minutes: 20,
      seconds: 0
    })
  }

  changePossession = () => {
    console.log("in change click");
    if (this.state.possession === "H") {
      this.setState({
        possession: "A"
      })
    } else {
      this.setState({
        possession: "H"
      })
    }
  }

  changePeriod = () => {
    console.log("in change period");
    if (this.state.period === "Period 1") {
      this.setState({
        period: "Period 2"
      })
    } else {
      this.setState({
        period: "Period 1"
      })
    }
  }

  // editGameDetails = (teamIndex, id, json) => {
  //   this.setState(currentState => {
  //     const x = {game: currentState.game.map(game => {
  //       return game.teams.map(team => {
  //         if (team.id === teamIndex + 1) {
  //           team.players.map(player => {
  //             if (player.id === id) {
  //               player = json
  //               return player
  //             } else {
  //               return player
  //             }
  //           })
  //         } else {
  //           return team
  //         }
  //       })
  //     })
  //   }
  //   return x;
  //   })
  // }

  // currentState.game.map(game => {
  //   return game.teams.map(team => {
  //     if (team.id === teamIndex + 1) {
  //       team.players.map(player => {
  //         if (player.id === id) {
  //           player = json
  //           return player
  //         } else {
  //           return player
  //         })
  //       }
  //     } else {
  //       return team
  //     }
  //   })
  // })


  // handleKeyPress = (event) => {
  //   this.setState({
  //     keyPress: event.keyCode
  //   }, () => console.log(this.state.keyPress))
  // }

} // end of class

export default App;
