"use client";

import React from 'react'
import ToolbarButton from './ToolbarButton'

interface ToolbarProps {
	formItems: number[]
	setFormItems: React.Dispatch<React.SetStateAction<number[]>>
}

const Toolbar = ({ formItems, setFormItems }: ToolbarProps) => {
  return (
	 <div className='bg-white rounded border border-2 shadow-md w-full self-center p-2'>
		<ToolbarButton onBtnClick={handleAddClick}>
			<img src="plus.svg" alt="icon" />
		</ToolbarButton>
	 </div>
  )

  function handleAddClick() {
		formItems.push(formItems.length+1);
		setFormItems(formItems);
  }
}

export default Toolbar