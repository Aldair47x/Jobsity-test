// import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/sass/styles.scss";


import React, { Component } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import Swal from 'sweetalert2'


import events from './events'

const uniqid = require('uniqid');
const axios = require('axios');
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
                    {event.desc && ':  ' + event.desc}
                    {event.weather != null ? 
                    <p style={{color: 'black'}}>
                        Weather forecast: {event.weather}
                    </p> : 
                    <p style={{color: 'black'}}>
                        No weather forecast to this date
                    </p>}
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
                    {event.desc && ':  ' + event.desc}
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
                    {event.desc && ':  ' + event.desc}
                </span>
            </div>
        )

    } else {

        return (
            <span>
                <strong>{event.title}</strong>
                <p>{event.city}</p>
                {event.desc && ':  ' + event.desc}
            </span>
        )
    }
}

const EventAgenda = ({ event }) => {
    return (
      
        <span>
            <em style={{ color: 'blue' }}>{event.title}</em>
            <p style={{color: 'black'}}>
                {event.city}
            </p>
            {event.desc && ':  ' + event.desc}
            {event.weather != null ? 
            <p style={{color: 'black'}}>
                Weather forecast: {event.weather}
            </p> : 
            <p style={{color: 'black'}}>
                No weather forecast to this date
            </p>}
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

                        if (value.length > 0 && value.length <= 30) {
                            resolve()
                        } else {
                            resolve('You need to write a reminder less than a 30 chars')
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
        
            ]).then(async (result) => {
            if (result.value) {
                
                const auxText = result.value[0];
                const auxCity = this.state.cities[ result.value[1] ];
                const auxColor = parseInt(result.value[2]);
                let auxWeather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${auxCity},us&appid=f1fee41184b348ce41ba5acdf09f9f4e`)
                // http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=f1fee41184b348ce41ba5acdf09f9f4e
                .then(function (response) {
                    console.log('Open Weather Map response:',response.data.list, 'Current time:', start.getTime()/1000);
                    // handle success
                    return response.data.list.map( ts => {
                        
                        if(start.getTime()/1000 === ts.dt){
                            
                            let weather = ts.weather.map( m => {
                                if(m.main){
                                    return m.main;
                                }
                                else{
                                    return null;
                                }
                            })
                            console.log('yes!', weather)
                            return weather;
                            // return ts.weather.main;
                        }
                    });
                    
                })
                .catch(function (error) {
                    // handle error
                    console.log(error, 'clima');
                    return null;
                })
                
                Swal.fire({
                title: 'All done!',
                confirmButtonText: 'Confirm'
                })
                this.setState({
                    events: [
                        ...this.state.events,
                        {
                            start,
                            end,
                            weather: auxWeather,
                            title: auxText,
                            city: auxCity,
                            color: auxColor,
                            id: uniqid()
                        },
                    ],
                })
                console.log(this.state.events);
            }
        })
        
    }

    handleEvent = (e) => {
        

        Swal.fire({
        title: 'Delete your REMINDER!',
        text: `You won't be able to revert this!
        \n
        ${e.title}`,
        icon: 'warning',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel it.',
        reverseButtons: true
        }).then((result) => {
        if (result.value) {
            let newEvents = this.state.events.filter(ev => ev !== e);
            this.setState({
                events:newEvents
            });
            
            Swal.fire(
            'Deleted!',
            'Your event has been deleted.',
            'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            Swal.fire(
            'Cancelled',
            'Your event is safe :)',
            'error'
            )
        }
        })
    }

    
    
      
    
    render() {

        
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
                    onSelectEvent={event => this.handleEvent(event)}
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
