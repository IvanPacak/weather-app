import { useState } from 'react';
import '../style/Header.css';
import WeatherInfo from './WeatherInfo';

export default function Header() {
    const [cityName, setCityName] = useState('Spisska Nova Ves');
    const [data, setData] = useState("");

    const fetchWeatherData = async () => {
        await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=df4cba48244b0655e1c72b00992c7ff8`)
        .then(response => response.json())
        .then(async response => {
            await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${response[0].lat}&lon=${response[0].lon}&lang=sk&units=metric&exclude=minutely,hourly,daily&appid=df4cba48244b0655e1c72b00992c7ff8`)
                .then(response => response.json())
                .then(response => setData(response.current))
        })
        .catch(error => console.log(error))
    }

    const getCityName = e => {
        setCityName(e.target.value);
    }

    const getData = e => {
        e.preventDefault();
        fetchWeatherData();
    }

    const convertUnix = (unixTime) => {
        const dateObject = new Date(unixTime * 1000);
        const hours = dateObject.toLocaleString("en-US", {hour: "numeric"}) // 10 AM
        const minutes = dateObject.toLocaleString("en-US", {minute: "numeric"}) // 30
        return `${(new Date()).toString().split(' ').splice(1,2).join(' ')}, ${hours.substring(0, hours.indexOf(' '))} : ${minutes}`;
    }

    const iconSrc = data === "" ? '' : `http://openweathermap.org/img/w/${data.weather[0].icon}.png`; 

    return(
        <header>
            <div className='main-card-div'>
                <div className='gradient'>
                    <div className='date-container'>
                        <h2 className='date-day'>{data === "" ? '' : new Date(data.sunrise).toLocaleString("en-US", {weekday: "long"}) }</h2>
                        <p className='current-date'>{(new Date()).toString().split(' ').splice(1,3).join(' ')}</p>
                        <p className='city-name'>{cityName}</p>
                    </div>
                    <div className='weather-container'>
                        <img className='weather-icon' src={iconSrc} alt="weather icon" />
                        <h1 className='temperature'>{data === "" ? '' : data.feels_like + "°C"}</h1>
                        <h3>{data === "" ? '' : data.weather[0].description }</h3>
                    </div>
                </div>
            </div>
            <div className='weather-info-div'>
                <WeatherInfo title="Vlhkosť" data={data === "" ? '' : data.humidity + " %"}/>
                <WeatherInfo title="Tlak" data={data === "" ? '' : data.pressure + " hPa"}/>
                <WeatherInfo title="Oblačnosť" data={data === "" ? '' : data.clouds + " %"}/>
                <WeatherInfo title="Rýchlosť vetra" data={data === "" ? '' : (Math.round((data.wind_speed * 3.6) * 100) / 100) + " km/h"}/>
                <WeatherInfo title="Západ slnka" data={data === "" ? '' : convertUnix(data.sunset)}/>
                <WeatherInfo title="Východ slnka" data={data === "" ? '' : convertUnix(data.sunrise)}/>
                <form className='find-location'>
                    <input className='input-city-name' type="text" onChange={getCityName}/>
                    <button className='location-button' onClick={getData}>Search</button>
                </form>
            </div>
        </header>
    )
}