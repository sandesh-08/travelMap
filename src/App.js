import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import "./App.css";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoomIcon from '@material-ui/icons/Room';
import axios from "axios";
import Register from './components/Register';
import Login from './components/Login';
import CardRight from './components/CardRight/CardRight';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder';

import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [displayInfo,setDisplayInfo] = useState([]);
  const [pins,setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [userLatt,setUserLatt] = useState(null);
  const [userLong,setUserLong] = useState(null);
  const [carTime,setCarTime] = useState(null);
  const [bicycleTime,setBicycleTime] = useState(null);
  const [walkTime,setWalkTime] = useState(null);
  
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      setUserLatt(position.coords.latitude);
      setUserLong(position.coords.longitude);
    });
  }
  const mapRef = useRef()

  const updateTime=(newLatt,newLong)=>{
    setBicycleTime(null);
    axios.get(`${process.env.REACT_APP_TIMECYCLE}/${userLong},${userLatt};${newLong},${newLatt}?&access_token=${process.env.REACT_APP_MAPBOX}`)
    .then((res)=> {
      if(res.data.code==='Ok') setBicycleTime(res.data.routes[0].duration);
      else setBicycleTime(null);
    })
    .catch(()=>{
      setBicycleTime(null);
    })

    setCarTime(null);
    axios.get(`${process.env.REACT_APP_TIMECAR}/${userLong},${userLatt};${newLong},${newLatt}?&access_token=${process.env.REACT_APP_MAPBOX}`)
    .then((res)=> {
      if(res.data.code==='Ok') setCarTime(res.data.routes[0].duration);
      else setCarTime(null);
    })
    .catch(()=>{
      setCarTime(null);
    })

    setWalkTime(null);
    axios.get(`${process.env.REACT_APP_TIMEWALK}/${userLong},${userLatt};${newLong},${newLatt}?&access_token=${process.env.REACT_APP_MAPBOX}`)
    .then((res)=> {
      if(res.data.code==='Ok') setWalkTime(res.data.routes[0].duration);
      else setWalkTime(null);
    })
    .catch(()=>{
      setWalkTime(null);
    })
  }

  const [viewport, setViewport] = useState({
    height: window.innerWidth >750 ? "94vh": "80vh",
    width: window.innerWidth >750 ? "70vw" : "90vw",
    latitude: 21.1458,
    longitude: 79.0882,
    zoom: 2
  });



  useEffect(()=>{
    const getPins = async ()=> {
      try{
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/pins`);
        setPins(res.data);
      }catch(err) {
        console.log(err);
      }
    };
    getPins();
  },[]);

  
  
  const handleMarkerClick = (id,lat,long) => {
    setNewPlace(null);
    setCurrentPlaceId(id);
    updateTime(lat,long);
    setViewport({...viewport,latitude:lat,longitude:long})
  }
  
  const handleAddClick = (e) => {
    setCurrentPlaceId(null);
    if(currentUser) {
      const [long,lat] = e.lngLat;
      setNewPlace({
        lat:lat,
        long:long,
      })
      updateTime(lat,long);
    }
    else {
      setShowLogin(true);
    }
  }
  
  const handleMarkerAddClick = (lat,long) => {
    setNewPlace({
      lat:lat,
      long:long,
    })
    updateTime(lat,long);
  }
  
  const handleSubmit = async(e) => {    
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.long,
    } 
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/pins`,newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);
    }
    catch(err) {
      console.log(err);
    }
  }
  
  const handleLogout = () => {
    setCurrentPlaceId(null);
    setNewPlace(null);
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  

  useEffect(() => {
    if(currentPlaceId!==null) {
      axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/pins/${currentPlaceId}`)
      .then((response)=>{
        var dummy=[];
        for(var x of pins ) {
          if(x.title.toLowerCase()===response.data[0].title.toLowerCase() || x.lat===response.data[0].lat || x.long===response.data[0].long) dummy.push(x);
        }
        dummy.reverse()
        setDisplayInfo(dummy);
        console.log(dummy);
      })
      .catch((e)=>{
        console.log("error !! dummy");
        console.log(e);
      })
    }
    else {

    }
  }, [currentPlaceId,pins]);

  const handleViewPortChange = (nextViewport) => {
      setViewport(nextViewport);
  }
  
  return (
    <div className="outerBox">
      <div>
        {(currentUser) &&
          window.innerWidth<=600 && 
          <div>
            <button className="logout" onClick={handleLogout}> logOut </button> 
          </div>
        }
        {(!currentUser) && 
            window.innerWidth<=600 &&
              <div className="loginandregisterAttop">
                  <button className="login" onClick={()=>setShowLogin(true)}> logIn </button>
                  <button className="register"  onClick={()=>setShowRegister(true)}> Register </button>
              </div>
        }
      </div>
      <div className="map">
        <div>
          {
             userLatt ?
                <div className="distIndicator">
                  <div>
                    <DriveEtaIcon />
                    : {carTime ? `${(carTime/3600).toFixed(2)} hrs `  : "---"}
                  </div>
                  <div>
                    <DirectionsBikeIcon />
                    : {bicycleTime ? `${(bicycleTime/3600).toFixed(2)} hrs `  : "---"}
                  </div> 
                  <div>
                    <DirectionsWalkIcon />
                    : {walkTime ? `${(walkTime/3600).toFixed(2)} hrs `  : "---"}
                  </div>
                </div>  :
                <p>Please turn on your location access </p>
          }
        </div>
        <div className="mapContainer">
          <ReactMapGL
            {...viewport}
            ref={mapRef}
            mapboxApiAccessToken= "pk.eyJ1Ijoic2FuZGVzaDA4IiwiYSI6ImNrc3BqdjI2MDAzaHczMm9kbWpkcTI0ODQifQ.vKxQCv9_HnCfxp9ijjZXZg"
            onViewportChange={nextViewport => handleViewPortChange(nextViewport)}
            mapStyle="mapbox://styles/sandesh08/ckt32i9o20yab18lqo9r090jn"
            onDblClick = {handleAddClick}
            transitionDuration = "300"
          > 
                <div>
                    <Geocoder
                      mapRef={mapRef}
                      onViewportChange={nextViewport => handleViewPortChange(nextViewport)}
                      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
                      position="top-left"
                      style={{width: "30vw"}}
                    />
                </div>
            {
              pins.map((p)=>{
                return (
                <div key={p._id}>
                  <Marker 
                    latitude={p.lat} 
                    longitude={p.long} 
                    offsetLeft={-viewport.zoom*2.5} 
                    offsetTop={-viewport.zoom*5}
                  >
                  <RoomIcon 
                      style={{
                          fontSize: viewport.zoom*5, 
                          color: p.username===currentUser ? "green" : "slateblue", 
                          cursor: "pointer"}}
                          onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
                  />
                  </Marker>
                  {p._id === currentPlaceId &&
                    <Popup
                        latitude={p.lat}
                        longitude={p.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left" 
                        onClose={()=>setCurrentPlaceId(null)}
                    >
                        <div className="card">
                          <div className="cardhead">
                            <p>Place :</p>
                            <p className="placename"> {p.title} </p>
                          </div>
                          <button className="addReviewBtn"
                            onClick={()=>{
                                setCurrentPlaceId(null);
                                if(currentUser) {
                                  handleMarkerAddClick(p.lat,p.long);
                                }
                                else {
                                  setShowLogin(true);
                                }
                            }}
                          >Add Review</button>
                        </div>
                    </Popup>
                  }
                </div>
                )})}

            {newPlace && 
              <Popup
                  latitude={newPlace.lat}
                  longitude={newPlace.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left" 
                  onClose={()=>setNewPlace(null)}
              >
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input placeholder="Enter a Title" onChange={(e)=>setTitle(e.target.value)}/>
                    <label>Review</label>
                    <textarea placeholder="Say something about this place" onChange={(e)=>setDesc(e.target.value)}/>
                    <label>Rating</label>
                      <select onChange={(e)=>setRating(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    <button className="submitButton" type="submit"> Add Pin </button>
                  </form>
                </div>
              </Popup>
            }

            {(currentUser) ?
              window.innerWidth>600 && <button className="button logout" onClick={handleLogout}> logOut </button> :
              window.innerWidth>600 &&
                  <div className="buttons">
                    <button className="button login" onClick={()=>setShowLogin(true)}> logIn</button>
                    <button className="button register"  onClick={()=>setShowRegister(true)}> Register</button>
                  </div>
            }
            {showRegister && <Register setShowRegister={setShowRegister} />}
            {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
          </ReactMapGL>
        </div>
      </div>


        <div className="rightPart">
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          { displayInfo.length===0 &&
            <p className="titleOfRight"> Review's Box </p>
          }
          { displayInfo[0] &&
            <p className="titleOfRight"> {displayInfo[0].title}</p>
          }
          {
              displayInfo.map((props)=> {
                return(
                  <CardRight  props={props} key={props.id}/>
                );
              })
          }
          
        </div>
    </div>

  );
}

export default App;