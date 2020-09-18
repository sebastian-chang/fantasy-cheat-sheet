import React from 'react'
import { MDBBtn } from 'mdbreact'

const Button = ({ type, clickFunction, buttonLabel, buttonStyle }) => (
    <button type={type} style={buttonStyle} onClick={clickFunction}>{buttonLabel}</button>
)

export default Button
