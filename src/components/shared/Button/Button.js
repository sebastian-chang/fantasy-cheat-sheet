import React from 'react'

const Button = ({ clickFunction, buttonLabel, buttonStyle }) => (
    <button type="button" style={buttonStyle} onClick={clickFunction}>{buttonLabel}</button>
)

export default Button
