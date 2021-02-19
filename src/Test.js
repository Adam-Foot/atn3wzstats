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

        function secondsToTime(seconds) {
            seconds = Number(seconds);
            let d = Math.floor(seconds / (3600*24));
            let h = Math.floor(seconds % (3600*24) / 3600);
            let m = Math.floor(seconds % 3600 / 60);

            let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
            let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes ") : "";

            return dDisplay + hDisplay + mDisplay;
        }

        const Lifetime = ({username, kd, wins, kills, deaths, gamesPlayed, winPercentage, revives, top5, top10, top25, timePlayed}) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3">
                <div className="card bg-dark shadow-lg border-danger card-expand">
                    <div className="card-body text-white">
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
                        <p className="card-text mb-0"><strong>Win
                            Percentage: </strong>{winPercentage}%
                        </p>
                        <p className="card-text mb-0"><strong>Revives: </strong>{revives}
                        </p>
                        <p className="card-text mb-0"><strong>Top 5: </strong>{top5}
                        </p>
                        <p className="card-text mb-0"><strong>Top 10: </strong>{top10}
                        </p>
                        <p className="card-text mb-0"><strong>Top 25: </strong>{top25}
                        </p>
                        <p className="card-text"><strong>Time Played: </strong>{secondsToTime(timePlayed)}
                        </p>
                    </div>
                </div>
            </div>
        );

        const Weekly = ({username, kd, kills, deaths, gamesPlayed, killsPerGame}) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3">
                <div className="card bg-dark shadow-lg border-danger card-expand">
                    <div className="card-body text-white">
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
                            <a className="navbar-brand" href="#">ATN3's Warzone
                                Stats - TEST PAGE</a>
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
                        <a className="navbar-brand" href="#">ATN3's Warzone
                            Stats - TEST PAGE</a>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="row justify-content-center mb-5">
                        <div className="col-12 text-end">
                            <h5 className="text-white">Stats updating in <strong><span className="text-danger">{currentTime} minutes</span></strong></h5>
                        </div>
                    </div>

                    <ul className="nav nav-pills" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active text-white" id="home-tab" data-bs-toggle="tab"
                                    data-bs-target="#home" type="button" role="tab" aria-controls="home"
                                    aria-selected="true">Lifetime Stats
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link text-white" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                    type="button" role="tab" aria-controls="profile" aria-selected="false">Weekly Stats
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link text-white" id="games-tab" data-bs-toggle="tab" data-bs-target="#games"
                                    type="button" role="tab" aria-controls="games" aria-selected="false">Recent Games
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link text-white" id="updates-tab" data-bs-toggle="tab" data-bs-target="#updates"
                                    type="button" role="tab" aria-controls="updates" aria-selected="false">Updates
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
                                        revives={`${user.response2.br.revives}`}
                                        top5={`${user.response2.br.topFive}`}
                                        top10={`${user.response2.br.topTen}`}
                                        top25={`${user.response2.br.topTwentyFive}`}
                                        timePlayed={`${user.response2.br.timePlayed}`}
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

                        <div className="tab-pane fade" id="games" role="tabpanel" aria-labelledby="games-tab">
                            <div className="row justify-content-center mt-3">

                                {/* ATN3 */}
                                <div className="col-12 col-lg-6 mb-3 text-white">
                                    <div className="card bg-dark shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[0].id}</h5>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneAdam"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[0].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[0].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[0].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[0].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[0].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[0].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[1].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[1].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[1].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[1].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[1].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[1].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[2].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[2].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[2].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[2].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[2].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[2].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[3].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[3].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[3].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[3].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[3].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[3].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[4].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[4].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[4].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[4].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[4].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[4].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
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
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSixAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[5].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[5].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[5].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[5].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[5].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[5].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[5].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[5].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[5].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[5].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSixAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[5].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[5].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[5].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[5].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[5].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[5].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSevenAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[6].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[6].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[6].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[6].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[6].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[6].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[6].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[6].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[6].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[6].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSevenAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[6].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[6].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[6].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[6].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[6].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[6].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEight">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseEightAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[7].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[7].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[7].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[7].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[7].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[7].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[7].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[7].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[7].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[7].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseEightAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[7].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[7].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[7].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[7].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[7].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[7].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseNineAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[8].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[8].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[8].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[8].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[8].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[8].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[8].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[8].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[8].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[8].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseNineAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[8].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[8].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[8].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[8].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[8].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[8].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTen">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTenAdam"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[0].response2.matches[9].playerStats.teamPlacement ? '??' : weeklyGames[0].response2.matches[9].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[0].response2.matches[9].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[0].response2.matches[9].mode === 'br_brquads' ? 'Quads' : weeklyGames[0].response2.matches[9].mode === 'br_brtrios' ? 'Trios' : weeklyGames[0].response2.matches[9].mode === 'br_brduos' ? 'Duos' : weeklyGames[0].response2.matches[9].mode === 'br_brsolo' ? 'Solo' : weeklyGames[0].response2.matches[9].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[0].response2.matches[9].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[0].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[0].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[0].response2.matches[9].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTenAdam" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[0].response2.matches[9].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[0].response2.matches[9].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[0].response2.matches[9].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[0].response2.matches[9].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[0].response2.matches[9].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[0].response2.matches[9].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* KOOSTACY */}
                                <div className="col-12 col-lg-6 mb-3 text-white">
                                    <div className="card bg-dark shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[1].id}</h5>
                                            <div className="accordion" id="accordionExample2">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneMark"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[0].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[0].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[0].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[0].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[0].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[0].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample2">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[1].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[1].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[1].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[1].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[1].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[1].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample2">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[2].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[2].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[2].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[2].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[2].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[2].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample2">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[3].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[3].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[3].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[3].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[3].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[3].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample2">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[4].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[4].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[4].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[4].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[4].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[4].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample2">
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
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSixMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[5].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[5].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[5].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[5].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[5].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[5].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[5].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[5].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[5].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[5].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSixMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[5].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[5].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[5].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[5].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[5].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[5].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSevenMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[6].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[6].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[6].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[6].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[6].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[6].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[6].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[6].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[6].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[6].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSevenMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[6].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[6].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[6].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[6].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[6].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[6].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEight">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseEightMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[7].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[7].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[7].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[7].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[7].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[7].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[7].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[7].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[7].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[7].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseEightMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[7].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[7].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[7].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[7].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[7].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[7].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseNineMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[8].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[8].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[8].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[8].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[8].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[8].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[8].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[8].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[8].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[8].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseNineMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[8].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[8].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[8].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[8].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[8].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[8].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTen">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTenMark"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[1].response2.matches[9].playerStats.teamPlacement ? '??' : weeklyGames[1].response2.matches[9].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[1].response2.matches[9].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[1].response2.matches[9].mode === 'br_brquads' ? 'Quads' : weeklyGames[1].response2.matches[9].mode === 'br_brtrios' ? 'Trios' : weeklyGames[1].response2.matches[9].mode === 'br_brduos' ? 'Duos' : weeklyGames[1].response2.matches[9].mode === 'br_brsolo' ? 'Solo' : weeklyGames[1].response2.matches[9].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[1].response2.matches[9].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[1].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[1].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[1].response2.matches[9].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTenMark" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[1].response2.matches[9].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[1].response2.matches[9].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[1].response2.matches[9].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[1].response2.matches[9].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[1].response2.matches[9].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[1].response2.matches[9].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* MIGHTYOWL */}
                                <div className="col-12 col-lg-6 mb-3 text-white">
                                    <div className="card bg-dark shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[2].id}</h5>
                                            <div className="accordion" id="accordionExample3">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneJoe"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[0].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[0].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[0].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[0].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[0].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[0].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample3">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[1].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[1].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[1].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[1].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[1].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[1].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample3">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[2].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[2].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[2].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[2].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[2].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[2].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample3">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[3].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[3].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[3].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[3].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[3].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[3].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample3">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[4].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[4].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[4].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[4].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[4].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[4].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample3">
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
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSixJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[5].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[5].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[5].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[5].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[5].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[5].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[5].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[5].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[5].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[5].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSixJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[5].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[5].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[5].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[5].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[5].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[5].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSevenJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[6].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[6].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[6].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[6].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[6].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[6].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[6].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[6].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[6].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[6].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSevenJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[6].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[6].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[6].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[6].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[6].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[6].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEight">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseEightJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[7].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[7].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[7].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[7].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[7].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[7].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[7].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[7].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[7].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[7].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseEightJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[7].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[7].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[7].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[7].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[7].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[7].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseNineJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[8].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[8].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[8].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[8].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[8].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[8].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[8].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[8].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[8].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[8].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseNineJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[8].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[8].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[8].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[8].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[8].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[8].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTen">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTenJoe"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[2].response2.matches[9].playerStats.teamPlacement ? '??' : weeklyGames[2].response2.matches[9].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[2].response2.matches[9].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[2].response2.matches[9].mode === 'br_brquads' ? 'Quads' : weeklyGames[2].response2.matches[9].mode === 'br_brtrios' ? 'Trios' : weeklyGames[2].response2.matches[9].mode === 'br_brduos' ? 'Duos' : weeklyGames[2].response2.matches[9].mode === 'br_brsolo' ? 'Solo' : weeklyGames[2].response2.matches[9].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[2].response2.matches[9].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[2].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[2].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[2].response2.matches[9].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTenJoe" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[2].response2.matches[9].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[2].response2.matches[9].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[2].response2.matches[9].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[2].response2.matches[9].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[2].response2.matches[9].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[2].response2.matches[9].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NAYFF24 */}
                                <div className="col-12 col-lg-6 mb-3 text-white">
                                    <div className="card bg-dark shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[3].id}</h5>
                                            <div className="accordion" id="accordionExample4">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneNathan"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[0].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[0].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[0].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[0].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[0].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[0].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample4">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[1].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[1].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[1].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[1].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[1].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[1].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample4">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[2].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[2].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[2].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[2].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[2].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[2].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample4">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[3].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[3].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[3].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[3].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[3].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[3].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample4">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[4].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[4].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[4].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[4].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[4].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[4].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample4">
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
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSixNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[5].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[5].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[5].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[5].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[5].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[5].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[5].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[5].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[5].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[5].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSixNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[5].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[5].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[5].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[5].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[5].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[5].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSevenNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[6].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[6].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[6].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[6].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[6].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[6].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[6].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[6].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[6].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[6].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSevenNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[6].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[6].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[6].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[6].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[6].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[6].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEight">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseEightNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[7].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[7].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[7].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[7].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[7].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[7].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[7].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[7].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[7].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[7].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseEightNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[7].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[7].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[7].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[7].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[7].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[7].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseNineNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[8].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[8].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[8].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[8].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[8].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[8].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[8].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[8].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[8].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[8].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseNineNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[8].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[8].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[8].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[8].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[8].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[8].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTen">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTenNathan"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[3].response2.matches[9].playerStats.teamPlacement ? '??' : weeklyGames[3].response2.matches[9].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[3].response2.matches[9].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[3].response2.matches[9].mode === 'br_brquads' ? 'Quads' : weeklyGames[3].response2.matches[9].mode === 'br_brtrios' ? 'Trios' : weeklyGames[3].response2.matches[9].mode === 'br_brduos' ? 'Duos' : weeklyGames[3].response2.matches[9].mode === 'br_brsolo' ? 'Solo' : weeklyGames[3].response2.matches[9].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[3].response2.matches[9].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[3].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[3].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[3].response2.matches[9].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTenNathan" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[3].response2.matches[9].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[3].response2.matches[9].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[3].response2.matches[9].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[3].response2.matches[9].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[3].response2.matches[9].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[3].response2.matches[9].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* REDOX */}
                                <div className="col-12 col-lg-6 mb-3 text-white">
                                    <div className="card bg-dark shadow-lg border-danger card-expand">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{weeklyGames[4].id}</h5>
                                            <div className="accordion" id="accordionExample5">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseOneDom"
                                                                aria-expanded="false" aria-controls="collapseOne">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[0].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[0].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[0].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[0].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[0].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[0].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[0].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[0].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[0].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[0].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[0].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOneDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample5">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[1].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[1].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[1].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[1].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[1].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[1].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[1].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[1].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[1].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[1].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[1].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwoDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTwo" data-bs-parent="#accordionExample5">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[2].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[2].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[2].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[2].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[2].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[2].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[2].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[2].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[2].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[2].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[2].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThreeDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingThree" data-bs-parent="#accordionExample5">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[3].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[3].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[3].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[3].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[3].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[3].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[3].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[3].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[3].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[3].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[3].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFourDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFour" data-bs-parent="#accordionExample5">
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
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[4].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[4].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[4].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[4].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[4].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[4].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[4].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[4].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[4].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[4].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[4].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFiveDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingFive" data-bs-parent="#accordionExample5">
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
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSix">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSixDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[5].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[5].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[5].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[5].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[5].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[5].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[5].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[5].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[5].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[5].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[5].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSixDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[5].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[5].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[5].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[5].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[5].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[5].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingSeven">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseSevenDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[6].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[6].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[6].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[6].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[6].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[6].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[6].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[6].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[6].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[6].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[6].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseSevenDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[6].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[6].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[6].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[6].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[6].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[6].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingEight">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseEightDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[7].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[7].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[7].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[7].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[7].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[7].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[7].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[7].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[7].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[7].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[7].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseEightDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[7].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[7].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[7].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[7].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[7].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[7].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingNine">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseNineDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[8].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[8].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[8].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[8].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[8].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[8].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[8].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[8].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[8].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[8].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[8].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseNineDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[8].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[8].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[8].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[8].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[8].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[8].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTen">
                                                        <button className="accordion-button collapsed" type="button"
                                                                data-bs-toggle="collapse" data-bs-target="#collapseTenDom"
                                                                aria-expanded="false" aria-controls="collapseFive">
                                                            <span className="badge bg-danger p-3 rounded-circle w-10">{!weeklyGames[4].response2.matches[9].playerStats.teamPlacement ? '??' : weeklyGames[4].response2.matches[9].playerStats.teamPlacement} </span><span className="me-4 mx-2">{new Date(weeklyGames[4].response2.matches[9].utcStartSeconds * 1000).toLocaleString("en-GB", {year: '2-digit', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>{weeklyGames[4].response2.matches[9].mode === 'br_brquads' ? 'Quads' : weeklyGames[4].response2.matches[9].mode === 'br_brtrios' ? 'Trios' : weeklyGames[4].response2.matches[9].mode === 'br_brduos' ? 'Duos' : weeklyGames[4].response2.matches[9].mode === 'br_brsolo' ? 'Solo' : weeklyGames[4].response2.matches[9].mode === 'br_rebirth_rbrthtrios' ? 'Rebirth Trios' : weeklyGames[4].response2.matches[9].mode === 'br_rebirth_rbrthduos' ? 'Rebirth Duos' : weeklyGames[4].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Solo' : weeklyGames[4].response2.matches[9].mode === 'br_rebirth_rbrthsolo' ? 'Rebirth Quads' : weeklyGames[4].response2.matches[9].mode === 'brtdm_rmbl' ? 'Warzone Rumble' : 'Unknown Gamemode'}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTenDom" className="accordion-collapse collapse"
                                                         aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="mb-0"><strong>Kills: </strong>{weeklyGames[4].response2.matches[9].playerStats.kills}</p>
                                                            <p className="mb-0"><strong>Deaths: </strong>{weeklyGames[4].response2.matches[9].playerStats.deaths}</p>
                                                            <p className="mb-0"><strong>KD: </strong>{(weeklyGames[4].response2.matches[9].playerStats.kdRatio).toFixed(2)}</p>
                                                            <p className="mb-0"><strong>Score/minute: </strong>{(weeklyGames[4].response2.matches[9].playerStats.scorePerMinute).toFixed(0)}</p>
                                                            <p className="mb-0"><strong>Damage: </strong>{weeklyGames[4].response2.matches[9].playerStats.damageDone}</p>
                                                            <p><strong>Damage Taken: </strong>{weeklyGames[4].response2.matches[9].playerStats.damageTaken}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="tab-pane fade" id="updates" role="tabpanel" aria-labelledby="updates-tab">
                            <div className="row mt-3">
                                <div className="col-12 col-md-10 col-lg-8 mb-3 text-white">
                                    <h5>Planned Updates</h5>
                                    <ul>
                                        <li className="text-decoration-line-through">Show date & time of recent matches</li>
                                        <li>Show ranks of matches based on average KD of lobby (similar to sbmmwarzone)</li>
                                        <li>Have countdown timer show seconds as well as minutes</li>
                                        <li>Show squad stats in recent games</li>
                                        <li className="text-decoration-line-through">Show 10 most recent games as opposed to 5</li>
                                        <li>Render recent games dynamically rather than each of them be hard-coded</li>
                                        <li>Have the site render new stats automatically when they are fetched, allowing the user to see new stats without refreshing the page</li>
                                        <li className="text-decoration-line-through">Make the site look nicer</li>
                                        <li>Save stats in local storage of users' browsers - Saving on resources</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Test;