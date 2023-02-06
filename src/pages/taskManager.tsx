import * as React from 'react'
import styled from 'styled-components'

import { formatDate } from '@fullcalendar/core'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { INITIAL_EVENTS, createEventId } from './event-utils'

const { useState } = React

const Header = styled.header`
  font-size: 1.5rem;
  height: 2rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  top: 0;
`

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`

const TaskArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  bottom: 0;
  font-size: 1rem;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 50vw;
`

const Calendar = styled.div`
  border-top: 1px solid silver;
  bottom: 0;
  overflow-y: scroll;
  padding: 1rem;
  position: absolute;
  left: 0;
  top: 0;
  width: 50vw;
`

// localStorage でデータの参照・保存に使うキー
const StorageKey = 'pages/editor:task'
  
export const TaskManager: React.FC = () => {
  const loadJSON = key => 
    JSON.parse(localStorage.getItem(key));

  const [weekendsVisible, setWeekendsVisible] = useState(true)
  // localStorage から取得した値を useState の初期値に設定
  const [currentEvents, setCurrentEvents] = useState(loadJSON(StorageKey))

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible)
  }

  const handleEvents = (events) => {
    // localStorageに保存する
    localStorage.setItem(StorageKey, JSON.stringify(events))
    setCurrentEvents(events)
  }

  // イベントがクリックされた場合
  const handleEventClick = (clickInfo) => {
    if (confirm(`タスク '${clickInfo.event.title}' を削除しますか？`)) {
      clickInfo.event.remove()
    }
  }

  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }

  const events = [
    { title: 'Meeting', start: new Date() }
  ]

  const handleDateSelect = (selectInfo) => {
    let title = prompt('新しいタスクを登録します。タスクを入力してください。')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  return (
    <>
      <Header>
        Task Manager
      </Header>
      <Wrapper>
        <Calendar>
          <div>
            <FullCalendar
	      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
	      headerToolbar={{
	        left: 'prev,next today',
		center: 'title',
		right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
	      initialView="dayGridMonth" // 初期表示
	      editable={true} // ?
	      locale="ja"	// 日本語表示
	      selectable={true} // 選択できるかどうか
	      selectMirror={true}
	      dayMaxEvents={true}
	      weekends={weekendsVisible} // 週末を表示するかどうか
//	      initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
	      initialEvents={loadJSON(StorageKey)} // alternatively, use the `events` setting to fetch from a feed
	      select={handleDateSelect} 	// カレンダーが選択された場合
	      eventContent={renderEventContent}	// custom render function イベントのカレンダーへの表示のさせ方
	      eventClick={handleEventClick}	// イベントがクリックされた場合
	      eventsSet={handleEvents}	// called after events are initialized/added/changed/removed

//              events={events}
//	      dateClick={handleDateClick}
	    />
          </div>
    	</Calendar>
      </Wrapper>
    </>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}
