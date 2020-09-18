import React, { useEffect, useState } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import Select from 'react-select'

import {
    MDBContainer, MDBListGroup, MDBListGroupItem, MDBIcon,
    MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
    MDBBtn, MDBForm
} from 'mdbreact'

import Button from '../shared/Button/Button'
import Input from '../shared/Input/Input'

import apiUrl from '../../apiConfig'
import axios from 'axios'

import { teams, positions } from '../../footballVariables'

const CheatSheet = props => {
    const [sheet, setSheet] = useState({})
    const [player, setPlayer] = useState({
        'first_name': '',
        'last_name': '',
        'position': '',
        'current_team': '',
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
            'sheet': props.match.params.id,
        })
        setPlayerIsOpen(!playerModalIsOpen)
    }
    // // Whenever the player modal closes reset
    // const closePlayerModal = () => {
    //     setPlayer({
    //         'first_name': '',
    //         'last_name': '',
    //         'position': '',
    //         'current_team': '',
    //         'sheet': props.match.params.id,
    //     })
    //     setPlayerIsOpen(false)
    // }
    // If user cancels out of update revert back to previous title
    const openUpdatePlayerModal = (playerID) => {
        const index = sheet.players.findIndex(player => { return player.id === playerID })
        const player = sheet.players[index]
        console.log('this is what player looks like ', player)
        setPlayer({
            'first_name': player.first_name,
            'last_name': player.last_name,
            'position': player.position,
            'current_team': player.current_team,
            'sheet': props.match.params.id,
        })
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

    const deleteSheet = () => {
        axios({
            url: apiUrl + `/sheets/${props.match.params.id}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(() => props.history.push('/cheat-sheet'))
            .catch(console.error)
    }

    const updateSheet = () => {
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
            })
            .catch(console.error)
        )
    }

    const addPlayer = (event) => {
        event.preventDefault()
        console.log('what is happening', player)
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
                console.log('this is add player response', res.data.player)
                console.log('this is what the sheet looks like', sheet)
                const newPlayers = [...sheet.players]
                newPlayers.push(res.data.player)
                console.log('this is new players', newPlayers)
                setSheet(prevSheet => {
                    const updatedField = { 'players': newPlayers }
                    const editedSheet = Object.assign({}, prevSheet, updatedField)
                    return editedSheet
                })
            })
            .then(() => playerToggleModal())
            .catch(console.error)
        )
    }
    const deletePlayer = (playerID) => {
        console.log('delete stuff', playerID)
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
            })
            .catch(console.error)
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

    let player_list = ''
    if (sheet.players) {
        player_list = sheet.players.map(player => {
            if (player) {
                return (
                    <MDBListGroupItem key={player.id}>
                        {player.current_team} - {player.position}: {player.first_name} {player.last_name}
                        <span style={{ 'float': 'right', 'color': 'red', 'paddingLeft': '25px' }} onClick={() => deletePlayer(player.id)}><MDBIcon icon="minus-circle" /></span>
                        <span style={{ 'float': 'right', 'color': 'green' }} onClick={() => openUpdatePlayerModal(player.id)}><MDBIcon icon="pencil-alt" /></span>
                    </MDBListGroupItem>
                )
            }
        })
    }
    return (
        <div>
            <h2>{sheet.title}
            <span style={{ 'cursor': 'pointer', 'fontSize': '.9rem', 'padding-left': '25px' }}><MDBIcon onClick={titleToggleModal} icon="pencil-alt" /></span></h2>
            <MDBContainer>
                <MDBListGroup style={{ width: '60vw' }}>
                    {player_list}
                </MDBListGroup>
            </MDBContainer>
            <Button clickFunction={props.history.goBack} buttonLabel={'Back'} />
            <Button clickFunction={playerToggleModal} buttonLabel={'Add player'} />
            <Button clickFunction={deleteSheet} buttonLabel={'Delete Sheet'} />

            {/* Update cheat sheet title modal */}
            <MDBModal isOpen={titleModalIsOpen} toggle={cancelUpdate}>
                <MDBModalHeader toggle={cancelUpdate}>Update: {sheet.title}</MDBModalHeader>
                <MDBModalBody>
                    <Input eventHandler={handleSheetChange} name={'title'} value={sheet.title} label={'Title'} type={'text'} />
                </MDBModalBody>
                <MDBModalFooter style={{ 'background': '#eee' }}>
                    <Button clickFunction={cancelUpdate} buttonLabel={'Cancel'} />
                    <Button clickFunction={updateSheet} buttonLabel={'Update Sheet'} />
                </MDBModalFooter>
            </MDBModal>

            {/* Player modal */}
            <MDBModal isOpen={playerModalIsOpen} toggle={playerToggleModal}>
                <MDBModalHeader toggle={playerToggleModal}>Add a player</MDBModalHeader>
                <MDBModalBody>
                    <form onSubmit={addPlayer}>
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
                            <Button buttonLabel={'Add Player'} type={'submit'} />
                        </div>
                    </form>
                </MDBModalBody>
            </MDBModal>
        </div>
    )
}

export default withRouter(CheatSheet)
