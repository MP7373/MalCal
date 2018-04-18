const listContainer = document.getElementById('list-container')
const coverBlock = listContainer.childNodes[1]
const list = JSON.parse(document.getElementsByTagName("table")[0].dataset.items)
const showArray = []
const currentDate = new Date()

list.forEach(e => {
  if (e.status == 1) {
    let date = new Date(e.anime_start_date_string)

    let month = convertNumericMonthToString(date.getMonth())

    let weekday = convertNumericWeekdayToString(date.getDay())

    let day = date.getDate()

    let hours = date.getHours()
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = date.getMinutes()
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let time = `${hours}:${minutes}:00`

    let year = date.getFullYear().toString()

    let newShowObject = {
      Title: e.anime_title,
      EpisodesWatched: e.num_watched_episodes,
      Episodes: e.anime_num_episodes,
      Month: month,
      Weekday: weekday,
      Day: day,
      Time: time,
      Year: year
    }

    showArray.push(newShowObject)
  }
})

const allShowsObject = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
}

showArray.forEach(doc => {
  let show = doc
  switch (show.Weekday) {
      case 'Sunday':
          allShowsObject.Sunday.push(show)
          break;
      case 'Monday':
          allShowsObject.Monday.push(show)
          break;
      case 'Tuesday':
          allShowsObject.Tuesday.push(show)
          break;
      case 'Wednesday':
          allShowsObject.Wednesday.push(show)
          break;
      case 'Thursday':
          allShowsObject.Thursday.push(show)
          break;
      case 'Friday':
          allShowsObject.Friday.push(show)
          break;
      case 'Saturday':
          allShowsObject.Saturday.push(show)
  }
})

appendNodeAfter(coverBlock, createCalGrid(allShowsObject))

//dom functions
function createCalGrid(allShowsObject) {
  const cal = document.createElement('div')
  cal.classList.add('watchlist-grid-container')

  const dayray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  dayray.forEach(day => {
    cal.appendChild(createCalDay(day, allShowsObject))
  })

  return cal
}

function createCalDay(day, allShowsObject) {
  const div = document.createElement('div')
  div.classList.add('watchlist-grid-item')

  const h4 = document.createElement('h4')
  h4.innerText = day
  div.appendChild(h4)

  const col = document.createElement('div')
  col.id = day
  col.classList.add('watchlist-day-col')

  allShowsObject[day].forEach(show => {
    const showElement = document.createElement('div')
    showElement.classList.add('show-element')

    const titleElement = document.createElement('h5')
    titleElement.textContent = show.Title
    showElement.appendChild(titleElement)

    const totalEpisodesElement = document.createElement('h6')
    totalEpisodesElement.textContent = `Episodes: ${show.Episodes}`
    const totalEpisodes = show.Episodes
    showElement.appendChild(totalEpisodesElement)

    const availableEpisodesElement = document.createElement('h6')
    const dateString = `${show.Month} ${show.Day}, ${show.Year} ${show.Time}`
    const episodesOut = getNumberOfEpisodesOut(dateString, currentDate, show.Episodes)
    availableEpisodesElement.textContent = `Released: ${episodesOut}`
    showElement.appendChild(availableEpisodesElement)

    const watchedEpisodesElement = document.createElement('h6')
    let episodesWatched = show.EpisodesWatched
    watchedEpisodesElement.textContent = `Watched: ${episodesWatched}`
    watchedEpisodesElement.classList.add('watched')
    showElement.appendChild(watchedEpisodesElement)

    col.appendChild(showElement)
  })

  div.appendChild(col)

  return div
}

//utility functions
function convertNumericMonthToString(numericMonth) {
  switch (numericMonth) {
      case 0: return 'January'
      case 1: return 'February'
      case 2: return 'March'
      case 3: return 'April'
      case 4: return 'May'
      case 5: return 'June'
      case 6: return 'July'
      case 7: return 'August'
      case 8: return 'September'
      case 9: return 'October'
      case 10: return 'November'
      case 11: return 'December'
  }
}

function convertNumericWeekdayToString(numericWeekday) {
  switch (numericWeekday) {
      case 0: return 'Sunday'
      case 1: return 'Monday'
      case 2: return 'Tuesday'
      case 3: return 'Wednesday'
      case 4: return 'Thursday'
      case 5: return 'Friday'
      case 6: return 'Saturday'
  }
}

function appendNodeAfter(nodeToAppendTo, newNode) {
  nodeToAppendTo.parentNode.insertBefore(newNode, nodeToAppendTo.nextSibling)
}

function getNumberOfEpisodesOut(airDateString, currentDate, totalEpisodes) {
  const airDate = new Date(airDateString)
  const episodes = Math.floor((currentDate.getTime() - airDate.getTime()) / 604800000) + 1
  if (episodes < totalEpisodes) {
      return episodes
  }
  return totalEpisodes
}