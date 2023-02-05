import React, {useState} from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { openLoading, closeLoading, selectLoading } from "./loadingSlice";


import './Loading.scss'
export default function Loading() {
    const loading = useSelector(selectLoading)
    const dispatch = useDispatch()

    return (
        <>
        <div className="loader-wrapper" style={ loading ? {display: 'flex'} : {display: 'none'}}>
            <div className="loader">
                <svg viewBox="0 0 80 80">
                    <circle id="test" cx="40" cy="40" r="32"></circle>
                </svg>
            </div>

            <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>

            <div className="loader">
                <svg viewBox="0 0 80 80">
                    <rect x="8" y="8" width="64" height="64"></rect>
                </svg>
            </div>
        </div>
        </>
    )
}