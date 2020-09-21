import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Select from 'react-select'

import {
    MDBContainer, MDBListGroup, MDBListGroupItem, MDBIcon,
    MDBModal, MDBModalHeader, MDBModalBody
} from 'mdbreact'
import {Roller} from 'react-awesome-spinners'

import './CheatSheet.scss'
import Button from '../shared/Button/Button'
import Input from '../shared/Input/Input'

import apiUrl from '../../apiConfig'
import axios from 'axios'

import { teams, positions } from '../../footballVariables'
import messages from '../AutoDismissAlert/messages'

const CheatSheet = props => {
    const [updating, setUpdating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sheet, setSheet] = useState({})
    const [player, setPlayer] = useState({
        'first_name': '',
        'last_name': '',
        'position': '',
        'current_team': '',
        'id': 0,
        'sheet': props.match.params.id,
    })
    const [tempSheet, setTempSheet] = useState({})

    // Setup for sheet title modal display
    const [titleModalIsOpen, setTitleIsOpen] = useState(false)
    // Toggle Modal
    const titleToggleModal = () => {
        //  Save previous state in case user cancels out of updating the sheet
        if (!titleModalIsOpen) {
            setTempSheet(sheet)
        }
        setTitleIsOpen(!titleModalIsOpen)
    }
    // If user cancels out of update revert back to previous title
    const cancelUpdate = () => {
        setSheet(tempSheet)
        setTitleIsOpen(false)
    }

    // Setup for add player modal display
    const [playerModalIsOpen, setPlayerIsOpen] = useState(false)
    // Toggle Modal
    const playerToggleModal = () => {
        setPlayer({
            'first_name': '',
            'last_name': '',
            'position': '',
            'current_team': '',
            'id': 0,
            'sheet': props.match.params.id,
        })
        setPlayerIsOpen(!playerModalIsOpen)
        setUpdating(false)
    }
    // If user cancels out of update revert back to previous title
    const openUpdatePlayerModal = (playerID) => {
        const index = sheet.players.findIndex(player => { return player.id === playerID })
        const player = sheet.players[index]
        setPlayer({
            'first_name': player.first_name,
            'last_name': player.last_name,
            'position': player.position,
            'current_team': player.current_team,
            'id': player.id,
            'sheet': props.match.params.id,
        })
        setUpdating(true)
        setPlayerIsOpen(true)
    }

    // API calls
    useEffect(() => {
        axios({
            url: apiUrl + `/sheets/${props.match.params.id}`,
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(res => setSheet(res.data.sheet))
            .catch(console.error)
    }, [])

    // Sheet API calls
    const deleteSheet = () => {
        axios({
            url: apiUrl + `/sheets/${props.match.params.id}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(() => {
                props.history.push('/cheat-sheet')
                props.msgAlert({
                    heading: 'Delete sheet success',
                    message: messages.deletedSheetSuccess,
                    variant: 'success'
                })
            })
            .catch(error => {
                console.error
                props.msgAlert({
                    heading: 'Delete sheet failed with error: ' + error.message,
                    message: messages.deletedSheetFailure,
                    variant: 'danger'
                })
            })
    }

    // Update cheat sheet
    const updateSheet = (event) => {
        event.preventDefault()
        return (axios({
            url: apiUrl + `/sheets/${props.match.params.id}/`,
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${props.user.token}`
            },
            data: {
                sheet: sheet
            }
        })
            .then(res => {
                setSheet(res.data.sheet)
                setTitleIsOpen(false)
                props.msgAlert({
                    heading: 'Update sheet success',
                    message: messages.updatedSheetSuccess,
                    variant: 'success'
                })
            })
            .catch(error => {
                console.error
                props.msgAlert({
                    heading: 'Update sheet failed with error: ' + error.message,
                    message: messages.updatedSheetFailure,
                    variant: 'danger'
                })
            })
        )
    }

    // Player API calls
    // Create a new player
    const addPlayer = (event) => {
        event.preventDefault()
        setLoading(true)
        return (axios({
            url: apiUrl + `/players/`,
            method: 'POST',
            headers: {
                'Authorization': `Token ${props.user.token}`
            },
            data: {
                player: player
            }
        })
            .then(res => {
                // setSheet(res.data.sheet)
                const newPlayers = [...sheet.players]
                newPlayers.push(res.data.player)
                setSheet(prevSheet => {
                    const updatedField = { 'players': newPlayers }
                    const editedSheet = Object.assign({}, prevSheet, updatedField)
                    return editedSheet
                })
                playerToggleModal()
                setLoading(false)
                props.msgAlert({
                    heading: 'Create player success',
                    message: messages.createdPlayerSuccess,
                    variant: 'success'
                })
            })
            // .then(() => )
            .catch(error => {
                console.error
                setLoading(false)
                props.msgAlert({
                    heading: 'Create player failed with error: ' + error.message,
                    message: messages.createdPlayerFailure,
                    variant: 'danger'
                })
            })
        )
    }
    //Update player information
    const updatePlayer = (event) => {
        event.preventDefault()
        setLoading(true)
        return (axios({
            url: apiUrl + `/players/${player.id}/`,
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${props.user.token}`
            },
            data: {
                player: player
            }
        })
            .then(res => {
                const index = sheet.players.findIndex(findPlayer => { return findPlayer.id === player.id })
                const newPlayers = [...sheet.players]
                newPlayers[index] = res.data.player
                setSheet(prevSheet => {
                    const updatedField = { 'players': newPlayers }
                    const editedSheet = Object.assign({}, prevSheet, updatedField)
                    return editedSheet
                })
                setLoading(false)
                props.msgAlert({
                    heading: 'Update player success',
                    message: messages.updatedPlayerSuccess,
                    variant: 'success'
                })
            })
            .then(() => playerToggleModal())
            .catch(error => {
                console.error
                setLoading(false)
                props.msgAlert({
                    heading: 'Update player failed with error: ' + error.message,
                    message: messages.updatedPlayerFailure,
                    variant: 'danger'
                })
            })
        )
    }
    // Remove a player from the cheat sheet
    const deletePlayer = (playerID) => {
        return (axios({
            url: apiUrl + `/players/${playerID}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        }))
            .then(() => {
                const index = sheet.players.findIndex(player => { return player.id === playerID })
                const newPlayers = [...sheet.players]
                newPlayers.splice(index, 1)
                setSheet(prevSheet => {
                    const updatedField = { 'players': newPlayers }
                    const editedSheet = Object.assign({}, prevSheet, updatedField)
                    return editedSheet
                })
                props.msgAlert({
                    heading: 'Delete player success',
                    message: messages.deletedPlayerSuccess,
                    variant: 'success'
                })
            })
            .catch(error => {
                console.error
                props.msgAlert({
                    heading: 'Delete player failed with error: ' + error.message,
                    message: messages.deletedPlayerFailure,
                    variant: 'danger'
                })
            })
    }

    // Handles input changes to the sheets title
    const handleSheetChange = event => {
        event.persist()

        setSheet(prevSheet => {
            const updatedField = { [event.target.name]: event.target.value }
            const editedSheet = Object.assign({}, prevSheet, updatedField)
            return editedSheet
        })
    }

    // Handles change for player info
    const handlePlayerChange = event => {
        event.persist()

        setPlayer(prevPlayer => {
            const updatedField = { [event.target.name]: event.target.value }
            const editedPlayer = Object.assign({}, prevPlayer, updatedField)
            return editedPlayer
        })
    }
    // Handles select drop down for player position
    const handlePositionChange = selectedOption => {
        setPlayer(prevPlayer => {
            const updatedField = { 'position': selectedOption.value }
            const editedPlayer = Object.assign({}, prevPlayer, updatedField)
            return editedPlayer
        })
    }
    // Handles select drop down for player's current team
    const handleTeamChange = selectedOption => {
        setPlayer(prevPlayer => {
            const updatedField = { 'current_team': selectedOption.value }
            const editedPlayer = Object.assign({}, prevPlayer, updatedField)
            return editedPlayer
        })
    }

    // Generates a list of players in each sheet
    let player_list = ''
    if (sheet.players) {
        player_list = sheet.players.map(player => {
            if (player) {
                return (
                    <MDBListGroupItem key={player.id} className={'playerCard ' + player.current_team}>
                        <Link to={`/player/${player.id}`} className='playerLink'>
                        {player.position} - {player.current_team}: {player.first_name} {player.last_name}
                        </Link>
                        <span style={{ 'float': 'right', 'marginLeft': '25px' }} onClick={() => deletePlayer(player.id)}><MDBIcon icon="trash-alt" /></span>
                        <span style={{ 'float': 'right' }} onClick={() => openUpdatePlayerModal(player.id)}><MDBIcon icon="pencil-alt" /></span>
                    </MDBListGroupItem>
                )
            }
        })
    }
    return (
        <div className='col-12 col-md-9'>
            <h2>{sheet.title}
                <span style={{ 'cursor': 'pointer', 'fontSize': '.9rem', 'paddingLeft': '25px' }}><MDBIcon onClick={titleToggleModal} icon="pencil-alt" /></span></h2>
            <MDBContainer className='cheatsheet'>
                <MDBListGroup>
                    {player_list}
                </MDBListGroup>
            </MDBContainer>
            <Button clickFunction={props.history.goBack} buttonLabel={'Back'} />
            <Button clickFunction={playerToggleModal} buttonLabel={'Add player'} />
            <Button clickFunction={deleteSheet} buttonLabel={'Delete Sheet'} />

            {/* Update cheat sheet title modal */}
            <MDBModal isOpen={titleModalIsOpen} toggle={cancelUpdate}>
                <MDBModalHeader toggle={cancelUpdate}>Update title</MDBModalHeader>
                <MDBModalBody>
                    <form onSubmit={updateSheet}>
                        <Input eventHandler={handleSheetChange} name={'title'} value={sheet.title} label={'Title'} type={'text'} required={true} />
                        {/* Footer */}
                        <div sytle={{ 'position': 'absolute', 'right': 0, 'background': '#eee' }}>
                            <Button clickFunction={cancelUpdate} buttonLabel={'Cancel'} />
                            <Button buttonLabel={'Update Sheet'} type={'submit'} />
                        </div>
                    </form>
                </MDBModalBody>
            </MDBModal>

            {/* Player modal */}
            <MDBModal isOpen={playerModalIsOpen} toggle={playerToggleModal}>
                <MDBModalHeader toggle={playerToggleModal}>{updating ? 'Update player' : 'Add a player'}</MDBModalHeader>
                <MDBModalBody>
                    {loading ? <Roller /> :
                    <form onSubmit={updating ? updatePlayer : addPlayer}>
                        <Input eventHandler={handlePlayerChange} name={'first_name'} value={player.first_name} label={'First Name'} type={'text'} required={true} />
                        <Input eventHandler={handlePlayerChange} name={'last_name'} value={player.last_name} label={'Last Name'} type={'text'} required={true} />

                        {/* Dropdown menus */}
                        <Select
                            name={'position'}
                            label='Position'
                            autoFocus={true}
                            onChange={handlePositionChange}
                            options={positions}
                            placeholder={'Select a position'}
                            value={positions.filter(position => position.value === player.position)}
                        />
                        {!props.disabled && (
                            <input tabIndex={-1}
                                autoComplete="off"
                                style={{ opacity: 0, height: 0 }}
                                value={player.position}
                                onChange={() => ''}
                                required={true} />
                        )}
                        <br />
                        <Select
                            name={'current_team'}
                            autoFocus={true}
                            onChange={handleTeamChange}
                            options={teams}
                            placeholder={'Select a team'}
                            value={teams.filter(team => team.value === player.current_team)}
                        />
                        {!props.disabled && (
                            <input tabIndex={-1}
                                autoComplete="off"
                                style={{ opacity: 0, height: 0 }}
                                value={player.current_team}
                                onChange={() => ''}
                                required={true} />
                        )}
                        {/* Footer */}
                        <div sytle={{ 'position': 'absolute', 'right': 0, 'background': '#eee' }}>
                            <Button clickFunction={playerToggleModal} buttonLabel={'Cancel'} type={'button'} />
                            <Button buttonLabel={updating ? 'Update Player' : 'Add Player'} type={'submit'} />
                        </div>
                    </form>}
                </MDBModalBody>
            </MDBModal>
        </div>
    )
}

export default withRouter(CheatSheet)
