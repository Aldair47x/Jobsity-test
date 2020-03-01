// import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/sass/styles.scss";


import React, { Component } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import Swal from 'sweetalert2'


import events from './events'


const cities = JSON.parse(JSON.stringify(Object.assign({}, require('full-countries-cities').getCities('United States'))));
const colorClass = {
    0: 'Green',
    1: 'Blue',
    2: 'Yellow'
}

const localizer = momentLocalizer(moment);

const Event = ({ event }) => {
    if(event.color === 0){
        return (
            <div style={{backgroundColor: 'lightgreen'}}>
                <span>
                    <strong style={{color: 'black'}}>
                        {event.title}
                    </strong>
                    <p style={{color: 'black'}}>
                        {event.city}
                    </p>
                </span>
            </div>
        )

    } else if( event.color === 1) {
        return (
            <div style={{backgroundColor: 'lightblue'}}>
                <span>
                    <strong style={{color: 'black'}}>
                        {event.title}
                    </strong>
                    <p style={{color: 'black'}}>
                        {event.city}
                    </p>
                </span>
            </div>
        )

    } else if(event.color === 2) {
        return (
            <div style={{backgroundColor: 'lightgoldenrodyellow'}}>
               <span>
                    <strong style={{color: 'black'}}>
                        {event.title}
                    </strong>
                    <p style={{color: 'black'}}>
                        {event.city}
                    </p>
                </span>
            </div>
        )

    } else {

        return (
            <span>
                <strong>{event.title}</strong>
                <p>{event.city}</p>
            </span>
        )
    }
}

const EventAgenda = ({ event }) => {
    return (
      <span>
        <em style={{ color: 'blue' }}>{event.title}</em>
        <p>{event.desc}</p>
      </span>
    )
}



export default class Calendarr extends Component {

    constructor(...args) {
        super(...args)
        this.state = {
            events,
            cities,
            colorClass
        }
        
    }

    handleSelect = async ({ start, end }) => {
        
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']
            }).queue([
            {
                title: 'Enter your reminder',
                input: 'text',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve, reject) => {

                        if (value.length <= 30) {
                            resolve()
                        } else {
                            resolve('You need to write write a reminder less than a 30 chars')
                        }
                    })
                }
            },
            {
                title: 'Select a city',
                input: 'select',
                inputOptions: this.state.cities,
                inputPlaceholder: 'Cities',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            this.setState({
                                ...this.state,
                                city: value
                                    
                            })
                            resolve()
                        } else {
                            resolve('You must select one city')
                        }
                    })
                }
            },
            {
                title: 'Select a color',
                input: 'select',
                inputOptions: this.state.colorClass,
                inputPlaceholder: 'Colors',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            this.setState({
                                ...this.state,
                                city: value
                                    
                            })
                            resolve()
                        } else {
                            resolve('You must select one color')
                        }
                    })
                }
            }
        
            ]).then((result) => {
            if (result.value) {
                console.log(result.value);
                const answers = JSON.stringify(result.value)
                console.log(answers);
                Swal.fire({
                title: 'All done!',
                html: `
                    Your answers:
                    <pre><code>${answers}</code></pre>
                `,
                confirmButtonText: 'Lovely!'
                })
                this.setState({
                    events: [
                        ...this.state.events,
                        {
                            start,
                            end,
                            title: 'prueba'
                        },
                    ],
                })
            }
        })

        // const title = window.prompt('New Event name')
        
        
    }

    

      
    
    render() {

        console.log(this.state.cities[6-1]);

        return (
            <div style={{height: '100vh', margin: '10px'}}>

                <Calendar
                    selectable
                    events={this.state.events}
                    localizer={localizer}
                    defaultDate={new Date(2015, 3, 12)}
                    defaultView={Views.MONTH}
                    dayPropGetter={this.customDayPropGetter}
                    slotPropGetter={this.customSlotPropGetter}
                    onSelectEvent={event => alert(event.title)}
                    onSelectSlot={this.handleSelect}
                    components={{
                        event: Event,
                        agenda: {
                            event: EventAgenda,
                        },
                    }}
                
                />
            </div>
        )
    }
}
