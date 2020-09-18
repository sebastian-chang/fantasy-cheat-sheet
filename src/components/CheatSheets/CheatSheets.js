import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact'

import apiUrl from '../../apiConfig'
import axios from 'axios'

import Button from '../shared/Button/Button'
import Input from '../shared/Input/Input'

const CheatSheet = props => {
  const [sheets, setSheets] = useState([])
  const [title, setTitle] = useState({ 'title': '' })

  // Setup for modal display
  const [modalIsOpen, setIsOpen] = useState(false)
  // Toggle Modal
  const toggleModal = () => {
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

  const createSheet = () => {
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
      })
      .catch(console.error)
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
          <Input eventHandler={handleChange} name={'title'} value={title.title} label={'Title'} type={'text'} />
        </MDBModalBody>
        <MDBModalFooter style={{ 'background': '#eee' }}>
          <Button clickFunction={toggleModal} buttonLabel={'Close'} />
          <Button clickFunction={createSheet} buttonLabel={'Create Sheet'} />
        </MDBModalFooter>
      </MDBModal>
    </div>
  )
}

export default CheatSheet
