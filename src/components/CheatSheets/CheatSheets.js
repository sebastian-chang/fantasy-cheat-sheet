import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import apiUrl from '../../apiConfig'
import axios from 'axios'

import Button from '../shared/Button/Button'

const CheatSheet = props => {
  const [sheets, setSheets] = useState([])

  // Setup for modal display
  const [modalIsOpen, setIsOpen] = useState(false)
  // Open modal
  const openModal = () => {
    setIsOpen(true)
  }
  // Close modal
  const closeModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    Modal.setAppElement('.sheets')
    console.log('are we making it here')
    axios({
      url: apiUrl + '/sheets/',
      headers: {
        'Authorization': `Token ${props.user.token}`
      }
    })
      .then(res => setSheets(res.data.sheets))
      // .then(res => console.log('here', res.data))
      .catch(console.error)
  }, [])

  const createSheet = (sheet) => {
    return (axios({
      url: apiUrl + '/sheets/',
      method: 'POST',
      headers: {
        'Authorization': `Token ${props.user.token}`
      },
      data: {
        sheet: {
          title: sheet.title
        }
      }
    })
      .then()
      .catch()
    )
  }

  const sheetList = sheets.map(sheet => (
    <div key={sheet.id}>
      <h4>{sheet.title}</h4>
    </div>
  ))

  return (
    <div className='sheets'>
      {sheetList}
      <Button buttonLabel={'Create Sheet'} clickFunction={openModal} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        // style={customStyles}
        contentLabel="Credit Card Form"
      >
        TEST MODAL
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  )
}

export default CheatSheet
