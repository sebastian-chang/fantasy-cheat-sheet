import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact'

import apiUrl from '../../apiConfig'
import axios from 'axios'
import messages from '../AutoDismissAlert/messages'

import Button from '../shared/Button/Button'
import Input from '../shared/Input/Input'

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

  const createSheet = (event) => {
    event.preventDefault()
    console.log('sheets before new add ', sheets)
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
        const new_list = sheets
        new_list.push(res.data.sheet)
        setSheets(new_list)
        setIsOpen(false)
        props.msgAlert({
          heading: 'Create sheet success',
          message: messages.createdSheetSuccess,
          variant: 'success'
        })
      })
      .catch(error => {
        console.error
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
      <h4>{sheet.title}</h4>
    </Link>
  ))

  return (
    <div className='sheets'>
      {sheetList}
      <Button buttonLabel={'Create Sheet'} clickFunction={toggleModal} />
      <MDBModal isOpen={modalIsOpen} toggle={toggleModal}>
        <MDBModalHeader toggle={toggleModal}>Create Cheat Sheet</MDBModalHeader>
        <MDBModalBody>
          <form onSubmit={createSheet}>
            <Input eventHandler={handleChange} name={'title'} value={title.title} label={'Title'} type={'text'} />
            <div sytle={{ 'position': 'absolute', 'right': 0, 'background': '#eee' }}>
              <Button clickFunction={toggleModal} type={'button'} buttonLabel={'Close'} />
              <Button buttonLabel={'Create Sheet'} type={'submit'} />
            </div>
          </form>
        </MDBModalBody>
      </MDBModal>
    </div>
  )
}

export default CheatSheet
