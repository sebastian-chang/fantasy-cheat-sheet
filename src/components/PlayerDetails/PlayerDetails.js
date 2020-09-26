import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import {
    MDBCard, MDBCardBody, MDBCardTitle, MDBCardFooter, MDBBtn
} from 'mdbreact'

import './PlayerDetails.scss'
import PlayerChart from './StatChart/StatChart'
import PlayerGraph from './StatGraph/StatGraph'
import apiUrl from '../../apiConfig'
import axios from 'axios'

const PlayerDetails = props => {
    const [player, setPlayer] = useState(null)
    const [stats, setStats] = useState(false)
    const [graph, setGraphs] = useState(false)
    useEffect(() => {
        axios({
            url: apiUrl + `/players/${props.match.params.id}`,
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(res => setPlayer(res.data.player))
            .catch(console.error)
    }, [])

    // Toggles for player stats and graphs
    const turnStatsOn = () => {
        setStats(true)
        setGraphs(false)
    }
    const turnGraphssOn = () => {
        setGraphs(true)
        setStats(false)
    }

    // Create buttons to be used if player has stats
    const playerStatsButton = (
        <span>
            <MDBBtn color='primary' onClick={turnStatsOn}>Stats</MDBBtn>
            <MDBBtn color='primary' onClick={turnGraphssOn}>Graphs</MDBBtn>
        </span>
    )
    let playerCard = ''
    if (player) {
        playerCard = (
            <div>
                <MDBCard className='mt-3'>
                    <MDBCardBody>
                        <div className='playerInfoCard'>
                            <div className='playerInfoImage playerInfoBackground' style={{ 'backgroundImage': `url(${player.team_logo})` }}><img className="rounded mx-auto z-depth-2" src={player.photo_url} /></div>
                            <div className='infoCard'>
                                <p><span className='infoLabel'>Height:</span> {player.height}</p>
                                <p><span className='infoLabel'>Weight:</span> {player.weight}</p>
                                <p><span className='infoLabel'>DOB:</span> {player.dob}</p>
                                <p><span className='infoLabel'>Age:</span> {player.age}</p>
                                <p><span className='infoLabel'>Team:</span> {player.city_team === '' ? player.current_team : player.city_team}</p>
                                <p><span className='infoLabel'>Position:</span> {player.position}</p>
                            </div>
                        </div>
                        <div className='playerInfoName'>
                            <MDBCardTitle>{player.first_name} {player.last_name}</MDBCardTitle>
                        </div>
                        <MDBCardFooter className='playerInfoFooter'>
                            <MDBBtn color='blue-grey' onClick={props.history.goBack}>Back</MDBBtn>{player.has_stats ? playerStatsButton : ''}
                        </MDBCardFooter>
                    </MDBCardBody>
                </MDBCard>
                <MDBCard className='mt-2 mb-2'>
                    {stats ? <PlayerChart user={props.user} pid={player.MSF_PID} /> : ''}
                    {graph ? <PlayerGraph user={props.user} pid={player.MSF_PID} /> : ''}
                </MDBCard>
            </div>
        )
    }
    return (
        <div>
            {playerCard}
        </div>
    )
}

export default withRouter(PlayerDetails)
