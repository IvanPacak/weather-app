import '../style/Header.css';

export default function WeatherInfo(props){
    return(
        <div className='weather-info'>
            <span className='weather-info-title'>{props.title}</span>
            <span className='weather-info-data'>{props.data}</span>
        </div>
    )
}