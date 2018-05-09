/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/library'],function(q,l,c){"use strict";var T=c.TitleLevel;var B={};B.render=function(r,b){this.startCell(r,b);this.addContent(r,b);this.endCell(r);};B.startCell=function(r,b){var C=this.getCellColor(r,b);r.write("<div");r.writeControlData(b);r.addClass("sapUiBlockLayoutCell");C&&r.addClass(C);this.setWidth(r,b);r.writeStyles();r.writeClasses();r.write(">");};B.getCellColor=function(r,b){var C=b.getBackgroundColorSet(),s=b.getBackgroundColorShade();if(!C&&!s){return"";}else if((C&&!s)||(!C&&s)){q.sap.log.warning("Both, backgroundColorSet and backgroundColorShade should be defined. ColoSet is not applied to "+b.getId()+".");return"";}C=C.replace("ColorSet","");s=s.replace("Shade","");return"sapUiBlockLayoutCellColor"+C+s;};B.setWidth=function(r,b){if(b._getParentRowScrollable()){var w=b.getWidth();if(w!==0){r.addStyle("width",w+"%");}}else{this.addFlex(r,b._getFlexWidth());}};B.addFlex=function(r,f){r.addStyle("-webkit-flex",f);r.addStyle("-ms-flex",f);r.addStyle("flex",f);};B.addTitle=function(r,b){if(b.getTitle()){var a="sapUiBlockCell"+b.getTitleAlignment(),t="sapUiBlockCellTitle "+a;if(b.getContent().length===0){t+=" sapUiBlockCellTitleNoContent";}var d=b.getTitleLevel(),e=d===T.Auto,f=e?"h2":d;r.write("<"+f+" id='"+this.getTitleId(b)+"' class='"+t+"'>");r.writeEscaped(b.getTitle());r.write("</"+f+">");}};B.getTitleId=function(b){return b.getId()+"-Title";};B.addContent=function(r,b){var a=b.getContent(),d="sapUiBlockCellContent ";if(b.getTitleAlignment()==="Center"){d+="sapUiBlockCellCenteredContent";}r.write("<div class='"+d+"' aria-labelledby='"+this.getTitleId(b)+"' >");this.addTitle(r,b);a.forEach(r.renderControl);r.write("</div>");};B.endCell=function(r){r.write("</div>");};return B;},true);
