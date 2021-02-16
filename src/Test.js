import React, {Component} from 'react';
import {db} from "./firebase";

import logo from './assets/logo.png';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            weeklyData: null,
            weeklyGames: null,
            currentTime: null,
            time: null,
            isLoading: true
        }
    }

    loadNewTime() {
        const date = new Date();
        const minutes = date.getMinutes();
        if (minutes > 30) {
            this.setState({currentTime: (30 - minutes) + 30})
        } else {
            this.setState({currentTime: 30 - minutes})
        }
    }

    async componentDidMount() {
        this.updateTimer = setInterval(() => this.loadNewTime(), 1000);

        const dataRef = db.collection('data');
        const weeklyDataRef = db.collection('weekly-data');
        const weeklyGamesRef = db.collection('weekly-games');


        await dataRef.get().then((doc) => {
            const tempDoc = doc.docs.map((doc) => {
                return {id: doc.id, ...doc.data()}
            })
            this.setState({
                data: tempDoc
            });
        })

        await weeklyDataRef.get().then((doc) => {
            const tempWeeklyDoc = doc.docs.map((doc) => {
                return {id: doc.id, ...doc.data()}
            })
            this.setState({
                weeklyData: tempWeeklyDoc
            });
        })

        await weeklyGamesRef.get().then((doc) => {
            const tempGamesDoc = doc.docs.map((doc) => {
                return {id: doc.id, ...doc.data()}
            })
            this.setState({
                weeklyGames: tempGamesDoc,
                isLoading: false
            });
        })
    }

    componentWillUnmount() {
        clearInterval(this.updateTimer);
    }

    render() {
        const {
            data,
            weeklyData,
            currentTime,
            isLoading
        } = this.state;

        const Lifetime = ({username, kd, wins, kills, deaths, gamesPlayed, winPercentage}) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3">
                <div className="card shadow-lg border-danger card-expand">
                    <div className="card-body">
                        <h5 className="card-title">{username}</h5>
                        <p className="card-text mb-0">
                            <strong>KD: </strong>{kd}</p>
                        <p className="card-text mb-0">
                            <strong>Wins: </strong>{wins}
                        </p>
                        <p className="card-text mb-0">
                            <strong>Kills: </strong>{kills}
                        </p>
                        <p className="card-text mb-0">
                            <strong>Deaths: </strong>{deaths}</p>
                        <p className="card-text mb-0"><strong>Games
                            Played: </strong>{gamesPlayed}</p>
                        <p className="card-text"><strong>Win
                            Percentage: </strong>{winPercentage}%
                        </p>
                    </div>
                </div>
            </div>
        );

        const Weekly = ({username, kd, kills, deaths, gamesPlayed, killsPerGame}) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3">
                <div className="card shadow-lg border-danger card-expand">
                    <div className="card-body">
                        <h5 className="card-title">{username}</h5>
                        <p className="card-text mb-0">
                            <strong>KD: </strong>{kd}</p>
                        <p className="card-text mb-0">
                            <strong>Kills: </strong>{kills}
                        </p>
                        <p className="card-text mb-0">
                            <strong>Deaths: </strong>{deaths}</p>
                        <p className="card-text mb-0"><strong>Games
                            Played: </strong>{gamesPlayed}</p>
                        <p className="card-text mb-0">
                            <strong>Kills per
                                Game: </strong>{killsPerGame}
                        </p>
                    </div>
                </div>
            </div>
        );


        if (isLoading) {
            return (
                <>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#"><img src={logo} alt="ATN3" width="50"/> ATN3's Warzone
                                Stats</a>
                        </div>
                    </nav>

                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-12 text-center">
                                <div className="lds-ring">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <h2 className="text-white">Loading stats...</h2>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

        return (
            <>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#"><img src={logo} alt="ATN3" width="50"/> ATN3's Warzone
                            Stats</a>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="row justify-content-center mb-5">
                        <div className="col-12 text-end">
                            <h5 className="text-white">Stats update
                                in <strong><span>{currentTime}</span> minutes</strong></h5>
                        </div>
                    </div>

                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab"
                                    data-bs-target="#home" type="button" role="tab" aria-controls="home"
                                    aria-selected="true">Lifetime Stats
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                    type="button" role="tab" aria-controls="profile" aria-selected="false">Weekly Stats
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="games-tab" data-bs-toggle="tab" data-bs-target="#games"
                                    type="button" role="tab" aria-controls="games" aria-selected="false">Recent Games
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel"
                             aria-labelledby="home-tab">
                            <div className="row justify-content-center mt-3">
                                {data.map((user) => (
                                    <Lifetime
                                        username={`${user.id}`}
                                        kd={`${user.response2.br.kdRatio.toFixed(2)}`}
                                        wins={`${user.response2.br.wins}`}
                                        kills={`${user.response2.br.kills}`}
                                        deaths={`${user.response2.br.deaths}`}
                                        gamesPlayed={`${user.response2.br.gamesPlayed}`}
                                        winPercentage={`${(user.response2.br.wins / user.response2.br.gamesPlayed * 100).toFixed(2)}`}
                                    />
                                ))}
                            </div>
                        </div>


                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="row justify-content-center mt-3">
                                {weeklyData.map((user) => {
                                    if (user.response2.wz.all.properties === null) return (
                                        <Weekly
                                            username={`${user.id}`}
                                            kd={"N/A"}
                                            kills={"N/A"}
                                            deaths={"N/A"}
                                            gamesPlayed={"N/A"}
                                            killsPerGame={"N/A"}
                                        />
                                    )

                                    return (
                                        <Weekly
                                            username={`${user.id}`}
                                            kd={`${user.response2.wz.all.properties.kdRatio.toFixed(2)}`}
                                            kills={`${user.response2.wz.all.properties.kills}`}
                                            deaths={`${user.response2.wz.all.properties.deaths}`}
                                            gamesPlayed={`${user.response2.wz.all.properties.matchesPlayed}`}
                                            killsPerGame={`${user.response2.wz.all.properties.killsPerGame.toFixed(2)}`}
                                        />
                                    )
                                })}

                            </div>
                        </div>



                    </div>
                </div>
            </>
        )
    }

}

export default Test;