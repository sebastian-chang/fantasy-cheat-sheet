import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import {
    MDBCard, MDBCardBody, MDBCardTitle, MDBCardFooter, MDBBtn
} from 'mdbreact'

import './PlayerDetails.scss'
import apiUrl from '../../apiConfig'
import axios from 'axios'

const PlayerDetails = props => {
    const [player, setPlayer] = useState({})
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
    return (
        <MDBCard className='mt-3'>
            <MDBCardBody>
                <div className='playerInfoCard'>
                    <div className='playerInfoImage playerInfoBackground' style={{ 'backgroundImage': `url(${player.team_logo})` }}><img className="rounded mx-auto z-depth-2" src={player.photo_url} /></div>
                    <div className='infoCard'>
                        <p><span className='infoLabel'>Height:</span> {player.height}</p>
                        <p><span className='infoLabel'>Weight:</span> {player.weight}</p>
                        <p><span className='infoLabel'>DOB:</span> {player.dob}</p>
                        <p><span className='infoLabel'>Age:</span> {player.age}</p>
                        <p><span className='infoLabel'>Team:</span> {player.city_team == '' ? player.current_team : player.city_team}</p>
                        <p><span className='infoLabel'>Position:</span> {player.position}</p>
                    </div>
                </div>
                <div className='playerInfoName'>
                    <MDBCardTitle>{player.first_name} {player.last_name}</MDBCardTitle>
                </div>
                <MDBCardFooter className='playerInfoFooter'>
                    <MDBBtn color='blue-grey' onClick={props.history.goBack}>Back</MDBBtn>
                </MDBCardFooter>
            </MDBCardBody>
        </MDBCard>
    )
}

export default withRouter(PlayerDetails)