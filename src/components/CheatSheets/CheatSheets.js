import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBModal, MDBModalHeader, MDBModalBody, MDBBtn, MDBContainer, MDBListGroup, MDBListGroupItem, MDBBadge } from 'mdbreact'

import apiUrl from '../../apiConfig'
import axios from 'axios'
import messages from '../AutoDismissAlert/messages'

import Input from '../shared/Input/Input'
import './CheatSheets.scss'

const CheatSheet = props => {
    const [sheets, setSheets] = useState([])
    const [title, setTitle] = useState({ 'title': '' })

    // Setup for modal display
    const [modalIsOpen, setIsOpen] = useState(false)
    // Toggle Modal
    const toggleModal = () => {
        setTitle({ 'title': '' })
        setIsOpen(!modalIsOpen)
    }

    useEffect(() => {
        axios({
            url: apiUrl + '/sheets/',
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(res => setSheets(res.data.sheets))
            .catch(console.error)
    }, [])

    // Creates a new cheat sheet
    const createSheet = (event) => {
        event.preventDefault()
        return (axios({
            url: apiUrl + '/sheets/',
            method: 'POST',
            headers: {
                'Authorization': `Token ${props.user.token}`
            },
            data: {
                sheet: {
                    title: title.title
                }
            }
        })
            // add newly created cheat sheet to local state
            .then(res => {
                const newList = sheets
                newList.push(res.data.sheet)
                setSheets(newList)
                setIsOpen(false)
                props.msgAlert({
                    heading: 'Create sheet success',
                    message: messages.createdSheetSuccess,
                    variant: 'success'
                })
            })
            .catch(error => {
                // console.error
                props.msgAlert({
                    heading: 'Create sheet failed with error: ' + error.message,
                    message: messages.createdSheetSuccess,
                    variant: 'danger'
                })
            })
        )
    }

    const handleChange = event => {
        setTitle({ [event.target.name]: event.target.value })
    }

    const sheetList = sheets.map(sheet => (
        <Link key={sheet.id} to={`/cheat-sheet/${sheet.id}`}>
            <MDBListGroupItem className="d-flex justify-content-between align-items-center sheets-links"><h4>{sheet.title}</h4>
                <MDBBadge color="primary" pill>{sheet.players.length}</MDBBadge>
            </MDBListGroupItem>
        </Link>
    ))

    return (
        <div className='sheets'>
            <MDBContainer>
                <MDBListGroup className='sheets-group'>
                    {sheetList}
                </MDBListGroup>
            </MDBContainer>
            {/* <Button buttonLabel={'Create Sheet'} clickFunction={toggleModal} /> */}
            <MDBBtn className='sheets-create' onClick={toggleModal} color='primary'>Create Sheet</MDBBtn>
            <MDBModal isOpen={modalIsOpen} toggle={toggleModal}>
                <MDBModalHeader toggle={toggleModal}>Create Cheat Sheet</MDBModalHeader>
                <MDBModalBody>
                    <form onSubmit={createSheet}>
                        <Input eventHandler={handleChange} name={'title'} value={title.title} label={'Title'} type={'text'} />
                        <div sytle={{ 'position': 'absolute', 'right': 0, 'background': '#eee' }}>
                            <MDBBtn onClick={toggleModal} color='blue-grey'>Close</MDBBtn>
                            <MDBBtn type='submit' color='primary'>Submit</MDBBtn>
                        </div>
                    </form>
                </MDBModalBody>
            </MDBModal>
        </div>
    )
}

export default CheatSheet
