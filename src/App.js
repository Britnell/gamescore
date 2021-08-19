import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// a single line text-input with enter to submit
// passes props and takes submit funciton
function TextInput({ onsubmit=()=>{}, onchange=()=>{}, props={} }){
  function keypress(ev){
    if(ev.key==='Enter')
      onsubmit(ev)
  }
  return (<input type="text" onChange={onchange} onKeyPress={keypress} {...props} />)
}


// 
function HSLToHEX(h,s,l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
  
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;

    return "#" + r + g + b;
}


function randomHue(){
  let h = Math.random()*360
  let s = 88
  let l = 75
  return HSLToHEX(h,s,l);
}


function Header(){

  return (<div className='header-row'>
    Player Scores
    <div className="nav-link"><Link to="/">Basic</Link></div>
            <div className="nav-link"><Link to="/rounds">Rounds</Link></div>
  </div>)
}


function NewPlayer({onNewPlayer}){

  function ipsubmit(ev){
    let name = ev.target.value
    ev.target.value = ''
    onNewPlayer(name)
  } 

  return (<div className='new-row'>
            <div>Add player : </div>
            <TextInput props={{name:'nameinput'}} onsubmit={ipsubmit}  />
          </div>)
}


function ScoreButton({val,buttonScoreChange}){

  let sign = (val>0)?'+':'-'
  function scoreChange(ev){
    buttonScoreChange(x=>x+val)
  }
  return (<div className="add-button" onClick={scoreChange} >{sign}{val}</div>)
}

function Player({player,setScore,removePlayer}){
  const {name,score,hue} = player;

  function ipScoreChange(ev){
    let newScore = parseInt(ev.target.value)
    if(newScore || newScore===0 )
      setScore(name,newScore)
    else
      setScore(name,ev.target.value)
    
    
  }

  function buttonScoreChange(operation){
    let mod = operation(score)
    setScore(name,mod)
  }


  return(<div className="player-row" style={{backgroundColor: hue }} >
    <div>{name}</div>
    {/* <div>{score}</div> */}
    <TextInput onchange={ipScoreChange} props={{ style:{width: `90%`}, value: score}} />
    <div className="add-button-container">
      <ScoreButton val={1} buttonScoreChange={buttonScoreChange}  />
      <ScoreButton val={5} buttonScoreChange={buttonScoreChange}  />
      <ScoreButton val={10} buttonScoreChange={buttonScoreChange}  />
    </div>
    <div className="remove-button" onClick={()=>removePlayer(name)}>X</div>
  </div>)
}



function GameCounter(){
  const [players,setPlayers] = React.useState(()=>{
    let local = window.localStorage.getItem('player-score')
    if(!local)  return {};
    return JSON.parse(local)
  })
  
  React.useEffect(()=>{
    window.localStorage.setItem('player-score',JSON.stringify(players))
  },[players])

  function onNewPlayer(name){
    let _players = {...players}
    _players[name] = {
                        name: name,
                        score: 0,
                        hue: randomHue(),
                      }
    setPlayers(_players)
  }

  function onRemovePlayer(name){
    let _players = {...players}
    if(_players.hasOwnProperty(name))
      delete _players[name]
    setPlayers(_players)
  }

  function setScore(name,sc){
    let _players = {...players}
    _players[name]['score'] = sc;
    setPlayers(_players)
  }

  const playerlist = []

  Object.keys(players).map( (name,i) => 
      playerlist.push(<Player 
        key={i} 
        player={players[name]}
        setScore={setScore}
        removePlayer={onRemovePlayer} 
      />)  )

  return (<>
            {playerlist}
            <NewPlayer onNewPlayer={onNewPlayer} />
          </>)
}

function RoundsCounter(){
  return (<div>ROUNDS</div>)
}
function App() {
  return (
    <>
      <Router>
          <div className="counter-container">
            <Header />
            <Switch>
              <Route exact path="/">
                <GameCounter />
              </Route>
              <Route>
                <RoundsCounter />
              </Route>
            </Switch>
          </div>
      </Router>
    </>
  );
}

export default App;