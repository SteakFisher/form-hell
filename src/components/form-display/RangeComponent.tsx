"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormRendererContext } from "@/contexts/FormRendererContext";
import { RangeProps } from "@/interfaces/form-component-interfaces/RangeProps";
import { RangeResponse } from "formhell-js";
import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FormItem } from "formhell-js";

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
	const tooltipCloseDelay = 250;
	const KBTooltipCloseDay = 750;

	const [open, setOpen] = useState(false);

	const closeTooltipAfterKBNav = useDebouncedCallback(() => {
		setOpen(false);
	}, KBTooltipCloseDay);

	return (
		<SliderPrimitive.Root
			ref={ref}
			className={cn(
				"relative flex w-full touch-none select-none items-center",
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track
				onPointerDown={() => {
					window.addEventListener(
						"pointerup",
						() => {
							setTimeout(() => setOpen(false), tooltipCloseDelay);
						},
						{ once: true },
					);
					setOpen(true);
				}}
				className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
			>
				<SliderPrimitive.Range className="absolute h-full bg-primary" />
			</SliderPrimitive.Track>
			<TooltipProvider>
				<Tooltip open={open}>
					<TooltipTrigger asChild>
						<SliderPrimitive.Thumb
							onKeyDown={(e) => {
								if (
									![
										"ArrowRight",
										"ArrowLeft",
										"ArrowUp",
										"ArrowDown",
										"PageUp",
										"PageDown",
										"Home",
										"End",
									].includes(e.key)
								)
									return;
								setOpen(true);
								closeTooltipAfterKBNav();
							}}
							onPointerDown={() => {
								window.addEventListener(
									"pointerup",
									() => {
										setTimeout(
											() => setOpen(false),
											tooltipCloseDelay,
										);
									},
									{ once: true },
								);
								setOpen(true);
							}}
							className="focus-visible:border-1 block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:border-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>{props.value ? props.value[0] : 0}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</SliderPrimitive.Root>
	);
});

Slider.displayName = SliderPrimitive.Root.displayName;

export default function RangeComponent({
	item,
	id,
}: {
	id: string;
	item: FormItem;
}) {
	const props = item.props as RangeProps;
	const { formResponses } = useContext(FormRendererContext);
	const [val, setVal] = useState<number>(props.min);
	let rangeResp = formResponses[id] as RangeResponse;

	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Slider
					onValueChange={(value) => {
						formResponses[id] = { range: value[0], type: "range" };
						setVal(value[0]);
					}}
					value={[val]}
					defaultValue={[props.min]}
					max={props.max}
					min={props.min}
					step={props.step}
				/>
			</CardContent>
		</Card>
	);
}
