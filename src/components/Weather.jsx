import useOpenWeatherAPI from "../hooks/useOpenWeatherAPI";

export default function Weather() {
  const { data, loading, geoError, fetchError } = useOpenWeatherAPI();

  const noonFilteredWeather = data?.list?.filter((datum) =>
    datum.dt_txt.includes("12:00:00")
  );

  return (
    <div id="weather-container">
      {geoError ? (
        <p>위치 정보를 가져오는 데 실패했습니다. : {geoError}</p>
      ) : loading ? (
        <p>날씨 정보를 불러오는 중입니다...</p>
      ) : fetchError ? (
        <p>날씨 정보를 가져오는 데 실패했습니다. : {fetchError}</p>
      ) : (
        <>
          <h2>{data.city.name} 날씨(정오, 5일)</h2>
          <ul>
            {noonFilteredWeather?.map((forecast) => (
              <li key={forecast.dt}>
                <h3>{forecast.dt_txt.split(" ")[0]}</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0].description}
                />
                <p>{forecast.main.temp.toFixed(1)}°C</p>
                <p>{forecast.weather[0].description}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
