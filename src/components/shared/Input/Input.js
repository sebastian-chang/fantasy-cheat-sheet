import React from 'react'
import { MDBInput } from 'mdbreact'

const Input = props => {
    return (
        <MDBInput
        onChange={props.eventHandler}
        label={props.label}
        type={props.type}
        name={props.name}
        value={props.value} />
    )
}

export default Input