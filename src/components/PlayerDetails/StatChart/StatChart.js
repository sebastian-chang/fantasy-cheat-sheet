import React, { useEffect, useState } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import './StatChart.css'

import apiUrl from '../../../apiConfig'
import axios from 'axios'
import { withRouter } from 'react-router'

const StatChart = props => {
    const [playerStats, setPlayerStats] = useState({})
    const oppList = {}
    const seasonList = {}

    // API call to get player stats data
    useEffect(() => {
        axios({
            url: apiUrl + `/qb-stat/${props.pid}`,
            headers: {
                'Authorization': `Token ${props.user.token}`
            }
        })
            .then(res => setPlayerStats(res.data.player_stats))
            .catch(console.error)
    }, [])

    // React Bootstrap table function
    function enumFormatter (cell, row, enumObject) {
        return enumObject[cell];
    }

    // Loop through data to create new objects for filtering rows
    for (const i in playerStats) {
        // Check to see if opponent already exists in object
        if (oppList[playerStats[i]['opponent']] === undefined) {
            oppList[playerStats[i]['opponent']] = playerStats[i]['opponent']
        }
        // Check to see if season already exists
        if (seasonList[playerStats[i]['season']] === undefined) {
            seasonList[playerStats[i]['season']] = playerStats[i]['season']
        }
    }
    // Creates an empty table on component load
    let table = ''
    // After data loads up create season stats table
    if (playerStats.length > 0) {
        table = (
            <BootstrapTable data={playerStats}>
                <TableHeaderColumn dataField='id' isKey={true} hidden>Product ID</TableHeaderColumn>
                <TableHeaderColumn dataField='week'>Week</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='season'
                    filterFormatted
                    dataFormat={enumFormatter}
                    formatExtraData={seasonList}
                    filter={{ type: 'SelectFilter', options: seasonList }}
                >
                    Season
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='opponent'
                    filterFormatted
                    dataFormat={enumFormatter}
                    formatExtraData={oppList}
                    filter={{ type: 'SelectFilter', options: oppList }}
                >
                    Opponent
                </TableHeaderColumn>
                <TableHeaderColumn dataField='passcompletions' >Pass Completions</TableHeaderColumn>
                <TableHeaderColumn dataField='passattempts' >Pass Attempts</TableHeaderColumn>
                <TableHeaderColumn dataField='passpct' >Pass Percentage</TableHeaderColumn>
                <TableHeaderColumn dataField='passyards' >Passing Yards</TableHeaderColumn>
                <TableHeaderColumn dataField='passint' >Interceptions</TableHeaderColumn>
                <TableHeaderColumn dataField='passtd' >Touchdowns</TableHeaderColumn>
                <TableHeaderColumn dataField='qbrating' >QB Rating</TableHeaderColumn>
            </BootstrapTable>
        )
    }
    return (
        <div>
            { table }
        </div>
    )
}

export default withRouter(StatChart)
