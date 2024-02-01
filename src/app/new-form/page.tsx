"use client";

import React, { useState } from "react";
import FormBuilder from "../components/FormBuilder";
import Toolbar from "../components/Toolbar/Toolbar";

const NewFormPage = () => {
const [formItems, setFormItems] = useState([1, 2, 3]);
  return (
    <>
      <div>NewFormPage</div>
      <div className="flex w-full justify-center">
        <FormBuilder formItems={formItems} setFormItems={setFormItems} />
      </div>
		<div className="flex h-full w-18 fixed top-0 right-3">
			<Toolbar formItems={formItems} setFormItems={setFormItems} />
		</div>
    </>
  );
};

export default NewFormPage;
