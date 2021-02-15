import React, {Component} from 'react';
import {db} from "./firebase";

import logo from './assets/logo.png';

class App extends Component {
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
            this.setState({ currentTime: (30 - minutes) + 30 })
        } else {
            this.setState({ currentTime: 30 - minutes })
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
            weeklyGames,
            currentTime,
            isLoading
        } = this.state;

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
                            <h5 className="text-white">Stats update in <strong><span>{currentTime}</span> minutes</strong></h5>
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
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[0].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[0].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[0].response2.br.wins}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[0].response2.br.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[0].response2.br.deaths}</p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[0].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[0].response2.br.wins / data[0].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/battlenet/ATN3%232332/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[1].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[1].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[1].response2.br.wins}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[1].response2.br.kills}</p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[1].response2.br.deaths}</p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[1].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[1].response2.br.wins / data[1].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/atvi/gainsley%20harriot%231544298/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[2].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[2].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[2].response2.br.wins}</p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[2].response2.br.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[2].response2.br.deaths}
                                            </p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[2].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[2].response2.br.wins / data[2].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/atvi/koostacy%239136361/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[3].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[3].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[3].response2.br.wins}</p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[3].response2.br.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[3].response2.br.deaths}
                                            </p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[3].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[3].response2.br.wins / data[3].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/atvi/jimmy%20jams%235066697/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[4].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[4].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[4].response2.br.wins}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[4].response2.br.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[4].response2.br.deaths}</p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[4].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[4].response2.br.wins / data[4].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/atvi/nayff24%238295391/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{data[5].id}</h5>
                                            <p className="card-text mb-0">
                                                <strong>KD: </strong>{data[5].response2.br.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0">
                                                <strong>Wins: </strong>{data[5].response2.br.wins}</p>
                                            <p className="card-text mb-0">
                                                <strong>Kills: </strong>{data[5].response2.br.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{data[5].response2.br.deaths}
                                            </p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{data[5].response2.br.gamesPlayed}</p>
                                            <p className="card-text"><strong>Win
                                                Percentage: </strong>{(data[5].response2.br.wins / data[5].response2.br.gamesPlayed * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                        <div className="card-footer text-center"><a
                                            href="https://cod.tracker.gg/warzone/profile/battlenet/Redox%2321477/matches"
                                            className="text-decoration-none" target="_blank">
                                            <button className="btn btn-primary btn-block">Recent Games</button>
                                        </a></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="row justify-content-center mt-3">
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[0].id}</h5>
                                            {weeklyData[0].response2.wz.all.properties === null ? <p>{weeklyData[0].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[0].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                                <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[0].response2.wz.all.properties.kills}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <strong>Deaths: </strong>{weeklyData[0].response2.wz.all.properties.deaths}</p>
                                                <p className="card-text mb-0"><strong>Games
                                                    Played: </strong>{weeklyData[0].response2.wz.all.properties.matchesPlayed}</p>
                                                <p className="card-text mb-0">
                                                    <strong>Kills per Game: </strong>{(weeklyData[0].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[1].id}</h5>
                                            {weeklyData[1].response2.wz.all.properties === null ? <p>{weeklyData[1].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[1].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                                <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[1].response2.wz.all.properties.kills}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <strong>Deaths: </strong>{weeklyData[1].response2.wz.all.properties.deaths}</p>
                                                <p className="card-text mb-0"><strong>Games
                                                    Played: </strong>{weeklyData[1].response2.wz.all.properties.matchesPlayed}</p>
                                                <p className="card-text mb-0">
                                                    <strong>Kills per Game: </strong>{(weeklyData[1].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[2].id}</h5>
                                            {weeklyData[2].response2.wz.all.properties === null ? <p>{weeklyData[2].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[2].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                                <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[2].response2.wz.all.properties.kills}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <strong>Deaths: </strong>{weeklyData[2].response2.wz.all.properties.deaths}</p>
                                                <p className="card-text mb-0"><strong>Games
                                                    Played: </strong>{weeklyData[2].response2.wz.all.properties.matchesPlayed}</p>
                                                <p className="card-text mb-0">
                                                    <strong>Kills per Game: </strong>{(weeklyData[2].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[3].id}</h5>
                                            {weeklyData[3].response2.wz.all.properties === null ? <p>{weeklyData[3].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[3].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                                <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[3].response2.wz.all.properties.kills}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <strong>Deaths: </strong>{weeklyData[3].response2.wz.all.properties.deaths}</p>
                                                <p className="card-text mb-0"><strong>Games
                                                    Played: </strong>{weeklyData[3].response2.wz.all.properties.matchesPlayed}</p>
                                                <p className="card-text mb-0">
                                                    <strong>Kills per Game: </strong>{(weeklyData[3].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[4].id}</h5>
                                            {weeklyData[4].response2.wz.all.properties === null ? <p>{weeklyData[4].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[4].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                                <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[4].response2.wz.all.properties.kills}
                                                </p>
                                                <p className="card-text mb-0">
                                                    <strong>Deaths: </strong>{weeklyData[4].response2.wz.all.properties.deaths}</p>
                                                <p className="card-text mb-0"><strong>Games
                                                    Played: </strong>{weeklyData[4].response2.wz.all.properties.matchesPlayed}</p>
                                                <p className="card-text mb-0">
                                                    <strong>Kills per Game: </strong>{(weeklyData[4].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title">{weeklyData[5].id}</h5>
                                            {weeklyData[5].response2.wz.all.properties === null ? <p>{weeklyData[5].id} hasn't played any games this week! Or his account is set to private >:(</p> : <><p className="card-text mb-0">
                                                <strong>KD: </strong>{weeklyData[5].response2.wz.all.properties.kdRatio.toFixed(2)}</p>
                                            <p className="card-text mb-0"><strong>Kills: </strong>{weeklyData[5].response2.wz.all.properties.kills}
                                            </p>
                                            <p className="card-text mb-0">
                                                <strong>Deaths: </strong>{weeklyData[5].response2.wz.all.properties.deaths}</p>
                                            <p className="card-text mb-0"><strong>Games
                                                Played: </strong>{weeklyData[5].response2.wz.all.properties.matchesPlayed}</p>
                                            <p className="card-text mb-0">
                                                <strong>Kills per Game: </strong>{(weeklyData[5].response2.wz.all.properties.killsPerGame).toFixed(2)}</p></>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="tab-pane fade" id="games" role="tabpanel" aria-labelledby="games-tab">
                            <div className="row justify-content-center mt-3">
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[0].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneAdam"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger me-3">{weeklyGames[0].response2.matches[0].playerStats.teamPlacement} </span>{weeklyGames[0].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[0].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[0].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[0].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[0].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[0].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[0].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTwoAdam"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                            <span className="badge bg-danger me-3">{weeklyGames[0].response2.matches[1].playerStats.teamPlacement} </span>{weeklyGames[0].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[1].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[1].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[1].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[1].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[1].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[1].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseThreeAdam"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                            <span className="badge bg-danger me-3">{weeklyGames[0].response2.matches[2].playerStats.teamPlacement} </span>{weeklyGames[0].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[2].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[2].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[2].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[2].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[2].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[2].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFourAdam"
                                                                aria-expanded="false" aria-controls="collapseFour">
                                                            <span className="badge bg-danger me-3">{weeklyGames[0].response2.matches[3].playerStats.teamPlacement} </span>{weeklyGames[0].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[3].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[3].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[3].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[3].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[3].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[3].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFive">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFiveAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger me-3">{weeklyGames[0].response2.matches[4].playerStats.teamPlacement} </span>{weeklyGames[0].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[4].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[4].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[4].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[4].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[4].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[4].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[1].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneMark"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger me-3">{weeklyGames[1].response2.matches[0].playerStats.teamPlacement} </span>{weeklyGames[1].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[0].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[0].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[0].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[0].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[0].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[0].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTwoMark"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                            <span className="badge bg-danger me-3">{weeklyGames[1].response2.matches[1].playerStats.teamPlacement} </span>{weeklyGames[1].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[1].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[1].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[1].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[1].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[1].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[1].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseThreeMark"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                            <span className="badge bg-danger me-3">{weeklyGames[1].response2.matches[2].playerStats.teamPlacement} </span>{weeklyGames[1].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[2].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[2].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[2].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[2].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[2].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[2].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFourMark"
                                                                aria-expanded="false" aria-controls="collapseFour">
                                                            <span className="badge bg-danger me-3">{weeklyGames[1].response2.matches[3].playerStats.teamPlacement} </span>{weeklyGames[1].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[3].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[3].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[3].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[3].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[3].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[3].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFive">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFiveMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger me-3">{weeklyGames[1].response2.matches[4].playerStats.teamPlacement} </span>{weeklyGames[1].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[4].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[4].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[4].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[4].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[4].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[4].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[2].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneJoe"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger me-3">{weeklyGames[2].response2.matches[0].playerStats.teamPlacement} </span>{weeklyGames[2].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[0].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[0].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[0].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[0].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[0].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[0].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTwoJoe"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                            <span className="badge bg-danger me-3">{weeklyGames[2].response2.matches[1].playerStats.teamPlacement} </span>{weeklyGames[2].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[1].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[1].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[1].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[1].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[1].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[1].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseThreeJoe"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                            <span className="badge bg-danger me-3">{weeklyGames[2].response2.matches[2].playerStats.teamPlacement} </span>{weeklyGames[2].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[2].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[2].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[2].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[2].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[2].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[2].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFourJoe"
                                                                aria-expanded="false" aria-controls="collapseFour">
                                                            <span className="badge bg-danger me-3">{weeklyGames[2].response2.matches[3].playerStats.teamPlacement} </span>{weeklyGames[2].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[3].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[3].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[3].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[3].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[3].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[3].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFive">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFiveJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger me-3">{weeklyGames[2].response2.matches[4].playerStats.teamPlacement} </span>{weeklyGames[2].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[4].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[4].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[4].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[4].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[4].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[4].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[3].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneNathan"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger me-3">{weeklyGames[3].response2.matches[0].playerStats.teamPlacement} </span>{weeklyGames[3].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[0].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[0].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[0].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[0].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[0].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[0].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTwoNathan"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                            <span className="badge bg-danger me-3">{weeklyGames[3].response2.matches[1].playerStats.teamPlacement} </span>{weeklyGames[3].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[1].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[1].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[1].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[1].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[1].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[1].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseThreeNathan"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                            <span className="badge bg-danger me-3">{weeklyGames[3].response2.matches[2].playerStats.teamPlacement} </span>{weeklyGames[3].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[2].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[2].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[2].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[2].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[2].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[2].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFourNathan"
                                                                aria-expanded="false" aria-controls="collapseFour">
                                                            <span className="badge bg-danger me-3">{weeklyGames[3].response2.matches[3].playerStats.teamPlacement} </span>{weeklyGames[3].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[3].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[3].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[3].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[3].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[3].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[3].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFive">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFiveNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger me-3">{weeklyGames[3].response2.matches[4].playerStats.teamPlacement} </span> {weeklyGames[3].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[4].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[4].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[4].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[4].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[4].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[4].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <div className="card shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[4].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneDom"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger me-3">{weeklyGames[4].response2.matches[0].playerStats.teamPlacement} </span>{weeklyGames[4].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[0].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[0].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[0].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[0].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[0].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[0].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTwoDom"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                            <span className="badge bg-danger me-3">{weeklyGames[4].response2.matches[1].playerStats.teamPlacement} </span>{weeklyGames[4].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[1].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[1].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[1].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[1].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[1].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[1].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseThreeDom"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                            <span className="badge bg-danger me-3">{weeklyGames[4].response2.matches[2].playerStats.teamPlacement} </span>{weeklyGames[4].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[2].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[2].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[2].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[2].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[2].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[2].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFourDom"
                                                                aria-expanded="false" aria-controls="collapseFour">
                                                            <span className="badge bg-danger me-3">{weeklyGames[4].response2.matches[3].playerStats.teamPlacement} </span>{weeklyGames[4].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[3].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[3].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[3].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[3].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[3].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[3].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFive">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseFiveDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger me-3">{weeklyGames[4].response2.matches[4].playerStats.teamPlacement} </span> {weeklyGames[4].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : 'Special Event'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[4].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[4].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[4].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[4].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[4].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[4].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default App;