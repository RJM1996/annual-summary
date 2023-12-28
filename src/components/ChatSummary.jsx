import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'

const ChatSummary = ({ chatData }) => {
  const [yearlyStats, setYearlyStats] = useState({})
  const [monthlyStats, setMonthlyStats] = useState({})
  const [mostActiveDay, setMostActiveDay] = useState({})
  const [earliestDay, setEarliestDay] = useState({})
  const [latestDay, setLatestDay] = useState({})
  const [recentMessages, setRecentMessages] = useState([])
  const [mostTalkativeWords, setMostTalkativeWords] = useState([])

  useEffect(() => {
    // Calculate yearly statistics
    const yearlyStatsData = {}
    chatData.forEach((message) => {
      const date = new Date(message.timestamp * 1000)
      const year = date.getFullYear()
      yearlyStatsData[year] = (yearlyStatsData[year] || 0) + 1
    })
    setYearlyStats(yearlyStatsData)

    // Calculate monthly statistics
    const monthlyStatsData = {}
    chatData.forEach((message) => {
      const date = new Date(message.timestamp * 1000)
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`
      monthlyStatsData[yearMonth] = (monthlyStatsData[yearMonth] || 0) + 1
    })
    setMonthlyStats(monthlyStatsData)

    // Calculate most active day
    const dailyStats = {}
    chatData.forEach((message) => {
      const date = new Date(message.timestamp * 1000)
      const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      dailyStats[day] = dailyStats[day] || { messages: [], count: 0 }
      dailyStats[day].messages.push(message)
      dailyStats[day].count += 1
    })

    const sortedDays = Object.keys(dailyStats).sort((a, b) => dailyStats[b].count - dailyStats[a].count)

    setMostActiveDay({
      mostMessages: dailyStats[sortedDays[0]].count,
      day: sortedDays[0],
      messages: dailyStats[sortedDays[0]].messages.slice(0, 10),
    })

    // Find earliest day
    const earliestDay = sortedDays[sortedDays.length - 1]
    setEarliestDay({
      day: earliestDay,
      messages: dailyStats[earliestDay].messages.slice(0, 10),
    })

    // Find latest day
    const latestDay = sortedDays[0]
    setLatestDay({
      day: latestDay,
      messages: dailyStats[latestDay].messages.slice(0, 10),
    })

    // Find recent messages
    const recentMessages = chatData.slice(-5)
    setRecentMessages(recentMessages)

    // Calculate most talkative words
    const wordCounts = {}
    chatData.forEach((message) => {
      const words = message.text.split(/\s+/)
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      })
    })
    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a])
    setMostTalkativeWords(sortedWords.slice(0, 20))
  }, [chatData])

  // Format data for ECharts
  const formatChartData = (data) => ({
    xAxis: {
      type: 'category',
      data: Object.keys(data),
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}: {c} messages',
    },
    series: [
      {
        data: Object.values(data),
        type: 'bar',
      },
    ],
  })

  // Format data for ECharts Word Cloud
  const formatWordCloudData = (words) => words?.map((word) => ({ name: word, value: mostTalkativeWords[word] }))

  return (
    <div>
      <h1>2023 Yearly Chat Summary</h1>

      {/* Yearly Statistics */}
      <h2>Yearly Statistics</h2>
      {Object.keys(yearlyStats).length > 0 && <ReactECharts option={formatChartData(yearlyStats)} />}

      {/* Monthly Statistics */}
      <h2>Monthly Statistics</h2>
      {Object.keys(monthlyStats).length > 0 && <ReactECharts option={formatChartData(monthlyStats)} />}

      {/* Most Active Day */}
      <h2>Most Active Day</h2>
      <p>Day: {mostActiveDay.day}</p>
      <p>Most Messages: {mostActiveDay.mostMessages} messages</p>
      <p>Messages:</p>
      <ul>
        {mostActiveDay.messages?.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>

      {/* Earliest Day */}
      <h2>Earliest Day</h2>
      <p>Day: {earliestDay.day}</p>
      <p>Messages:</p>
      <ul>
        {earliestDay.messages?.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>

      {/* Latest Day */}
      <h2>Latest Day</h2>
      <p>Day: {latestDay.day}</p>
      <p>Messages:</p>
      <ul>
        {latestDay.messages?.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>

      {/* Recent Messages */}
      <h2>Recent Messages</h2>
      <ul>
        {recentMessages?.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>

      {/* Most Talkative Words - Word Cloud */}
      <h2>Most Talkative Words</h2>
      <ul>
        {mostTalkativeWords.map((word, index) => (
          <li key='index'>{word} </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatSummary
