// import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/sass/styles.scss";


import React, { Component } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import Swal from 'sweetalert2'


import events from './events'
// import uniqueID for the events
const uniqid = require('uniqid');
// import axios for http request 
const axios = require('axios');
// import full contries cities for a specific state
const cities = JSON.parse(JSON.stringify(Object.assign({}, require('full-countries-cities').getCities('United States'))));
// declare const object for select options of colors
const colorClass = {
    0: 'Green',
    1: 'Blue',
    2: 'Yellow'
}

// Call moment localizer to integrate moment with reac-big-calendar
const localizer = momentLocalizer(moment);




export default class Calendarr extends Component {

    constructor(...args) {
        super(...args)
        this.state = {
            events,
            cities,
            colorClass
            
        }
        
    }

    // function to get a response from openweathermap to handle the forecast
    /**
    * @param cityName City for request the weather
    * @param currentTime The current time for the request
    */
    requestWeather = async (cityName, currentTime) => {
        const currentTimestamp = currentTime.getTime()/1000;
        // const currentTimestamp = 1583247600;
        let currentWeather;
            
        await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&appid=f1fee41184b348ce41ba5acdf09f9f4e`)
            
            .then(response => {
                console.log('Open Weather Map response:', response.data.list, 'Current time:', currentTimestamp);
                // handle success
                
                const auxWeather = response.data.list.map( ts => {
                    
                    if(currentTimestamp === ts.dt){
                        
                        
                        const forecast = ts.weather.map( m => {
                            if(m.main){
                                currentWeather = m.main;
                                return currentWeather;
                            }
                            else {
                                return null;
                            }
                        })
                        
                        
                        return forecast;
                    }
                    else {
                        return null;
                    }
                });
                console.log('yes!', currentWeather)
                return auxWeather;
            })
            .catch( error => {
                // handle error
                console.log(error, 'Api weather');
                return null;
            })
        
        return currentWeather;

    }


    // function to create a new event in some range date
    /**
    * @param start The start range date
    * @param end The end range date
    */
    handleSelect = ({ start, end }) => {
        
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']
            })
            .queue([{
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
            }])
            .then( async (result) => {
            if (result.value) {
                
                const auxText = result.value[0];
                const auxCity = this.state.cities[ result.value[1] ];
                const auxColor = parseInt(result.value[2]);
                const auxWeather = await this.requestWeather(auxCity, start);
                console.log( auxWeather );
                
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
                
            }
        })
        
    }


    // function to delete an event from the calendar
    /**
    * @param e handle the event for preventDefault()
    * @param event The event that will be deleted
    */
    deleteEvent = (e, event) => {
        
        e.preventDefault();


        Swal.fire({
        title: 'Delete your REMINDER!',
        html: `${event.title}
        <br>
        You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel it.',
        reverseButtons: true
        }).then((result) => {
        if (result.value) {
            let newEvents = this.state.events.filter(ev => ev !== event);
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

    // function to show some information from the event when is clicked on the calendar
    /**
    * @param event Even to show
    */
    showEvent = (event) => {
        

        Swal.fire({
        title: '<strong>Reminder</strong>',
        icon: 'info',
        html:
            `Text: <b>${event.title}</b>`  +
            '<br>'  +
            `City: <b>${event.city}</b>`  +
            '<br>'  +
            `Weather <b>${event.weather}</b>` ,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Ok'
    
        })
    }

    // function to edit an event from the calendar
    /**
    * @param e handle the event for preventDefault()
    * @param event The event that will be edited
    */
    editEvent = (e, event) => {
        e.preventDefault();

        Swal.fire({
            title: 'Edit your REMINDER!',
            html: `

            `,
            icon: 'warning',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'Yes, edit it!',
            cancelButtonText: 'No',
            reverseButtons: true
            }).then((result) => {
            if (result.value) {
                Swal.mixin({
                    input: 'text',
                    confirmButtonText: 'Next &rarr;',
                    showCancelButton: true,
                    progressSteps: ['1', '2', '3']
                    })
                    .queue([{
                        title: 'Enter your reminder',
                        input: 'text',
                        value: event.title,
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
                        value: event.city,
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
                    }])
                    .then( async (result) => {
                    if (result.value) {
                        
                        const auxText = result.value[0];
                        const auxCity = this.state.cities[ result.value[1] ];
                        const auxColor = parseInt(result.value[2]);
                        const auxWeather = await this.requestWeather(auxCity, event.start);
                        
                        //find the index of object from array that you want to update
                        const objIndex = this.state.events.findIndex(obj => obj.id === event.id);

                        // make new object of updated object.   
                        const updatedObj = { 
                            ...this.state.events[objIndex],
                            title: auxText,
                            city: auxCity,
                            color: auxColor,
                            weather: auxWeather
                        }

                        // make final new array of objects by combining updated object.
                        const updatedEvents = [
                        ...this.state.events.slice(0, objIndex),
                        updatedObj,
                        ...this.state.events.slice(objIndex + 1),
                        ];

                        this.setState({
                            ...this.state,
                            events: updatedEvents
                        })

                        
                        Swal.fire({
                        title: 'All done!',
                        confirmButtonText: 'Confirm'
                        })
                        
                        
                    }
                })
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

    // Custom component for the specific area "Agenda" for the calendar
    /**
    * @param event The event that will be show
    */
    EventAgenda = ({ event }) => {
        
        
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
                <button onClick={e => {this.deleteEvent(e, event)}} style={{ float: 'right', marginRight: '5px' }}> Delete </button>
                <button onClick={e => {this.editEvent(e, event)}} style={{ float: 'right', marginRight: '5px' }}> Edit </button>
            </span>
          
        )
    }

    // Custom component for the events in the calendar
    /**
    * @param event The event that will be show
    */
    Event = ({ event }) => {
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

    
    render() {

        
        return (
            <div style={{height: '100vh', margin: '10px'}}>

                <Calendar
                    selectable
                    events={this.state.events}
                    localizer={localizer}
                    defaultDate={new Date(2020, 3, 12)}
                    defaultView={Views.MONTH}
                    dayPropGetter={this.customDayPropGetter}
                    slotPropGetter={this.customSlotPropGetter}
                    onSelectEvent={event => {
                        this.showEvent(event);

                    }}
                    onSelectSlot={this.handleSelect}
                    components={{
                        event: this.Event,
                        agenda: {
                            event: this.EventAgenda,
                        },
                    }}
                
                />
            </div>
        )
    }
}
