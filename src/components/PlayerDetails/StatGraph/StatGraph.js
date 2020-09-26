import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import Lodash from 'lodash'

import apiUrl from '../../../apiConfig'
import axios from 'axios'
import { withRouter } from 'react-router'

const StatGraph = props => {
    const [playerStats, setPlayerStats] = useState({})

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

    // Random color generator
    function getRandomColor () {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    // User lodash to group seasons together
    const seasonGroup = Lodash.groupBy(playerStats, 'season')
    const data = {}
    const datasets = []
    // Format player stat data to be used by ChartJS2
    for (const key in seasonGroup) {
        const qbRatingData = []
        for (const i in seasonGroup[key]) {
            // qbRatingData.push([i + 1, seasonGroup[key][i]['qbrating']])
            qbRatingData.push(seasonGroup[key][i]['qbrating'])
        }
        const color = getRandomColor()
        const seasonData = {
            label: `Season ${key}`,
            fill: false,
            lineTension: 0.5,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: qbRatingData
        }
        datasets.push(seasonData)
    }
    // Create labels for graph
    data['labels'] = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13', 'Week 14', 'Week 15', 'Week 16']
    data['datasets'] = datasets

    const lineChart = (
        // A react-chart hyper-responsively and continuously fills the available
        // space of its parent element automatically
        <div>
            <Line
                data={data}
                options={{
                    title: {
                        display: true,
                        text: 'QB Rating',
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            />
        </div>
    )
    return (
        <div>
            {lineChart}
        </div>
    )
}

export default withRouter(StatGraph)
