import { useState, useEffect } from "react";


// API key for OpenWeatherMap
const API_KEY = "1c2287819f7dd56f7fd413514bc07749";

// Mapping of weather conditions to background image URLs
const weatherImages = {
  Clear: "https://i.ibb.co/rf5wrmrW/image.png",
  Clouds: "https://i.ibb.co/XkyxJX2T/image.png",
  Rain: "https://i.ibb.co/Cs5SSTHN/image.png",
  Drizzle: "https://i.ibb.co/s9FTbp18/image.png",
  Mist: "https://i.ibb.co/vvHp5mbd/image.png",
  Snow: "https://i.ibb.co/cKGsQtwL/image.png",
  Thunderstorm: "https://i.ibb.co/v4hkh2hN/image.png",
  Haze: "https://i.ibb.co/hR21PNrx/image.png",
  Atmosphere: "https://i.ibb.co/RppsZphs/image.png"
};

const convertTemperature = (celsius) => (celsius * 9) / 5 + 32;

const UIdesign = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setIsFahrenheit(false); // Reset toggle to Celsius on new search
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching the weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  const handleSearch = () => {
    if (cityInput.trim() !== "") {
      fetchWeather(cityInput);
    } else {
      alert("Please enter a city name.");
    }
  };

  if (loading) {
    return <div className="flex size-full min-h-screen items-center justify-center bg-[#111922] text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex size-full min-h-screen items-center justify-center bg-[#111922] text-white">Error: {error}</div>;
  }

  const { name, main, weather, wind } = weatherData;
  const tempCelsius = main.temp;
  const temperature = isFahrenheit ? convertTemperature(tempCelsius).toFixed(1) : tempCelsius.toFixed(1);
  const unit = isFahrenheit ? "°F" : "°C";
  const backgroundImage = weatherImages[weather[0]?.main] || weatherImages.Clear;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111922] dark group/design-root overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', 'Noto Sans', sans-serif" }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#243447] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Weather App</h2>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="px-4 py-3">
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#111922] rounded-xl min-h-80"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
              ></div>
            </div>

            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#93acc8] flex border-none bg-[#243447] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search for a city"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-none text-white focus:outline-0 focus:ring-0 border-none bg-[#243447] h-full placeholder:text-[#93acc8] px-4 text-base font-normal leading-normal"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="bg-[#1978e5] hover:bg-blue-600 text-white px-4 py-2 rounded-r-xl font-medium" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </label>
            </div>

            <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">{name}</h1>
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">{weather[0]?.description}</p>

            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#243447]">
                <p className="text-white text-base font-medium leading-normal">Temperature</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{temperature}{unit}</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#243447]">
                <p className="text-white text-base font-medium leading-normal">Humidity</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{main.humidity}%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#243447]">
                <p className="text-white text-base font-medium leading-normal">Wind Speed</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">{(wind.speed * 3.6).toFixed(1)} km/h</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#111922] px-4 min-h-14 justify-between">
              <p className="text-white text-base font-normal leading-normal flex-1 truncate">Temperature Unit</p>
              <div className="shrink-0">
                <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#243447] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1978e5]">
                  <div
                    className="h-full w-[27px] rounded-full bg-white"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px" }}
                  ></div>
                  <input type="checkbox" className="invisible absolute" checked={isFahrenheit} onChange={() => setIsFahrenheit(!isFahrenheit)} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIdesign;