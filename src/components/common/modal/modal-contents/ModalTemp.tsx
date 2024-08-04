import React, { ReactNode } from 'react'

export interface ModalTempProps {
  name : string;
  age : number;
  object : {
    obj1 : boolean,
    obj2 : string
  },
  component : ReactNode
}
const ModalTemp = ({name, age, object, component} : ModalTempProps) => {
  return (
    <div>
      {name}
      {age}
      {object.obj1}
      {object.obj2}
      {component}
    </div>
  )
}

export default ModalTemp