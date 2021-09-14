import * as React from 'react';
import StarIcon from '@material-ui/icons/Star';
import "./cardRight.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import {format} from "timeago.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardRight=(props,key)=>{
  console.log("into rightcard: ",props);
  const myStorage = window.localStorage;
  const currUser=myStorage.getItem("user");

  <ToastContainer
    position="top-right"
    autoClose={1000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />

  const notifyToastSuccess=()=>{
    toast.success(" Succesfully Deleted ", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "toastStyle"
    });
  }

  const notifyToastWarn=()=>{
    toast.warn(" Already Deleted, Refresh to see changes ", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "toastStyle"
    });
  }

  const notifyToastError=()=>{
    console.log("invoking error") ;
    toast.error(" Something went Wrong ", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "toastStyle"
    });
  }

  const deletePin=(id)=>{
    axios.delete(`${process.env.REACT_APP_BACKEND_SERVER}/pins/delete/${id}`)
    .then((res)=>{
        if(res.data.ok===1 && res.data.deletedCount===1) {
          notifyToastSuccess();
        }
        else if(res.data.ok===1 && res.data.deletedCount===0) {
          notifyToastWarn();
        }
    }).catch((err)=>{
        notifyToastError();
    })
  }   

  return (
      <>
        <Card
          bg="dark"
          text="light"
          className="mb-2 mainCardinCardRight"
        >
          <Card.Body>
            <Card.Title style={{display: "flex"}}> 
              <div className="headingRightCardinCardRight">Rating : </div>
              <div className="starsinRightCard">
                    {
                        props.props.rating === 1 ?
                        <StarIcon style={{ height: 18,width: 18, marginTop: "-14px"}} className="starinRightCard"/> :
                        Array(props.props.rating).fill( <StarIcon style={{ height: 18,width: 18, marginTop: "-14px"}} className="starinRightCard"/> )
                    }
                </div>
            </Card.Title>
            <Card.Text className="cardTextRightinCardRight">
              {props.props.desc}
            </Card.Text>

            <Card.Text className="cardbottomRightinCardRight">
                <div>
                  {props.props.username}
                </div>
                <div>
                  {format(props.props.createdAt)}
                </div>
                <div>
                  { 
                    props.props.username===currUser &&
                    <button className="deleteReviewinCardRight" onClick={(e)=> deletePin(props.props._id)}>Delete </button>
                  }
                </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
  );
}

export default CardRight;