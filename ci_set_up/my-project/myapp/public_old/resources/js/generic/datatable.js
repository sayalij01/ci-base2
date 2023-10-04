'use strict'

import { dbg, ge, gc } from './helpers.js'

/*
  table cols is map and should have one column marked as id giver
  colspecs = new Map([
    'col-name': {title: 'Title 1', visible: true, isID: true }
  ])
  colspecs can have also html which will define table cell html content,
  and placeHolder where text from row will be put into this html element.
  placeHolder is optional and defaults to innerHTML.
  table rows consists of pairs column name: column value
*/

function ce(el) {
  return document.createElement(el)
}


function ct(txt) {
  return document.createTextNode(txt)
}


function ca(parent, newElemName) {
  // create and append and return newly created
  let e = ce(newElemName)
  parent.appendChild(e)
  return e
}


function cta(parent, newText) {
  let t = ct(newText)
  parent.appendChild(t)
}


function createHeaders(colDefs, id, classes) {
  let tab = ce('table')
  tab.id = id
  tab.className = classes
  let tr = ca(tab, 'tr')
  for(let [colName, colDef] of colDefs.entries()) {
    if (typeof colDef.visible !== 'undefined' && colDef.visible == false) continue
    let h = ca(tr, 'th')
    let d = ca(h, 'div')
    d.classList.add(id + '-_thdiv-_' + colName)
    d.addEventListener("mouseup", function(e) {
      let tab = e.srcElement.parentElement.parentElement.parentElement
      fixDivSizes(tab)
    })
    let t = cta(d, colDef.title)
    h.id = id + '-_th-_' + colName
  }
  return tab
}


function getNameOfIDCol(colDefs) {
  for(let [colName, colDef] of colDefs.entries()) {
    if (typeof colDef.isID !== 'undefined' && colDef.isID == true) return colName
  }
  return null
}


function find_placeholder(el) {
  if (el.hasAttribute('data-dt_placeholder')) {
    //dbg('placeholder found:', el)
    return el
  } else {
    //dbg('placeholder not found:', el, el.hasAttribute('data-dt_placeholder'))
    for (let child of el.children) {
      let el_in_children = find_placeholder(child)
      if (el_in_children != null) {
        return el_in_children
      }
    }
    return null
  }
}


function createRows(tab, colDefs, rows) {
  let idColName = getNameOfIDCol(colDefs)
  for(let row of rows) {
    let tr = ca(tab, 'tr')
    tr.id = tab.id + '-_row-_' + row[idColName]
    tr.classList.add(tab.id + '-_row')
    for(let [colName, colDef] of colDefs.entries()) {
      let col = row[colName]
      if (typeof colDef.applyFunc !== "undefined") {
        col = colDef.applyFunc(col)
      }
      if (typeof colDef.visible !== 'undefined' && colDef.visible == false) continue
      let td = ca(tr, 'td')
      td.id = tab.id + '-_col-_' + colName + '-_id-_' + row[idColName]
      td.className = tab.id + '-_col-_' + colName
      if (typeof colDef.html !== 'undefined') {
        td.innerHTML = colDef.html
        if (typeof col !== 'undefined') {
          let inner_elem = find_placeholder(td.children[0])
          let placeHolder_attr = 'innerHTML'
          if (typeof colDef.placeHolder !== 'undefined') {
            placeHolder_attr = colDef.placeHolder
          }
          inner_elem[placeHolder_attr] = col
        }
      } else {
        if (typeof col !== 'undefined') cta(td, col)
      }
    }
  }
}

        
export function createDT(colDefs, rows = null, id = null, classes = null) {
  let tab = createHeaders(colDefs, id, classes)
  if (rows) {
    createRows(tab, colDefs, rows)
  }
  return tab
}


export function addDTRows(tab, colDefs, rows) {
  createRows(tab, colDefs, rows)
}


export function removeRows(tab) {
  let classname = tab.id + '-_row';
  for(let i = 0; i < tab.children.length;) {
    let row = tab.children[i];
    if (row.classList.contains(classname)) {
      row.remove()
    } else {
      i += 1
    }
  }
}


export function fixDivSizes(tab) {
  let hrow = tab.children[0];
  for(let c of hrow.children) {
    c.children[0].style.width = c.offsetWidth + "px"
  }
}