
import React, { useState, useEffect, FunctionComponent } from "react";
import Trainer from "../components/Trainer";
import Uploader from "../components/Uploader";
import Landing from "../components/Landing";
import  { TemplatePage, TemplatePageWithAuth } from "./TemplatePage";

function LandingPage(props) {
    return (
        <TemplatePage>
            <Landing/>
        </TemplatePage>);
}

function TrainerPage(props) {
    return (
        <TemplatePageWithAuth>
            <Trainer/>
        </TemplatePageWithAuth>);
}

function UploaderPage(props) {
    return (
        <TemplatePageWithAuth>
            <Uploader/>
        </TemplatePageWithAuth>);
}


export { LandingPage, TrainerPage,  UploaderPage};