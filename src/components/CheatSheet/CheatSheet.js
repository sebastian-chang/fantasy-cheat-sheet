import React, { useEffect, useState } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'

import {
    MDBContainer, MDBListGroup, MDBListGroupItem, MDBIcon,
    MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter
} from 'mdbreact'

import Button from '../shared/Button/Button'
import Input from '../shared/Input/Input'

import apiUrl from '../../apiConfig'
import axios from 'axios'

const CheatSheet = props => {
    const [sheet, setSheet] = useState({})
    const [tempSheet, setTempSheet] = useState({})

    // Setup for modal display
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
        console.log('this is what sheet looks like ', sheet)
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

    const handleTitleChange = event => {
        setSheet({
            ...sheet,
            [event.target.name]: event.target.value
        })
    }

    console.log('sheet on load ', sheet)
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
            <h2>{sheet.title}<span style={{ 'cursor': 'pointer', 'font-size': '.9rem' }}>    <MDBIcon onClick={titleToggleModal} icon="pencil-alt" /></span></h2>
            <MDBContainer>
                <MDBListGroup style={{ width: '60vw' }}>
                    {player_list}
                </MDBListGroup>
            </MDBContainer>
            <Button clickFunction={props.history.goBack} buttonLabel={'Back'} />
            {/* <Button clickFunction={'somethong'} buttonLabel={'Add player'} /> */}
            <Button clickFunction={deleteSheet} buttonLabel={'Delete Sheet'} />

            {/* Update cheat sheet title modal */}
            <MDBModal isOpen={titleModalIsOpen} toggle={cancelUpdate}>
                <MDBModalHeader toggle={cancelUpdate}>Update: {sheet.title}</MDBModalHeader>
                <MDBModalBody>
                    <Input eventHandler={handleTitleChange} name={'title'} value={sheet.title} label={'Title'} type={'text'} />
                </MDBModalBody>
                <MDBModalFooter style={{ 'background': '#eee' }}>
                    <Button clickFunction={cancelUpdate} buttonLabel={'Cancel'} />
                    <Button clickFunction={updateSheet} buttonLabel={'Update Sheet'} />
                </MDBModalFooter>
            </MDBModal>
        </div>
    )
}

export default withRouter(CheatSheet)
