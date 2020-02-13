import React from "react";
import 'bootstrap';

export const LoadingArea = () => 
(<div class="container mt-5">{Array.from(Array(10).keys()).map(() =>(
    <div class="d-flex flex-row justify-content-between m-5 bd-highlight">
        <div class="spinner-grow text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>))
}</div>)