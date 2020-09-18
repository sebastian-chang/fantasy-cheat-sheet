import React, { useEffect, useState } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import Select from 'react-select'

import {
    MDBContainer, MDBListGroup, MDBListGroupItem, MDBIcon,
    MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
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
        setPlayerIsOpen(!playerModalIsOpen)
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

    const addPlayer = () => {
        console.log('this is player if I hit submit ', player)
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
                setPlayerIsOpen(false)
            })
            .catch(console.error)
        )
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
                    <MDBListGroupItem key={player.id} href='#/cheat-sheet'>
                        {player.current_team} - {player.position}: {player.first_name} {player.last_name}
                    </MDBListGroupItem>
                )
            }
        })
    }
    return (
        <div>
            <h2>{sheet.title}<span style={{ 'cursor': 'pointer', 'fontSize': '.9rem' }}><MDBIcon onClick={titleToggleModal} icon="pencil-alt" /></span></h2>
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

            {/* Add player modal */}
            <MDBModal isOpen={playerModalIsOpen} toggle={playerToggleModal}>
                <MDBModalHeader toggle={playerToggleModal}>Update: {sheet.title}</MDBModalHeader>
                <MDBModalBody>
                    <Input eventHandler={handlePlayerChange} name={'first_name'} value={player.first_name} label={'First Name'} type={'text'} />
                    <Input eventHandler={handlePlayerChange} name={'last_name'} value={player.last_name} label={'Last Name'} type={'text'} />

                    {/* Dropdown menus */}
                    <span>Player Position</span>
                    <Select name={'position'} label='Position' autoFocus={true} onChange={handlePositionChange} options={positions} />
                    <span>Team</span>
                    <Select name={'current_team'} autoFocus={true} onChange={handleTeamChange} options={teams} />
                </MDBModalBody>

                {/* Footer */}
                <MDBModalFooter style={{ 'background': '#eee' }}>
                    <Button clickFunction={playerToggleModal} buttonLabel={'Cancel'} />
                    <Button clickFunction={addPlayer} buttonLabel={'Add Player'} />
                </MDBModalFooter>
            </MDBModal>
        </div>
    )
}

export default withRouter(CheatSheet)
