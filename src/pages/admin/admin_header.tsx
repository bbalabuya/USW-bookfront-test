import React from "react";
import styled from "styled-components";
import { Admin } from "./admin";

const Admin_header_css = styled.div`
    width: 100%;
    min-height: 70px;
  height: 70px;
  background-color: #f8f8f8;
  border-bottom: 3px solid rgb(255, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
    `


export const Admin_header =()=>{
    return(
            <Admin_header_css>관리자 페이지</Admin_header_css>  
    )
}