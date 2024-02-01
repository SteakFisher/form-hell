"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { SortableItem } from "./SortableItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormBuilderProps {
	formItems: number[]
	setFormItems: React.Dispatch<React.SetStateAction<number[]>>
}

const FormBuilder = ({ formItems, setFormItems }: FormBuilderProps) => {
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Card className="w-[700px] self-center">
      <CardHeader>
        <CardTitle>Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
			 modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={formItems} strategy={verticalListSortingStrategy}>
            {formItems.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

export default FormBuilder;
